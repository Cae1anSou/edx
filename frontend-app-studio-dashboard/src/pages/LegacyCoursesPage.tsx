import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  createEnrollment,
  fetchBookmarks,
  fetchCourseBlocks,
  fetchCourseHome,
  fetchCourseHomeV1,
  fetchDiscussionV1,
  fetchInstructorCourseInfo,
  fetchInstructorSummary,
  fetchInstructorTasks,
  fetchLearnerHome,
  fetchLearningProgress,
  fetchLearningSequencesV1
} from '../api/studio';
import { currentUserId } from '../api/client';

type LegacyCourseRoute = {
  courseKey: string;
  subPath: string;
  view: 'about' | 'courseware' | 'progress' | 'instructor' | 'discussion' | 'bookmarks' | 'generic';
  section?: string;
  subsection?: string;
  position?: string;
  studentId?: string;
  jumpType?: 'jump_to' | 'jump_to_id';
  jumpTarget?: string;
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
    consumed = 1;
  } else if (segments.length >= 3) {
    courseKey = segments.slice(0, 3).join('/');
    consumed = 3;
  } else {
    courseKey = segments[0];
    consumed = 1;
  }

  const viewSegments = segments.slice(consumed);
  const subPath = viewSegments.join('/');
  const lower = subPath.toLowerCase();

  let view: LegacyCourseRoute['view'] = 'generic';
  if (lower.startsWith('about')) {
    view = 'about';
  } else if (lower.startsWith('courseware')) {
    view = 'courseware';
  } else if (lower.startsWith('jump_to')) {
    view = 'courseware';
  } else if (lower.startsWith('progress')) {
    view = 'progress';
  } else if (lower.startsWith('instructor')) {
    view = 'instructor';
  } else if (lower.startsWith('discussion') || lower.startsWith('course_wiki') || lower.startsWith('wiki')) {
    view = 'discussion';
  } else if (lower.startsWith('bookmarks')) {
    view = 'bookmarks';
  }

  const parsed: LegacyCourseRoute = { courseKey, subPath, view };

  if (view === 'courseware') {
    if (viewSegments[0] === 'courseware') {
      parsed.section = viewSegments[1];
      parsed.subsection = viewSegments[2];
      parsed.position = viewSegments[3];
    } else if (viewSegments[0] === 'jump_to' || viewSegments[0] === 'jump_to_id') {
      parsed.jumpType = viewSegments[0];
      parsed.jumpTarget = viewSegments.slice(1).join('/') || undefined;
    }
  }

  if (view === 'progress' && viewSegments.length > 1) {
    parsed.studentId = viewSegments[1];
  }

  return parsed;
}

const VIEW_LABEL: Record<LegacyCourseRoute['view'], string> = {
  about: 'About',
  courseware: 'Courseware',
  progress: 'Progress',
  instructor: 'Instructor',
  discussion: 'Discussion',
  bookmarks: 'Bookmarks',
  generic: 'Generic'
};

