import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  createUpload,
  fetchBookmarks,
  fetchClipboardItems,
  fetchCommerceBaskets,
  fetchDownstreams,
  fetchTeamAssignments,
  fetchTeamById,
  fetchTeamMembership,
  fetchTeamMemberships,
  fetchTeams,
  fetchTeamTopic,
  fetchUpload,
  searchLegacy,
  syncDownstream
} from '../api/studio';

export function LegacyCompatibilityPage() {
  const [searchCourseId, setSearchCourseId] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [teamId, setTeamId] = useState('test-team');
  const [teamUsername, setTeamUsername] = useState('u-test');
  const [topicId, setTopicId] = useState('topic-1');
  const [topicCourseId, setTopicCourseId] = useState('course-v1:org+num+run');
  const [syncBlockId, setSyncBlockId] = useState('block-v1');
  const [uploadFilename, setUploadFilename] = useState('syllabus.pdf');
  const [uploadToken, setUploadToken] = useState('');

  const bookmarksQuery = useQuery({ queryKey: ['legacy-bookmarks'], queryFn: fetchBookmarks });
  const searchMutation = useMutation({
    mutationFn: searchLegacy
  });
  const basketsQuery = useQuery({ queryKey: ['legacy-baskets'], queryFn: fetchCommerceBaskets });
  const clipboardQuery = useQuery({ queryKey: ['legacy-clipboard'], queryFn: fetchClipboardItems });
  const downstreamsQuery = useQuery({ queryKey: ['legacy-downstreams'], queryFn: fetchDownstreams });
  const syncMutation = useMutation({
    mutationFn: syncDownstream,
    onSuccess: () => downstreamsQuery.refetch()
  });
  const teamsQuery = useQuery({ queryKey: ['legacy-teams'], queryFn: fetchTeams });
  const teamMembershipsQuery = useQuery({ queryKey: ['legacy-team-memberships'], queryFn: fetchTeamMemberships });
  const teamByIdMutation = useMutation({ mutationFn: (id: string) => fetchTeamById(id) });
  const teamAssignmentsMutation = useMutation({ mutationFn: (id: string) => fetchTeamAssignments(id) });
  const teamMembershipMutation = useMutation({
    mutationFn: ({ lookupTeamId, lookupUsername }: { lookupTeamId: string; lookupUsername: string }) =>
      fetchTeamMembership(lookupTeamId, lookupUsername)
  });
  const teamTopicMutation = useMutation({
    mutationFn: ({ lookupTopicId, lookupCourseId }: { lookupTopicId: string; lookupCourseId: string }) =>
      fetchTeamTopic(lookupTopicId, lookupCourseId)
  });
  const uploadCreateMutation = useMutation({ mutationFn: createUpload });
  const uploadStatusMutation = useMutation({ mutationFn: fetchUpload });

  return (
    <main className="container">
      <header className="page-header">
        <h1>Legacy Compatibility APIs</h1>
        <p>Manage compatibility endpoints for bookmarks, team, contentstore, and uploads.</p>
      </header>

      <section className="actions">
        <Link to="/course/" className="button-link secondary-btn">
          Back to Dashboard
        </Link>
      </section>

      <section className="create-form">
        <h2>Bookmarks</h2>
        {bookmarksQuery.isLoading ? <p>Loading bookmarks...</p> : null}
        {bookmarksQuery.error ? <p className="error-text">Failed to load bookmarks.</p> : null}
        {bookmarksQuery.data ? <pre>{JSON.stringify(bookmarksQuery.data, null, 2)}</pre> : null}
      </section>

      <form
        className="create-form"
        onSubmit={(event) => {
          event.preventDefault();
          searchMutation.mutate({ courseId: searchCourseId || undefined, user: searchUser || undefined });
        }}
      >
        <h2>Legacy Search</h2>
        <label>
          course_id
          <input value={searchCourseId} onChange={(event) => setSearchCourseId(event.target.value)} />
        </label>
        <label>
          user
          <input value={searchUser} onChange={(event) => setSearchUser(event.target.value)} />
        </label>
        <div className="actions">
          <button type="submit" disabled={searchMutation.isPending}>
            {searchMutation.isPending ? 'Searching...' : 'Search'}
          </button>
        </div>
        {searchMutation.error ? <p className="error-text">Search request failed.</p> : null}
        {searchMutation.data ? <pre>{JSON.stringify(searchMutation.data, null, 2)}</pre> : null}
      </form>

      <section className="create-form">
        <h2>Commerce Baskets</h2>
        {basketsQuery.isLoading ? <p>Loading baskets...</p> : null}
        {basketsQuery.error ? <p className="error-text">Failed to load baskets.</p> : null}
        {basketsQuery.data ? <pre>{JSON.stringify(basketsQuery.data, null, 2)}</pre> : null}
      </section>

      <section className="create-form">
        <h2>Content Staging Clipboard</h2>
        {clipboardQuery.isLoading ? <p>Loading clipboard...</p> : null}
        {clipboardQuery.error ? <p className="error-text">Failed to load clipboard.</p> : null}
        {clipboardQuery.data ? <pre>{JSON.stringify(clipboardQuery.data, null, 2)}</pre> : null}
      </section>

      <form
        className="create-form"
        onSubmit={(event) => {
          event.preventDefault();
          syncMutation.mutate(syncBlockId);
        }}
      >
        <h2>Contentstore Downstreams</h2>
        {downstreamsQuery.isLoading ? <p>Loading downstreams...</p> : null}
        {downstreamsQuery.error ? <p className="error-text">Failed to load downstreams.</p> : null}
        {downstreamsQuery.data ? <pre>{JSON.stringify(downstreamsQuery.data, null, 2)}</pre> : null}
        <label>
          downstream block id
          <input value={syncBlockId} onChange={(event) => setSyncBlockId(event.target.value)} />
        </label>
        <div className="actions">
          <button type="submit" disabled={syncMutation.isPending}>
            {syncMutation.isPending ? 'Syncing...' : 'Sync Downstream'}
          </button>
        </div>
        {syncMutation.error ? <p className="error-text">Sync failed.</p> : null}
        {syncMutation.data ? <pre>{JSON.stringify(syncMutation.data, null, 2)}</pre> : null}
      </form>

      <section className="create-form">
        <h2>Teams</h2>
        {teamsQuery.isLoading ? <p>Loading teams...</p> : null}
        {teamsQuery.error ? <p className="error-text">Failed to load teams.</p> : null}
        {teamsQuery.data ? <pre>{JSON.stringify(teamsQuery.data, null, 2)}</pre> : null}
        {teamMembershipsQuery.isLoading ? <p>Loading memberships...</p> : null}
        {teamMembershipsQuery.error ? <p className="error-text">Failed to load memberships.</p> : null}
        {teamMembershipsQuery.data ? <pre>{JSON.stringify(teamMembershipsQuery.data, null, 2)}</pre> : null}
      </section>

      <form
        className="create-form"
        onSubmit={(event) => {
          event.preventDefault();
          teamByIdMutation.mutate(teamId);
        }}
      >
        <h2>Team Detail and Assignments</h2>
        <label>
          team id
          <input value={teamId} onChange={(event) => setTeamId(event.target.value)} />
        </label>
        <div className="actions">
          <button type="submit" disabled={teamByIdMutation.isPending}>
            Load Team
          </button>
          <button
            type="button"
            onClick={() => teamAssignmentsMutation.mutate(teamId)}
            disabled={teamAssignmentsMutation.isPending}
          >
            Load Assignments
          </button>
        </div>
        {teamByIdMutation.error ? <p className="error-text">Failed to load team.</p> : null}
        {teamAssignmentsMutation.error ? <p className="error-text">Failed to load assignments.</p> : null}
        {teamByIdMutation.data ? <pre>{JSON.stringify(teamByIdMutation.data, null, 2)}</pre> : null}
        {teamAssignmentsMutation.data ? <pre>{JSON.stringify(teamAssignmentsMutation.data, null, 2)}</pre> : null}
      </form>

      <form
        className="create-form"
        onSubmit={(event) => {
          event.preventDefault();
          teamMembershipMutation.mutate({ lookupTeamId: teamId, lookupUsername: teamUsername });
        }}
      >
        <h2>Team Membership Detail</h2>
        <label>
          username
          <input value={teamUsername} onChange={(event) => setTeamUsername(event.target.value)} />
        </label>
        <div className="actions">
          <button type="submit" disabled={teamMembershipMutation.isPending}>
            Load Membership
          </button>
        </div>
        {teamMembershipMutation.error ? <p className="error-text">Failed to load membership.</p> : null}
        {teamMembershipMutation.data ? <pre>{JSON.stringify(teamMembershipMutation.data, null, 2)}</pre> : null}
      </form>

      <form
        className="create-form"
        onSubmit={(event) => {
          event.preventDefault();
          teamTopicMutation.mutate({ lookupTopicId: topicId, lookupCourseId: topicCourseId });
        }}
      >
        <h2>Topic Lookup</h2>
        <label>
          topic id
          <input value={topicId} onChange={(event) => setTopicId(event.target.value)} />
        </label>
        <label>
          course id
          <input value={topicCourseId} onChange={(event) => setTopicCourseId(event.target.value)} />
        </label>
        <div className="actions">
          <button type="submit" disabled={teamTopicMutation.isPending}>
            Load Topic
          </button>
        </div>
        {teamTopicMutation.error ? <p className="error-text">Failed to load topic.</p> : null}
        {teamTopicMutation.data ? <pre>{JSON.stringify(teamTopicMutation.data, null, 2)}</pre> : null}
      </form>

      <form
        className="create-form"
        onSubmit={(event) => {
          event.preventDefault();
          uploadCreateMutation.mutate(uploadFilename || undefined);
        }}
      >
        <h2>Uploads</h2>
        <label>
          filename
          <input value={uploadFilename} onChange={(event) => setUploadFilename(event.target.value)} />
        </label>
        <div className="actions">
          <button type="submit" disabled={uploadCreateMutation.isPending}>
            {uploadCreateMutation.isPending ? 'Creating...' : 'Create Upload'}
          </button>
        </div>
        {uploadCreateMutation.error ? <p className="error-text">Failed to create upload.</p> : null}
        {uploadCreateMutation.data ? <pre>{JSON.stringify(uploadCreateMutation.data, null, 2)}</pre> : null}
      </form>

      <form
        className="create-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (uploadToken.trim()) {
            uploadStatusMutation.mutate(uploadToken.trim());
          }
        }}
      >
        <h2>Upload Status</h2>
        <label>
          upload token
          <input value={uploadToken} onChange={(event) => setUploadToken(event.target.value)} placeholder="up-token-1" />
        </label>
        <div className="actions">
          <button type="submit" disabled={uploadStatusMutation.isPending}>
            {uploadStatusMutation.isPending ? 'Loading...' : 'Load Upload'}
          </button>
        </div>
        {uploadStatusMutation.error ? <p className="error-text">Failed to load upload status.</p> : null}
        {uploadStatusMutation.data ? <pre>{JSON.stringify(uploadStatusMutation.data, null, 2)}</pre> : null}
      </form>
    </main>
  );
}
