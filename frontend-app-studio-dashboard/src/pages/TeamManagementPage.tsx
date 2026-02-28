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
    if (!pathname.startsWith('/course_team/') && !pathname.startsWith('/team/')) {
      return '';
    }
    const prefix = pathname.startsWith('/course_team/') ? '/course_team/' : '/team/';
    const rest = pathname.slice(prefix.length).split('/').filter(Boolean);
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
      setMessage(failed.length > 0 ? `Updated with ${failed.length} failures.` : 'Role updated successfully.');
      assignmentsQuery.refetch();
    },
    onError: (error: unknown) => {
      setMessage(error instanceof Error ? error.message : 'Role update failed.');
    }
  });

  const canManage = Boolean(lookup?.email && lookup.email.trim());

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-team">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub">
            <span className="legacy-v1-subtitle">Settings</span>
            <span>Course Team</span>
          </h1>
        </div>
        <nav className="legacy-v1-mast-actions" aria-label="Page Actions">
          <button
            type="button"
            className="legacy-v1-btn legacy-v1-btn-primary"
            onClick={() => {
              const nextEmail = email.trim() || seededEmail;
              if (!nextEmail) {
                setMessage('Please enter a team member email first.');
                return;
              }
              setLookup({ email: nextEmail, username: username.trim() || undefined, userId: userId.trim() || undefined });
              setMessage(null);
            }}
          >
            New Team Member
          </button>
        </nav>
      </section>

      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <article className="legacy-v1-main" role="main">
          <form
            id="create-user-form"
            name="create-user-form"
            className="create-form legacy-v1-create-user form-create create-user"
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
            <h2>Add a User to Your Course's Team</h2>
            <label>
              User's Email Address
              <input
                id="user-email-input"
                className="user-email-input"
                name="user-email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="example: username@domain.com"
              />
              <span className="legacy-v1-tip">Provide the email address of the user you want to add as Staff.</span>
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
              <button type="submit">Add User</button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setEmail('');
                  setUsername('');
                  setUserId('');
                  setLookup(null);
                  setMessage(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>

          {message ? <p className="error-text legacy-v1-page-msg">{message}</p> : null}

          <ol id="user-list" className="legacy-v1-user-list user-list">
            {assignmentsQuery.isLoading ? (
              <li className="legacy-v1-loading-item">Loading</li>
            ) : null}

            {assignmentsQuery.error ? (
              <li className="legacy-v1-loading-item error-text">Failed to load assignments.</li>
            ) : null}

            {!assignmentsQuery.isLoading && !assignmentsQuery.error && (assignmentsQuery.data ?? []).length === 0 ? (
              <li className="legacy-v1-loading-item">No matching team entries.</li>
            ) : null}

            {(assignmentsQuery.data ?? []).map((item) => (
              <li className="item-card" key={item.course_id}>
                <h3>{item.course_name}</h3>
                <p><strong>Course ID:</strong> {item.course_id}</p>
                <p><strong>Organization:</strong> {item.org}</p>
                <p><strong>Current Role:</strong> {item.role ?? 'None'}</p>
                <div className="item-actions">
                  <button
                    type="button"
                    disabled={updateRole.isPending || !canManage}
                    onClick={() =>
                      updateRole.mutate({
                        email: lookup?.email ?? '',
                        operations: [{ course_id: item.course_id, role: 'staff', action: 'assign' }]
                      })
                    }
                  >
                    Add staff access
                  </button>
                  <button
                    type="button"
                    disabled={updateRole.isPending || !canManage}
                    onClick={() =>
                      updateRole.mutate({
                        email: lookup?.email ?? '',
                        operations: [{ course_id: item.course_id, role: 'instructor', action: 'assign' }]
                      })
                    }
                  >
                    Add admin access
                  </button>
                  <button
                    type="button"
                    className="secondary-btn"
                    disabled={updateRole.isPending || !canManage || !item.role}
                    onClick={() =>
                      updateRole.mutate({
                        email: lookup?.email ?? '',
                        operations: [{ course_id: item.course_id, role: (item.role ?? 'staff') as 'staff' | 'instructor', action: 'revoke' }]
                      })
                    }
                  >
                    Remove access
                  </button>
                </div>
              </li>
            ))}
          </ol>

          {(assignmentsQuery.data ?? []).length <= 1 && canManage ? (
            <div className="legacy-v1-helper-notice">
              <h3>Add Team Members to This Course</h3>
              <p>Adding team members makes course authoring collaborative. Users must have an active account.</p>
              <div className="actions">
                <button
                  type="button"
                  onClick={() => {
                    const nextEmail = email.trim() || seededEmail;
                    if (!nextEmail) {
                      setMessage('Please enter a team member email first.');
                      return;
                    }
                    setLookup({ email: nextEmail, username: username.trim() || undefined, userId: userId.trim() || undefined });
                    setMessage(null);
                  }}
                >
                  Add a New Team Member
                </button>
              </div>
            </div>
          ) : null}
        </article>

        <aside className="legacy-v1-sidebar" role="complementary">
          <div className="legacy-v1-side-bit">
            <h3>Course Team Roles</h3>
            <p>Course team members with the Staff role are course co-authors and can edit content.</p>
            <p>Admins can add and remove other course team members.</p>
            <p>All course team members can access Studio, LMS, and Insights.</p>
          </div>
          <div className="legacy-v1-side-bit">
            <h3>Transferring Ownership</h3>
            <p>Every course must have an Admin. If you are the Admin, add admin access for another user, then ask that user to remove you.</p>
          </div>
          <div className="legacy-v1-side-bit">
            <h3>Context</h3>
            <p><strong>Legacy course key:</strong> {seededCourseKey || '(none)'}</p>
            <p><strong>Current path:</strong> {location.pathname}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
