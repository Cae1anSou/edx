import { z } from 'zod';
import { deleteApi, getApi, patchApi, postApi, putApi } from './client';
import {
  CourseTeamAssignment,
  CourseTeamUpdateResult,
  CreatedResource,
  DiscussionTourState,
  HelpCenterArticle,
  LegacyNotificationItem,
  LegacyTaskItem,
  StudioDashboard,
  UserTourState
} from '../types';
import { currentUserId } from './client';

const createCourseSchema = z.object({
  display_name: z.string().trim().min(1, 'Required field.'),
  org: z.string().trim().min(1, 'Required field.'),
  number: z.string().trim().min(1, 'Required field.'),
  run: z.string().trim().min(1, 'Required field.'),
  source_course_key: z.string().trim().optional()
});

const createLibrarySchema = z.object({
  display_name: z.string().trim().min(1, 'Required field.'),
  org: z.string().trim().min(1, 'Required field.'),
  number: z.string().trim().min(1, 'Required field.')
});

export function fetchStudioDashboard(): Promise<StudioDashboard> {
  return getApi<StudioDashboard>('/api/studio/v1/dashboard');
}

export function fetchOrganizations(): Promise<string[]> {
  return getApi<string[]>('/api/studio/v1/organizations');
}

export function createCourse(input: z.infer<typeof createCourseSchema>): Promise<CreatedResource> {
  const validated = createCourseSchema.parse(input);
  return postApi<typeof validated, CreatedResource>('/api/studio/v1/courses', validated);
}

export function rerunCourse(input: z.infer<typeof createCourseSchema>): Promise<CreatedResource> {
  const validated = createCourseSchema.parse(input);
  return postApi<typeof validated, CreatedResource>('/api/studio/v1/courses/rerun', validated);
}

export function dismissNotification(notificationId: string): Promise<void> {
  return deleteApi(`/api/studio/v1/notifications/${encodeURIComponent(notificationId)}`);
}

export function createLibrary(input: z.infer<typeof createLibrarySchema>): Promise<CreatedResource> {
  const validated = createLibrarySchema.parse(input);
  return postApi<typeof validated, CreatedResource>('/api/studio/v1/libraries', validated);
}

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type CreateLibraryInput = z.infer<typeof createLibrarySchema>;

export function fetchCourseTeamAssignments(params: {
  email?: string;
  username?: string;
  userId?: string;
}): Promise<CourseTeamAssignment[]> {
  const query = new URLSearchParams();
  if (params.email?.trim()) {
    query.set('email', params.email.trim());
  }
  if (params.username?.trim()) {
    query.set('username', params.username.trim());
  }
  if (params.userId?.trim()) {
    query.set('user_id', params.userId.trim());
  }
  const suffix = query.toString();
  return getApi<CourseTeamAssignment[]>(`/api/support/v1/manage_course_team/${suffix ? `?${suffix}` : ''}`);
}

export function updateCourseTeamAssignments(params: {
  email: string;
  operations: Array<{ course_id: string; role: 'instructor' | 'staff'; action: 'assign' | 'revoke' }>;
}): Promise<{ email: string; results: CourseTeamUpdateResult[] }> {
  return putApi<
    {
      email: string;
      bulk_role_operations: Array<{ course_id: string; role: 'instructor' | 'staff'; action: 'assign' | 'revoke' }>;
    },
    { email: string; results: CourseTeamUpdateResult[] }
  >('/api/support/v1/manage_course_team/', {
    email: params.email,
    bulk_role_operations: params.operations
  });
}

export function fetchTasks(): Promise<{ results: LegacyTaskItem[] }> {
  return getApi<{ results: LegacyTaskItem[] }>('/api/tasks/v0/');
}

export function createTask(taskType: string): Promise<LegacyTaskItem> {
  return postApi<{ task_type: string }, LegacyTaskItem>('/api/tasks/v0/', {
    task_type: taskType
  });
}

export function fetchTask(taskId: number): Promise<LegacyTaskItem> {
  return getApi<LegacyTaskItem>(`/api/tasks/v0/${taskId}/`);
}

export function fetchNotifications(): Promise<{ results: LegacyNotificationItem[]; count: number }> {
  return getApi<{ results: LegacyNotificationItem[]; count: number }>('/api/notifications/');
}

