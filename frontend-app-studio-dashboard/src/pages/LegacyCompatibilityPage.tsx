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
  const searchMutation = useMutation({ mutationFn: searchLegacy });
  const basketsQuery = useQuery({ queryKey: ['legacy-baskets'], queryFn: fetchCommerceBaskets });
  const clipboardQuery = useQuery({ queryKey: ['legacy-clipboard'], queryFn: fetchClipboardItems });
  const downstreamsQuery = useQuery({ queryKey: ['legacy-downstreams'], queryFn: fetchDownstreams });
  const syncMutation = useMutation({ mutationFn: syncDownstream, onSuccess: () => downstreamsQuery.refetch() });
  const teamsQuery = useQuery({ queryKey: ['legacy-teams'], queryFn: fetchTeams });
  const teamMembershipsQuery = useQuery({ queryKey: ['legacy-team-memberships'], queryFn: fetchTeamMemberships });
  const teamByIdMutation = useMutation({ mutationFn: (id: string) => fetchTeamById(id) });
  const teamAssignmentsMutation = useMutation({ mutationFn: (id: string) => fetchTeamAssignments(id) });
  const teamMembershipMutation = useMutation({ mutationFn: ({ lookupTeamId, lookupUsername }: { lookupTeamId: string; lookupUsername: string }) => fetchTeamMembership(lookupTeamId, lookupUsername) });
  const teamTopicMutation = useMutation({ mutationFn: ({ lookupTopicId, lookupCourseId }: { lookupTopicId: string; lookupCourseId: string }) => fetchTeamTopic(lookupTopicId, lookupCourseId) });
  const uploadCreateMutation = useMutation({ mutationFn: createUpload });
  const uploadStatusMutation = useMutation({ mutationFn: fetchUpload });

  return (
    <main className="container legacy-v1-shell legacy-v1-generic legacy-v1-legacy-compatibility">
      <section className="legacy-v1-mast">
        <div>
          <h1 className="legacy-v1-title-with-sub">
            <span className="legacy-v1-subtitle">Compatibility</span>
            <span>Legacy Compatibility APIs</span>
          </h1>
        </div>
        <nav className="legacy-v1-mast-actions" aria-label="Page Actions">
          <Link to="/course/" className="legacy-v1-link-btn">Studio Home</Link>
          <Link to="/teams-v0" className="legacy-v1-link-btn">Teams v0</Link>
          <Link to="/uploads" className="legacy-v1-link-btn">Uploads</Link>
        </nav>
      </section>

      <section className="legacy-v1-layout legacy-v1-layout-mastless">
        <article className="legacy-v1-main">
          <section className="create-form">
            <h2>Read APIs Snapshot</h2>
            {bookmarksQuery.data ? <pre>{JSON.stringify(bookmarksQuery.data, null, 2)}</pre> : null}
            {basketsQuery.data ? <pre>{JSON.stringify(basketsQuery.data, null, 2)}</pre> : null}
            {clipboardQuery.data ? <pre>{JSON.stringify(clipboardQuery.data, null, 2)}</pre> : null}
            {downstreamsQuery.data ? <pre>{JSON.stringify(downstreamsQuery.data, null, 2)}</pre> : null}
            {teamsQuery.data ? <pre>{JSON.stringify(teamsQuery.data, null, 2)}</pre> : null}
            {teamMembershipsQuery.data ? <pre>{JSON.stringify(teamMembershipsQuery.data, null, 2)}</pre> : null}
          </section>

          <form className="create-form" onSubmit={(event) => { event.preventDefault(); searchMutation.mutate({ courseId: searchCourseId || undefined, user: searchUser || undefined }); }}>
            <h2>Legacy Search</h2>
            <label>course_id<input value={searchCourseId} onChange={(event) => setSearchCourseId(event.target.value)} /></label>
            <label>user<input value={searchUser} onChange={(event) => setSearchUser(event.target.value)} /></label>
            <div className="actions"><button type="submit" disabled={searchMutation.isPending}>{searchMutation.isPending ? 'Searching...' : 'Search'}</button></div>
          </form>

          <form className="create-form" onSubmit={(event) => { event.preventDefault(); syncMutation.mutate(syncBlockId); }}>
            <h2>Downstream Sync</h2>
            <label>downstream block id<input value={syncBlockId} onChange={(event) => setSyncBlockId(event.target.value)} /></label>
            <div className="actions"><button type="submit" disabled={syncMutation.isPending}>{syncMutation.isPending ? 'Syncing...' : 'Sync Downstream'}</button></div>
          </form>

          <form className="create-form" onSubmit={(event) => { event.preventDefault(); teamByIdMutation.mutate(teamId); }}>
            <h2>Teams</h2>
            <label>team id<input value={teamId} onChange={(event) => setTeamId(event.target.value)} /></label>
            <label>username<input value={teamUsername} onChange={(event) => setTeamUsername(event.target.value)} /></label>
            <label>topic id<input value={topicId} onChange={(event) => setTopicId(event.target.value)} /></label>
            <label>topic course id<input value={topicCourseId} onChange={(event) => setTopicCourseId(event.target.value)} /></label>
            <div className="actions">
              <button type="submit" disabled={teamByIdMutation.isPending}>Load Team</button>
              <button type="button" onClick={() => teamAssignmentsMutation.mutate(teamId)} disabled={teamAssignmentsMutation.isPending}>Load Assignments</button>
              <button type="button" onClick={() => teamMembershipMutation.mutate({ lookupTeamId: teamId, lookupUsername: teamUsername })} disabled={teamMembershipMutation.isPending}>Load Membership</button>
              <button type="button" onClick={() => teamTopicMutation.mutate({ lookupTopicId: topicId, lookupCourseId: topicCourseId })} disabled={teamTopicMutation.isPending}>Load Topic</button>
            </div>
          </form>

          <form className="create-form" onSubmit={(event) => { event.preventDefault(); uploadCreateMutation.mutate(uploadFilename || undefined); }}>
            <h2>Uploads</h2>
            <label>filename<input value={uploadFilename} onChange={(event) => setUploadFilename(event.target.value)} /></label>
            <div className="actions"><button type="submit" disabled={uploadCreateMutation.isPending}>{uploadCreateMutation.isPending ? 'Creating...' : 'Create Upload'}</button></div>
          </form>

          <form className="create-form" onSubmit={(event) => { event.preventDefault(); if (uploadToken.trim()) uploadStatusMutation.mutate(uploadToken.trim()); }}>
            <h2>Upload Status</h2>
            <label>upload token<input value={uploadToken} onChange={(event) => setUploadToken(event.target.value)} placeholder="up-token-1" /></label>
            <div className="actions"><button type="submit" disabled={uploadStatusMutation.isPending}>{uploadStatusMutation.isPending ? 'Loading...' : 'Load Upload'}</button></div>
          </form>
        </article>

        <aside className="legacy-v1-sidebar" role="complementary">
          <div className="legacy-v1-side-bit">
            <h3>Summary</h3>
            <p>Teams loaded: {(teamsQuery.data as { results?: unknown[] } | undefined)?.results?.length ?? 0}</p>
            <p>Memberships loaded: {(teamMembershipsQuery.data as { results?: unknown[] } | undefined)?.results?.length ?? 0}</p>
            {searchMutation.data ? <pre>{JSON.stringify(searchMutation.data, null, 2)}</pre> : null}
            {!searchMutation.data && teamByIdMutation.data ? <pre>{JSON.stringify(teamByIdMutation.data, null, 2)}</pre> : null}
            {!searchMutation.data && !teamByIdMutation.data && uploadStatusMutation.data ? <pre>{JSON.stringify(uploadStatusMutation.data, null, 2)}</pre> : null}
            {teamAssignmentsMutation.data ? <pre>{JSON.stringify(teamAssignmentsMutation.data, null, 2)}</pre> : null}
            {teamMembershipMutation.data ? <pre>{JSON.stringify(teamMembershipMutation.data, null, 2)}</pre> : null}
            {teamTopicMutation.data ? <pre>{JSON.stringify(teamTopicMutation.data, null, 2)}</pre> : null}
            {syncMutation.data ? <pre>{JSON.stringify(syncMutation.data, null, 2)}</pre> : null}
            {uploadCreateMutation.data ? <pre>{JSON.stringify(uploadCreateMutation.data, null, 2)}</pre> : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
