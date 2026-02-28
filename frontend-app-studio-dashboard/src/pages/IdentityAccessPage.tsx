import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import {
  fetchChangeEmailSettings,
  fetchCourseModesV1,
  fetchNotificationPreferencesV3,
  fetchOrganizationsV0,
  fetchThirdPartyProviders
} from '../api/studio';

function statusOf(isLoading: boolean, isError: boolean) {
  if (isLoading) {
    return 'loading';
  }
  return isError ? 'error' : 'ok';
}

export function IdentityAccessPage() {
  const location = useLocation();
  const emailSettingsQuery = useQuery({ queryKey: ['identity-email-settings'], queryFn: fetchChangeEmailSettings });
  const notificationPrefsQuery = useQuery({ queryKey: ['identity-notification-prefs'], queryFn: fetchNotificationPreferencesV3 });
  const isCourseModesRoute = location.pathname.startsWith('/course_modes');
  const courseModesQuery = useQuery({
    queryKey: ['identity-course-modes'],
    queryFn: fetchCourseModesV1,
    enabled: isCourseModesRoute
  });
  const organizationsQuery = useQuery({ queryKey: ['identity-organizations-v0'], queryFn: fetchOrganizationsV0 });
  const providersQuery = useQuery({ queryKey: ['identity-third-party-providers'], queryFn: fetchThirdPartyProviders });

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-identity-access">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub">
            <span className="legacy-v1-subtitle">Account</span>
            <span>Identity and Access</span>
          </h1>
        </div>
        <nav className="legacy-v1-mast-actions" aria-label="Page Actions">
          <Link to="/course/" className="legacy-v1-link-btn">Studio Home</Link>
          <Link to="/notification-preferences" className="legacy-v1-link-btn">Notification Preferences</Link>
          <Link to="/help-center" className="legacy-v1-link-btn">Help Center</Link>
        </nav>
      </section>

      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <article className="legacy-v1-main">
          <section className="create-form">
            <h2>Account and Messaging</h2>
            <ul className="item-list">
              <li className="item-card">
                <h3>Email Settings</h3>
                <p><strong>Endpoint:</strong> /api/change_email_settings/</p>
                <p><strong>Status:</strong> {statusOf(emailSettingsQuery.isLoading, emailSettingsQuery.isError)}</p>
              </li>
              <li className="item-card">
                <h3>Notification Preferences</h3>
                <p><strong>Endpoint:</strong> /api/notifications/v3/</p>
                <p><strong>Status:</strong> {statusOf(notificationPrefsQuery.isLoading, notificationPrefsQuery.isError)}</p>
              </li>
              {isCourseModesRoute ? (
                <li className="item-card">
                  <h3>Course Modes</h3>
                  <p><strong>Endpoint:</strong> /api/course_modes/v1/</p>
                  <p><strong>Status:</strong> {statusOf(courseModesQuery.isLoading, courseModesQuery.isError)}</p>
                </li>
              ) : null}
            </ul>
          </section>

          <section className="create-form">
            <h2>Organizations and Providers</h2>
            <ul className="item-list">
              <li className="item-card">
                <h3>Organizations v0</h3>
                <p><strong>Endpoint:</strong> /api/organizations/v0/</p>
                <p><strong>Status:</strong> {statusOf(organizationsQuery.isLoading, organizationsQuery.isError)}</p>
              </li>
              <li className="item-card">
                <h3>Third-party Providers</h3>
                <p><strong>Endpoint:</strong> /api/third_party_auth/v0/providers/</p>
                <p><strong>Status:</strong> {statusOf(providersQuery.isLoading, providersQuery.isError)}</p>
              </li>
            </ul>
          </section>
        </article>

        <aside className="legacy-v1-sidebar" role="complementary">
          <div className="legacy-v1-side-bit">
            <h3>Data</h3>
            <p className="legacy-v1-muted">Path: {location.pathname}</p>
            {organizationsQuery.data ? <pre>{JSON.stringify(organizationsQuery.data, null, 2)}</pre> : null}
            {!organizationsQuery.data && providersQuery.data ? <pre>{JSON.stringify(providersQuery.data, null, 2)}</pre> : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
