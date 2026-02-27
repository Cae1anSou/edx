import { useMutation, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchDiscussionTours, fetchUserTour, patchUserTour, updateDiscussionTour } from '../api/studio';
import { currentUserId } from '../api/client';

export function UserToursPage() {
  const userTourQuery = useQuery({
    queryKey: ['user-tour'],
    queryFn: () => fetchUserTour(currentUserId())
  });

  const discussionToursQuery = useQuery({
    queryKey: ['discussion-tours'],
    queryFn: fetchDiscussionTours
  });

  const patchUserTourMutation = useMutation({
    mutationFn: (payload: { course_home_tour_status?: string; show_courseware_tour?: boolean }) => patchUserTour(payload),
    onSuccess: () => userTourQuery.refetch()
  });

  const updateDiscussionTourMutation = useMutation({
    mutationFn: ({ tourId, showTour }: { tourId: number; showTour: boolean }) => updateDiscussionTour(tourId, showTour),
    onSuccess: () => discussionToursQuery.refetch()
  });

  return (
    <main className="container">
      <header className="page-header">
        <h1>User Tours</h1>
        <p>Manage course-home and discussion tour flags.</p>
      </header>

      <section className="actions">
        <Link to="/course/" className="button-link secondary-btn">
          Back to Dashboard
        </Link>
      </section>

      {userTourQuery.isLoading ? <p>Loading user tour...</p> : null}
      {userTourQuery.error ? <p className="error-text">Failed to load user tour.</p> : null}

      {userTourQuery.data ? (
        <section className="create-form">
          <h2>Course Home Tour</h2>
          <p>
            <strong>Status:</strong> {userTourQuery.data.course_home_tour_status}
          </p>
          <p>
            <strong>Show Courseware Tour:</strong> {String(userTourQuery.data.show_courseware_tour)}
          </p>
          <div className="actions">
            <button
              type="button"
              disabled={patchUserTourMutation.isPending}
              onClick={() =>
                patchUserTourMutation.mutate({
                  course_home_tour_status: userTourQuery.data?.course_home_tour_status === 'completed' ? 'not_started' : 'completed'
                })
              }
            >
              Toggle Status
            </button>
            <button
              type="button"
              disabled={patchUserTourMutation.isPending}
              onClick={() =>
                patchUserTourMutation.mutate({
                  show_courseware_tour: !(userTourQuery.data?.show_courseware_tour ?? false)
                })
              }
            >
              Toggle Courseware Tour
            </button>
          </div>
        </section>
      ) : null}

      {discussionToursQuery.isLoading ? <p>Loading discussion tours...</p> : null}
      {discussionToursQuery.error ? <p className="error-text">Failed to load discussion tours.</p> : null}

      {discussionToursQuery.data ? (
        <section className="team-grid">
          {discussionToursQuery.data.map((tour) => (
            <article className="item-card" key={tour.id}>
              <h3>{tour.tour_name}</h3>
              <p>
                <strong>Show Tour:</strong> {String(tour.show_tour)}
              </p>
              <div className="item-actions">
                <button
                  type="button"
                  disabled={updateDiscussionTourMutation.isPending}
                  onClick={() => updateDiscussionTourMutation.mutate({ tourId: tour.id, showTour: !tour.show_tour })}
                >
                  Toggle
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : null}
    </main>
  );
}
