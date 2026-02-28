import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchNotificationPreferencesV2,
  fetchNotificationPreferencesV3,
  getNotificationPreferenceUpdate,
  postNotificationPreferenceUpdate
} from '../api/studio';
import { currentUserId } from '../api/client';

export function NotificationPreferencesPage() {
  const [username, setUsername] = useState(currentUserId());
  const [patch, setPatch] = useState('');

  const prefsV2Query = useQuery({
    queryKey: ['notification-preferences-v2'],
    queryFn: fetchNotificationPreferencesV2
  });

  const prefsV3Query = useQuery({
    queryKey: ['notification-preferences-v3'],
    queryFn: fetchNotificationPreferencesV3
  });

  const updateGetMutation = useMutation({
    mutationFn: ({ user, variantPatch }: { user: string; variantPatch?: string }) =>
      getNotificationPreferenceUpdate({ username: user, patch: variantPatch })
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ user, variantPatch }: { user: string; variantPatch?: string }) =>
      postNotificationPreferenceUpdate({ username: user, patch: variantPatch })
  });

  return (
    <main className="container">
      <header className="page-header">
        <h1>Notification Preferences</h1>
        <p>Review legacy notification configuration and test all one-click update variants.</p>
      </header>

      <section className="actions">
        <Link to="/course/" className="button-link secondary-btn">
          Back to Dashboard
        </Link>
      </section>

      <form
        className="create-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!username.trim()) {
            return;
          }
          updatePostMutation.mutate({ user: username.trim(), variantPatch: patch.trim() || undefined });
        }}
      >
        <h2>One-click Update Variants</h2>
        <label>
          username
          <input value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>
        <label>
          patch (optional)
          <input value={patch} onChange={(event) => setPatch(event.target.value)} placeholder="course-v1..." />
        </label>
        <div className="actions">
          <button
            type="button"
            onClick={() => {
              if (username.trim()) {
                updateGetMutation.mutate({ user: username.trim(), variantPatch: patch.trim() || undefined });
              }
            }}
            disabled={updateGetMutation.isPending}
          >
            {updateGetMutation.isPending ? 'Loading...' : 'GET Variant'}
          </button>
          <button type="submit" disabled={updatePostMutation.isPending}>
            {updatePostMutation.isPending ? 'Updating...' : 'POST Variant'}
          </button>
        </div>
        {updateGetMutation.error ? <p className="error-text">GET update variant failed.</p> : null}
        {updatePostMutation.error ? <p className="error-text">POST update variant failed.</p> : null}
        {updateGetMutation.data ? <pre>{JSON.stringify(updateGetMutation.data, null, 2)}</pre> : null}
        {updatePostMutation.data ? <pre>{JSON.stringify(updatePostMutation.data, null, 2)}</pre> : null}
      </form>

      <section className="create-form">
        <h2>Preferences Config v2</h2>
        {prefsV2Query.isLoading ? <p>Loading v2 preferences...</p> : null}
        {prefsV2Query.error ? <p className="error-text">Failed to load v2 preferences.</p> : null}
        {prefsV2Query.data ? <pre>{JSON.stringify(prefsV2Query.data, null, 2)}</pre> : null}
      </section>

      <section className="create-form">
        <h2>Preferences Config v3</h2>
        {prefsV3Query.isLoading ? <p>Loading v3 preferences...</p> : null}
        {prefsV3Query.error ? <p className="error-text">Failed to load v3 preferences.</p> : null}
        {prefsV3Query.data ? <pre>{JSON.stringify(prefsV3Query.data, null, 2)}</pre> : null}
      </section>
    </main>
  );
}
