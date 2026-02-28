import { useMutation, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchNotifications, markNotificationRead, markNotificationsSeen } from '../api/studio';

export function LegacyNotificationsPage() {
  const notificationsQuery = useQuery({ queryKey: ['legacy-notifications'], queryFn: fetchNotifications });

  const markRead = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => notificationsQuery.refetch()
  });

  const markSeen = useMutation({
    mutationFn: markNotificationsSeen,
    onSuccess: () => notificationsQuery.refetch()
  });

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-notifications">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub">
            <span className="legacy-v1-subtitle">Messaging</span>
            <span>Notifications</span>
          </h1>
        </div>
        <nav className="legacy-v1-mast-actions" aria-label="Page Actions">
          <button
            type="button"
            className="legacy-v1-btn"
            onClick={() => markSeen.mutate('discussion')}
            disabled={markSeen.isPending || notificationsQuery.isLoading}
          >
            Mark Discussion Seen
          </button>
          <Link to="/notifications-center" className="legacy-v1-link-btn">Notifications Center</Link>
          <Link to="/course/" className="legacy-v1-link-btn">Studio Home</Link>
        </nav>
      </section>

      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <article className="legacy-v1-main">
          {notificationsQuery.isLoading ? <p className="legacy-v1-loading-item">Loading notifications...</p> : null}
          {notificationsQuery.error ? <p className="legacy-v1-loading-item error-text">Failed to load notifications.</p> : null}
          {markRead.error ? <p className="error-text legacy-v1-page-msg">Failed to update read status.</p> : null}
          {markSeen.error ? <p className="error-text legacy-v1-page-msg">Failed to update seen status.</p> : null}

          <section className="legacy-v1-user-list">
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
            <h3>Summary</h3>
            <p>Total notifications: {notificationsQuery.data?.count ?? 0}</p>
            <p>Read mutation: {markRead.isPending ? 'running' : 'idle'}</p>
            <p>Seen mutation: {markSeen.isPending ? 'running' : 'idle'}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
