import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createTask, fetchTask, fetchTasks } from '../api/studio';

export function TasksPage() {
  const [taskType, setTaskType] = useState('grade_recalculation');
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const listQuery = useQuery({ queryKey: ['legacy-tasks'], queryFn: fetchTasks });
  const taskDetailQuery = useQuery({
    queryKey: ['legacy-task-detail', selectedTaskId],
    queryFn: () => fetchTask(selectedTaskId ?? 0),
    enabled: selectedTaskId !== null
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: (task) => {
      setMessage(`Task #${task.id} created.`);
      listQuery.refetch();
      setSelectedTaskId(task.id);
    },
    onError: (error: unknown) => {
      setMessage(error instanceof Error ? error.message : 'Failed to create task.');
    }
  });

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-tasks">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub">
            <span className="legacy-v1-subtitle">Operations</span>
            <span>Tasks</span>
          </h1>
        </div>
        <nav className="legacy-v1-mast-actions" aria-label="Page Actions">
          <Link to="/course/" className="legacy-v1-link-btn">Studio Home</Link>
          <Link to="/notifications" className="legacy-v1-link-btn">Notifications</Link>
        </nav>
      </section>

      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <article className="legacy-v1-main">
          <form
            className="create-form"
            onSubmit={(event) => {
              event.preventDefault();
              createTaskMutation.mutate(taskType.trim() || 'unknown');
            }}
          >
            <h2>Create Task</h2>
            <label>
              Task type
              <input value={taskType} onChange={(event) => setTaskType(event.target.value)} placeholder="grade_recalculation" />
            </label>
            <div className="actions">
              <button type="submit" disabled={createTaskMutation.isPending}>
                {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </form>

          {message ? <p className="error-text legacy-v1-page-msg">{message}</p> : null}

          <section className="legacy-v1-user-list">
            {listQuery.isLoading ? <p className="legacy-v1-loading-item">Loading tasks...</p> : null}
            {listQuery.error ? <p className="legacy-v1-loading-item error-text">Failed to load tasks.</p> : null}

            {(listQuery.data?.results ?? []).map((task) => (
              <article key={task.id} className="item-card">
                <h3>Task #{task.id}</h3>
                <p><strong>Type:</strong> {task.task_type}</p>
                <p><strong>State:</strong> {task.state}</p>
                <p><strong>Created:</strong> {task.created}</p>
                <div className="item-actions">
                  <button type="button" onClick={() => setSelectedTaskId(task.id)}>View Details</button>
                </div>
              </article>
            ))}
          </section>
        </article>

        <aside className="legacy-v1-sidebar" role="complementary">
          <div className="legacy-v1-side-bit">
            <h3>Task Detail</h3>
            {selectedTaskId === null ? <p>Select a task from the list.</p> : <p>Selected task: #{selectedTaskId}</p>}
            {taskDetailQuery.isLoading ? <p>Loading detail...</p> : null}
            {taskDetailQuery.error ? <p className="error-text">Failed to load task detail.</p> : null}
            {taskDetailQuery.data ? <pre>{JSON.stringify(taskDetailQuery.data, null, 2)}</pre> : null}
          </div>
          <div className="legacy-v1-side-bit">
            <h3>Summary</h3>
            <p>Total tasks: {listQuery.data?.results?.length ?? 0}</p>
            <p>Create mutation: {createTaskMutation.isPending ? 'running' : 'idle'}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
