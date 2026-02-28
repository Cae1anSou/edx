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

  const prefsV2Query = useQuery({ queryKey: ['notification-preferences-v2'], queryFn: fetchNotificationPreferencesV2 });
  const prefsV3Query = useQuery({ queryKey: ['notification-preferences-v3'], queryFn: fetchNotificationPreferencesV3 });

  const updateGetMutation = useMutation({
    mutationFn: ({ user, variantPatch }: { user: string; variantPatch?: string }) =>
      getNotificationPreferenceUpdate({ username: user, patch: variantPatch })
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ user, variantPatch }: { user: string; variantPatch?: string }) =>
      postNotificationPreferenceUpdate({ username: user, patch: variantPatch })
  });

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-notification-preferences">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub">
            <span className="legacy-v1-subtitle">Messaging</span>
            <span>Notification Preferences</span>
          </h1>
        </div>
        <nav className="legacy-v1-mast-actions" aria-label="Page Actions">
          <Link to="/notifications" className="legacy-v1-link-btn">Notifications</Link>
          <Link to="/notifications-center" className="legacy-v1-link-btn">Notifications Center</Link>
        </nav>
      </section>

      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <article className="legacy-v1-main">
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
              Username
              <input value={username} onChange={(event) => setUsername(event.target.value)} />
            </label>
            <label>
              Patch (optional)
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
          </form>

          <section className="create-form">
            <h2>Preferences Config</h2>
            {prefsV2Query.isLoading ? <p>Loading v2 preferences...</p> : null}
            {prefsV2Query.error ? <p className="error-text">Failed to load v2 preferences.</p> : null}
            {prefsV3Query.isLoading ? <p>Loading v3 preferences...</p> : null}
            {prefsV3Query.error ? <p className="error-text">Failed to load v3 preferences.</p> : null}
            <p>v2 API: {prefsV2Query.isError ? 'error' : 'ok'}</p>
            <p>v3 API: {prefsV3Query.isError ? 'error' : 'ok'}</p>
          </section>
        </article>

        <aside className="legacy-v1-sidebar" role="complementary">
          <div className="legacy-v1-side-bit">
            <h3>Response</h3>
            {updateGetMutation.data ? <pre>{JSON.stringify(updateGetMutation.data, null, 2)}</pre> : null}
            {!updateGetMutation.data && updatePostMutation.data ? <pre>{JSON.stringify(updatePostMutation.data, null, 2)}</pre> : null}
            {!updateGetMutation.data && !updatePostMutation.data && prefsV3Query.data ? <pre>{JSON.stringify(prefsV3Query.data, null, 2)}</pre> : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
