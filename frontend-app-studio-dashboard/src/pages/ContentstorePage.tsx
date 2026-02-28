import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchClipboardItems, fetchCourseBlocks, fetchDownstreams, syncDownstream } from '../api/studio';

function queryState(isLoading: boolean, isError: boolean, isSuccess: boolean) {
  if (isLoading) {
    return 'loading';
  }
  if (isError) {
    return 'error';
  }
  return isSuccess ? 'ok' : 'idle';
}

export function ContentstorePage() {
  const location = useLocation();
  const [downstreamBlockId, setDownstreamBlockId] = useState('block-v1');
  const [courseId, setCourseId] = useState('course-v1:org+num+run');

  const legacyRouteSeed = useMemo(() => {
    const pathname = location.pathname.replace(/\/+$/, '');
    const parseCourseLike = (segments: string[]) => {
      if (segments.length === 0) {
        return '';
      }
      if (segments[0].includes(':')) {
        return decodeURIComponent(segments[0]);
      }
      if (segments.length >= 3) {
        return decodeURIComponent(segments.slice(0, 3).join('/'));
      }
      return decodeURIComponent(segments[0]);
    };
    const coursePrefixes = ['/tabs/', '/textbooks/'];
    for (const prefix of coursePrefixes) {
      if (pathname.startsWith(prefix)) {
        const raw = parseCourseLike(pathname.slice(prefix.length).split('/').filter(Boolean));
        if (raw) {
          return { courseKey: raw, downstreamId: '' };
        }
      }
    }

    const blockPrefixes = ['/container/', '/container_embed/', '/orphan/', '/xblock/container/', '/xblock/outline/', '/xblock/'];
    for (const prefix of blockPrefixes) {
      if (pathname.startsWith(prefix)) {
        const restSegments = pathname.slice(prefix.length).split('/').filter(Boolean);
        let raw = '';
        if (prefix === '/xblock/' && restSegments.length > 1) {
          raw = restSegments.slice(0, -1).join('/');
        } else {
          raw = restSegments.join('/');
        }
        if (raw) {
          return { courseKey: '', downstreamId: decodeURIComponent(raw) };
        }
      }
    }
    return { courseKey: '', downstreamId: '' };
  }, [location.pathname]);

  useEffect(() => {
    if (legacyRouteSeed.courseKey) {
      setCourseId(legacyRouteSeed.courseKey);
    }
    if (legacyRouteSeed.downstreamId) {
      setDownstreamBlockId(legacyRouteSeed.downstreamId);
    }
  }, [legacyRouteSeed]);

  const clipboardQuery = useQuery({ queryKey: ['contentstore-clipboard'], queryFn: fetchClipboardItems });
  const downstreamsQuery = useQuery({ queryKey: ['contentstore-downstreams'], queryFn: fetchDownstreams });

  const syncMutation = useMutation({
    mutationFn: syncDownstream,
    onSuccess: () => downstreamsQuery.refetch()
  });

  const blocksMutation = useMutation({ mutationFn: fetchCourseBlocks });

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-contentstore">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub">
            <span className="legacy-v1-subtitle">Authoring</span>
            <span>Contentstore and Staging</span>
          </h1>
        </div>
        <nav className="legacy-v1-mast-actions" aria-label="Page Actions">
          <Link to="/course/" className="legacy-v1-link-btn">Studio Home</Link>
          <Link to="/uploads" className="legacy-v1-link-btn">Uploads</Link>
          <Link to="/resource-builder" className="legacy-v1-link-btn">Resource Builder</Link>
        </nav>
      </section>

      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <article className="legacy-v1-main">
          <section className="create-form">
            <h2>Status Board</h2>
            <ul className="item-list">
              <li className="item-card"><h3>Clipboard</h3><p>Status: {queryState(clipboardQuery.isLoading, clipboardQuery.isError, clipboardQuery.isSuccess)}</p></li>
              <li className="item-card"><h3>Downstream Query</h3><p>Status: {queryState(downstreamsQuery.isLoading, downstreamsQuery.isError, downstreamsQuery.isSuccess)}</p></li>
              <li className="item-card"><h3>Blocks Lookup</h3><p>Status: {blocksMutation.isPending ? 'loading' : blocksMutation.isError ? 'error' : blocksMutation.isSuccess ? 'ok' : 'idle'}</p></li>
            </ul>
          </section>

          <form
            className="create-form"
            onSubmit={(event) => {
              event.preventDefault();
              syncMutation.mutate(downstreamBlockId);
            }}
          >
            <h2>Downstream Sync</h2>
            <label>
              Downstream block id
              <input value={downstreamBlockId} onChange={(event) => setDownstreamBlockId(event.target.value)} />
            </label>
            <div className="actions">
              <button type="submit" disabled={syncMutation.isPending}>{syncMutation.isPending ? 'Syncing...' : 'Sync'}</button>
            </div>
            {syncMutation.error ? <p className="error-text">Sync failed.</p> : null}
          </form>

          <form
            className="create-form"
            onSubmit={(event) => {
              event.preventDefault();
              blocksMutation.mutate(courseId || undefined);
            }}
          >
            <h2>Course Blocks</h2>
            <label>
              Course id
              <input value={courseId} onChange={(event) => setCourseId(event.target.value)} />
            </label>
            <div className="actions">
              <button type="submit" disabled={blocksMutation.isPending}>{blocksMutation.isPending ? 'Loading...' : 'Load Blocks'}</button>
            </div>
            {blocksMutation.error ? <p className="error-text">Failed to load blocks.</p> : null}
          </form>
        </article>

        <aside className="legacy-v1-sidebar" role="complementary">
          <div className="legacy-v1-side-bit">
            <h3>Inspector</h3>
            <p className="legacy-v1-muted">Path: {location.pathname}</p>
            {legacyRouteSeed.courseKey ? <p className="legacy-v1-muted">Course: {legacyRouteSeed.courseKey}</p> : null}
            {legacyRouteSeed.downstreamId ? <p className="legacy-v1-muted">Block: {legacyRouteSeed.downstreamId}</p> : null}
            {downstreamsQuery.data ? <pre>{JSON.stringify(downstreamsQuery.data, null, 2)}</pre> : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