export function fetchNotificationCount(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/notifications/count/');
}

export function markNotificationRead(params: { app_name?: string; notification_id?: number }): Promise<{ message: string }> {
  return patchApi<typeof params, { message: string }>('/api/notifications/read/', params);
}

export function markNotificationsSeen(appName: string): Promise<{ message: string }> {
  return putApi<Record<string, never>, { message: string }>(`/api/notifications/mark-seen/${encodeURIComponent(appName)}/`, {});
}

export function fetchNotificationPreferencesV3(): Promise<{ status: string; version: string; apps: string[] }> {
  return getApi<{ status: string; version: string; apps: string[] }>('/api/notifications/v3/configurations/');
}

export function fetchNotificationPreferencesV2(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/notifications/v2/configurations/');
}

export function updateNotificationPreference(username?: string): Promise<{ result: string; username: string }> {
  return postNotificationPreferenceUpdate({ username });
}

export function getNotificationPreferenceUpdate(params?: {
  username?: string;
  patch?: string;
}): Promise<{ result: string; username: string }> {
  const user = params?.username ?? currentUserId();
  const suffix = params?.patch ? `/${encodeURIComponent(params.patch)}` : '';
  return getApi<{ result: string; username: string }>(
    `/api/notifications/preferences/update/${encodeURIComponent(user)}${suffix}/`
  );
}

export function postNotificationPreferenceUpdate(params?: {
  username?: string;
  patch?: string;
}): Promise<{ result: string; username: string }> {
  const user = params?.username ?? currentUserId();
  const suffix = params?.patch ? `/${encodeURIComponent(params.patch)}` : '';
  return postApi<Record<string, never>, { result: string; username: string }>(
    `/api/notifications/preferences/update/${encodeURIComponent(user)}${suffix}/`,
    {}
  );
}

export function searchHelpCenter(query: string): Promise<{ results: HelpCenterArticle[]; query: string }> {
  return getApi<{ results: HelpCenterArticle[]; query: string }>(
    `/api/v2/help_center/articles/search.json?query=${encodeURIComponent(query)}`
  );
}

export function fetchMfeConfig(mfe?: string): Promise<Record<string, unknown>> {
  const suffix = mfe ? `?mfe=${encodeURIComponent(mfe)}` : '';
  return getApi<Record<string, unknown>>(`/api/mfe_config/v1${suffix}`);
}

export function fetchBrandingFooterJson(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/branding/v1/footer', {
    headers: {
      Accept: 'application/json'
    }
  });
}

export async function fetchBrandingFooterHtml(): Promise<string> {
  const response = await fetch('/api/branding/v1/footer', {
    credentials: 'include',
    headers: {
      'X-User-Id': currentUserId(),
      Accept: 'text/html'
    }
  });
  if (!response.ok) {
    throw new Error('Request failed');
  }
  return response.text();
}

export function fetchUserTour(username?: string): Promise<UserTourState> {
  const user = username ?? currentUserId();
  return getApi<UserTourState>(`/api/user_tours/v1/${encodeURIComponent(user)}`);
}

export async function patchUserTour(
  payload: Partial<UserTourState>,
  username?: string
): Promise<void> {
  const user = username ?? currentUserId();
  await patchApi<typeof payload, unknown>(`/api/user_tours/v1/${encodeURIComponent(user)}`, payload);
}

export function fetchDiscussionTours(): Promise<DiscussionTourState[]> {
  return getApi<DiscussionTourState[]>('/api/user_tours/v1/discussions/');
}

export function updateDiscussionTour(tourId: number, showTour: boolean): Promise<DiscussionTourState> {
  return putApi<{ show_tour: boolean }, DiscussionTourState>(`/api/user_tours/v1/discussions/${tourId}`, {
    show_tour: showTour
  });
}

export function fetchBookmarks(): Promise<{ results: string[] }> {
  return getApi<{ results: string[] }>('/api/v1/bookmarks/');
}

export function searchLegacy(params: { courseId?: string; user?: string }): Promise<Record<string, unknown>> {
  const query = new URLSearchParams();
  if (params.courseId) {
    query.set('course_id', params.courseId);
  }
  if (params.user) {
    query.set('user', params.user);
  }
  const suffix = query.toString() ? `?${query.toString()}` : '';
  return getApi<Record<string, unknown>>(`/api/v1/search/${suffix}`);
}

