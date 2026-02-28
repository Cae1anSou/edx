import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  createEnrollment,
  fetchBookmarks,
  fetchCourseBlocks,
  fetchCourseHome,
  fetchDiscussionV1,
  fetchInstructorCourseInfo,
  fetchInstructorSummary,
  fetchLearnerHome,
  fetchLearningProgress
} from '../api/studio';
import { currentUserId } from '../api/client';

type LegacyCourseRoute = {
  courseKey: string;
  subPath: string;
  view: 'about' | 'courseware' | 'progress' | 'instructor' | 'discussion' | 'bookmarks' | 'generic';
};

function parseLegacyCourseRoute(pathname: string): LegacyCourseRoute {
  const rest = decodeURIComponent(pathname.replace(/^\/courses\/?/, ''));
  if (!rest) {
    return { courseKey: '', subPath: '', view: 'generic' };
  }

  const segments = rest.split('/').filter(Boolean);
  if (segments.length === 0) {
    return { courseKey: '', subPath: '', view: 'generic' };
  }

  let courseKey = '';
  let consumed = 1;
  if (segments[0].includes(':')) {
    courseKey = segments[0];
  } else if (segments.length >= 3) {
    courseKey = segments.slice(0, 3).join('/');
    consumed = 3;
  } else {
    courseKey = segments[0];
  }

  const viewSegments = segments.slice(consumed);
  const subPath = viewSegments.join('/');
  const lower = subPath.toLowerCase();

  let view: LegacyCourseRoute['view'] = 'generic';
  if (lower.startsWith('about')) {
    view = 'about';
  } else if (lower.startsWith('courseware') || lower.startsWith('jump_to')) {
    view = 'courseware';
  } else if (lower.startsWith('progress')) {
    view = 'progress';
  } else if (lower.startsWith('instructor')) {
    view = 'instructor';
  } else if (lower.startsWith('discussion') || lower.startsWith('wiki')) {
    view = 'discussion';
  } else if (lower.startsWith('bookmarks')) {
    view = 'bookmarks';
  }

  return { courseKey, subPath, view };
}

const VIEW_LABEL: Record<LegacyCourseRoute['view'], string> = {
  about: 'About',
  courseware: 'Courseware',
  progress: 'Progress',
  instructor: 'Instructor',
  discussion: 'Discussion',
  bookmarks: 'Bookmarks',
  generic: 'Course Home'
};

function dataCount(value: unknown): number {
  if (!value || typeof value !== 'object') {
    return 0;
  }
  const row = value as Record<string, unknown>;
  const candidates = ['results', 'courses', 'highlights', 'blocks'];
  for (const key of candidates) {
    if (Array.isArray(row[key])) {
      return row[key].length;
    }
  }
  return 0;
}

