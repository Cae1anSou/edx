import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
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
  fetchDiscountsV1,
  fetchDiscussionV1,
  fetchEdxNotesV1,
  fetchEmbargoV1,
  fetchExperimentsV1,
  fetchInstructorCourseInfo,
  fetchInstructorSummary,
  fetchInstructorTaskV1,
  fetchInstructorTasks,
  fetchInstructorV2,
  fetchLearnerHome,
  fetchLearningSequencesV1,
  fetchLibrariesV2,
  fetchMobileApi,
  fetchModulestoreMigratorV1,
  fetchOlxExportV1,
  fetchOraStaffGraderV1,
  fetchOrganizationsV0,
  fetchThirdPartyProviders,
  fetchValV0,
  fetchXblockV2,
  fetchYoutubeVideoIds,
  fetchBulkDiscussionToggle,
  postBulkEnroll
} from '../api/studio';

const SIMPLE_GET_ACTIONS: Array<{ label: string; run: () => Promise<Record<string, unknown>> }> = [
  { label: 'GET /api/ccx/v0/', run: fetchCcx },
  { label: 'GET /api/certificates/v0/', run: fetchCertificatesV0 },
  { label: 'GET /api/change_email_settings/', run: fetchChangeEmailSettings },
  { label: 'GET /api/cohorts/v1/', run: fetchCohortsV1 },
  { label: 'GET /api/content_search/v2/studio/', run: fetchContentSearchStudio },
  { label: 'GET /api/content_tagging/v1/', run: fetchContentTaggingV1 },
  { label: 'GET /api/course_home/', run: fetchCourseHome },
  { label: 'GET /api/course_home/v1/', run: fetchCourseHomeV1 },
  { label: 'GET /api/course_modes/v1/', run: fetchCourseModesV1 },
  { label: 'GET /api/discounts/v1/', run: fetchDiscountsV1 },
  { label: 'GET /api/discussion/v1/', run: fetchDiscussionV1 },
  { label: 'GET /api/edxnotes/v1/', run: fetchEdxNotesV1 },
  { label: 'GET /api/embargo/v1/', run: fetchEmbargoV1 },
  { label: 'GET /api/experiments/v1/', run: fetchExperimentsV1 },
  { label: 'GET /api/instructor/v2/', run: fetchInstructorV2 },
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

export function AdditionalApiFamiliesPage() {
  const [courseId, setCourseId] = useState('course-v1:org+num+run');
  const [mobileVersion, setMobileVersion] = useState('v0');
  const [problemLocation, setProblemLocation] = useState('');
  const [bulkPayload, setBulkPayload] = useState('{"course_id":"course-v1:org+num+run","emails":"a@example.com"}');
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const loadEndpointMutation = useMutation({ mutationFn: async ({ action }: { action: () => Promise<Record<string, unknown>> }) => action() });
  const bulkEnrollMutation = useMutation({ mutationFn: postBulkEnroll });

  const dynamicEndpoints = useMemo(() => {
    const encodedCourseId = encodeURIComponent(courseId || 'course-v1:org+num+run');
    const encodedProblem = encodeURIComponent(problemLocation);
    const problemQuery = problemLocation ? `?problem_location_str=${encodedProblem}` : '';
    return [
      { label: `/api/courses/${encodedCourseId}/bulk_enable_disable_discussions`, run: () => fetchBulkDiscussionToggle(courseId || 'course-v1:org+num+run') },
      { label: `/api/instructor/v1/?course_id=${encodedCourseId}`, run: () => fetchInstructorSummary(courseId || 'course-v1:org+num+run') },
      { label: `/api/instructor/v2/courses/${encodedCourseId}`, run: () => fetchInstructorCourseInfo(courseId || 'course-v1:org+num+run') },
      { label: `/api/instructor/v2/courses/${encodedCourseId}/instructor_tasks${problemQuery}`, run: () => fetchInstructorTasks({ courseId: courseId || 'course-v1:org+num+run', problemLocation: problemLocation || undefined }) },
      { label: `/api/mobile/${encodeURIComponent(mobileVersion || 'v0')}`, run: () => fetchMobileApi(mobileVersion || 'v0') },
      { label: `/api/youtube/courses/${encodedCourseId}/edx-video-ids`, run: () => fetchYoutubeVideoIds(courseId || 'course-v1:org+num+run') }
    ];
  }, [courseId, mobileVersion, problemLocation]);

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-additional-apis">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub">
            <span className="legacy-v1-subtitle">Compatibility</span>
            <span>Additional API Families</span>
          </h1>
        </div>
        <nav className="legacy-v1-mast-actions" aria-label="Page Actions">
          <Link to="/course/" className="legacy-v1-link-btn">Studio Home</Link>
          <Link to="/legacy-system-apis" className="legacy-v1-link-btn">Legacy System APIs</Link>
        </nav>
      </section>

      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <article className="legacy-v1-main">
          <form
            className="create-form"
            onSubmit={(event) => {
              event.preventDefault();
              try {
                const parsed = JSON.parse(bulkPayload) as Record<string, unknown>;
                bulkEnrollMutation.mutate(parsed);
              } catch {
                bulkEnrollMutation.reset();
              }
            }}
          >
            <h2>Bulk Enroll</h2>
            <label>Request payload (JSON)<input value={bulkPayload} onChange={(event) => setBulkPayload(event.target.value)} /></label>
            <div className="actions">
              <button type="submit" disabled={bulkEnrollMutation.isPending}>{bulkEnrollMutation.isPending ? 'Submitting...' : 'POST /api/bulk_enroll/v1/bulk_enroll'}</button>
            </div>
          </form>

          <section className="create-form">
            <h2>Parameterized Endpoints</h2>
            <label>course id<input value={courseId} onChange={(event) => setCourseId(event.target.value)} /></label>
            <label>mobile api version<input value={mobileVersion} onChange={(event) => setMobileVersion(event.target.value)} /></label>
            <label>instructor task problem_location_str<input value={problemLocation} onChange={(event) => setProblemLocation(event.target.value)} /></label>
            <div className="team-grid">
              {dynamicEndpoints.map((item) => (
                <article className="item-card" key={item.label}>
                  <p>{item.label}</p>
                  <div className="item-actions">
                    <button type="button" onClick={() => { setActiveAction(item.label); loadEndpointMutation.mutate({ action: item.run }); }} disabled={loadEndpointMutation.isPending}>Run</button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="create-form">
            <h2>Simple GET Endpoints</h2>
            <div className="team-grid">
              {SIMPLE_GET_ACTIONS.map((item) => (
                <article className="item-card" key={item.label}>
                  <p>{item.label}</p>
                  <div className="item-actions">
                    <button type="button" onClick={() => { setActiveAction(item.label); loadEndpointMutation.mutate({ action: item.run }); }} disabled={loadEndpointMutation.isPending}>Run</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </article>

        <aside className="legacy-v1-sidebar" role="complementary">
          <div className="legacy-v1-side-bit">
            <h3>Last Response</h3>
            {activeAction ? <p><strong>Action:</strong> {activeAction}</p> : null}
            {loadEndpointMutation.isPending ? <p>Loading endpoint response...</p> : null}
            {loadEndpointMutation.error ? <p className="error-text">Failed to load endpoint response.</p> : null}
            {bulkEnrollMutation.data ? <pre>{JSON.stringify(bulkEnrollMutation.data, null, 2)}</pre> : null}
            {!bulkEnrollMutation.data && loadEndpointMutation.data ? <pre>{JSON.stringify(loadEndpointMutation.data, null, 2)}</pre> : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