export function LegacyCoursesPage() {
  const location = useLocation();
  const route = useMemo(() => parseLegacyCourseRoute(location.pathname), [location.pathname]);
  const hasCourse = Boolean(route.courseKey);

  const [progressUserId, setProgressUserId] = useState(route.studentId ?? currentUserId());
  const [problemLocation, setProblemLocation] = useState('');

  const aboutQuery = useQuery({
    queryKey: ['legacy-courses-about', route.courseKey],
    queryFn: fetchCourseHome,
    enabled: route.view === 'about' || route.view === 'generic'
  });
  const aboutV1Query = useQuery({
    queryKey: ['legacy-courses-about-v1', route.courseKey],
    queryFn: fetchCourseHomeV1,
    enabled: route.view === 'about' || route.view === 'generic'
  });
  const coursewareBlocksQuery = useQuery({
    queryKey: ['legacy-courses-courseware-blocks', route.courseKey],
    queryFn: () => fetchCourseBlocks(route.courseKey),
    enabled: route.view === 'courseware' && hasCourse
  });

  const learnerHomeQuery = useQuery({
    queryKey: ['legacy-courses-learner-home', route.courseKey],
    queryFn: fetchLearnerHome,
    enabled: route.view === 'progress' || route.view === 'generic'
  });
  const sequencesQuery = useQuery({
    queryKey: ['legacy-courses-sequences', route.courseKey],
    queryFn: fetchLearningSequencesV1,
    enabled: route.view === 'progress' || route.view === 'generic'
  });
  const progressQuery = useQuery({
    queryKey: ['legacy-courses-learning-progress', route.courseKey, progressUserId],
    queryFn: () => fetchLearningProgress(route.courseKey, progressUserId),
    enabled: route.view === 'progress' && hasCourse && Boolean(progressUserId.trim())
  });

  const discussionQuery = useQuery({
    queryKey: ['legacy-courses-discussion', route.courseKey],
    queryFn: fetchDiscussionV1,
    enabled: route.view === 'discussion' || route.view === 'generic'
  });
  const bookmarksQuery = useQuery({
    queryKey: ['legacy-courses-bookmarks', route.courseKey],
    queryFn: fetchBookmarks,
    enabled: route.view === 'bookmarks' || route.view === 'generic'
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
  const instructorTasksQuery = useQuery({
    queryKey: ['legacy-courses-instructor-tasks', route.courseKey, problemLocation],
    queryFn: () =>
      fetchInstructorTasks({
        courseId: route.courseKey,
        problemLocation: problemLocation.trim() || undefined
      }),
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
    <main className="container">
      <header className="page-header">
        <h1>Legacy Courses Router</h1>
        <p>React migration landing for LMS `/courses/...` legacy paths.</p>
        <p>
          <strong>Route:</strong> {location.pathname}
        </p>
        <p>
          <strong>Course key:</strong> {route.courseKey || 'N/A'}
        </p>
        <p>
          <strong>Detected view:</strong> {VIEW_LABEL[route.view]}
          {route.subPath ? ` (${route.subPath})` : ''}
        </p>
      </header>

      <section className="actions">
        <Link to="/dashboard" className="button-link secondary-btn">
          LMS Dashboard
        </Link>
        <Link to="/course/" className="button-link secondary-btn">
          Studio Dashboard
        </Link>
        <Link to="/learner-experience" className="button-link secondary-btn">
          Learner Experience
        </Link>
      </section>

      {hasCourse ? (
        <section className="actions">
          <Link to={courseLink('about')} className="button-link secondary-btn">About</Link>
          <Link to={courseLink('courseware')} className="button-link secondary-btn">Courseware</Link>
          <Link to={courseLink('progress')} className="button-link secondary-btn">Progress</Link>
          <Link to={courseLink('instructor')} className="button-link secondary-btn">Instructor</Link>
          <Link to={courseLink('discussion')} className="button-link secondary-btn">Discussion</Link>
          <Link to={courseLink('bookmarks')} className="button-link secondary-btn">Bookmarks</Link>
        </section>
      ) : null}

      {(route.view === 'about' || route.view === 'generic') ? (
        <section className="create-form">
          <h2>About</h2>
          <div className="actions">
            <button
              type="button"
              disabled={!hasCourse || enrollMutation.isPending}
              onClick={() => {
                if (hasCourse) {
                  enrollMutation.mutate(route.courseKey);
                }
              }}
            >
              {enrollMutation.isPending ? 'Enrolling...' : 'Enroll Current Course'}
            </button>
          </div>
          {enrollMutation.error ? <p className="error-text">Enrollment failed.</p> : null}
          {enrollMutation.data ? <pre>{JSON.stringify(enrollMutation.data, null, 2)}</pre> : null}
          {aboutQuery.isLoading ? <p>Loading course home...</p> : null}
          {aboutQuery.error ? <p className="error-text">Failed to load course home.</p> : null}
          {aboutQuery.data ? <pre>{JSON.stringify(aboutQuery.data, null, 2)}</pre> : null}
          {aboutV1Query.isLoading ? <p>Loading course home v1...</p> : null}
          {aboutV1Query.error ? <p className="error-text">Failed to load course home v1.</p> : null}
          {aboutV1Query.data ? <pre>{JSON.stringify(aboutV1Query.data, null, 2)}</pre> : null}
        </section>
      ) : null}

      {route.view === 'courseware' ? (
        <section className="create-form">
          <h2>Courseware</h2>
          <p>
            <strong>section:</strong> {route.section ?? '(root)'}
          </p>
          <p>
            <strong>subsection:</strong> {route.subsection ?? '(none)'}
          </p>
          <p>
            <strong>position:</strong> {route.position ?? '(none)'}
          </p>
          {route.jumpType ? (
            <p>
              <strong>{route.jumpType}:</strong> {route.jumpTarget ?? '(none)'}
            </p>
          ) : null}
          {coursewareBlocksQuery.isLoading ? <p>Loading course blocks...</p> : null}
          {coursewareBlocksQuery.error ? <p className="error-text">Failed to load course blocks.</p> : null}
          {coursewareBlocksQuery.data ? <pre>{JSON.stringify(coursewareBlocksQuery.data, null, 2)}</pre> : null}
        </section>
      ) : null}

      {(route.view === 'progress' || route.view === 'generic') ? (
        <section className="create-form">
          <h2>Progress</h2>
          <label>
            progress user id
            <input value={progressUserId} onChange={(event) => setProgressUserId(event.target.value)} />
          </label>
          {learnerHomeQuery.isLoading ? <p>Loading learner home...</p> : null}
          {learnerHomeQuery.error ? <p className="error-text">Failed to load learner home.</p> : null}
          {learnerHomeQuery.data ? <pre>{JSON.stringify(learnerHomeQuery.data, null, 2)}</pre> : null}
          {sequencesQuery.isLoading ? <p>Loading learning sequences...</p> : null}
          {sequencesQuery.error ? <p className="error-text">Failed to load learning sequences.</p> : null}
          {sequencesQuery.data ? <pre>{JSON.stringify(sequencesQuery.data, null, 2)}</pre> : null}
          {progressQuery.isLoading ? <p>Loading learning progress...</p> : null}
          {progressQuery.error ? <p className="error-text">Failed to load learning progress.</p> : null}
          {progressQuery.data ? <pre>{JSON.stringify(progressQuery.data, null, 2)}</pre> : null}
        </section>
      ) : null}

      {route.view === 'instructor' ? (
        <section className="create-form">
          <h2>Instructor</h2>
          <label>
            problem_location_str (optional)
            <input value={problemLocation} onChange={(event) => setProblemLocation(event.target.value)} />
          </label>
          {instructorSummaryQuery.isLoading ? <p>Loading instructor summary...</p> : null}
          {instructorSummaryQuery.error ? <p className="error-text">Failed to load instructor summary.</p> : null}
          {instructorSummaryQuery.data ? <pre>{JSON.stringify(instructorSummaryQuery.data, null, 2)}</pre> : null}
          {instructorCourseInfoQuery.isLoading ? <p>Loading instructor course info...</p> : null}
          {instructorCourseInfoQuery.error ? <p className="error-text">Failed to load instructor course info.</p> : null}
          {instructorCourseInfoQuery.data ? <pre>{JSON.stringify(instructorCourseInfoQuery.data, null, 2)}</pre> : null}
          {instructorTasksQuery.isLoading ? <p>Loading instructor tasks...</p> : null}
          {instructorTasksQuery.error ? <p className="error-text">Failed to load instructor tasks.</p> : null}
          {instructorTasksQuery.data ? <pre>{JSON.stringify(instructorTasksQuery.data, null, 2)}</pre> : null}
        </section>
      ) : null}

      {(route.view === 'discussion' || route.view === 'generic') ? (
        <section className="create-form">
          <h2>Discussion</h2>
          {discussionQuery.isLoading ? <p>Loading discussion...</p> : null}
          {discussionQuery.error ? <p className="error-text">Failed to load discussion.</p> : null}
          {discussionQuery.data ? <pre>{JSON.stringify(discussionQuery.data, null, 2)}</pre> : null}
        </section>
      ) : null}

      {(route.view === 'bookmarks' || route.view === 'generic') ? (
        <section className="create-form">
          <h2>Bookmarks</h2>
          {bookmarksQuery.isLoading ? <p>Loading bookmarks...</p> : null}
          {bookmarksQuery.error ? <p className="error-text">Failed to load bookmarks.</p> : null}
          {bookmarksQuery.data ? <pre>{JSON.stringify(bookmarksQuery.data, null, 2)}</pre> : null}
        </section>
      ) : null}
    </main>
  );
}
