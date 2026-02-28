import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { fetchInstructorCourseInfo, fetchInstructorSummary, fetchInstructorTasks } from '../api/studio';

export function InstructorToolsPage() {
  const location = useLocation();
  const params = useParams<{ courseKey?: string; graderIndex?: string }>();
  const routeSeed = useMemo(() => {
    if (params.courseKey) {
      return {
        courseId: decodeURIComponent(params.courseKey),
        graderIndex: params.graderIndex ? decodeURIComponent(params.graderIndex) : ''
      };
    }
    const pathname = location.pathname.replace(/\/+$/, '');
    if (!pathname.startsWith('/settings/grading/')) {
      return { courseId: 'course-v1:org+num+run', graderIndex: '' };
    }
    const rest = pathname.slice('/settings/grading/'.length).split('/').filter(Boolean);
    if (rest.length === 0) {
      return { courseId: 'course-v1:org+num+run', graderIndex: '' };
    }
    if (rest[0].includes(':')) {
      return {
        courseId: decodeURIComponent(rest[0]),
        graderIndex: rest[1] ? decodeURIComponent(rest[1]) : ''
      };
    }
    return {
      courseId: decodeURIComponent(rest.slice(0, 3).join('/')),
      graderIndex: rest[3] ? decodeURIComponent(rest[3]) : ''
    };
  }, [location.pathname, params.courseKey, params.graderIndex]);

  const [courseId, setCourseId] = useState(routeSeed.courseId);
  const [problemLocation, setProblemLocation] = useState(routeSeed.graderIndex);

  const summaryMutation = useMutation({ mutationFn: fetchInstructorSummary });
  const courseInfoMutation = useMutation({ mutationFn: fetchInstructorCourseInfo });
  const tasksMutation = useMutation({
    mutationFn: ({ lookupCourseId, lookupProblemLocation }: { lookupCourseId: string; lookupProblemLocation?: string }) =>
      fetchInstructorTasks({ courseId: lookupCourseId, problemLocation: lookupProblemLocation })
  });

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-instructor-tools">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub">
            <span className="legacy-v1-subtitle">Instructor</span>
            <span>Tools</span>
          </h1>
        </div>
        <nav className="legacy-v1-mast-actions" aria-label="Page Actions">
          <Link to="/course/" className="legacy-v1-link-btn">Studio Home</Link>
          <Link to="/course-operations" className="legacy-v1-link-btn">Course Operations</Link>
          <Link to="/tasks" className="legacy-v1-link-btn">Tasks</Link>
        </nav>
      </section>

      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <article className="legacy-v1-main">
          <form
            className="create-form"
            onSubmit={(event) => {
              event.preventDefault();
              summaryMutation.mutate(courseId);
            }}
          >
            <h2>Instructor v1 Summary</h2>
            <label>
              Course id
              <input value={courseId} onChange={(event) => setCourseId(event.target.value)} />
            </label>
            <div className="actions">
              <button type="submit" disabled={summaryMutation.isPending}>{summaryMutation.isPending ? 'Loading...' : 'Load Summary'}</button>
              <button type="button" disabled={courseInfoMutation.isPending} onClick={() => courseInfoMutation.mutate(courseId)}>
                {courseInfoMutation.isPending ? 'Loading...' : 'Load v2 Course Info'}
              </button>
            </div>
            {summaryMutation.error ? <p className="error-text">Failed to load summary.</p> : null}
            {courseInfoMutation.error ? <p className="error-text">Failed to load course info.</p> : null}
          </form>

          <form
            className="create-form"
            onSubmit={(event) => {
              event.preventDefault();
              tasksMutation.mutate({ lookupCourseId: courseId, lookupProblemLocation: problemLocation || undefined });
            }}
          >
            <h2>Instructor Tasks</h2>
            <label>
              problem_location_str
              <input value={problemLocation} onChange={(event) => setProblemLocation(event.target.value)} />
            </label>
            <div className="actions">
              <button type="submit" disabled={tasksMutation.isPending}>{tasksMutation.isPending ? 'Loading...' : 'Load Tasks'}</button>
            </div>
            {tasksMutation.error ? <p className="error-text">Failed to load instructor tasks.</p> : null}
          </form>
        </article>

        <aside className="legacy-v1-sidebar" role="complementary">
          <div className="legacy-v1-side-bit">
            <h3>Response</h3>
            {summaryMutation.data ? <pre>{JSON.stringify(summaryMutation.data, null, 2)}</pre> : null}
            {!summaryMutation.data && courseInfoMutation.data ? <pre>{JSON.stringify(courseInfoMutation.data, null, 2)}</pre> : null}
            {!summaryMutation.data && !courseInfoMutation.data && tasksMutation.data ? <pre>{JSON.stringify(tasksMutation.data, null, 2)}</pre> : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
