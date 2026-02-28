import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { fetchCourseTeamAssignments, updateCourseTeamAssignments } from '../api/studio';

export function TeamManagementPage() {
  const location = useLocation();
  const params = useParams<{ courseKey?: string; email?: string }>();
  const seededEmail = params.email ? decodeURIComponent(params.email) : '';
  const seededCourseKey = useMemo(() => {
    if (params.courseKey) {
      return decodeURIComponent(params.courseKey);
    }
    const pathname = location.pathname.replace(/\/+$/, '');
    if (!pathname.startsWith('/course_team/')) {
      if (!pathname.startsWith('/team/')) {
        return '';
      }
      const rest = pathname.slice('/team/'.length).split('/').filter(Boolean);
      if (rest.length === 0) {
        return '';
      }
      if (rest[0].includes(':')) {
        return decodeURIComponent(rest[0]);
      }
      if (rest.length >= 3) {
        return decodeURIComponent(rest.slice(0, 3).join('/'));
      }
      return decodeURIComponent(rest[0]);
    }
    const rest = pathname.slice('/course_team/'.length).split('/').filter(Boolean);
    if (rest.length === 0) {
      return '';
    }
    if (rest[0].includes(':')) {
      return decodeURIComponent(rest[0]);
    }
    if (rest.length >= 3) {
      return decodeURIComponent(rest.slice(0, 3).join('/'));
    }
    return decodeURIComponent(rest[0]);
  }, [location.pathname, params.courseKey]);

  const [email, setEmail] = useState(seededEmail);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [lookup, setLookup] = useState<{ email?: string; username?: string; userId?: string } | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const assignmentsQuery = useQuery({
    queryKey: ['team-assignments', lookup?.email, lookup?.username, lookup?.userId],
    queryFn: () => fetchCourseTeamAssignments(lookup ?? {}),
    enabled: Boolean(lookup)
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
        {seededCourseKey ? (
          <p>
            <strong>Legacy route course key:</strong> {seededCourseKey}
          </p>
        ) : null}
      </header>

      <form
        className="create-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!email.trim() && !username.trim() && !userId.trim()) {
            setMessage('At least one filter is required: email, username, or user id.');
            return;
          }
          setLookup({
            email: email.trim() || undefined,
            username: username.trim() || undefined,
            userId: userId.trim() || undefined
          });
          setMessage(null);
        }}
      >
        <label>
          Team member email
          <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="user@example.com" />
        </label>
        <label>
          Username
          <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="staff_user" />
        </label>
        <label>
          User ID
          <input value={userId} onChange={(event) => setUserId(event.target.value)} placeholder="42" />
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
                  disabled={updateRole.isPending || !lookup?.email}
                  onClick={() =>
                    updateRole.mutate({
                      email: lookup?.email ?? '',
                      operations: [{ course_id: item.course_id, role: 'staff', action: 'assign' }]
                    })
                  }
                >
                  Set Staff
                </button>
                <button
                  type="button"
                  disabled={updateRole.isPending || !lookup?.email}
                  onClick={() =>
                    updateRole.mutate({
                      email: lookup?.email ?? '',
                      operations: [{ course_id: item.course_id, role: 'instructor', action: 'assign' }]
                    })
                  }
                >
                  Set Instructor
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  disabled={updateRole.isPending || !lookup?.email || !item.role}
                  onClick={() =>
                    updateRole.mutate({
                      email: lookup?.email ?? '',
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
