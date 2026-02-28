import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  fetchNotificationCount,
  fetchNotificationPreferencesV2,
  fetchNotificationPreferencesV3,
  fetchNotifications,
  markNotificationRead,
  markNotificationsSeen,
  updateNotificationPreference
} from '../api/studio';

function stateOf(isLoading: boolean, isError: boolean) {
  if (isLoading) {
    return 'loading';
  }
  return isError ? 'error' : 'ok';
}

export function NotificationsCenterPage() {
  const location = useLocation();
  const params = useParams<{ courseKey?: string; actionStateId?: string }>();
  const routeSeed = useMemo(() => {
    const pathname = location.pathname.replace(/\/+$/, '');
    if (!pathname.startsWith('/course_notifications/')) {
      return {
        courseKey: params.courseKey ? decodeURIComponent(params.courseKey) : '',
        actionStateId: params.actionStateId ? decodeURIComponent(params.actionStateId) : ''
      };
    }
    const rest = pathname.slice('/course_notifications/'.length).split('/').filter(Boolean);
    if (rest.length === 0) {
      return { courseKey: '', actionStateId: '' };
    }
    let courseKey = '';
    let actionStateId = '';
    if (rest[0].includes(':')) {
      courseKey = decodeURIComponent(rest[0]);
      actionStateId = rest[1] ? decodeURIComponent(rest[1]) : '';
    } else {
      courseKey = decodeURIComponent(rest.slice(0, 3).join('/'));
      actionStateId = rest[3] ? decodeURIComponent(rest[3]) : '';
    }
    return { courseKey, actionStateId };
  }, [location.pathname, params.actionStateId, params.courseKey]);

  const notificationsQuery = useQuery({ queryKey: ['center-notifications'], queryFn: fetchNotifications });
  const countQuery = useQuery({ queryKey: ['center-notification-count'], queryFn: fetchNotificationCount });
  const prefsV2Query = useQuery({ queryKey: ['center-notification-prefs-v2'], queryFn: fetchNotificationPreferencesV2 });
  const prefsQuery = useQuery({ queryKey: ['center-notification-prefs'], queryFn: fetchNotificationPreferencesV3 });

  const markRead = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => notificationsQuery.refetch()
  });

  const markSeen = useMutation({
    mutationFn: markNotificationsSeen,
    onSuccess: () => {
      notificationsQuery.refetch();
      countQuery.refetch();
    }
  });

  const quickUpdate = useMutation({ mutationFn: () => updateNotificationPreference() });

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-notifications-center">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub">
            <span className="legacy-v1-subtitle">Messaging</span>
            <span>Notifications Center</span>
          </h1>
        </div>
        <nav className="legacy-v1-mast-actions" aria-label="Page Actions">
          <button type="button" className="legacy-v1-btn" onClick={() => markSeen.mutate('discussion')} disabled={markSeen.isPending}>
            Mark Discussion Seen
          </button>
          <button type="button" className="legacy-v1-btn" onClick={() => quickUpdate.mutate()} disabled={quickUpdate.isPending}>
            {quickUpdate.isPending ? 'Updating...' : 'Quick Preference Update'}
          </button>
          <Link to="/notifications" className="legacy-v1-link-btn">Legacy Notifications</Link>
        </nav>
      </section>

      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <article className="legacy-v1-main">
          <section className="create-form">
            <h2>Status Board</h2>
            <ul className="item-list">
              <li className="item-card"><h3>Notification Count</h3><p>Status: {stateOf(countQuery.isLoading, countQuery.isError)}</p></li>
              <li className="item-card"><h3>Preference v2</h3><p>Status: {stateOf(prefsV2Query.isLoading, prefsV2Query.isError)}</p></li>
              <li className="item-card"><h3>Preference v3</h3><p>Status: {stateOf(prefsQuery.isLoading, prefsQuery.isError)}</p></li>
            </ul>
            {quickUpdate.error ? <p className="error-text">Failed to update preferences.</p> : null}
          </section>

          <section className="legacy-v1-user-list">
            {notificationsQuery.isLoading ? <p className="legacy-v1-loading-item">Loading notifications...</p> : null}
            {notificationsQuery.error ? <p className="legacy-v1-loading-item error-text">Failed to load notifications.</p> : null}
            {(notificationsQuery.data?.results ?? []).map((item) => (
              <article className="item-card" key={item.id}>
                <h3>{item.app_name}</h3>
                <p>{item.content}</p>
                <p><strong>Created:</strong> {item.created}</p>
                <p><strong>Last Read:</strong> {item.last_read ?? 'unread'}</p>
                <p><strong>Last Seen:</strong> {item.last_seen ?? 'unseen'}</p>
                <div className="item-actions">
                  <button type="button" onClick={() => markRead.mutate({ notification_id: item.id })} disabled={markRead.isPending}>
                    Mark Read
                  </button>
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => markRead.mutate({ app_name: item.app_name })}
                    disabled={markRead.isPending}
                  >
                    Mark App Read
                  </button>
                </div>
              </article>
            ))}
          </section>
        </article>

        <aside className="legacy-v1-sidebar" role="complementary">
          <div className="legacy-v1-side-bit">
            <h3>Debug</h3>
            <p className="legacy-v1-muted">Path: {location.pathname}</p>
            {routeSeed.courseKey ? <p className="legacy-v1-muted">Course: {routeSeed.courseKey}</p> : null}
            {routeSeed.actionStateId ? <p className="legacy-v1-muted">Action State: {routeSeed.actionStateId}</p> : null}
            <p>Read mutation: {markRead.isPending ? 'running' : 'idle'}</p>
            <p>Seen mutation: {markSeen.isPending ? 'running' : 'idle'}</p>
            <p>Quick update: {quickUpdate.isPending ? 'running' : 'idle'}</p>
            {countQuery.data ? <pre>{JSON.stringify(countQuery.data, null, 2)}</pre> : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
