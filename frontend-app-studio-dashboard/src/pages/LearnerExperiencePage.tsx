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

function apiState(isLoading: boolean, isError: boolean) {
  if (isLoading) {
    return 'loading';
  }
  return isError ? 'error' : 'ok';
}

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
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-learner-experience">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub">
            <span className="legacy-v1-subtitle">Learner</span>
            <span>Experience</span>
          </h1>
        </div>
        <nav className="legacy-v1-mast-actions" aria-label="Page Actions">
          <Link to="/dashboard" className="legacy-v1-link-btn">My Courses</Link>
          <Link to="/search-commerce" className="legacy-v1-link-btn">Search & Commerce</Link>
          <Link to="/notifications" className="legacy-v1-link-btn">Notifications</Link>
        </nav>
      </section>

      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <article className="legacy-v1-main">
          <section className="create-form">
            <h2>Course Navigation APIs</h2>
            <ul className="item-list">
              <li className="item-card"><h3>Bookmarks</h3><p><strong>Status:</strong> {apiState(bookmarksQuery.isLoading, bookmarksQuery.isError)}</p></li>
              <li className="item-card"><h3>Course Home</h3><p><strong>Status:</strong> {apiState(courseHomeQuery.isLoading, courseHomeQuery.isError)}</p></li>
              <li className="item-card"><h3>Course Home v1</h3><p><strong>Status:</strong> {apiState(courseHomeV1Query.isLoading, courseHomeV1Query.isError)}</p></li>
            </ul>
          </section>

          <section className="create-form">
            <h2>Learner Home and Discussion</h2>
            <ul className="item-list">
              <li className="item-card"><h3>Learner Home</h3><p><strong>Status:</strong> {apiState(learnerHomeQuery.isLoading, learnerHomeQuery.isError)}</p></li>
              <li className="item-card"><h3>Learning Sequences</h3><p><strong>Status:</strong> {apiState(sequencesQuery.isLoading, sequencesQuery.isError)}</p></li>
              <li className="item-card"><h3>Discussion / Notes / Experiments</h3><p><strong>Status:</strong> {[discussionQuery, notesQuery, experimentsQuery].some((q) => q.isError) ? 'error' : [discussionQuery, notesQuery, experimentsQuery].some((q) => q.isLoading) ? 'loading' : 'ok'}</p></li>
            </ul>
          </section>
        </article>

        <aside className="legacy-v1-sidebar" role="complementary">
          <div className="legacy-v1-side-bit">
            <h3>Data</h3>
            <p className="legacy-v1-muted">Path: {location.pathname}</p>
            {routeCourse ? <p className="legacy-v1-muted">Course: {routeCourse}</p> : null}
            {learnerHomeQuery.data ? <pre>{JSON.stringify(learnerHomeQuery.data, null, 2)}</pre> : null}
            {!learnerHomeQuery.data && discussionQuery.data ? <pre>{JSON.stringify(discussionQuery.data, null, 2)}</pre> : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