export function fetchCommerceBaskets(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/commerce/v0/baskets/');
}

export function fetchClipboardItems(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/content-staging/v1/clipboard/');
}

export function fetchCourseBlocks(courseId?: string): Promise<Record<string, unknown>> {
  const suffix = courseId ? `?course_id=${encodeURIComponent(courseId)}` : '';
  return getApi<Record<string, unknown>>(`/api/courses/v1/blocks/${suffix}`);
}

export function fetchLearningProgress(courseId: string, userId?: string): Promise<Record<string, unknown>> {
  const targetUser = userId && userId.trim() ? userId.trim() : currentUserId();
  return getApi<Record<string, unknown>>(
    `/api/v1/courses/${encodeURIComponent(courseId)}/progress/${encodeURIComponent(targetUser)}`
  );
}

export function fetchCreditProviders(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/credit/v1/providers/');
}

export function fetchEndpointV1(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/end_point/v1');
}

export function createEnrollment(courseId: string): Promise<Record<string, unknown>> {
  return postApi<{ course_id: string }, Record<string, unknown>>('/api/enrollment/v1/enrollment', {
    course_id: courseId
  });
}

export function fetchEntitlements(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/entitlements/v1/entitlements/');
}

export function submitFinancialAssistance(payload: Record<string, unknown>): Promise<Record<string, unknown>> {
  return postApi<Record<string, unknown>, Record<string, unknown>>('/api/financial/v1/assistance', payload);
}

export function uploadStaffProfileImage(): Promise<Record<string, unknown>> {
  return postApi<Record<string, never>, Record<string, unknown>>('/api/profile_images/v0/staff/upload', {});
}

export function removeStaffProfileImage(): Promise<Record<string, unknown>> {
  return postApi<Record<string, never>, Record<string, unknown>>('/api/profile_images/v0/staff/remove', {});
}

export function fetchDownstreams(): Promise<{ results: Array<Record<string, unknown>> }> {
  return getApi<{ results: Array<Record<string, unknown>> }>('/api/contentstore/v2/downstreams/');
}

export function syncDownstream(downstreamBlockId: string): Promise<Record<string, unknown>> {
  return postApi<Record<string, never>, Record<string, unknown>>(`/api/contentstore/v2/downstreams/${encodeURIComponent(downstreamBlockId)}/sync`, {});
}

export function fetchTeams(): Promise<{ results: Array<Record<string, unknown>> }> {
  return getApi<{ results: Array<Record<string, unknown>> }>('/api/team/v0/teams/');
}

export function fetchTeamMemberships(): Promise<{ results: Array<Record<string, unknown>> }> {
  return getApi<{ results: Array<Record<string, unknown>> }>('/api/team/v0/team_memberships/');
}

export function fetchTeamById(teamId: string, expand?: string): Promise<Record<string, unknown>> {
  const suffix = expand ? `?expand=${encodeURIComponent(expand)}` : '';
  return getApi<Record<string, unknown>>(`/api/team/v0/teams/${encodeURIComponent(teamId)}${suffix}`);
}

export function fetchTeamAssignments(teamId: string): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>(`/api/team/v0/teams/${encodeURIComponent(teamId)}/assignments`);
}

export function fetchTeamMembership(teamId: string, username: string, admin?: boolean): Promise<Record<string, unknown>> {
  const suffix = admin !== undefined ? `?admin=${String(admin)}` : '';
  return getApi<Record<string, unknown>>(`/api/team/v0/team_membership/${encodeURIComponent(teamId)},${encodeURIComponent(username)}${suffix}`);
}

export function fetchTeamTopic(topicId: string, courseId: string): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>(`/api/team/v0/topics/${encodeURIComponent(topicId)},${encodeURIComponent(courseId)}`);
}

export function createUpload(filename?: string): Promise<{ upload: Record<string, unknown> }> {
  const suffix = filename ? `?filename=${encodeURIComponent(filename)}` : '';
  return postApi<Record<string, never>, { upload: Record<string, unknown> }>(`/api/v2/uploads.json${suffix}`, {});
}

