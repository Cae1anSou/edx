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

export function NotificationsCenterPage() {
  const location = useLocation();
  const params = useParams<{ courseKey?: string; actionStateId?: string }>();
  const routeSeed = useMemo(() => {
    const pathname = location.pathname.replace(/\/+$/, '');
    if (!pathname.startsWith('/course_notifications/')) {
      return { courseKey: params.courseKey ? decodeURIComponent(params.courseKey) : '', actionStateId: params.actionStateId ? decodeURIComponent(params.actionStateId) : '' };
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

  const quickUpdate = useMutation({
    mutationFn: () => updateNotificationPreference()
  });

  return (
    <main className="container">
      <header className="page-header">
        <h1>Notifications Center</h1>
        <p>React migration for notification count, read/seen updates, and preferences.</p>
        <p>
          <strong>Current path:</strong> {location.pathname}
        </p>
        {routeSeed.courseKey ? (
          <p>
            <strong>Legacy course key:</strong> {routeSeed.courseKey}
          </p>
        ) : null}
        {routeSeed.actionStateId ? (
          <p>
            <strong>Legacy action state id:</strong> {routeSeed.actionStateId}
          </p>
        ) : null}
      </header>

      <section className="actions">
        <button type="button" onClick={() => markSeen.mutate('discussion')} disabled={markSeen.isPending}>
          Mark Discussion Seen
        </button>
        <button type="button" onClick={() => quickUpdate.mutate()} disabled={quickUpdate.isPending}>
          {quickUpdate.isPending ? 'Updating...' : 'Quick Preference Update'}
        </button>
        <Link to="/course/" className="button-link secondary-btn">
          Back to Dashboard
        </Link>
      </section>

      <section className="create-form">
        <h2>Count and Preferences</h2>
        {countQuery.isLoading ? <p>Loading count...</p> : null}
        {countQuery.error ? <p className="error-text">Failed to load notification count.</p> : null}
        {countQuery.data ? <pre>{JSON.stringify(countQuery.data, null, 2)}</pre> : null}
        {prefsV2Query.isLoading ? <p>Loading v2 preferences...</p> : null}
        {prefsV2Query.error ? <p className="error-text">Failed to load v2 preferences.</p> : null}
        {prefsV2Query.data ? <pre>{JSON.stringify(prefsV2Query.data, null, 2)}</pre> : null}
        {prefsQuery.isLoading ? <p>Loading preferences...</p> : null}
        {prefsQuery.error ? <p className="error-text">Failed to load preferences.</p> : null}
        {prefsQuery.data ? <pre>{JSON.stringify(prefsQuery.data, null, 2)}</pre> : null}
        {quickUpdate.error ? <p className="error-text">Failed to update preferences.</p> : null}
        {quickUpdate.data ? <pre>{JSON.stringify(quickUpdate.data, null, 2)}</pre> : null}
      </section>

      <section className="team-grid">
        {notificationsQuery.isLoading ? <p>Loading notifications...</p> : null}
        {notificationsQuery.error ? <p className="error-text">Failed to load notifications.</p> : null}
        {notificationsQuery.data?.results.map((item) => (
          <article className="item-card" key={item.id}>
            <h3>{item.app_name}</h3>
            <p>{item.content}</p>
            <p>
              <strong>Created:</strong> {item.created}
            </p>
            <p>
              <strong>Last Read:</strong> {item.last_read ?? 'unread'}
            </p>
            <p>
              <strong>Last Seen:</strong> {item.last_seen ?? 'unseen'}
            </p>
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
    </main>
  );
}
