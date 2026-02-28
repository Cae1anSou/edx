import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  createEnrollment,
  fetchCreditProviders,
  fetchEndpointV1,
  fetchEntitlements,
  removeStaffProfileImage,
  submitFinancialAssistance,
  uploadStaffProfileImage
} from '../api/studio';

function queryState(isLoading: boolean, isError: boolean) {
  if (isLoading) {
    return 'loading';
  }
  return isError ? 'error' : 'ok';
}

export function LearnerServicesPage() {
  const location = useLocation();
  const [courseId, setCourseId] = useState('course-v1:org+num+run');
  const [financialBody, setFinancialBody] = useState('{"course_id":"course-v1:org+num+run","reason":"need aid"}');

  const routeSeed = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return {
      courseId: searchParams.get('course_id') ?? ''
    };
  }, [location.search]);

  useEffect(() => {
    if (!routeSeed.courseId) {
      return;
    }
    setCourseId(routeSeed.courseId);
    setFinancialBody(JSON.stringify({ course_id: routeSeed.courseId, reason: 'need aid' }));
  }, [routeSeed.courseId]);

  const creditQuery = useQuery({ queryKey: ['learner-credit-providers'], queryFn: fetchCreditProviders });
  const endpointQuery = useQuery({ queryKey: ['learner-endpoint-v1'], queryFn: fetchEndpointV1 });
  const entitlementsQuery = useQuery({ queryKey: ['learner-entitlements'], queryFn: fetchEntitlements });

  const enrollmentMutation = useMutation({ mutationFn: createEnrollment });
  const financialMutation = useMutation({ mutationFn: submitFinancialAssistance });
  const uploadImageMutation = useMutation({ mutationFn: uploadStaffProfileImage });
  const removeImageMutation = useMutation({ mutationFn: removeStaffProfileImage });

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-learner-services">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub">
            <span className="legacy-v1-subtitle">Learner</span>
            <span>Services</span>
          </h1>
        </div>
        <nav className="legacy-v1-mast-actions" aria-label="Page Actions">
          <Link to="/course/" className="legacy-v1-link-btn">Studio Home</Link>
          <Link to="/search-commerce" className="legacy-v1-link-btn">Search & Commerce</Link>
          <Link to="/identity-access" className="legacy-v1-link-btn">Identity & Access</Link>
        </nav>
      </section>

      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <article className="legacy-v1-main">
          <section className="create-form">
            <h2>Service Health</h2>
            <ul className="item-list">
              <li className="item-card"><h3>Credit Providers</h3><p>Status: {queryState(creditQuery.isLoading, creditQuery.isError)}</p></li>
              <li className="item-card"><h3>Endpoint v1</h3><p>Status: {queryState(endpointQuery.isLoading, endpointQuery.isError)}</p></li>
              <li className="item-card"><h3>Entitlements</h3><p>Status: {queryState(entitlementsQuery.isLoading, entitlementsQuery.isError)}</p></li>
            </ul>
          </section>

          <form
            className="create-form"
            onSubmit={(event) => {
              event.preventDefault();
              enrollmentMutation.mutate(courseId);
            }}
          >
            <h2>Create Enrollment</h2>
            <label>
              Course id
              <input value={courseId} onChange={(event) => setCourseId(event.target.value)} />
            </label>
            <div className="actions">
              <button type="submit" disabled={enrollmentMutation.isPending}>
                {enrollmentMutation.isPending ? 'Submitting...' : 'Enroll'}
              </button>
            </div>
            {enrollmentMutation.error ? <p className="error-text">Enrollment request failed.</p> : null}
          </form>

          <form
            className="create-form"
            onSubmit={(event) => {
              event.preventDefault();
              try {
                const parsed = JSON.parse(financialBody) as Record<string, unknown>;
                financialMutation.mutate(parsed);
              } catch {
                financialMutation.reset();
              }
            }}
          >
            <h2>Financial Assistance</h2>
            <label>
              Payload (JSON)
              <input value={financialBody} onChange={(event) => setFinancialBody(event.target.value)} />
            </label>
            <div className="actions">
              <button type="submit" disabled={financialMutation.isPending}>
                {financialMutation.isPending ? 'Submitting...' : 'Submit Financial Assistance'}
              </button>
            </div>
            {financialMutation.error ? <p className="error-text">Financial request failed or JSON is invalid.</p> : null}
          </form>

          <section className="create-form">
            <h2>Staff Profile Image</h2>
            <div className="actions">
              <button type="button" disabled={uploadImageMutation.isPending} onClick={() => uploadImageMutation.mutate()}>
                {uploadImageMutation.isPending ? 'Uploading...' : 'Upload Image'}
              </button>
              <button type="button" className="secondary-btn" disabled={removeImageMutation.isPending} onClick={() => removeImageMutation.mutate()}>
                {removeImageMutation.isPending ? 'Removing...' : 'Remove Image'}
              </button>
            </div>
            {uploadImageMutation.error ? <p className="error-text">Upload image failed.</p> : null}
            {removeImageMutation.error ? <p className="error-text">Remove image failed.</p> : null}
          </section>
        </article>

        <aside className="legacy-v1-sidebar" role="complementary">
          <div className="legacy-v1-side-bit">
            <h3>Latest Response</h3>
            <p className="legacy-v1-muted">Path: {location.pathname}</p>
            {routeSeed.courseId ? <p className="legacy-v1-muted">Course: {routeSeed.courseId}</p> : null}
            {enrollmentMutation.data ? <pre>{JSON.stringify(enrollmentMutation.data, null, 2)}</pre> : null}
            {!enrollmentMutation.data && financialMutation.data ? <pre>{JSON.stringify(financialMutation.data, null, 2)}</pre> : null}
            {!enrollmentMutation.data && !financialMutation.data && uploadImageMutation.data ? <pre>{JSON.stringify(uploadImageMutation.data, null, 2)}</pre> : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