export function fetchUpload(token: string): Promise<{ upload: Record<string, unknown> }> {
  return getApi<{ upload: Record<string, unknown> }>(`/api/v2/uploads/${encodeURIComponent(token)}.json`);
}

export function fetchGenerateVideoUploadLink(courseId: string): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>(`/api/legacy/media/generate_video_upload_link/${encodeURIComponent(courseId)}`);
}

export function fetchVideoImagesUploadEnabled(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/legacy/media/video_images_upload_enabled');
}

export function fetchVideoFeatures(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/legacy/media/video_features');
}

export function fetchTranscriptPreferences(courseId: string): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>(`/api/legacy/media/transcript_preferences/${encodeURIComponent(courseId)}`);
}

export function fetchTranscriptCredentials(courseId: string): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>(`/api/legacy/media/transcript_credentials/${encodeURIComponent(courseId)}`);
}

export function fetchVideoEncodingsDownload(courseId: string): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>(`/api/legacy/media/video_encodings_download/${encodeURIComponent(courseId)}`);
}

export function postBulkEnroll(payload: Record<string, unknown>): Promise<Record<string, unknown>> {
  return postApi<Record<string, unknown>, Record<string, unknown>>('/api/bulk_enroll/v1/bulk_enroll', payload);
}

export function fetchCcx(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/ccx/v0/');
}

export function fetchCertificatesV0(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/certificates/v0/');
}

export function fetchChangeEmailSettings(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/change_email_settings/');
}

export function fetchCohortsV1(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/cohorts/v1/');
}

export function fetchContentSearchStudio(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/content_search/v2/studio/');
}

export function fetchContentTaggingV1(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/content_tagging/v1/');
}

export function fetchCourseHome(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/course_home/');
}

export function fetchCourseHomeV1(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/course_home/v1/');
}

export function fetchCourseModesV1(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/course_modes/v1/');
}

export function fetchLegacyDashboard(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/dashboard/');
}

export function fetchDiscountsV1(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/discounts/v1/');
}

export function fetchDiscussionV1(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/discussion/v1/');
}

export function fetchEdxNotesV1(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/edxnotes/v1/');
}

export function fetchEmbargoV1(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/embargo/v1/');
}

export function fetchExperimentsV1(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/experiments/v1/');
}

export function fetchInstructorV2(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/instructor/v2/');
}

export function fetchInstructorTaskV1(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/instructor_task/v1/');
}

export function fetchLearnerHome(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/learner_home/');
}

export function fetchLearningSequencesV1(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/learning_sequences/v1/');
}

export function fetchLibrariesV2(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/libraries/v2/');
}

export function fetchModulestoreMigratorV1(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/modulestore_migrator/v1/');
}

export function fetchOlxExportV1(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/olx-export/v1/');
}

export function fetchOraStaffGraderV1(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/ora_staff_grader/v1/');
}

export function fetchOrganizationsV0(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/organizations/v0/');
}

export function fetchThirdPartyProviders(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/third_party_auth/v0/providers/');
}

export function fetchValV0(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/val/v0/');
}

export function fetchXblockV2(): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>('/api/xblock/v2/');
}

export function fetchBulkDiscussionToggle(courseId: string): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>(`/api/courses/${encodeURIComponent(courseId)}/bulk_enable_disable_discussions`);
}

export function fetchMobileApi(apiVersion: string): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>(`/api/mobile/${encodeURIComponent(apiVersion)}`);
}

export function fetchYoutubeVideoIds(courseId: string): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>(`/api/youtube/courses/${encodeURIComponent(courseId)}/edx-video-ids`);
}

export function fetchInstructorSummary(courseId: string): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>(`/api/instructor/v1/?course_id=${encodeURIComponent(courseId)}`);
}

export function fetchInstructorCourseInfo(courseId: string): Promise<Record<string, unknown>> {
  return getApi<Record<string, unknown>>(`/api/instructor/v2/courses/${encodeURIComponent(courseId)}`);
}

export function fetchInstructorTasks(params: { courseId: string; problemLocation?: string }): Promise<Record<string, unknown>> {
  const query = params.problemLocation ? `?problem_location_str=${encodeURIComponent(params.problemLocation)}` : '';
  return getApi<Record<string, unknown>>(`/api/instructor/v2/courses/${encodeURIComponent(params.courseId)}/instructor_tasks${query}`);
}
