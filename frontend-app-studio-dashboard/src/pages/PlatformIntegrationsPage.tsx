import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
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

export function PlatformIntegrationsPage() {
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
    <main className="container">
      <header className="page-header">
        <h1>Platform Integrations</h1>
        <p>React migration for platform integration and extension API families.</p>
      </header>

      <section className="actions">
        <Link to="/course/" className="button-link secondary-btn">
          Back to Dashboard
        </Link>
      </section>

      <section className="create-form">
        <h2>Programs and Catalog</h2>
        {ccxQuery.data ? <pre>{JSON.stringify(ccxQuery.data, null, 2)}</pre> : null}
        {certsQuery.data ? <pre>{JSON.stringify(certsQuery.data, null, 2)}</pre> : null}
        {cohortsQuery.data ? <pre>{JSON.stringify(cohortsQuery.data, null, 2)}</pre> : null}
        {modesQuery.data ? <pre>{JSON.stringify(modesQuery.data, null, 2)}</pre> : null}
        {librariesQuery.data ? <pre>{JSON.stringify(librariesQuery.data, null, 2)}</pre> : null}
      </section>

      <section className="create-form">
        <h2>Organizations and Auth</h2>
        {orgsQuery.data ? <pre>{JSON.stringify(orgsQuery.data, null, 2)}</pre> : null}
        {providersQuery.data ? <pre>{JSON.stringify(providersQuery.data, null, 2)}</pre> : null}
      </section>

      <section className="create-form">
        <h2>Extensions</h2>
        {valQuery.data ? <pre>{JSON.stringify(valQuery.data, null, 2)}</pre> : null}
        {xblockQuery.data ? <pre>{JSON.stringify(xblockQuery.data, null, 2)}</pre> : null}
        {migratorQuery.data ? <pre>{JSON.stringify(migratorQuery.data, null, 2)}</pre> : null}
        {olxQuery.data ? <pre>{JSON.stringify(olxQuery.data, null, 2)}</pre> : null}
        {oraQuery.data ? <pre>{JSON.stringify(oraQuery.data, null, 2)}</pre> : null}
      </section>

      <section className="create-form">
        <h2>Status</h2>
        {[
          ccxQuery,
          certsQuery,
          cohortsQuery,
          modesQuery,
          librariesQuery,
          orgsQuery,
          providersQuery,
          valQuery,
          xblockQuery,
          migratorQuery,
          olxQuery,
          oraQuery
        ].some((q) => q.isLoading) ? <p>Loading integrations...</p> : null}
        {[
          ccxQuery,
          certsQuery,
          cohortsQuery,
          modesQuery,
          librariesQuery,
          orgsQuery,
          providersQuery,
          valQuery,
          xblockQuery,
          migratorQuery,
          olxQuery,
          oraQuery
        ].some((q) => q.error) ? <p className="error-text">One or more integration endpoints failed.</p> : null}
      </section>
    </main>
  );
}
