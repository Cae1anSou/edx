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
    <main className="container">
      <header className="page-header">
        <h1>Learner Services</h1>
        <p>React migration of enrollment, entitlements, financial assistance, and profile image actions.</p>
        <p>
          <strong>Current path:</strong> {location.pathname}
        </p>
        {routeSeed.courseId ? (
          <p>
            <strong>Legacy query course key:</strong> {routeSeed.courseId}
          </p>
        ) : null}
      </header>

      <section className="actions">
        <Link to="/course/" className="button-link secondary-btn">
          Back to Dashboard
        </Link>
      </section>

      <section className="create-form">
        <h2>Credit Providers</h2>
        {creditQuery.isLoading ? <p>Loading providers...</p> : null}
        {creditQuery.error ? <p className="error-text">Failed to load providers.</p> : null}
        {creditQuery.data ? <pre>{JSON.stringify(creditQuery.data, null, 2)}</pre> : null}
      </section>

      <section className="create-form">
        <h2>Endpoint v1</h2>
        {endpointQuery.isLoading ? <p>Loading endpoint...</p> : null}
        {endpointQuery.error ? <p className="error-text">Failed to load endpoint.</p> : null}
        {endpointQuery.data ? <pre>{JSON.stringify(endpointQuery.data, null, 2)}</pre> : null}
      </section>

      <section className="create-form">
        <h2>Entitlements</h2>
        {entitlementsQuery.isLoading ? <p>Loading entitlements...</p> : null}
        {entitlementsQuery.error ? <p className="error-text">Failed to load entitlements.</p> : null}
        {entitlementsQuery.data ? <pre>{JSON.stringify(entitlementsQuery.data, null, 2)}</pre> : null}
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
          course id
          <input value={courseId} onChange={(event) => setCourseId(event.target.value)} />
        </label>
        <div className="actions">
          <button type="submit" disabled={enrollmentMutation.isPending}>
            {enrollmentMutation.isPending ? 'Submitting...' : 'Enroll'}
          </button>
        </div>
        {enrollmentMutation.error ? <p className="error-text">Enrollment request failed.</p> : null}
        {enrollmentMutation.data ? <pre>{JSON.stringify(enrollmentMutation.data, null, 2)}</pre> : null}
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
          payload (JSON)
          <input value={financialBody} onChange={(event) => setFinancialBody(event.target.value)} />
        </label>
        <div className="actions">
          <button type="submit" disabled={financialMutation.isPending}>
            {financialMutation.isPending ? 'Submitting...' : 'Submit Financial Assistance'}
          </button>
        </div>
        {financialMutation.error ? <p className="error-text">Financial request failed or JSON is invalid.</p> : null}
        {financialMutation.data ? <pre>{JSON.stringify(financialMutation.data, null, 2)}</pre> : null}
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
        {uploadImageMutation.data ? <pre>{JSON.stringify(uploadImageMutation.data, null, 2)}</pre> : null}
        {removeImageMutation.data ? <pre>{JSON.stringify(removeImageMutation.data, null, 2)}</pre> : null}
      </section>
    </main>
  );
}
