import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  fetchEndpointV1,
  fetchInstructorTaskV1,
  fetchLegacyDashboard,
  fetchMobileApi,
  fetchNotificationCount
} from '../api/studio';

function stateOf(isLoading: boolean, isError: boolean) {
  if (isLoading) {
    return 'loading';
  }
  return isError ? 'error' : 'ok';
}

export function SystemStatusPage() {
  const location = useLocation();
  const [mobileVersion, setMobileVersion] = useState('v0');

  const endpointQuery = useQuery({ queryKey: ['status-endpoint-v1'], queryFn: fetchEndpointV1 });
  const dashboardQuery = useQuery({ queryKey: ['status-legacy-dashboard'], queryFn: fetchLegacyDashboard });
  const notificationCountQuery = useQuery({ queryKey: ['status-notification-count'], queryFn: fetchNotificationCount });
  const instructorTaskQuery = useQuery({ queryKey: ['status-instructor-task-v1'], queryFn: fetchInstructorTaskV1 });
  const mobileMutation = useMutation({ mutationFn: fetchMobileApi });

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-system-status">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub"><span className="legacy-v1-subtitle">Operations</span><span>System Status</span></h1>
        </div>
        <nav className="legacy-v1-mast-actions" aria-label="Page Actions">
          <Link to="/course/" className="legacy-v1-link-btn">Studio Home</Link>
          <Link to="/compliance" className="legacy-v1-link-btn">Compliance</Link>
        </nav>
      </section>

      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <article className="legacy-v1-main">
          <section className="create-form">
            <h2>Core Health</h2>
            <ul className="item-list">
              <li className="item-card"><h3>Endpoint API</h3><p>Status: {stateOf(endpointQuery.isLoading, endpointQuery.isError)}</p></li>
              <li className="item-card"><h3>Dashboard API</h3><p>Status: {stateOf(dashboardQuery.isLoading, dashboardQuery.isError)}</p></li>
              <li className="item-card"><h3>Notifications API</h3><p>Status: {stateOf(notificationCountQuery.isLoading, notificationCountQuery.isError)}</p></li>
              <li className="item-card"><h3>Instructor Task API</h3><p>Status: {stateOf(instructorTaskQuery.isLoading, instructorTaskQuery.isError)}</p></li>
            </ul>
          </section>

          <form className="create-form" onSubmit={(event) => { event.preventDefault(); mobileMutation.mutate(mobileVersion || 'v0'); }}>
            <h2>Mobile API Check</h2>
            <label>api version<input value={mobileVersion} onChange={(event) => setMobileVersion(event.target.value)} /></label>
            <div className="actions"><button type="submit" disabled={mobileMutation.isPending}>{mobileMutation.isPending ? 'Loading...' : 'Check Mobile API'}</button></div>
            {mobileMutation.error ? <p className="error-text">Failed to load mobile API status.</p> : null}
          </form>
        </article>

        <aside className="legacy-v1-sidebar" role="complementary">
          <div className="legacy-v1-side-bit">
            <h3>Data</h3>
            <p className="legacy-v1-muted">Path: {location.pathname}</p>
            {endpointQuery.data ? <pre>{JSON.stringify(endpointQuery.data, null, 2)}</pre> : null}
            {!endpointQuery.data && notificationCountQuery.data ? <pre>{JSON.stringify(notificationCountQuery.data, null, 2)}</pre> : null}
            {!endpointQuery.data && !notificationCountQuery.data && mobileMutation.data ? <pre>{JSON.stringify(mobileMutation.data, null, 2)}</pre> : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
