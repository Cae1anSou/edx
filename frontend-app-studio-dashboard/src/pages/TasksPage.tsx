import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createTask, fetchTask, fetchTasks } from '../api/studio';

export function TasksPage() {
  const [taskType, setTaskType] = useState('grade_recalculation');
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const listQuery = useQuery({
    queryKey: ['legacy-tasks'],
    queryFn: fetchTasks
  });

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
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('Failed to create task.');
      }
    }
  });

  return (
    <main className="container">
      <header className="page-header">
        <h1>Tasks</h1>
        <p>Create and inspect background tasks.</p>
      </header>

      <form
        className="create-form"
        onSubmit={(event) => {
          event.preventDefault();
          createTaskMutation.mutate(taskType.trim() || 'unknown');
        }}
      >
        <label>
          Task type
          <input value={taskType} onChange={(event) => setTaskType(event.target.value)} />
        </label>
        <div className="actions">
          <button type="submit" disabled={createTaskMutation.isPending}>
            {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
          </button>
          <Link to="/course/" className="button-link secondary-btn">
            Back to Dashboard
          </Link>
        </div>
      </form>

      {message ? <p className="error-text">{message}</p> : null}

      <section className="team-grid">
        {listQuery.isLoading ? <p>Loading tasks...</p> : null}
        {listQuery.error ? <p className="error-text">Failed to load tasks.</p> : null}
        {listQuery.data?.results.map((task) => (
          <article key={task.id} className="item-card">
            <h3>Task #{task.id}</h3>
            <p>
              <strong>Type:</strong> {task.task_type}
            </p>
            <p>
              <strong>State:</strong> {task.state}
            </p>
            <p>
              <strong>Created:</strong> {task.created}
            </p>
            <div className="item-actions">
              <button type="button" onClick={() => setSelectedTaskId(task.id)}>
                View Details
              </button>
            </div>
          </article>
        ))}
      </section>

      {selectedTaskId !== null ? (
        <section className="create-form">
          <h2>Task Detail #{selectedTaskId}</h2>
          {taskDetailQuery.isLoading ? <p>Loading task detail...</p> : null}
          {taskDetailQuery.error ? <p className="error-text">Failed to load task detail.</p> : null}
          {taskDetailQuery.data ? (
            <pre>{JSON.stringify(taskDetailQuery.data, null, 2)}</pre>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}
