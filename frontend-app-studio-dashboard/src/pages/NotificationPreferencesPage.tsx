import { useMutation, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchNotificationPreferencesV3, updateNotificationPreference } from '../api/studio';
import { currentUserId } from '../api/client';

export function NotificationPreferencesPage() {
  const prefsQuery = useQuery({
    queryKey: ['notification-preferences-v3'],
    queryFn: fetchNotificationPreferencesV3
  });

  const updateMutation = useMutation({
    mutationFn: () => updateNotificationPreference(currentUserId())
  });

  return (
    <main className="container">
      <header className="page-header">
        <h1>Notification Preferences</h1>
        <p>Review v3 configuration and trigger one-click preference update.</p>
      </header>

      <section className="actions">
        <button type="button" onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? 'Updating...' : 'One-click Update'}
        </button>
        <Link to="/course/" className="button-link secondary-btn">
          Back to Dashboard
        </Link>
      </section>

      {prefsQuery.isLoading ? <p>Loading preferences...</p> : null}
      {prefsQuery.error ? <p className="error-text">Failed to load notification preferences.</p> : null}
      {updateMutation.error ? <p className="error-text">Failed to update preferences.</p> : null}

      {prefsQuery.data ? (
        <section className="create-form">
          <h2>Preferences Config</h2>
          <pre>{JSON.stringify(prefsQuery.data, null, 2)}</pre>
        </section>
      ) : null}

      {updateMutation.data ? (
        <section className="create-form">
          <h2>Update Result</h2>
          <pre>{JSON.stringify(updateMutation.data, null, 2)}</pre>
        </section>
      ) : null}
    </main>
  );
}
