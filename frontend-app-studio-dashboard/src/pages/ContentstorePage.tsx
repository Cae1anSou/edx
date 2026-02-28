import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchClipboardItems, fetchCourseBlocks, fetchDownstreams, syncDownstream } from '../api/studio';

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

  const clipboardQuery = useQuery({
    queryKey: ['contentstore-clipboard'],
    queryFn: fetchClipboardItems
  });

  const downstreamsQuery = useQuery({
    queryKey: ['contentstore-downstreams'],
    queryFn: fetchDownstreams
  });

  const syncMutation = useMutation({
    mutationFn: syncDownstream,
    onSuccess: () => downstreamsQuery.refetch()
  });

  const blocksMutation = useMutation({
    mutationFn: fetchCourseBlocks
  });

  return (
    <main className="container">
      <header className="page-header">
        <h1>Contentstore and Staging</h1>
        <p>React migration for clipboard, downstream sync, and blocks lookup.</p>
        <p>
          <strong>Current path:</strong> {location.pathname}
        </p>
        {legacyRouteSeed.courseKey ? (
          <p>
            <strong>Legacy course key:</strong> {legacyRouteSeed.courseKey}
          </p>
        ) : null}
        {legacyRouteSeed.downstreamId ? (
          <p>
            <strong>Legacy block key:</strong> {legacyRouteSeed.downstreamId}
          </p>
        ) : null}
      </header>

      <section className="actions">
        <Link to="/course/" className="button-link secondary-btn">
          Back to Dashboard
        </Link>
      </section>

      <section className="create-form">
        <h2>Clipboard</h2>
        {clipboardQuery.isLoading ? <p>Loading clipboard...</p> : null}
        {clipboardQuery.error ? <p className="error-text">Failed to load clipboard.</p> : null}
        {clipboardQuery.data ? <pre>{JSON.stringify(clipboardQuery.data, null, 2)}</pre> : null}
      </section>

      <form
        className="create-form"
        onSubmit={(event) => {
          event.preventDefault();
          syncMutation.mutate(downstreamBlockId);
        }}
      >
        <h2>Downstream Sync</h2>
        {downstreamsQuery.isLoading ? <p>Loading downstreams...</p> : null}
        {downstreamsQuery.error ? <p className="error-text">Failed to load downstreams.</p> : null}
        {downstreamsQuery.data ? <pre>{JSON.stringify(downstreamsQuery.data, null, 2)}</pre> : null}
        <label>
          downstream block id
          <input value={downstreamBlockId} onChange={(event) => setDownstreamBlockId(event.target.value)} />
        </label>
        <div className="actions">
          <button type="submit" disabled={syncMutation.isPending}>
            {syncMutation.isPending ? 'Syncing...' : 'Sync'}
          </button>
        </div>
        {syncMutation.error ? <p className="error-text">Sync failed.</p> : null}
        {syncMutation.data ? <pre>{JSON.stringify(syncMutation.data, null, 2)}</pre> : null}
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
          course id
          <input value={courseId} onChange={(event) => setCourseId(event.target.value)} />
        </label>
        <div className="actions">
          <button type="submit" disabled={blocksMutation.isPending}>
            {blocksMutation.isPending ? 'Loading...' : 'Load Blocks'}
          </button>
        </div>
        {blocksMutation.error ? <p className="error-text">Failed to load blocks.</p> : null}
        {blocksMutation.data ? <pre>{JSON.stringify(blocksMutation.data, null, 2)}</pre> : null}
      </form>
    </main>
  );
}
