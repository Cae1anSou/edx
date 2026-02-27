import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchTeamAssignments,
  fetchTeamById,
  fetchTeamMembership,
  fetchTeamMemberships,
  fetchTeams,
  fetchTeamTopic
} from '../api/studio';

export function TeamsV0Page() {
  const [teamId, setTeamId] = useState('test-team');
  const [username, setUsername] = useState('u-test');
  const [topicId, setTopicId] = useState('topic-1');
  const [courseId, setCourseId] = useState('course-v1:org+num+run');

  const teamsQuery = useQuery({ queryKey: ['teams-v0-list'], queryFn: fetchTeams });
  const membershipsQuery = useQuery({ queryKey: ['teams-v0-memberships'], queryFn: fetchTeamMemberships });

  const teamMutation = useMutation({ mutationFn: (id: string) => fetchTeamById(id) });
  const assignmentsMutation = useMutation({ mutationFn: fetchTeamAssignments });
  const membershipMutation = useMutation({
    mutationFn: ({ lookupTeamId, lookupUsername }: { lookupTeamId: string; lookupUsername: string }) =>
      fetchTeamMembership(lookupTeamId, lookupUsername)
  });
  const topicMutation = useMutation({
    mutationFn: ({ lookupTopicId, lookupCourseId }: { lookupTopicId: string; lookupCourseId: string }) =>
      fetchTeamTopic(lookupTopicId, lookupCourseId)
  });

  return (
    <main className="container">
      <header className="page-header">
        <h1>Teams v0</h1>
        <p>React migration of team listing, membership, assignments, and topic lookup flows.</p>
      </header>

      <section className="actions">
        <Link to="/course/" className="button-link secondary-btn">
          Back to Dashboard
        </Link>
      </section>

      <section className="create-form">
        <h2>Teams and Memberships</h2>
        {teamsQuery.isLoading ? <p>Loading teams...</p> : null}
        {teamsQuery.error ? <p className="error-text">Failed to load teams.</p> : null}
        {teamsQuery.data ? <pre>{JSON.stringify(teamsQuery.data, null, 2)}</pre> : null}
        {membershipsQuery.isLoading ? <p>Loading memberships...</p> : null}
        {membershipsQuery.error ? <p className="error-text">Failed to load memberships.</p> : null}
        {membershipsQuery.data ? <pre>{JSON.stringify(membershipsQuery.data, null, 2)}</pre> : null}
      </section>

      <form
        className="create-form"
        onSubmit={(event) => {
          event.preventDefault();
          teamMutation.mutate(teamId);
        }}
      >
        <h2>Team Detail</h2>
        <label>
          team id
          <input value={teamId} onChange={(event) => setTeamId(event.target.value)} />
        </label>
        <div className="actions">
          <button type="submit" disabled={teamMutation.isPending}>
            {teamMutation.isPending ? 'Loading...' : 'Load Team'}
          </button>
          <button
            type="button"
            disabled={assignmentsMutation.isPending}
            onClick={() => assignmentsMutation.mutate(teamId)}
          >
            Load Assignments
          </button>
        </div>
        {teamMutation.error ? <p className="error-text">Failed to load team.</p> : null}
        {assignmentsMutation.error ? <p className="error-text">Failed to load assignments.</p> : null}
        {teamMutation.data ? <pre>{JSON.stringify(teamMutation.data, null, 2)}</pre> : null}
        {assignmentsMutation.data ? <pre>{JSON.stringify(assignmentsMutation.data, null, 2)}</pre> : null}
      </form>

      <form
        className="create-form"
        onSubmit={(event) => {
          event.preventDefault();
          membershipMutation.mutate({ lookupTeamId: teamId, lookupUsername: username });
        }}
      >
        <h2>Membership Detail</h2>
        <label>
          username
          <input value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>
        <div className="actions">
          <button type="submit" disabled={membershipMutation.isPending}>
            {membershipMutation.isPending ? 'Loading...' : 'Load Membership'}
          </button>
        </div>
        {membershipMutation.error ? <p className="error-text">Failed to load membership.</p> : null}
        {membershipMutation.data ? <pre>{JSON.stringify(membershipMutation.data, null, 2)}</pre> : null}
      </form>

      <form
        className="create-form"
        onSubmit={(event) => {
          event.preventDefault();
          topicMutation.mutate({ lookupTopicId: topicId, lookupCourseId: courseId });
        }}
      >
        <h2>Topic Detail</h2>
        <label>
          topic id
          <input value={topicId} onChange={(event) => setTopicId(event.target.value)} />
        </label>
        <label>
          course id
          <input value={courseId} onChange={(event) => setCourseId(event.target.value)} />
        </label>
        <div className="actions">
          <button type="submit" disabled={topicMutation.isPending}>
            {topicMutation.isPending ? 'Loading...' : 'Load Topic'}
          </button>
        </div>
        {topicMutation.error ? <p className="error-text">Failed to load topic.</p> : null}
        {topicMutation.data ? <pre>{JSON.stringify(topicMutation.data, null, 2)}</pre> : null}
      </form>
    </main>
  );
}
