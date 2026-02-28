import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { fetchLibrariesV2, fetchStudioDashboard } from '../api/studio';

function decodeLibraryKey(raw?: string): string {
  if (!raw) {
    return '';
  }
  const decoded = decodeURIComponent(raw);
  if (decoded.includes(':')) {
    return decoded;
  }
  const segments = decoded.split('/').filter(Boolean);
  if (segments.length >= 3) {
    return segments.slice(0, 3).join('/');
  }
  return decoded;
}

export function LibraryDetailPage() {
  const location = useLocation();
  const params = useParams<{ libraryKey?: string }>();
  const libraryKey = decodeLibraryKey(params.libraryKey);

  const dashboardQuery = useQuery({ queryKey: ['studio-dashboard'], queryFn: fetchStudioDashboard });
  const librariesV2Query = useQuery({ queryKey: ['library-v2-detail'], queryFn: fetchLibrariesV2 });

  const library = useMemo(() => {
    if (!dashboardQuery.data) {
      return null;
    }
    const all = dashboardQuery.data.libraries;
    if (!libraryKey) {
      return all[0] ?? null;
    }
    return all.find((item) => item.courseKey === libraryKey || decodeURIComponent(item.courseKey) === libraryKey) ?? null;
  }, [dashboardQuery.data, libraryKey]);

  const title = library?.displayName ?? 'Content Library';

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-library">
      <section className="legacy-v1-mast wrapper-mast wrapper">
        <div>
          <h1 className="legacy-v1-title-with-sub">
            <span className="legacy-v1-subtitle">Content Library</span>
            <span>{title}</span>
          </h1>
        </div>
        <nav className="legacy-v1-mast-actions" aria-label="Page Actions">
          <button type="button" className="legacy-v1-btn legacy-v1-btn-primary">Add Component</button>
          <button type="button" className="legacy-v1-btn">Toggle Preview</button>
        </nav>
      </section>

      <section className="legacy-v1-layout legacy-v1-layout-mastless wrapper-content wrapper">
        <article className="legacy-v1-main content-primary">
          <div className="legacy-v1-message-strip" />

          <section className="legacy-v1-library-canvas">
            {dashboardQuery.isLoading ? (
              <div className="legacy-v1-loading-item">Loading</div>
            ) : null}
            {dashboardQuery.error ? (
              <div className="legacy-v1-loading-item error-text">Failed to load library metadata.</div>
            ) : null}

            {library ? (
              <div className="legacy-v1-data-box">
                <h4>Library Metadata</h4>
                <p><strong>Display Name:</strong> {library.displayName}</p>
                <p><strong>Library Key:</strong> {library.courseKey}</p>
                <p><strong>Organization:</strong> {library.org}</p>
                <p><strong>Code:</strong> {library.number}</p>
                <p><a href={library.url}>Open Library Root</a></p>
              </div>
            ) : null}

            {!library && !dashboardQuery.isLoading && !dashboardQuery.error ? (
              <div className="legacy-v1-empty">No matching library found in the dashboard payload.</div>
            ) : null}
          </section>

          <section className="legacy-v1-subnav">
            <Link to="/course/#libraries-tab">Back to Libraries</Link>
            <Link to="/team">Team</Link>
            <span className="legacy-v1-path">{location.pathname}</span>
          </section>
        </article>

        <aside className="legacy-v1-sidebar content-supplementary" role="complementary">
          <div className="legacy-v1-side-bit bit">
            <h3>Adding content to your library</h3>
            <p>Add components to your library for use in courses, using Add Component.</p>
            <p>Components are listed in the order in which they are added, with the most recently added at the bottom.</p>
            <p>Use pagination arrows to move across pages when your library has many components.</p>
          </div>
          <div className="legacy-v1-side-bit bit">
            <h3>Using library content in courses</h3>
            <p>
              Use library content in courses by adding the <strong>library_content</strong> policy key in advanced settings, then adding randomized content blocks that pull from this library.
            </p>
          </div>
          <div className="legacy-v1-side-bit bit external-help">
            <a href="https://docs.openedx.org/" target="_blank" rel="noopener" className="legacy-v1-link-btn">Learn more about content libraries</a>
          </div>
          <div className="legacy-v1-side-bit bit">
            <h3>API Snapshot</h3>
            {librariesV2Query.isLoading ? <p>Loading /api/libraries/v2/ ...</p> : null}
            {librariesV2Query.error ? <p className="error-text">Failed to load libraries API.</p> : null}
            {librariesV2Query.data ? <pre>{JSON.stringify(librariesV2Query.data, null, 2)}</pre> : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
