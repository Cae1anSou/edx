import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  fetchCcx,
  fetchCertificatesV0,
  fetchCohortsV1,
  fetchCourseModesV1,
  fetchLibrariesV2,
  fetchModulestoreMigratorV1,
  fetchOlxExportV1,
  fetchOraStaffGraderV1,
  fetchOrganizationsV0,
  fetchThirdPartyProviders,
  fetchValV0,
  fetchXblockV2
} from '../api/studio';

function stateFor(isLoading: boolean, isError: boolean) {
  if (isLoading) {
    return 'loading';
  }
  return isError ? 'error' : 'ok';
}

export function PlatformIntegrationsPage() {
  const location = useLocation();
  const rssSeed = useMemo(() => {
    const pathname = location.pathname.replace(/\/+$/, '');
    if (!pathname.startsWith('/rss_proxy/')) {
      return '';
    }
    const raw = pathname.slice('/rss_proxy/'.length);
    return raw ? decodeURIComponent(raw) : '';
  }, [location.pathname]);

  const ccxQuery = useQuery({ queryKey: ['pi-ccx'], queryFn: fetchCcx });
  const certsQuery = useQuery({ queryKey: ['pi-certs'], queryFn: fetchCertificatesV0 });
  const cohortsQuery = useQuery({ queryKey: ['pi-cohorts'], queryFn: fetchCohortsV1 });
  const modesQuery = useQuery({ queryKey: ['pi-course-modes'], queryFn: fetchCourseModesV1 });
  const librariesQuery = useQuery({ queryKey: ['pi-libraries'], queryFn: fetchLibrariesV2 });
  const orgsQuery = useQuery({ queryKey: ['pi-orgs'], queryFn: fetchOrganizationsV0 });
  const providersQuery = useQuery({ queryKey: ['pi-providers'], queryFn: fetchThirdPartyProviders });
  const valQuery = useQuery({ queryKey: ['pi-val'], queryFn: fetchValV0 });
  const xblockQuery = useQuery({ queryKey: ['pi-xblock'], queryFn: fetchXblockV2 });
  const migratorQuery = useQuery({ queryKey: ['pi-migrator'], queryFn: fetchModulestoreMigratorV1 });
  const olxQuery = useQuery({ queryKey: ['pi-olx'], queryFn: fetchOlxExportV1 });
  const oraQuery = useQuery({ queryKey: ['pi-ora'], queryFn: fetchOraStaffGraderV1 });

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-platform-integrations">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub">
            <span className="legacy-v1-subtitle">Platform</span>
            <span>Integrations</span>
          </h1>
        </div>
        <nav className="legacy-v1-mast-actions" aria-label="Page Actions">
          <Link to="/course/" className="legacy-v1-link-btn">Studio Home</Link>
          <Link to="/legacy-system-apis" className="legacy-v1-link-btn">Legacy System APIs</Link>
          <Link to="/authoring-apis" className="legacy-v1-link-btn">Authoring APIs</Link>
        </nav>
      </section>

      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <article className="legacy-v1-main">
          <section className="create-form">
            <h2>Programs and Enrollment</h2>
            <ul className="item-list">
              <li className="item-card"><h3>CCX</h3><p>Status: {stateFor(ccxQuery.isLoading, ccxQuery.isError)}</p></li>
              <li className="item-card"><h3>Certificates</h3><p>Status: {stateFor(certsQuery.isLoading, certsQuery.isError)}</p></li>
              <li className="item-card"><h3>Cohorts</h3><p>Status: {stateFor(cohortsQuery.isLoading, cohortsQuery.isError)}</p></li>
              <li className="item-card"><h3>Course Modes</h3><p>Status: {stateFor(modesQuery.isLoading, modesQuery.isError)}</p></li>
            </ul>
          </section>

          <section className="create-form">
            <h2>Organization and Auth</h2>
            <ul className="item-list">
              <li className="item-card"><h3>Organizations</h3><p>Status: {stateFor(orgsQuery.isLoading, orgsQuery.isError)}</p></li>
              <li className="item-card"><h3>Third-party Providers</h3><p>Status: {stateFor(providersQuery.isLoading, providersQuery.isError)}</p></li>
            </ul>
          </section>

          <section className="create-form">
            <h2>Content Runtime Extensions</h2>
            <ul className="item-list">
              <li className="item-card"><h3>Libraries</h3><p>Status: {stateFor(librariesQuery.isLoading, librariesQuery.isError)}</p></li>
              <li className="item-card"><h3>VAL</h3><p>Status: {stateFor(valQuery.isLoading, valQuery.isError)}</p></li>
              <li className="item-card"><h3>XBlock</h3><p>Status: {stateFor(xblockQuery.isLoading, xblockQuery.isError)}</p></li>
              <li className="item-card"><h3>Modulestore Migrator</h3><p>Status: {stateFor(migratorQuery.isLoading, migratorQuery.isError)}</p></li>
              <li className="item-card"><h3>OLX Export</h3><p>Status: {stateFor(olxQuery.isLoading, olxQuery.isError)}</p></li>
              <li className="item-card"><h3>ORA Staff Grader</h3><p>Status: {stateFor(oraQuery.isLoading, oraQuery.isError)}</p></li>
            </ul>
          </section>
        </article>

        <aside className="legacy-v1-sidebar" role="complementary">
          <div className="legacy-v1-side-bit">
            <h3>Sample Data</h3>
            <p className="legacy-v1-muted">Path: {location.pathname}</p>
            {rssSeed ? <p className="legacy-v1-muted">RSS seed: {rssSeed}</p> : null}
            {orgsQuery.data ? <pre>{JSON.stringify(orgsQuery.data, null, 2)}</pre> : null}
            {!orgsQuery.data && providersQuery.data ? <pre>{JSON.stringify(providersQuery.data, null, 2)}</pre> : null}
            {!orgsQuery.data && !providersQuery.data && valQuery.data ? <pre>{JSON.stringify(valQuery.data, null, 2)}</pre> : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
