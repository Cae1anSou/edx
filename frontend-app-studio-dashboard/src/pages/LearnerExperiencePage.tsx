import { useQuery } from '@tanstack/react-query';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  fetchBookmarks,
  fetchCourseHome,
  fetchCourseHomeV1,
  fetchDiscussionV1,
  fetchEdxNotesV1,
  fetchExperimentsV1,
  fetchLearnerHome,
  fetchLearningSequencesV1
} from '../api/studio';

export function LearnerExperiencePage() {
  const params = useParams<{ coursePath?: string }>();
  const location = useLocation();

  const parseCourseLike = (segments: string[]) => {
    if (segments.length === 0) {
      return '';
    }
    if (segments[0].includes(':')) {
      return decodeURIComponent(segments[0]);
    }
    if (segments.length >= 3) {
      return decodeURIComponent(segments.slice(0, 3).join('/'));
    }
    return decodeURIComponent(segments[0]);
  };

  const wildcardCourse = (() => {
    if (!location.pathname.startsWith('/courses/')) {
      return '';
    }
    const segments = location.pathname.replace('/courses/', '').split('/').filter(Boolean);
    return parseCourseLike(segments);
  })();
  const routeCourse = params.coursePath ? parseCourseLike([params.coursePath]) : wildcardCourse;

  const bookmarksQuery = useQuery({ queryKey: ['lx-bookmarks'], queryFn: fetchBookmarks });
  const courseHomeQuery = useQuery({ queryKey: ['lx-course-home'], queryFn: fetchCourseHome });
  const courseHomeV1Query = useQuery({ queryKey: ['lx-course-home-v1'], queryFn: fetchCourseHomeV1 });
  const learnerHomeQuery = useQuery({ queryKey: ['lx-learner-home'], queryFn: fetchLearnerHome });
  const sequencesQuery = useQuery({ queryKey: ['lx-sequences'], queryFn: fetchLearningSequencesV1 });
  const discussionQuery = useQuery({ queryKey: ['lx-discussion'], queryFn: fetchDiscussionV1 });
  const notesQuery = useQuery({ queryKey: ['lx-notes'], queryFn: fetchEdxNotesV1 });
  const experimentsQuery = useQuery({ queryKey: ['lx-experiments'], queryFn: fetchExperimentsV1 });

  return (
    <main className="container">
      <header className="page-header">
        <h1>Learner Experience</h1>
        <p>React migration for learner-facing legacy API surfaces.</p>
        <p>
          <strong>Current path:</strong> {location.pathname}
        </p>
        {location.pathname.startsWith('/notify') ? (
          <p>
            <strong>Legacy notify path:</strong> {decodeURIComponent(location.pathname.replace(/^\/notify\/?/, '') || '/')}
          </p>
        ) : null}
        {routeCourse ? (
          <p>
            <strong>Legacy route course key:</strong> {routeCourse}
          </p>
        ) : null}
      </header>

      <section className="actions">
        <Link to="/course/" className="button-link secondary-btn">
          Back to Dashboard
        </Link>
      </section>

      <section className="create-form">
        <h2>Bookmarks</h2>
        {bookmarksQuery.isLoading ? <p>Loading...</p> : null}
        {bookmarksQuery.error ? <p className="error-text">Failed to load bookmarks.</p> : null}
        {bookmarksQuery.data ? <pre>{JSON.stringify(bookmarksQuery.data, null, 2)}</pre> : null}
      </section>

      <section className="create-form">
        <h2>Course Home</h2>
        {courseHomeQuery.isLoading ? <p>Loading...</p> : null}
        {courseHomeQuery.error ? <p className="error-text">Failed to load course home.</p> : null}
        {courseHomeQuery.data ? <pre>{JSON.stringify(courseHomeQuery.data, null, 2)}</pre> : null}
        {courseHomeV1Query.isLoading ? <p>Loading v1...</p> : null}
        {courseHomeV1Query.error ? <p className="error-text">Failed to load course home v1.</p> : null}
        {courseHomeV1Query.data ? <pre>{JSON.stringify(courseHomeV1Query.data, null, 2)}</pre> : null}
      </section>

      <section className="create-form">
        <h2>Learner Home and Sequences</h2>
        {learnerHomeQuery.isLoading ? <p>Loading learner home...</p> : null}
        {learnerHomeQuery.error ? <p className="error-text">Failed to load learner home.</p> : null}
        {learnerHomeQuery.data ? <pre>{JSON.stringify(learnerHomeQuery.data, null, 2)}</pre> : null}
        {sequencesQuery.isLoading ? <p>Loading sequences...</p> : null}
        {sequencesQuery.error ? <p className="error-text">Failed to load learning sequences.</p> : null}
        {sequencesQuery.data ? <pre>{JSON.stringify(sequencesQuery.data, null, 2)}</pre> : null}
      </section>

      <section className="create-form">
        <h2>Discussion, Notes, Experiments</h2>
        {discussionQuery.isLoading ? <p>Loading discussion...</p> : null}
        {discussionQuery.error ? <p className="error-text">Failed to load discussion.</p> : null}
        {discussionQuery.data ? <pre>{JSON.stringify(discussionQuery.data, null, 2)}</pre> : null}
        {notesQuery.isLoading ? <p>Loading notes...</p> : null}
        {notesQuery.error ? <p className="error-text">Failed to load notes.</p> : null}
        {notesQuery.data ? <pre>{JSON.stringify(notesQuery.data, null, 2)}</pre> : null}
        {experimentsQuery.isLoading ? <p>Loading experiments...</p> : null}
        {experimentsQuery.error ? <p className="error-text">Failed to load experiments.</p> : null}
        {experimentsQuery.data ? <pre>{JSON.stringify(experimentsQuery.data, null, 2)}</pre> : null}
      </section>
    </main>
  );
}
