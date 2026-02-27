import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchEndpointV1,
  fetchInstructorTaskV1,
  fetchLegacyDashboard,
  fetchMobileApi,
  fetchNotificationCount
} from '../api/studio';

export function SystemStatusPage() {
  const [mobileVersion, setMobileVersion] = useState('v0');

  const endpointQuery = useQuery({ queryKey: ['status-endpoint-v1'], queryFn: fetchEndpointV1 });
  const dashboardQuery = useQuery({ queryKey: ['status-legacy-dashboard'], queryFn: fetchLegacyDashboard });
  const notificationCountQuery = useQuery({ queryKey: ['status-notification-count'], queryFn: fetchNotificationCount });
  const instructorTaskQuery = useQuery({ queryKey: ['status-instructor-task-v1'], queryFn: fetchInstructorTaskV1 });

  const mobileMutation = useMutation({ mutationFn: fetchMobileApi });

  return (
    <main className="container">
      <header className="page-header">
        <h1>System Status</h1>
        <p>React migration for core health and status-oriented legacy endpoints.</p>
      </header>

      <section className="actions">
        <Link to="/course/" className="button-link secondary-btn">
          Back to Dashboard
        </Link>
      </section>

      <section className="create-form">
        <h2>Core Endpoint and Dashboard</h2>
        {endpointQuery.isLoading ? <p>Loading endpoint status...</p> : null}
        {endpointQuery.error ? <p className="error-text">Failed to load endpoint status.</p> : null}
        {endpointQuery.data ? <pre>{JSON.stringify(endpointQuery.data, null, 2)}</pre> : null}

        {dashboardQuery.isLoading ? <p>Loading legacy dashboard status...</p> : null}
        {dashboardQuery.error ? <p className="error-text">Failed to load legacy dashboard status.</p> : null}
        {dashboardQuery.data ? <pre>{JSON.stringify(dashboardQuery.data, null, 2)}</pre> : null}
      </section>

      <section className="create-form">
        <h2>Notifications and Instructor Tasks</h2>
        {notificationCountQuery.isLoading ? <p>Loading notification count...</p> : null}
        {notificationCountQuery.error ? <p className="error-text">Failed to load notification count.</p> : null}
        {notificationCountQuery.data ? <pre>{JSON.stringify(notificationCountQuery.data, null, 2)}</pre> : null}

        {instructorTaskQuery.isLoading ? <p>Loading instructor task status...</p> : null}
        {instructorTaskQuery.error ? <p className="error-text">Failed to load instructor task status.</p> : null}
        {instructorTaskQuery.data ? <pre>{JSON.stringify(instructorTaskQuery.data, null, 2)}</pre> : null}
      </section>

      <form
        className="create-form"
        onSubmit={(event) => {
          event.preventDefault();
          mobileMutation.mutate(mobileVersion || 'v0');
        }}
      >
        <h2>Mobile API Status</h2>
        <label>
          api version
          <input value={mobileVersion} onChange={(event) => setMobileVersion(event.target.value)} />
        </label>
        <div className="actions">
          <button type="submit" disabled={mobileMutation.isPending}>
            {mobileMutation.isPending ? 'Loading...' : 'Check Mobile API'}
          </button>
        </div>
        {mobileMutation.error ? <p className="error-text">Failed to load mobile API status.</p> : null}
        {mobileMutation.data ? <pre>{JSON.stringify(mobileMutation.data, null, 2)}</pre> : null}
      </form>
    </main>
  );
}
