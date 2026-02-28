import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  fetchTeamAssignments,
  fetchTeamById,
  fetchTeamMembership,
  fetchTeamMemberships,
  fetchTeams,
  fetchTeamTopic
} from '../api/studio';

export function TeamsV0Page() {
  const location = useLocation();
  const params = useParams<{ courseKey?: string; groupConfigurationId?: string; groupId?: string }>();
  const routeSeed = useMemo(() => {
    if (params.courseKey) {
      return {
        courseId: decodeURIComponent(params.courseKey),
        teamId: params.groupConfigurationId ? decodeURIComponent(params.groupConfigurationId) : 'test-team',
        topicId: params.groupId ? decodeURIComponent(params.groupId) : 'topic-1'
      };
    }
    const pathname = location.pathname.replace(/\/+$/, '');
    if (!pathname.startsWith('/group_configurations/')) return { courseId: 'course-v1:org+num+run', teamId: 'test-team', topicId: 'topic-1' };
    const rest = pathname.slice('/group_configurations/'.length).split('/').filter(Boolean);
    if (rest.length === 0) return { courseId: 'course-v1:org+num+run', teamId: 'test-team', topicId: 'topic-1' };
    const courseId = rest[0].includes(':') ? decodeURIComponent(rest[0]) : decodeURIComponent(rest.slice(0, 3).join('/'));
    const offset = rest[0].includes(':') ? 1 : 3;
    return { courseId, teamId: rest[offset] ? decodeURIComponent(rest[offset]) : 'test-team', topicId: rest[offset + 1] ? decodeURIComponent(rest[offset + 1]) : 'topic-1' };
  }, [location.pathname, params.courseKey, params.groupConfigurationId, params.groupId]);

  const [teamId, setTeamId] = useState(routeSeed.teamId);
  const [expand, setExpand] = useState('');
  const [username, setUsername] = useState('u-test');
  const [adminOnly, setAdminOnly] = useState(false);
  const [topicId, setTopicId] = useState(routeSeed.topicId);
  const [courseId, setCourseId] = useState(routeSeed.courseId);

  const teamsQuery = useQuery({ queryKey: ['teams-v0-list'], queryFn: fetchTeams });
  const membershipsQuery = useQuery({ queryKey: ['teams-v0-memberships'], queryFn: fetchTeamMemberships });
  const teamMutation = useMutation({ mutationFn: ({ id, lookupExpand }: { id: string; lookupExpand?: string }) => fetchTeamById(id, lookupExpand) });
  const assignmentsMutation = useMutation({ mutationFn: fetchTeamAssignments });
  const membershipMutation = useMutation({ mutationFn: ({ lookupTeamId, lookupUsername, lookupAdmin }: { lookupTeamId: string; lookupUsername: string; lookupAdmin?: boolean }) => fetchTeamMembership(lookupTeamId, lookupUsername, lookupAdmin) });
  const topicMutation = useMutation({ mutationFn: ({ lookupTopicId, lookupCourseId }: { lookupTopicId: string; lookupCourseId: string }) => fetchTeamTopic(lookupTopicId, lookupCourseId) });

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-teams-v0">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub"><span className="legacy-v1-subtitle">Teams</span><span>Teams v0</span></h1>
        </div>
        <nav className="legacy-v1-mast-actions" aria-label="Page Actions">
          <Link to="/course/" className="legacy-v1-link-btn">Studio Home</Link>
          <Link to="/team" className="legacy-v1-link-btn">Team Management</Link>
          <Link to="/legacy-compatibility" className="legacy-v1-link-btn">Compatibility APIs</Link>
        </nav>
      </section>

      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <article className="legacy-v1-main">
          <section className="create-form">
            <h2>Teams and Memberships</h2>
            {teamsQuery.isLoading ? <p>Loading teams...</p> : null}
            {teamsQuery.error ? <p className="error-text">Failed to load teams.</p> : null}
            {teamsQuery.data ? <pre>{JSON.stringify(teamsQuery.data, null, 2)}</pre> : null}
            {membershipsQuery.isLoading ? <p>Loading memberships...</p> : null}
            {membershipsQuery.error ? <p className="error-text">Failed to load memberships.</p> : null}
            {membershipsQuery.data ? <pre>{JSON.stringify(membershipsQuery.data, null, 2)}</pre> : null}
          </section>

          <form className="create-form" onSubmit={(event) => { event.preventDefault(); teamMutation.mutate({ id: teamId, lookupExpand: expand || undefined }); }}>
            <h2>Team Detail</h2>
            <label>team id<input value={teamId} onChange={(event) => setTeamId(event.target.value)} /></label>
            <label>expand<input value={expand} onChange={(event) => setExpand(event.target.value)} placeholder="users,topics" /></label>
            <div className="actions">
              <button type="submit" disabled={teamMutation.isPending}>{teamMutation.isPending ? 'Loading...' : 'Load Team'}</button>
              <button type="button" disabled={assignmentsMutation.isPending} onClick={() => assignmentsMutation.mutate(teamId)}>Load Assignments</button>
            </div>
            {teamMutation.error ? <p className="error-text">Failed to load team.</p> : null}
            {assignmentsMutation.error ? <p className="error-text">Failed to load assignments.</p> : null}
            {teamMutation.data ? <pre>{JSON.stringify(teamMutation.data, null, 2)}</pre> : null}
            {assignmentsMutation.data ? <pre>{JSON.stringify(assignmentsMutation.data, null, 2)}</pre> : null}
          </form>

          <form className="create-form" onSubmit={(event) => { event.preventDefault(); membershipMutation.mutate({ lookupTeamId: teamId, lookupUsername: username, lookupAdmin: adminOnly || undefined }); }}>
            <h2>Membership Detail</h2>
            <label>username<input value={username} onChange={(event) => setUsername(event.target.value)} /></label>
            <label><input type="checkbox" checked={adminOnly} onChange={(event) => setAdminOnly(event.target.checked)} />admin only</label>
            <div className="actions"><button type="submit" disabled={membershipMutation.isPending}>{membershipMutation.isPending ? 'Loading...' : 'Load Membership'}</button></div>
            {membershipMutation.error ? <p className="error-text">Failed to load membership.</p> : null}
            {membershipMutation.data ? <pre>{JSON.stringify(membershipMutation.data, null, 2)}</pre> : null}
          </form>

          <form className="create-form" onSubmit={(event) => { event.preventDefault(); topicMutation.mutate({ lookupTopicId: topicId, lookupCourseId: courseId }); }}>
            <h2>Topic Detail</h2>
            <label>topic id<input value={topicId} onChange={(event) => setTopicId(event.target.value)} /></label>
            <label>course id<input value={courseId} onChange={(event) => setCourseId(event.target.value)} /></label>
            <div className="actions"><button type="submit" disabled={topicMutation.isPending}>{topicMutation.isPending ? 'Loading...' : 'Load Topic'}</button></div>
            {topicMutation.error ? <p className="error-text">Failed to load topic.</p> : null}
            {topicMutation.data ? <pre>{JSON.stringify(topicMutation.data, null, 2)}</pre> : null}
          </form>
        </article>

        <aside className="legacy-v1-sidebar" role="complementary">
          <div className="legacy-v1-side-bit">
            <h3>Summary</h3>
            <p>Course: {courseId}</p>
            <p>Team: {teamId}</p>
            <p>Topic: {topicId}</p>
            {teamMutation.data ? <pre>{JSON.stringify(teamMutation.data, null, 2)}</pre> : null}
            {!teamMutation.data && membershipMutation.data ? <pre>{JSON.stringify(membershipMutation.data, null, 2)}</pre> : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
