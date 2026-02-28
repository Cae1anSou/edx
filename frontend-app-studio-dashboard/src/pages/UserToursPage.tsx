import { useMutation, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchDiscussionTours, fetchUserTour, patchUserTour, updateDiscussionTour } from '../api/studio';
import { currentUserId } from '../api/client';

export function UserToursPage() {
  const userTourQuery = useQuery({ queryKey: ['user-tour'], queryFn: () => fetchUserTour(currentUserId()) });
  const discussionToursQuery = useQuery({ queryKey: ['discussion-tours'], queryFn: fetchDiscussionTours });

  const patchUserTourMutation = useMutation({
    mutationFn: (payload: { course_home_tour_status?: string; show_courseware_tour?: boolean }) => patchUserTour(payload),
    onSuccess: () => userTourQuery.refetch()
  });

  const updateDiscussionTourMutation = useMutation({
    mutationFn: ({ tourId, showTour }: { tourId: number; showTour: boolean }) => updateDiscussionTour(tourId, showTour),
    onSuccess: () => discussionToursQuery.refetch()
  });

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-user-tours">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub"><span className="legacy-v1-subtitle">Learner</span><span>User Tours</span></h1>
        </div>
        <nav className="legacy-v1-mast-actions" aria-label="Page Actions">
          <Link to="/course/" className="legacy-v1-link-btn">Studio Home</Link>
          <Link to="/notifications" className="legacy-v1-link-btn">Notifications</Link>
        </nav>
      </section>

      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <article className="legacy-v1-main">
          {userTourQuery.isLoading ? <p className="legacy-v1-loading-item">Loading user tour...</p> : null}
          {userTourQuery.error ? <p className="legacy-v1-loading-item error-text">Failed to load user tour.</p> : null}

          {userTourQuery.data ? (
            <section className="create-form">
              <h2>Course Home Tour</h2>
              <p><strong>Status:</strong> {userTourQuery.data.course_home_tour_status}</p>
              <p><strong>Show Courseware Tour:</strong> {String(userTourQuery.data.show_courseware_tour)}</p>
              <div className="actions">
                <button
                  type="button"
                  disabled={patchUserTourMutation.isPending}
                  onClick={() => patchUserTourMutation.mutate({ course_home_tour_status: userTourQuery.data?.course_home_tour_status === 'completed' ? 'not_started' : 'completed' })}
                >
                  Toggle Status
                </button>
                <button
                  type="button"
                  disabled={patchUserTourMutation.isPending}
                  onClick={() => patchUserTourMutation.mutate({ show_courseware_tour: !(userTourQuery.data?.show_courseware_tour ?? false) })}
                >
                  Toggle Courseware Tour
                </button>
              </div>
            </section>
          ) : null}

          {discussionToursQuery.isLoading ? <p className="legacy-v1-loading-item">Loading discussion tours...</p> : null}
          {discussionToursQuery.error ? <p className="legacy-v1-loading-item error-text">Failed to load discussion tours.</p> : null}

          {discussionToursQuery.data ? (
            <section className="legacy-v1-user-list">
              {discussionToursQuery.data.map((tour) => (
                <article className="item-card" key={tour.id}>
                  <h3>{tour.tour_name}</h3>
                  <p><strong>Show Tour:</strong> {String(tour.show_tour)}</p>
                  <div className="item-actions">
                    <button type="button" disabled={updateDiscussionTourMutation.isPending} onClick={() => updateDiscussionTourMutation.mutate({ tourId: tour.id, showTour: !tour.show_tour })}>
                      Toggle
                    </button>
                  </div>
                </article>
              ))}
            </section>
          ) : null}
        </article>

        <aside className="legacy-v1-sidebar" role="complementary">
          <div className="legacy-v1-side-bit">
            <h3>Summary</h3>
            <p>Discussion tours: {discussionToursQuery.data?.length ?? 0}</p>
            <p>Patch pending: {patchUserTourMutation.isPending ? 'yes' : 'no'}</p>
            <p>Discussion update pending: {updateDiscussionTourMutation.isPending ? 'yes' : 'no'}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