export function LegacyCoursesPage() {
  const location = useLocation();
  const route = useMemo(() => parseLegacyCourseRoute(location.pathname), [location.pathname]);
  const hasCourse = Boolean(route.courseKey);
  const [progressUserId, setProgressUserId] = useState(currentUserId());

  const aboutQuery = useQuery({
    queryKey: ['legacy-courses-about', route.courseKey],
    queryFn: fetchCourseHome,
    enabled: hasCourse && (route.view === 'about' || route.view === 'generic')
  });

  const coursewareBlocksQuery = useQuery({
    queryKey: ['legacy-courses-courseware-blocks', route.courseKey],
    queryFn: () => fetchCourseBlocks(route.courseKey),
    enabled: route.view === 'courseware' && hasCourse
  });

  const progressQuery = useQuery({
    queryKey: ['legacy-courses-learning-progress', route.courseKey, progressUserId],
    queryFn: () => fetchLearningProgress(route.courseKey, progressUserId),
    enabled: route.view === 'progress' && hasCourse
  });

  const learnerHomeQuery = useQuery({
    queryKey: ['legacy-courses-learner-home', route.courseKey],
    queryFn: fetchLearnerHome,
    enabled: route.view === 'progress' && hasCourse
  });

  const discussionQuery = useQuery({
    queryKey: ['legacy-courses-discussion', route.courseKey],
    queryFn: fetchDiscussionV1,
    enabled: route.view === 'discussion' && hasCourse
  });

  const bookmarksQuery = useQuery({
    queryKey: ['legacy-courses-bookmarks', route.courseKey],
    queryFn: fetchBookmarks,
    enabled: route.view === 'bookmarks' && hasCourse
  });

  const instructorSummaryQuery = useQuery({
    queryKey: ['legacy-courses-instructor-summary', route.courseKey],
    queryFn: () => fetchInstructorSummary(route.courseKey),
    enabled: route.view === 'instructor' && hasCourse
  });

  const instructorCourseInfoQuery = useQuery({
    queryKey: ['legacy-courses-instructor-course-info', route.courseKey],
    queryFn: () => fetchInstructorCourseInfo(route.courseKey),
    enabled: route.view === 'instructor' && hasCourse
  });

  const enrollMutation = useMutation({ mutationFn: createEnrollment });

  const courseLink = (suffix: string) => {
    if (!hasCourse) {
      return '/courses/';
    }
    return `/courses/${encodeURIComponent(route.courseKey)}/${suffix}`;
  };

  return (
    <main className="container legacy-v1-shell legacy-v1-lms legacy-v1-legacy-courses">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub">
            <span className="legacy-v1-subtitle">LMS Course</span>
            <span>{hasCourse ? route.courseKey : 'Course Catalog'}</span>
          </h1>
          <p className="legacy-v1-muted">
            {hasCourse ? `Current view: ${VIEW_LABEL[route.view]}` : 'Open a course route to view legacy course pages.'}
          </p>
        </div>
        <nav className="legacy-v1-mast-actions" aria-label="Page Actions">
          <Link to="/dashboard" className="legacy-v1-link-btn">My Courses</Link>
          <Link to="/course/" className="legacy-v1-link-btn">Studio</Link>
        </nav>
      </section>

      <section className="legacy-v1-subnav">
        <span>View: {VIEW_LABEL[route.view]}</span>
        {hasCourse ? <Link to={courseLink('about')}>About</Link> : null}
        {hasCourse ? <Link to={courseLink('courseware')}>Courseware</Link> : null}
        {hasCourse ? <Link to={courseLink('progress')}>Progress</Link> : null}
        {hasCourse ? <Link to={courseLink('discussion')}>Discussion</Link> : null}
        {hasCourse ? <Link to={courseLink('instructor')}>Instructor</Link> : null}
        {hasCourse ? <Link to={courseLink('bookmarks')}>Bookmarks</Link> : null}
      </section>

      {!hasCourse ? (
        <section className="legacy-v1-empty">Open a course path such as <code>/courses/course-v1:edX+DemoX+2026_T1/about</code>.</section>
      ) : null}

      {hasCourse ? (
        <section className="legacy-v1-layout legacy-v1-layout-mastless">
          <div className="legacy-v1-main">
            <article className="legacy-v1-course-card">
              <div>
                <h3>{VIEW_LABEL[route.view]}</h3>
                <p className="legacy-v1-meta">{route.subPath || 'root'}</p>
              </div>
              <div className="legacy-v1-card-actions">
                <button
                  type="button"
                  className="legacy-v1-btn legacy-v1-btn-primary"
                  disabled={enrollMutation.isPending}
                  onClick={() => enrollMutation.mutate(route.courseKey)}
                >
                  {enrollMutation.isPending ? 'Enrolling...' : 'Enroll Now'}
                </button>
              </div>
            </article>

            {route.view === 'about' || route.view === 'generic' ? (
              <article className="legacy-v1-data-box">
                <h4>Course Home Data</h4>
                {aboutQuery.isLoading ? <p className="legacy-v1-muted">Loading...</p> : null}
                {aboutQuery.error ? <p className="error-text">Failed to load course home.</p> : null}
                <p>Records: {dataCount(aboutQuery.data)}</p>
              </article>
            ) : null}

            {route.view === 'courseware' ? (
              <article className="legacy-v1-data-box">
                <h4>Courseware Blocks</h4>
                {coursewareBlocksQuery.isLoading ? <p className="legacy-v1-muted">Loading...</p> : null}
                {coursewareBlocksQuery.error ? <p className="error-text">Failed to load blocks.</p> : null}
                <p>Blocks: {dataCount(coursewareBlocksQuery.data)}</p>
              </article>
            ) : null}

            {route.view === 'progress' ? (
              <article className="legacy-v1-data-box">
                <h4>Progress</h4>
                <label className="legacy-v1-inline-field">
                  User ID
                  <input value={progressUserId} onChange={(event) => setProgressUserId(event.target.value)} />
                </label>
                {progressQuery.error ? <p className="error-text">Failed to load progress.</p> : null}
                {learnerHomeQuery.error ? <p className="error-text">Failed to load learner home.</p> : null}
                <p>Progress records: {dataCount(progressQuery.data)}</p>
                <p>Highlights: {dataCount(learnerHomeQuery.data)}</p>
              </article>
            ) : null}

            {route.view === 'discussion' ? (
              <article className="legacy-v1-data-box">
                <h4>Discussion</h4>
                {discussionQuery.error ? <p className="error-text">Failed to load discussion.</p> : null}
                <p>Threads: {dataCount(discussionQuery.data)}</p>
              </article>
            ) : null}

            {route.view === 'bookmarks' ? (
              <article className="legacy-v1-data-box">
                <h4>Bookmarks</h4>
                {bookmarksQuery.error ? <p className="error-text">Failed to load bookmarks.</p> : null}
                <p>Bookmark count: {dataCount(bookmarksQuery.data)}</p>
              </article>
            ) : null}

            {route.view === 'instructor' ? (
              <article className="legacy-v1-data-box">
                <h4>Instructor Tools</h4>
                {instructorSummaryQuery.error ? <p className="error-text">Failed to load instructor summary.</p> : null}
                {instructorCourseInfoQuery.error ? <p className="error-text">Failed to load instructor details.</p> : null}
                <p>Summary records: {dataCount(instructorSummaryQuery.data)}</p>
                <p>Course records: {dataCount(instructorCourseInfoQuery.data)}</p>
              </article>
            ) : null}
          </div>

          <aside className="legacy-v1-sidebar">
            <h2>Context</h2>
            <p>Path: {location.pathname}</p>
            <p>Course key: {route.courseKey}</p>
            <p>Subpath: {route.subPath || '(none)'}</p>
            {enrollMutation.error ? <p className="error-text">Enrollment failed.</p> : null}
            {enrollMutation.data ? <p className="legacy-v1-muted">Enrollment submitted.</p> : null}
          </aside>
        </section>
      ) : null}
    </main>
  );
}
