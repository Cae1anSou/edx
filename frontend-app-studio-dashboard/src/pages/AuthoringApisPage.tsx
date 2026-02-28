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

function apiState(isLoading: boolean, isError: boolean) {
  if (isLoading) {
    return 'loading';
  }
  return isError ? 'error' : 'ok';
}

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
    if (pathname.startsWith('/settings/advanced/')) return parseCourseLike(pathname.slice('/settings/advanced/'.length).split('/').filter(Boolean));
    if (pathname.startsWith('/authoring-apis/')) return parseCourseLike(pathname.slice('/authoring-apis/'.length).split('/').filter(Boolean));
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
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-authoring-apis">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub"><span className="legacy-v1-subtitle">Authoring</span><span>APIs</span></h1>
        </div>
        <nav className="legacy-v1-mast-actions" aria-label="Page Actions">
          <Link to="/course/" className="legacy-v1-link-btn">Studio Home</Link>
          <Link to="/contentstore" className="legacy-v1-link-btn">Contentstore</Link>
          <Link to="/resource-builder" className="legacy-v1-link-btn">Resource Builder</Link>
        </nav>
      </section>

      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <article className="legacy-v1-main">
          <section className="create-form">
            <h2>Discovery and Taxonomy</h2>
            <ul className="item-list">
              <li className="item-card"><h3>Content Search</h3><p>Status: {apiState(contentSearchQuery.isLoading, contentSearchQuery.isError)}</p></li>
              <li className="item-card"><h3>Content Tagging</h3><p>Status: {apiState(contentTaggingQuery.isLoading, contentTaggingQuery.isError)}</p></li>
            </ul>
          </section>
          <section className="create-form">
            <h2>Libraries and XBlock</h2>
            <ul className="item-list">
              <li className="item-card"><h3>Libraries v2</h3><p>Status: {apiState(librariesQuery.isLoading, librariesQuery.isError)}</p></li>
              <li className="item-card"><h3>XBlock v2</h3><p>Status: {apiState(xblockQuery.isLoading, xblockQuery.isError)}</p></li>
            </ul>
          </section>
          <section className="create-form">
            <h2>Export and Migration</h2>
            <ul className="item-list">
              <li className="item-card"><h3>Modulestore Migrator</h3><p>Status: {apiState(migratorQuery.isLoading, migratorQuery.isError)}</p></li>
              <li className="item-card"><h3>OLX Export</h3><p>Status: {apiState(olxQuery.isLoading, olxQuery.isError)}</p></li>
              <li className="item-card"><h3>ORA Staff Grader</h3><p>Status: {apiState(oraQuery.isLoading, oraQuery.isError)}</p></li>
            </ul>
          </section>
        </article>
        <aside className="legacy-v1-sidebar" role="complementary">
          <div className="legacy-v1-side-bit">
            <h3>Data</h3>
            <p className="legacy-v1-muted">Path: {location.pathname}</p>
            {legacyCourseKey ? <p className="legacy-v1-muted">Course: {legacyCourseKey}</p> : null}
            {librariesQuery.data ? <pre>{JSON.stringify(librariesQuery.data, null, 2)}</pre> : null}
            {!librariesQuery.data && xblockQuery.data ? <pre>{JSON.stringify(xblockQuery.data, null, 2)}</pre> : null}
            {!librariesQuery.data && !xblockQuery.data && migratorQuery.data ? <pre>{JSON.stringify(migratorQuery.data, null, 2)}</pre> : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
