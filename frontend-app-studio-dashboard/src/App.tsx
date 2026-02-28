import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { RerunCoursePage } from './pages/RerunCoursePage';
import { TeamManagementPage } from './pages/TeamManagementPage';
import { TasksPage } from './pages/TasksPage';
import { LegacyNotificationsPage } from './pages/LegacyNotificationsPage';
import { NotificationPreferencesPage } from './pages/NotificationPreferencesPage';
import { HelpCenterPage } from './pages/HelpCenterPage';
import { UserToursPage } from './pages/UserToursPage';
import { MfeBrandingPage } from './pages/MfeBrandingPage';
import { LegacyCompatibilityPage } from './pages/LegacyCompatibilityPage';
import { AdditionalApiFamiliesPage } from './pages/AdditionalApiFamiliesPage';
import { TeamsV0Page } from './pages/TeamsV0Page';
import { UploadsPage } from './pages/UploadsPage';
import { ContentstorePage } from './pages/ContentstorePage';
import { LearnerServicesPage } from './pages/LearnerServicesPage';
import { InstructorToolsPage } from './pages/InstructorToolsPage';
import { LegacySystemApisPage } from './pages/LegacySystemApisPage';
import { CourseOperationsPage } from './pages/CourseOperationsPage';
import { LearnerExperiencePage } from './pages/LearnerExperiencePage';
import { PlatformIntegrationsPage } from './pages/PlatformIntegrationsPage';
import { SearchCommercePage } from './pages/SearchCommercePage';
import { AuthoringApisPage } from './pages/AuthoringApisPage';
import { IdentityAccessPage } from './pages/IdentityAccessPage';
import { CompliancePage } from './pages/CompliancePage';
import { SystemStatusPage } from './pages/SystemStatusPage';
import { NotificationsCenterPage } from './pages/NotificationsCenterPage';
import { ResourceBuilderPage } from './pages/ResourceBuilderPage';
import { LmsDashboardPage } from './pages/LmsDashboardPage';
import { LegacyCoursesPage } from './pages/LegacyCoursesPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/course" element={<DashboardPage />} />
      <Route path="/course/" element={<DashboardPage />} />
      <Route path="/course/:courseKey" element={<DashboardPage />} />
      <Route path="/course/:courseKey/" element={<DashboardPage />} />
      <Route path="/course/*" element={<DashboardPage />} />
      <Route path="/home" element={<DashboardPage />} />
      <Route path="/home/" element={<DashboardPage />} />
      <Route path="/home_library" element={<DashboardPage />} />
      <Route path="/home_library/" element={<DashboardPage />} />
      <Route path="/dashboard" element={<LmsDashboardPage />} />
      <Route path="/dashboard/" element={<LmsDashboardPage />} />
      <Route path="/dashboard/:dashboardPath" element={<LmsDashboardPage />} />
      <Route path="/dashboard/*" element={<LmsDashboardPage />} />
      <Route path="/change_enrollment" element={<LearnerServicesPage />} />
      <Route path="/change_enrollment/" element={<LearnerServicesPage />} />
      <Route path="/courses" element={<LegacyCoursesPage />} />
      <Route path="/courses/" element={<LegacyCoursesPage />} />
      <Route path="/courses/:coursePath" element={<LegacyCoursesPage />} />
      <Route path="/courses/:coursePath/" element={<LegacyCoursesPage />} />
      <Route path="/courses/*" element={<LegacyCoursesPage />} />
      <Route path="/course_modes" element={<IdentityAccessPage />} />
      <Route path="/course_modes/" element={<IdentityAccessPage />} />
      <Route path="/course_modes/:modePath" element={<IdentityAccessPage />} />
      <Route path="/course_modes/*" element={<IdentityAccessPage />} />
      <Route path="/verify_student" element={<IdentityAccessPage />} />
      <Route path="/verify_student/" element={<IdentityAccessPage />} />
      <Route path="/verify_student/:verifyPath" element={<IdentityAccessPage />} />
      <Route path="/verify_student/*" element={<IdentityAccessPage />} />
      <Route path="/support" element={<HelpCenterPage />} />
      <Route path="/support/" element={<HelpCenterPage />} />
      <Route path="/support/:supportPath" element={<HelpCenterPage />} />
      <Route path="/support/*" element={<HelpCenterPage />} />
      <Route path="/wiki" element={<LearnerExperiencePage />} />
      <Route path="/wiki/" element={<LearnerExperiencePage />} />
      <Route path="/wiki/:wikiPath" element={<LearnerExperiencePage />} />
      <Route path="/wiki/*" element={<LearnerExperiencePage />} />
      <Route path="/notify" element={<LearnerExperiencePage />} />
      <Route path="/notify/" element={<LearnerExperiencePage />} />
      <Route path="/notify/:notifyPath" element={<LearnerExperiencePage />} />
      <Route path="/notify/:notifyPath/" element={<LearnerExperiencePage />} />
      <Route path="/notify/*" element={<LearnerExperiencePage />} />
      <Route path="/search" element={<SearchCommercePage />} />
      <Route path="/search/" element={<SearchCommercePage />} />
      <Route path="/search/:searchPath" element={<SearchCommercePage />} />
      <Route path="/search/*" element={<SearchCommercePage />} />
      <Route path="/catalog" element={<SearchCommercePage />} />
      <Route path="/catalog/" element={<SearchCommercePage />} />
      <Route path="/catalog/:catalogPath" element={<SearchCommercePage />} />
      <Route path="/catalog/*" element={<SearchCommercePage />} />
      <Route path="/rss_proxy" element={<PlatformIntegrationsPage />} />
      <Route path="/rss_proxy/" element={<PlatformIntegrationsPage />} />
      <Route path="/rss_proxy/:rssPath" element={<PlatformIntegrationsPage />} />
      <Route path="/rss_proxy/:rssPath/" element={<PlatformIntegrationsPage />} />
      <Route path="/rss_proxy/*" element={<PlatformIntegrationsPage />} />
      <Route path="/api-admin" element={<IdentityAccessPage />} />
      <Route path="/api-admin/" element={<IdentityAccessPage />} />
      <Route path="/api-admin/:adminPath" element={<IdentityAccessPage />} />
      <Route path="/api-admin/*" element={<IdentityAccessPage />} />
      <Route path="/organizations" element={<IdentityAccessPage />} />
      <Route path="/organizations/" element={<IdentityAccessPage />} />
      <Route path="/update_lang/:langPath" element={<IdentityAccessPage />} />
      <Route path="/update_lang/*" element={<IdentityAccessPage />} />
      <Route path="/lang_pref/update_language" element={<IdentityAccessPage />} />
      <Route path="/lang_pref/update_language/" element={<IdentityAccessPage />} />
      <Route path="/help_token" element={<HelpCenterPage />} />
      <Route path="/help_token/" element={<HelpCenterPage />} />
      <Route path="/help_token/:tokenPath" element={<HelpCenterPage />} />
      <Route path="/help_token/*" element={<HelpCenterPage />} />
      <Route path="/howitworks" element={<DashboardPage />} />
      <Route path="/howitworks/" element={<DashboardPage />} />
      <Route path="/signin_redirect_to_lms" element={<DashboardPage />} />
      <Route path="/signin_redirect_to_lms/" element={<DashboardPage />} />
      <Route path="/request_course_creator" element={<DashboardPage />} />
      <Route path="/request_course_creator/" element={<DashboardPage />} />
      <Route path="/signin" element={<DashboardPage />} />
      <Route path="/signin/" element={<DashboardPage />} />
      <Route path="/signup" element={<DashboardPage />} />
      <Route path="/signup/" element={<DashboardPage />} />
      <Route path="/accessibility" element={<SystemStatusPage />} />
      <Route path="/accessibility/" element={<SystemStatusPage />} />
      <Route path="/status" element={<SystemStatusPage />} />
      <Route path="/status/" element={<SystemStatusPage />} />
      <Route path="/not_found" element={<SystemStatusPage />} />
      <Route path="/server_error" element={<SystemStatusPage />} />
      <Route path="/403" element={<SystemStatusPage />} />
      <Route path="/404" element={<SystemStatusPage />} />
      <Route path="/429" element={<SystemStatusPage />} />
      <Route path="/500" element={<SystemStatusPage />} />
      <Route path="/event" element={<SystemStatusPage />} />
      <Route path="/event/" element={<SystemStatusPage />} />
      <Route path="/calculate" element={<SystemStatusPage />} />
      <Route path="/calculate/" element={<SystemStatusPage />} />
      <Route path="/import/:importPath" element={<CourseOperationsPage />} />
      <Route path="/import/*" element={<CourseOperationsPage />} />
      <Route path="/import_status/:importStatusPath" element={<CourseOperationsPage />} />
      <Route path="/import_status/*" element={<CourseOperationsPage />} />
      <Route path="/export/:exportPath" element={<CourseOperationsPage />} />
      <Route path="/export/*" element={<CourseOperationsPage />} />
      <Route path="/export_output/:exportOutputPath" element={<CourseOperationsPage />} />
      <Route path="/export_output/*" element={<CourseOperationsPage />} />
      <Route path="/export_status/:exportStatusPath" element={<CourseOperationsPage />} />
      <Route path="/export_status/*" element={<CourseOperationsPage />} />
      <Route path="/export_git/:exportGitPath" element={<CourseOperationsPage />} />
      <Route path="/export_git/*" element={<CourseOperationsPage />} />
      <Route path="/checklists/:checklistPath" element={<CourseOperationsPage />} />
      <Route path="/checklists/*" element={<CourseOperationsPage />} />
      <Route path="/course/:courseKey/search_reindex" element={<CourseOperationsPage />} />
      <Route path="/course/:courseKey/search_reindex/" element={<CourseOperationsPage />} />
      <Route path="/course/:org/:number/:run/search_reindex" element={<CourseOperationsPage />} />
      <Route path="/course/:org/:number/:run/search_reindex/" element={<CourseOperationsPage />} />
      <Route path="/container/:containerPath" element={<ContentstorePage />} />
      <Route path="/container/*" element={<ContentstorePage />} />
      <Route path="/container_embed/:containerPath" element={<ContentstorePage />} />
      <Route path="/container_embed/*" element={<ContentstorePage />} />
      <Route path="/orphan/:orphanPath" element={<ContentstorePage />} />
      <Route path="/orphan/*" element={<ContentstorePage />} />
      <Route path="/tabs/:tabPath" element={<ContentstorePage />} />
      <Route path="/tabs/*" element={<ContentstorePage />} />
      <Route path="/textbooks/:textbookPath" element={<ContentstorePage />} />
      <Route path="/textbooks/*" element={<ContentstorePage />} />
      <Route path="/video_images/:videoImagePath" element={<UploadsPage />} />
      <Route path="/video_images/*" element={<UploadsPage />} />
      <Route path="/video_images_upload_enabled" element={<UploadsPage />} />
      <Route path="/video_features" element={<UploadsPage />} />
      <Route path="/video_features/" element={<UploadsPage />} />
      <Route path="/generate_video_upload_link/:courseKey" element={<UploadsPage />} />
      <Route path="/generate_video_upload_link/:courseKey/" element={<UploadsPage />} />
      <Route path="/generate_video_upload_link/*" element={<UploadsPage />} />
      <Route path="/transcript_preferences/:courseKey" element={<UploadsPage />} />
      <Route path="/transcript_preferences/:courseKey/" element={<UploadsPage />} />
      <Route path="/transcript_preferences/*" element={<UploadsPage />} />
      <Route path="/transcript_credentials/:courseKey" element={<UploadsPage />} />
      <Route path="/transcript_credentials/:courseKey/" element={<UploadsPage />} />
      <Route path="/transcript_credentials/*" element={<UploadsPage />} />
      <Route path="/transcript_download" element={<UploadsPage />} />
      <Route path="/transcript_download/" element={<UploadsPage />} />
      <Route path="/transcript_upload" element={<UploadsPage />} />
      <Route path="/transcript_upload/" element={<UploadsPage />} />
      <Route path="/transcript_upload_api" element={<UploadsPage />} />
      <Route path="/transcript_upload_api/" element={<UploadsPage />} />
      <Route path="/transcript_delete/:courseKey" element={<UploadsPage />} />
      <Route path="/transcript_delete/:courseKey/" element={<UploadsPage />} />
      <Route path="/transcript_delete/:courseKey/:edxVideoId" element={<UploadsPage />} />
      <Route path="/transcript_delete/:courseKey/:edxVideoId/" element={<UploadsPage />} />
      <Route path="/transcript_delete/:courseKey/:edxVideoId/:languageCode" element={<UploadsPage />} />
      <Route path="/video_encodings_download/:courseKey" element={<UploadsPage />} />
      <Route path="/video_encodings_download/:courseKey/" element={<UploadsPage />} />
      <Route path="/video_encodings_download/*" element={<UploadsPage />} />
      <Route path="/transcripts/upload" element={<UploadsPage />} />
      <Route path="/transcripts/upload/" element={<UploadsPage />} />
      <Route path="/transcripts/download" element={<UploadsPage />} />
      <Route path="/transcripts/download/" element={<UploadsPage />} />
      <Route path="/transcripts/check" element={<UploadsPage />} />
      <Route path="/transcripts/check/" element={<UploadsPage />} />
      <Route path="/transcripts/choose" element={<UploadsPage />} />
      <Route path="/transcripts/choose/" element={<UploadsPage />} />
      <Route path="/transcripts/replace" element={<UploadsPage />} />
      <Route path="/transcripts/replace/" element={<UploadsPage />} />
      <Route path="/transcripts/rename" element={<UploadsPage />} />
      <Route path="/transcripts/rename/" element={<UploadsPage />} />
      <Route path="/xblock/outline/:usageKey" element={<ContentstorePage />} />
      <Route path="/xblock/outline/:usageKey/" element={<ContentstorePage />} />
      <Route path="/xblock/outline/*" element={<ContentstorePage />} />
      <Route path="/xblock/container/:usageKey" element={<ContentstorePage />} />
      <Route path="/xblock/container/:usageKey/" element={<ContentstorePage />} />
      <Route path="/xblock/container/*" element={<ContentstorePage />} />
      <Route path="/xblock/:usageKey" element={<ContentstorePage />} />
      <Route path="/xblock/:usageKey/" element={<ContentstorePage />} />
      <Route path="/xblock/:usageKey/:viewName" element={<ContentstorePage />} />
      <Route path="/xblock/:usageKey/:viewName/" element={<ContentstorePage />} />
      <Route path="/xblock/*" element={<ContentstorePage />} />
      <Route path="/preview/xblock/:usageKey" element={<ContentstorePage />} />
      <Route path="/preview/xblock/:usageKey/" element={<ContentstorePage />} />
      <Route path="/preview/xblock/*" element={<ContentstorePage />} />
      <Route path="/xblock/resource/:blockType/:resourcePath" element={<ContentstorePage />} />
      <Route path="/xblock/resource/:blockType/*" element={<ContentstorePage />} />
      <Route path="/xblock/resource/*" element={<ContentstorePage />} />
      <Route path="/course_info/:courseKey" element={<ResourceBuilderPage />} />
      <Route path="/course_info/:courseKey/" element={<ResourceBuilderPage />} />
      <Route path="/course_info/*" element={<ResourceBuilderPage />} />
      <Route path="/course_info_update/:courseKey" element={<ResourceBuilderPage />} />
      <Route path="/course_info_update/:courseKey/" element={<ResourceBuilderPage />} />
      <Route path="/course_info_update/:courseKey/:providedId" element={<ResourceBuilderPage />} />
      <Route path="/course_info_update/:courseKey/:providedId/" element={<ResourceBuilderPage />} />
      <Route path="/course_info_update/*" element={<ResourceBuilderPage />} />
      <Route path="/course_notifications/:courseKey" element={<NotificationsCenterPage />} />
      <Route path="/course_notifications/:courseKey/" element={<NotificationsCenterPage />} />
      <Route path="/course_notifications/:courseKey/:actionStateId" element={<NotificationsCenterPage />} />
      <Route path="/course_notifications/:courseKey/:actionStateId/" element={<NotificationsCenterPage />} />
      <Route path="/course_notifications/*" element={<NotificationsCenterPage />} />
      <Route path="/library/:libraryKey" element={<DashboardPage />} />
      <Route path="/library/:libraryKey/team" element={<TeamManagementPage />} />
      <Route path="/library/:libraryKey/team/" element={<TeamManagementPage />} />
      <Route path="/library/*" element={<DashboardPage />} />
      <Route path="/rerun" element={<RerunCoursePage />} />
      <Route path="/rerun/" element={<RerunCoursePage />} />
      <Route path="/rerun/:sourceCourseKey" element={<RerunCoursePage />} />
      <Route path="/rerun/:sourceCourseKey/" element={<RerunCoursePage />} />
      <Route path="/rerun/*" element={<RerunCoursePage />} />
      <Route path="/course_rerun" element={<RerunCoursePage />} />
      <Route path="/course_rerun/" element={<RerunCoursePage />} />
      <Route path="/course_rerun/:sourceCourseKey" element={<RerunCoursePage />} />
      <Route path="/course_rerun/:sourceCourseKey/" element={<RerunCoursePage />} />
      <Route path="/course_rerun/*" element={<RerunCoursePage />} />
      <Route path="/team" element={<TeamManagementPage />} />
      <Route path="/team/:courseKey" element={<TeamManagementPage />} />
      <Route path="/team/:courseKey/" element={<TeamManagementPage />} />
      <Route path="/team/*" element={<TeamManagementPage />} />
      <Route path="/course_team/:courseKey" element={<TeamManagementPage />} />
      <Route path="/course_team/:courseKey/" element={<TeamManagementPage />} />
      <Route path="/course_team/:courseKey/:email" element={<TeamManagementPage />} />
      <Route path="/course_team/:courseKey/:email/" element={<TeamManagementPage />} />
      <Route path="/course_team/*" element={<TeamManagementPage />} />
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/tasks/" element={<TasksPage />} />
      <Route path="/videos/:courseKey" element={<UploadsPage />} />
      <Route path="/videos/:courseKey/" element={<UploadsPage />} />
      <Route path="/videos/:courseKey/:edxVideoId" element={<UploadsPage />} />
      <Route path="/videos/:courseKey/:edxVideoId/" element={<UploadsPage />} />
      <Route path="/videos/*" element={<UploadsPage />} />
      <Route path="/group_configurations/:courseKey" element={<TeamsV0Page />} />
      <Route path="/group_configurations/:courseKey/:groupConfigurationId" element={<TeamsV0Page />} />
      <Route
        path="/group_configurations/:courseKey/:groupConfigurationId/:groupId"
        element={<TeamsV0Page />}
      />
      <Route path="/group_configurations/*" element={<TeamsV0Page />} />
      <Route path="/settings/details/:courseKey" element={<ResourceBuilderPage />} />
      <Route path="/settings/details/*" element={<ResourceBuilderPage />} />
      <Route path="/settings/grading/:courseKey" element={<InstructorToolsPage />} />
      <Route path="/settings/grading/:courseKey/:graderIndex" element={<InstructorToolsPage />} />
      <Route path="/settings/grading/*" element={<InstructorToolsPage />} />
      <Route path="/settings/advanced/:courseKey" element={<AuthoringApisPage />} />
      <Route path="/settings/advanced/*" element={<AuthoringApisPage />} />
      <Route path="/authoring-api/ui" element={<AuthoringApisPage />} />
      <Route path="/authoring-api/ui/" element={<AuthoringApisPage />} />
      <Route path="/authoring-api/schema" element={<AuthoringApisPage />} />
      <Route path="/authoring-api/schema/" element={<AuthoringApisPage />} />
      <Route path="/course/:courseKey/entrance_exam" element={<InstructorToolsPage />} />
      <Route path="/course/:courseKey/entrance_exam/" element={<InstructorToolsPage />} />
      <Route path="/course/:org/:number/:run/entrance_exam" element={<InstructorToolsPage />} />
      <Route path="/course/:org/:number/:run/entrance_exam/" element={<InstructorToolsPage />} />
      <Route path="/certificates/:certificatePath" element={<CompliancePage />} />
      <Route path="/certificates/*" element={<CompliancePage />} />
      <Route path="/notifications" element={<LegacyNotificationsPage />} />
      <Route path="/notifications/" element={<LegacyNotificationsPage />} />
      <Route path="/notification-preferences" element={<NotificationPreferencesPage />} />
      <Route path="/notification-preferences/" element={<NotificationPreferencesPage />} />
      <Route path="/help-center" element={<HelpCenterPage />} />
      <Route path="/help-center/" element={<HelpCenterPage />} />
      <Route path="/user-tours" element={<UserToursPage />} />
      <Route path="/user-tours/" element={<UserToursPage />} />
      <Route path="/mfe-branding" element={<MfeBrandingPage />} />
      <Route path="/mfe-branding/" element={<MfeBrandingPage />} />
      <Route path="/legacy-compatibility" element={<LegacyCompatibilityPage />} />
      <Route path="/legacy-compatibility/" element={<LegacyCompatibilityPage />} />
      <Route path="/api-families" element={<AdditionalApiFamiliesPage />} />
      <Route path="/api-families/" element={<AdditionalApiFamiliesPage />} />
      <Route path="/teams-v0" element={<TeamsV0Page />} />
      <Route path="/teams-v0/" element={<TeamsV0Page />} />
      <Route path="/uploads" element={<UploadsPage />} />
      <Route path="/uploads/" element={<UploadsPage />} />
      <Route path="/contentstore" element={<ContentstorePage />} />
      <Route path="/contentstore/" element={<ContentstorePage />} />
      <Route path="/learner-services" element={<LearnerServicesPage />} />
      <Route path="/learner-services/" element={<LearnerServicesPage />} />
      <Route path="/instructor-tools" element={<InstructorToolsPage />} />
      <Route path="/instructor-tools/" element={<InstructorToolsPage />} />
      <Route path="/legacy-system-apis" element={<LegacySystemApisPage />} />
      <Route path="/legacy-system-apis/" element={<LegacySystemApisPage />} />
      <Route path="/legacy-system-apis/:systemPath" element={<LegacySystemApisPage />} />
      <Route path="/legacy-system-apis/*" element={<LegacySystemApisPage />} />
      <Route path="/course-operations" element={<CourseOperationsPage />} />
      <Route path="/course-operations/" element={<CourseOperationsPage />} />
      <Route path="/learner-experience" element={<LearnerExperiencePage />} />
      <Route path="/learner-experience/" element={<LearnerExperiencePage />} />
      <Route path="/platform-integrations" element={<PlatformIntegrationsPage />} />
      <Route path="/platform-integrations/" element={<PlatformIntegrationsPage />} />
      <Route path="/search-commerce" element={<SearchCommercePage />} />
      <Route path="/search-commerce/" element={<SearchCommercePage />} />
      <Route path="/authoring-apis" element={<AuthoringApisPage />} />
      <Route path="/authoring-apis/" element={<AuthoringApisPage />} />
      <Route path="/authoring-apis/:authoringPath" element={<AuthoringApisPage />} />
      <Route path="/authoring-apis/*" element={<AuthoringApisPage />} />
      <Route path="/identity-access" element={<IdentityAccessPage />} />
      <Route path="/identity-access/" element={<IdentityAccessPage />} />
      <Route path="/compliance" element={<CompliancePage />} />
      <Route path="/compliance/" element={<CompliancePage />} />
      <Route path="/system-status" element={<SystemStatusPage />} />
      <Route path="/system-status/" element={<SystemStatusPage />} />
      <Route path="/notifications-center" element={<NotificationsCenterPage />} />
      <Route path="/notifications-center/" element={<NotificationsCenterPage />} />
      <Route path="/resource-builder" element={<ResourceBuilderPage />} />
      <Route path="/resource-builder/" element={<ResourceBuilderPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
