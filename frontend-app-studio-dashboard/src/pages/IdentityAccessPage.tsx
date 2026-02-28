import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import {
  fetchChangeEmailSettings,
  fetchCourseModesV1,
  fetchNotificationPreferencesV3,
  fetchOrganizationsV0,
  fetchThirdPartyProviders
} from '../api/studio';

export function IdentityAccessPage() {
  const location = useLocation();
  const emailSettingsQuery = useQuery({ queryKey: ['identity-email-settings'], queryFn: fetchChangeEmailSettings });
  const notificationPrefsQuery = useQuery({
    queryKey: ['identity-notification-prefs'],
    queryFn: fetchNotificationPreferencesV3
  });
  const isCourseModesRoute = location.pathname.startsWith('/course_modes');
  const courseModesQuery = useQuery({
    queryKey: ['identity-course-modes'],
    queryFn: fetchCourseModesV1,
    enabled: isCourseModesRoute
  });
  const organizationsQuery = useQuery({ queryKey: ['identity-organizations-v0'], queryFn: fetchOrganizationsV0 });
  const providersQuery = useQuery({ queryKey: ['identity-third-party-providers'], queryFn: fetchThirdPartyProviders });

  return (
    <main className="container">
      <header className="page-header">
        <h1>Identity and Access</h1>
        <p>React migration for account settings, org directory, and third-party identity providers.</p>
        <p>
          <strong>Current path:</strong> {location.pathname}
        </p>
      </header>

      <section className="actions">
        <Link to="/course/" className="button-link secondary-btn">
          Back to Dashboard
        </Link>
      </section>

      <section className="create-form">
        <h2>Account Settings</h2>
        {emailSettingsQuery.isLoading ? <p>Loading email settings...</p> : null}
        {emailSettingsQuery.error ? <p className="error-text">Failed to load email settings.</p> : null}
        {emailSettingsQuery.data ? <pre>{JSON.stringify(emailSettingsQuery.data, null, 2)}</pre> : null}

        {notificationPrefsQuery.isLoading ? <p>Loading notification preferences...</p> : null}
        {notificationPrefsQuery.error ? <p className="error-text">Failed to load notification preferences.</p> : null}
        {notificationPrefsQuery.data ? <pre>{JSON.stringify(notificationPrefsQuery.data, null, 2)}</pre> : null}
        {isCourseModesRoute ? (
          <>
            {courseModesQuery.isLoading ? <p>Loading course modes...</p> : null}
            {courseModesQuery.error ? <p className="error-text">Failed to load course modes.</p> : null}
            {courseModesQuery.data ? <pre>{JSON.stringify(courseModesQuery.data, null, 2)}</pre> : null}
          </>
        ) : null}
      </section>

      <section className="create-form">
        <h2>Organizations and Providers</h2>
        {organizationsQuery.isLoading ? <p>Loading organizations...</p> : null}
        {organizationsQuery.error ? <p className="error-text">Failed to load organizations.</p> : null}
        {organizationsQuery.data ? <pre>{JSON.stringify(organizationsQuery.data, null, 2)}</pre> : null}

        {providersQuery.isLoading ? <p>Loading providers...</p> : null}
        {providersQuery.error ? <p className="error-text">Failed to load providers.</p> : null}
        {providersQuery.data ? <pre>{JSON.stringify(providersQuery.data, null, 2)}</pre> : null}
      </section>
    </main>
  );
}
