import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
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

const API_ACTIONS: Array<{ label: string; run: () => Promise<Record<string, unknown>> }> = [
  { label: 'GET /api/ccx/v0/', run: fetchCcx },
  { label: 'GET /api/certificates/v0/', run: fetchCertificatesV0 },
  { label: 'GET /api/change_email_settings/', run: fetchChangeEmailSettings },
  { label: 'GET /api/cohorts/v1/', run: fetchCohortsV1 },
  { label: 'GET /api/content_search/v2/studio/', run: fetchContentSearchStudio },
  { label: 'GET /api/content_tagging/v1/', run: fetchContentTaggingV1 },
  { label: 'GET /api/course_home/', run: fetchCourseHome },
  { label: 'GET /api/course_home/v1/', run: fetchCourseHomeV1 },
  { label: 'GET /api/course_modes/v1/', run: fetchCourseModesV1 },
  { label: 'GET /api/dashboard/', run: fetchLegacyDashboard },
  { label: 'GET /api/discounts/v1/', run: fetchDiscountsV1 },
  { label: 'GET /api/discussion/v1/', run: fetchDiscussionV1 },
  { label: 'GET /api/edxnotes/v1/', run: fetchEdxNotesV1 },
  { label: 'GET /api/embargo/v1/', run: fetchEmbargoV1 },
  { label: 'GET /api/experiments/v1/', run: fetchExperimentsV1 },
  { label: 'GET /api/instructor_task/v1/', run: fetchInstructorTaskV1 },
  { label: 'GET /api/learner_home/', run: fetchLearnerHome },
  { label: 'GET /api/learning_sequences/v1/', run: fetchLearningSequencesV1 },
  { label: 'GET /api/libraries/v2/', run: fetchLibrariesV2 },
  { label: 'GET /api/modulestore_migrator/v1/', run: fetchModulestoreMigratorV1 },
  { label: 'GET /api/olx-export/v1/', run: fetchOlxExportV1 },
  { label: 'GET /api/ora_staff_grader/v1/', run: fetchOraStaffGraderV1 },
  { label: 'GET /api/organizations/v0/', run: fetchOrganizationsV0 },
  { label: 'GET /api/third_party_auth/v0/providers/', run: fetchThirdPartyProviders },
  { label: 'GET /api/val/v0/', run: fetchValV0 },
  { label: 'GET /api/xblock/v2/', run: fetchXblockV2 }
];

export function LegacySystemApisPage() {
  const runMutation = useMutation({
    mutationFn: async ({ action }: { action: () => Promise<Record<string, unknown>> }) => action()
  });

  return (
    <main className="container">
      <header className="page-header">
        <h1>Legacy System APIs</h1>
        <p>React page for remaining legacy system-style API families.</p>
      </header>

      <section className="actions">
        <Link to="/course/" className="button-link secondary-btn">
          Back to Dashboard
        </Link>
      </section>

      <section className="team-grid">
        {API_ACTIONS.map((item) => (
          <article className="item-card" key={item.label}>
            <p>{item.label}</p>
            <div className="item-actions">
              <button
                type="button"
                onClick={() => runMutation.mutate({ action: item.run })}
                disabled={runMutation.isPending}
              >
                Run
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="create-form">
        <h2>Last Response</h2>
        {runMutation.isPending ? <p>Loading response...</p> : null}
        {runMutation.error ? <p className="error-text">Request failed.</p> : null}
        {runMutation.data ? <pre>{JSON.stringify(runMutation.data, null, 2)}</pre> : null}
      </section>
    </main>
  );
}
