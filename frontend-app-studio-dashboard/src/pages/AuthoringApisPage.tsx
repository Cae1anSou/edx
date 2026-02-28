import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import {
  fetchContentSearchStudio,
  fetchContentTaggingV1,
  fetchLibrariesV2,
  fetchModulestoreMigratorV1,
  fetchOlxExportV1,
  fetchOraStaffGraderV1,
  fetchXblockV2
} from '../api/studio';

export function AuthoringApisPage() {
  const location = useLocation();
  const legacyCourseKey = (() => {
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
    if (pathname.startsWith('/settings/advanced/')) {
      const rest = pathname.slice('/settings/advanced/'.length).split('/').filter(Boolean);
      return parseCourseLike(rest);
    }
    if (pathname.startsWith('/authoring-apis/')) {
      const rest = pathname.slice('/authoring-apis/'.length).split('/').filter(Boolean);
      return parseCourseLike(rest);
    }
    return '';
  })();

  const contentSearchQuery = useQuery({ queryKey: ['authoring-content-search'], queryFn: fetchContentSearchStudio });
  const contentTaggingQuery = useQuery({ queryKey: ['authoring-content-tagging'], queryFn: fetchContentTaggingV1 });
  const librariesQuery = useQuery({ queryKey: ['authoring-libraries'], queryFn: fetchLibrariesV2 });
  const migratorQuery = useQuery({ queryKey: ['authoring-migrator'], queryFn: fetchModulestoreMigratorV1 });
  const olxQuery = useQuery({ queryKey: ['authoring-olx'], queryFn: fetchOlxExportV1 });
  const oraQuery = useQuery({ queryKey: ['authoring-ora'], queryFn: fetchOraStaffGraderV1 });
  const xblockQuery = useQuery({ queryKey: ['authoring-xblock'], queryFn: fetchXblockV2 });

  return (
    <main className="container">
      <header className="page-header">
        <h1>Authoring APIs</h1>
        <p>React migration for authoring-related legacy API families.</p>
        <p>
          <strong>Current path:</strong> {location.pathname}
        </p>
        {legacyCourseKey ? (
          <p>
            <strong>Legacy course key:</strong> {legacyCourseKey}
          </p>
        ) : null}
      </header>

      <section className="actions">
        <Link to="/course/" className="button-link secondary-btn">
          Back to Dashboard
        </Link>
      </section>

      <section className="create-form">
        <h2>Content Search and Tagging</h2>
        {contentSearchQuery.isLoading ? <p>Loading content search...</p> : null}
        {contentSearchQuery.error ? <p className="error-text">Failed to load content search.</p> : null}
        {contentSearchQuery.data ? <pre>{JSON.stringify(contentSearchQuery.data, null, 2)}</pre> : null}
        {contentTaggingQuery.isLoading ? <p>Loading content tagging...</p> : null}
        {contentTaggingQuery.error ? <p className="error-text">Failed to load content tagging.</p> : null}
        {contentTaggingQuery.data ? <pre>{JSON.stringify(contentTaggingQuery.data, null, 2)}</pre> : null}
      </section>

      <section className="create-form">
        <h2>Libraries and XBlock</h2>
        {librariesQuery.isLoading ? <p>Loading libraries...</p> : null}
        {librariesQuery.error ? <p className="error-text">Failed to load libraries.</p> : null}
        {librariesQuery.data ? <pre>{JSON.stringify(librariesQuery.data, null, 2)}</pre> : null}
        {xblockQuery.isLoading ? <p>Loading xblock...</p> : null}
        {xblockQuery.error ? <p className="error-text">Failed to load xblock.</p> : null}
        {xblockQuery.data ? <pre>{JSON.stringify(xblockQuery.data, null, 2)}</pre> : null}
      </section>

      <section className="create-form">
        <h2>Migration and Export</h2>
        {migratorQuery.isLoading ? <p>Loading migrator...</p> : null}
        {migratorQuery.error ? <p className="error-text">Failed to load migrator.</p> : null}
        {migratorQuery.data ? <pre>{JSON.stringify(migratorQuery.data, null, 2)}</pre> : null}
        {olxQuery.isLoading ? <p>Loading olx export...</p> : null}
        {olxQuery.error ? <p className="error-text">Failed to load olx export.</p> : null}
        {olxQuery.data ? <pre>{JSON.stringify(olxQuery.data, null, 2)}</pre> : null}
        {oraQuery.isLoading ? <p>Loading ora staff grader...</p> : null}
        {oraQuery.error ? <p className="error-text">Failed to load ora staff grader.</p> : null}
        {oraQuery.data ? <pre>{JSON.stringify(oraQuery.data, null, 2)}</pre> : null}
      </section>
    </main>
  );
}
