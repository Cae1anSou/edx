import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchInstructorCourseInfo, fetchInstructorSummary, fetchInstructorTasks } from '../api/studio';

export function InstructorToolsPage() {
  const [courseId, setCourseId] = useState('course-v1:org+num+run');
  const [problemLocation, setProblemLocation] = useState('');

  const summaryMutation = useMutation({ mutationFn: fetchInstructorSummary });
  const courseInfoMutation = useMutation({ mutationFn: fetchInstructorCourseInfo });
  const tasksMutation = useMutation({
    mutationFn: ({ lookupCourseId, lookupProblemLocation }: { lookupCourseId: string; lookupProblemLocation?: string }) =>
      fetchInstructorTasks({ courseId: lookupCourseId, problemLocation: lookupProblemLocation })
  });

  return (
    <main className="container">
      <header className="page-header">
        <h1>Instructor Tools</h1>
        <p>React migration for instructor summary, course info, and instructor tasks endpoints.</p>
      </header>

      <section className="actions">
        <Link to="/course/" className="button-link secondary-btn">
          Back to Dashboard
        </Link>
      </section>

      <form
        className="create-form"
        onSubmit={(event) => {
          event.preventDefault();
          summaryMutation.mutate(courseId);
        }}
      >
        <h2>Instructor v1 Summary</h2>
        <label>
          course id
          <input value={courseId} onChange={(event) => setCourseId(event.target.value)} />
        </label>
        <div className="actions">
          <button type="submit" disabled={summaryMutation.isPending}>
            {summaryMutation.isPending ? 'Loading...' : 'Load Summary'}
          </button>
          <button type="button" disabled={courseInfoMutation.isPending} onClick={() => courseInfoMutation.mutate(courseId)}>
            {courseInfoMutation.isPending ? 'Loading...' : 'Load v2 Course Info'}
          </button>
        </div>
        {summaryMutation.error ? <p className="error-text">Failed to load summary.</p> : null}
        {courseInfoMutation.error ? <p className="error-text">Failed to load course info.</p> : null}
        {summaryMutation.data ? <pre>{JSON.stringify(summaryMutation.data, null, 2)}</pre> : null}
        {courseInfoMutation.data ? <pre>{JSON.stringify(courseInfoMutation.data, null, 2)}</pre> : null}
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
          <button type="submit" disabled={tasksMutation.isPending}>
            {tasksMutation.isPending ? 'Loading...' : 'Load Tasks'}
          </button>
        </div>
        {tasksMutation.error ? <p className="error-text">Failed to load instructor tasks.</p> : null}
        {tasksMutation.data ? <pre>{JSON.stringify(tasksMutation.data, null, 2)}</pre> : null}
      </form>
    </main>
  );
}
