import { useMutation } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import {
  fetchCcx,
  fetchCertificatesV0,
  fetchChangeEmailSettings,
  fetchCohortsV1,
  fetchContentSearchStudio,
  fetchContentTaggingV1,
  fetchCourseHome,
  fetchCourseHomeV1,
  fetchCourseModesV1,
  fetchLegacyDashboard,
  fetchDiscountsV1,
  fetchDiscussionV1,
  fetchEdxNotesV1,
  fetchEmbargoV1,
  fetchExperimentsV1,
  fetchInstructorTaskV1,
  fetchLearnerHome,
  fetchLearningSequencesV1,
  fetchLibrariesV2,
  fetchModulestoreMigratorV1,
  fetchOlxExportV1,
  fetchOraStaffGraderV1,
  fetchOrganizationsV0,
  fetchThirdPartyProviders,
  fetchValV0,
  fetchXblockV2
} from '../api/studio';

const API_ACTIONS: Array<{ label: string; family: string; run: () => Promise<Record<string, unknown>> }> = [
  { label: 'GET /api/dashboard/', family: 'Learner', run: fetchLegacyDashboard },
  { label: 'GET /api/learner_home/', family: 'Learner', run: fetchLearnerHome },
  { label: 'GET /api/course_home/', family: 'Learner', run: fetchCourseHome },
  { label: 'GET /api/course_home/v1/', family: 'Learner', run: fetchCourseHomeV1 },
  { label: 'GET /api/learning_sequences/v1/', family: 'Learner', run: fetchLearningSequencesV1 },
  { label: 'GET /api/discussion/v1/', family: 'Learner', run: fetchDiscussionV1 },
  { label: 'GET /api/edxnotes/v1/', family: 'Learner', run: fetchEdxNotesV1 },
  { label: 'GET /api/ccx/v0/', family: 'Course Ops', run: fetchCcx },
  { label: 'GET /api/cohorts/v1/', family: 'Course Ops', run: fetchCohortsV1 },
  { label: 'GET /api/course_modes/v1/', family: 'Course Ops', run: fetchCourseModesV1 },
  { label: 'GET /api/certificates/v0/', family: 'Course Ops', run: fetchCertificatesV0 },
  { label: 'GET /api/instructor_task/v1/', family: 'Course Ops', run: fetchInstructorTaskV1 },
  { label: 'GET /api/discounts/v1/', family: 'Commerce & Policy', run: fetchDiscountsV1 },
  { label: 'GET /api/embargo/v1/', family: 'Commerce & Policy', run: fetchEmbargoV1 },
  { label: 'GET /api/experiments/v1/', family: 'Commerce & Policy', run: fetchExperimentsV1 },
  { label: 'GET /api/change_email_settings/', family: 'Identity', run: fetchChangeEmailSettings },
  { label: 'GET /api/organizations/v0/', family: 'Identity', run: fetchOrganizationsV0 },
  { label: 'GET /api/third_party_auth/v0/providers/', family: 'Identity', run: fetchThirdPartyProviders },
  { label: 'GET /api/content_search/v2/studio/', family: 'Authoring', run: fetchContentSearchStudio },
  { label: 'GET /api/content_tagging/v1/', family: 'Authoring', run: fetchContentTaggingV1 },
  { label: 'GET /api/libraries/v2/', family: 'Authoring', run: fetchLibrariesV2 },
  { label: 'GET /api/xblock/v2/', family: 'Authoring', run: fetchXblockV2 },
  { label: 'GET /api/modulestore_migrator/v1/', family: 'Authoring', run: fetchModulestoreMigratorV1 },
  { label: 'GET /api/olx-export/v1/', family: 'Authoring', run: fetchOlxExportV1 },
  { label: 'GET /api/ora_staff_grader/v1/', family: 'Authoring', run: fetchOraStaffGraderV1 },
  { label: 'GET /api/val/v0/', family: 'Authoring', run: fetchValV0 }
];

export function LegacySystemApisPage() {
  const location = useLocation();
  const runMutation = useMutation({ mutationFn: async ({ action }: { action: () => Promise<Record<string, unknown>> }) => action() });
  const families = Array.from(new Set(API_ACTIONS.map((item) => item.family)));

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-legacy-system-apis">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub"><span className="legacy-v1-subtitle">Compatibility</span><span>Legacy System APIs</span></h1>
        </div>
        <nav className="legacy-v1-mast-actions" aria-label="Page Actions">
          <Link to="/course/" className="legacy-v1-link-btn">Studio Home</Link>
          <Link to="/api-families" className="legacy-v1-link-btn">Additional API Families</Link>
        </nav>
      </section>

      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <article className="legacy-v1-main">
          {families.map((family) => (
            <section className="create-form" key={family}>
              <h2>{family}</h2>
              <ul className="item-list">
                {API_ACTIONS.filter((item) => item.family === family).map((item) => (
                  <li className="item-card" key={item.label}>
                    <p>{item.label}</p>
                    <div className="item-actions"><button type="button" onClick={() => runMutation.mutate({ action: item.run })} disabled={runMutation.isPending}>Run</button></div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </article>
        <aside className="legacy-v1-sidebar" role="complementary">
          <div className="legacy-v1-side-bit">
            <h3>Last Response</h3>
            <p className="legacy-v1-muted">Path: {location.pathname}</p>
            {runMutation.isPending ? <p>Loading response...</p> : null}
            {runMutation.error ? <p className="error-text">Request failed.</p> : null}
            {runMutation.data ? <pre>{JSON.stringify(runMutation.data, null, 2)}</pre> : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
