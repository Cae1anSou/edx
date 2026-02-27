import { useMutation, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchNotifications, markNotificationRead, markNotificationsSeen } from '../api/studio';

export function LegacyNotificationsPage() {
  const notificationsQuery = useQuery({
    queryKey: ['legacy-notifications'],
    queryFn: fetchNotifications
  });

  const markRead = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => notificationsQuery.refetch()
  });

  const markSeen = useMutation({
    mutationFn: markNotificationsSeen,
    onSuccess: () => notificationsQuery.refetch()
  });

  return (
    <main className="container">
      <header className="page-header">
        <h1>Notifications</h1>
        <p>Review and update notification read/seen status.</p>
      </header>

      <section className="actions">
        <button
          type="button"
          onClick={() => markSeen.mutate('discussion')}
          disabled={markSeen.isPending || notificationsQuery.isLoading}
        >
          Mark Discussion Seen
        </button>
        <Link to="/course/" className="button-link secondary-btn">
          Back to Dashboard
        </Link>
      </section>

      {notificationsQuery.isLoading ? <p>Loading notifications...</p> : null}
      {notificationsQuery.error ? <p className="error-text">Failed to load notifications.</p> : null}
      {markRead.error ? <p className="error-text">Failed to update read status.</p> : null}
      {markSeen.error ? <p className="error-text">Failed to update seen status.</p> : null}

      <section className="team-grid">
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
              <button
                type="button"
                onClick={() => markRead.mutate({ notification_id: item.id })}
                disabled={markRead.isPending}
              >
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
