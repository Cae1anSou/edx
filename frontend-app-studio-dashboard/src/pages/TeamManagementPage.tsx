import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCourseTeamAssignments, updateCourseTeamAssignments } from '../api/studio';

export function TeamManagementPage() {
  const [email, setEmail] = useState('');
  const [lookupEmail, setLookupEmail] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const assignmentsQuery = useQuery({
    queryKey: ['team-assignments', lookupEmail],
    queryFn: () => fetchCourseTeamAssignments(lookupEmail ?? ''),
    enabled: Boolean(lookupEmail)
  });

  const updateRole = useMutation({
    mutationFn: updateCourseTeamAssignments,
    onSuccess: (result) => {
      const failed = result.results.filter((item) => item.status !== 'success');
      if (failed.length > 0) {
        setMessage(`Updated with ${failed.length} failures.`);
      } else {
        setMessage('Role updated successfully.');
      }
      assignmentsQuery.refetch();
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('Role update failed.');
      }
    }
  });

  return (
    <main className="container">
      <header className="page-header">
        <h1>Team Management</h1>
        <p>Lookup and update course team roles.</p>
      </header>

      <form
        className="create-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!email.trim()) {
            setMessage('A valid email address is required.');
            return;
          }
          setLookupEmail(email.trim());
          setMessage(null);
        }}
      >
        <label>
          Team member email
          <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="user@example.com" />
        </label>
        <div className="actions">
          <button type="submit">Load Roles</button>
          <Link to="/course/" className="button-link secondary-btn">
            Back to Dashboard
          </Link>
        </div>
      </form>

      {message ? <p className="error-text">{message}</p> : null}

      {assignmentsQuery.isLoading ? <p>Loading team assignments...</p> : null}
      {assignmentsQuery.error ? <p className="error-text">Failed to load assignments.</p> : null}

      {assignmentsQuery.data ? (
        <section className="team-grid">
          {assignmentsQuery.data.map((item) => (
            <article className="item-card" key={item.course_id}>
              <h3>{item.course_name}</h3>
              <p>
                <strong>Course ID:</strong> {item.course_id}
              </p>
              <p>
                <strong>Org:</strong> {item.org}
              </p>
              <p>
                <strong>Current Role:</strong> {item.role ?? 'None'}
              </p>
              <div className="item-actions">
                <button
                  type="button"
                  disabled={updateRole.isPending || !lookupEmail}
                  onClick={() =>
                    updateRole.mutate({
                      email: lookupEmail ?? '',
                      operations: [{ course_id: item.course_id, role: 'staff', action: 'assign' }]
                    })
                  }
                >
                  Set Staff
                </button>
                <button
                  type="button"
                  disabled={updateRole.isPending || !lookupEmail}
                  onClick={() =>
                    updateRole.mutate({
                      email: lookupEmail ?? '',
                      operations: [{ course_id: item.course_id, role: 'instructor', action: 'assign' }]
                    })
                  }
                >
                  Set Instructor
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  disabled={updateRole.isPending || !lookupEmail || !item.role}
                  onClick={() =>
                    updateRole.mutate({
                      email: lookupEmail ?? '',
                      operations: [{ course_id: item.course_id, role: (item.role ?? 'staff') as 'staff' | 'instructor', action: 'revoke' }]
                    })
                  }
                >
                  Revoke
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : null}
    </main>
  );
}
