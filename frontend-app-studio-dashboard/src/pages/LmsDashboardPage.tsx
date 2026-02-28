import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import {
  fetchBookmarks,
  fetchLegacyDashboard,
  fetchLearnerHome,
  fetchNotificationCount,
  fetchEntitlements
} from '../api/studio';

export function LmsDashboardPage() {
  const location = useLocation();
  const dashboardSubpath = location.pathname.replace(/^\/dashboard\/?/, '');
  const dashboardQuery = useQuery({ queryKey: ['lms-dashboard'], queryFn: fetchLegacyDashboard });
  const learnerHomeQuery = useQuery({ queryKey: ['lms-learner-home'], queryFn: fetchLearnerHome });
  const bookmarksQuery = useQuery({ queryKey: ['lms-bookmarks'], queryFn: fetchBookmarks });
  const notificationCountQuery = useQuery({ queryKey: ['lms-notification-count'], queryFn: fetchNotificationCount });
  const entitlementsQuery = useQuery({ queryKey: ['lms-entitlements'], queryFn: fetchEntitlements });

  return (
    <main className="container">
      <header className="page-header">
        <h1>LMS Dashboard</h1>
        <p>React migration entry for legacy LMS dashboard and learner-home flows.</p>
        <p>
          <strong>Current path:</strong> {location.pathname}
        </p>
        {dashboardSubpath ? (
          <p>
            <strong>Legacy dashboard subpath:</strong> {decodeURIComponent(dashboardSubpath)}
          </p>
        ) : null}
      </header>

      <section className="actions">
        <Link to="/course/" className="button-link secondary-btn">
          Go to Studio Dashboard
        </Link>
        <Link to="/learner-experience" className="button-link secondary-btn">
          Learner Experience APIs
        </Link>
        <Link to="/notifications-center" className="button-link secondary-btn">
          Notifications Center
        </Link>
      </section>

      <section className="create-form">
        <h2>Legacy Dashboard + Learner Home</h2>
        {dashboardQuery.isLoading ? <p>Loading dashboard...</p> : null}
        {dashboardQuery.error ? <p className="error-text">Failed to load dashboard.</p> : null}
        {dashboardQuery.data ? <pre>{JSON.stringify(dashboardQuery.data, null, 2)}</pre> : null}

        {learnerHomeQuery.isLoading ? <p>Loading learner home...</p> : null}
        {learnerHomeQuery.error ? <p className="error-text">Failed to load learner home.</p> : null}
        {learnerHomeQuery.data ? <pre>{JSON.stringify(learnerHomeQuery.data, null, 2)}</pre> : null}
      </section>

      <section className="create-form">
        <h2>User State</h2>
        {bookmarksQuery.isLoading ? <p>Loading bookmarks...</p> : null}
        {bookmarksQuery.error ? <p className="error-text">Failed to load bookmarks.</p> : null}
        {bookmarksQuery.data ? <pre>{JSON.stringify(bookmarksQuery.data, null, 2)}</pre> : null}

        {notificationCountQuery.isLoading ? <p>Loading notification count...</p> : null}
        {notificationCountQuery.error ? <p className="error-text">Failed to load notification count.</p> : null}
        {notificationCountQuery.data ? <pre>{JSON.stringify(notificationCountQuery.data, null, 2)}</pre> : null}

        {entitlementsQuery.isLoading ? <p>Loading entitlements...</p> : null}
        {entitlementsQuery.error ? <p className="error-text">Failed to load entitlements.</p> : null}
        {entitlementsQuery.data ? <pre>{JSON.stringify(entitlementsQuery.data, null, 2)}</pre> : null}
      </section>
    </main>
  );
}
