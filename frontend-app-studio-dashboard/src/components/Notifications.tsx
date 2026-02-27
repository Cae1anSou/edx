import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dismissNotification } from '../api/studio';
import { StudioNotification } from '../types';

type Props = {
  notifications: StudioNotification[];
};

export function Notifications({ notifications }: Props) {
  const queryClient = useQueryClient();
  const dismiss = useMutation({
    mutationFn: dismissNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studio-dashboard'] });
    }
  });

  if (notifications.length === 0) {
    return null;
  }

  return (
    <section className="notifications">
      {notifications.map((notice) => (
        <article key={notice.id} className="notice">
          <div>
            <strong>{notice.title}</strong>
            <p>{notice.message}</p>
          </div>
          <button
            className="secondary-btn"
            disabled={dismiss.isPending}
            onClick={() => dismiss.mutate(notice.id)}
            type="button"
          >
            Dismiss
          </button>
        </article>
      ))}
    </section>
  );
}
