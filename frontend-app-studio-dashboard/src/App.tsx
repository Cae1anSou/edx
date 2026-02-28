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
import { LibraryDetailPage } from './pages/LibraryDetailPage';
import { LegacyEntryPage } from './pages/LegacyEntryPage';
import { LmsCourseAboutPage } from './pages/LmsCourseAboutPage';
import { LmsCoursewarePage } from './pages/LmsCoursewarePage';
import { LmsCourseProgressPage } from './pages/LmsCourseProgressPage';
import { LmsCourseDatesPage } from './pages/LmsCourseDatesPage';
import { LmsCourseTeamsPage } from './pages/LmsCourseTeamsPage';
import { LmsCourseDiscussionPage } from './pages/LmsCourseDiscussionPage';
import { LmsInstructorDashboardPage } from './pages/LmsInstructorDashboardPage';
import { LmsCertificatesPage } from './pages/LmsCertificatesPage';
import { FinancialAssistancePage } from './pages/FinancialAssistancePage';
import { LmsSurveyPage } from './pages/LmsSurveyPage';
import { LmsEmbargoPage } from './pages/LmsEmbargoPage';
import { LmsBulkEmailPage } from './pages/LmsBulkEmailPage';
import { LmsCourseBookmarksPage } from './pages/LmsCourseBookmarksPage';
import { LmsCourseTabPage } from './pages/LmsCourseTabPage';
import { LmsResetDeadlinesPage } from './pages/LmsResetDeadlinesPage';
import { LmsProviderLoginPage } from './pages/LmsProviderLoginPage';
import { LmsResubscribePage } from './pages/LmsResubscribePage';
import { LmsLogoutPage } from './pages/LmsLogoutPage';
import { LmsCourseMasqueradePage } from './pages/LmsCourseMasqueradePage';
import { LmsCourseEdxNotesPage } from './pages/LmsCourseEdxNotesPage';
import { LmsManageUserStandingPage } from './pages/LmsManageUserStandingPage';
import { LmsEnrollStaffPage } from './pages/LmsEnrollStaffPage';
import { LmsCourseSyllabusPage } from './pages/LmsCourseSyllabusPage';
import { LmsCourseBookPage } from './pages/LmsCourseBookPage';
import { LmsCourseJumpPage } from './pages/LmsCourseJumpPage';
import { LmsLtiPage } from './pages/LmsLtiPage';
import { LmsPublicVideoPage } from './pages/LmsPublicVideoPage';
import { LmsEnrollStudentsPage } from './pages/LmsEnrollStudentsPage';
import { LmsEmailStatusPage } from './pages/LmsEmailStatusPage';
import { LmsNotificationTokenPage } from './pages/LmsNotificationTokenPage';
import { LmsPasswordResetPage } from './pages/LmsPasswordResetPage';
import { LmsCohortsPage } from './pages/LmsCohortsPage';
import { LmsCoursewareSearchPage } from './pages/LmsCoursewareSearchPage';
import { LmsNotificationPrefsAjaxPage } from './pages/LmsNotificationPrefsAjaxPage';
import { LmsDebugPage } from './pages/LmsDebugPage';
import { LmsTemplatePage } from './pages/LmsTemplatePage';
import { LmsXqueuePage } from './pages/LmsXqueuePage';
import { LmsSystemConfigPage } from './pages/LmsSystemConfigPage';
import { LmsWikiRootPage } from './pages/LmsWikiRootPage';
import { LmsCourseAdminExtrasPage } from './pages/LmsCourseAdminExtrasPage';
import { LmsMiscEndpointPage } from './pages/LmsMiscEndpointPage';
import { LmsProgramsAboutPage } from './pages/LmsProgramsAboutPage';
import { LmsSubmissionHistoryPage } from './pages/LmsSubmissionHistoryPage';
import { LmsCourseXblockRoutePage } from './pages/LmsCourseXblockRoutePage';

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
      <Route path="/courses/:coursePath/about" element={<LmsCourseAboutPage />} />
      <Route path="/courses/:coursePath/about/" element={<LmsCourseAboutPage />} />
      <Route path="/courses/:org/:number/:run/about" element={<LmsCourseAboutPage />} />
      <Route path="/courses/:org/:number/:run/about/" element={<LmsCourseAboutPage />} />
      <Route path="/courses/:coursePath/progress" element={<LmsCourseProgressPage />} />
      <Route path="/courses/:coursePath/progress/" element={<LmsCourseProgressPage />} />
      <Route path="/courses/:coursePath/progress/:studentId" element={<LmsCourseProgressPage />} />
      <Route path="/courses/:coursePath/progress/:studentId/" element={<LmsCourseProgressPage />} />
      <Route path="/courses/:coursePath/progress/*" element={<LmsCourseProgressPage />} />
      <Route path="/courses/:org/:number/:run/progress" element={<LmsCourseProgressPage />} />
      <Route path="/courses/:org/:number/:run/progress/" element={<LmsCourseProgressPage />} />
      <Route path="/courses/:org/:number/:run/progress/:studentId" element={<LmsCourseProgressPage />} />
      <Route path="/courses/:org/:number/:run/progress/:studentId/" element={<LmsCourseProgressPage />} />
      <Route path="/courses/:org/:number/:run/progress/*" element={<LmsCourseProgressPage />} />
      <Route path="/courses/:coursePath/courseware" element={<LmsCoursewarePage />} />
      <Route path="/courses/:coursePath/courseware/" element={<LmsCoursewarePage />} />
      <Route path="/courses/:coursePath/courseware/*" element={<LmsCoursewarePage />} />
      <Route path="/courses/:org/:number/:run/courseware" element={<LmsCoursewarePage />} />
      <Route path="/courses/:org/:number/:run/courseware/" element={<LmsCoursewarePage />} />
      <Route path="/courses/:org/:number/:run/courseware/*" element={<LmsCoursewarePage />} />
      <Route path="/courses/:coursePath/dates" element={<LmsCourseDatesPage />} />
      <Route path="/courses/:coursePath/dates/" element={<LmsCourseDatesPage />} />
      <Route path="/courses/:coursePath/dates/*" element={<LmsCourseDatesPage />} />
      <Route path="/courses/:org/:number/:run/dates" element={<LmsCourseDatesPage />} />
      <Route path="/courses/:org/:number/:run/dates/" element={<LmsCourseDatesPage />} />
      <Route path="/courses/:org/:number/:run/dates/*" element={<LmsCourseDatesPage />} />
      <Route path="/courses/:coursePath/teams" element={<LmsCourseTeamsPage />} />
      <Route path="/courses/:coursePath/teams/" element={<LmsCourseTeamsPage />} />
      <Route path="/courses/:org/:number/:run/teams" element={<LmsCourseTeamsPage />} />
      <Route path="/courses/:org/:number/:run/teams/" element={<LmsCourseTeamsPage />} />
      <Route path="/courses/:coursePath/discussion" element={<LmsCourseDiscussionPage />} />
      <Route path="/courses/:coursePath/discussion/" element={<LmsCourseDiscussionPage />} />
      <Route path="/courses/:org/:number/:run/discussion" element={<LmsCourseDiscussionPage />} />
      <Route path="/courses/:org/:number/:run/discussion/" element={<LmsCourseDiscussionPage />} />
      <Route path="/courses/:coursePath/instructor" element={<LmsInstructorDashboardPage />} />
      <Route path="/courses/:coursePath/instructor/" element={<LmsInstructorDashboardPage />} />
      <Route path="/courses/:coursePath/instructor/*" element={<LmsInstructorDashboardPage />} />
      <Route path="/courses/:org/:number/:run/instructor" element={<LmsInstructorDashboardPage />} />
      <Route path="/courses/:org/:number/:run/instructor/" element={<LmsInstructorDashboardPage />} />
      <Route path="/courses/:org/:number/:run/instructor/*" element={<LmsInstructorDashboardPage />} />
      <Route path="/courses/:coursePath/bookmarks" element={<LmsCourseBookmarksPage />} />
      <Route path="/courses/:coursePath/bookmarks/" element={<LmsCourseBookmarksPage />} />
      <Route path="/courses/:org/:number/:run/bookmarks" element={<LmsCourseBookmarksPage />} />
      <Route path="/courses/:org/:number/:run/bookmarks/" element={<LmsCourseBookmarksPage />} />
      <Route path="/courses/:coursePath/tab/:tabType" element={<LmsCourseTabPage />} />
      <Route path="/courses/:coursePath/tab/:tabType/" element={<LmsCourseTabPage />} />
      <Route path="/courses/:coursePath/tab/:tabType/*" element={<LmsCourseTabPage />} />
      <Route path="/courses/:org/:number/:run/tab/:tabType" element={<LmsCourseTabPage />} />
      <Route path="/courses/:org/:number/:run/tab/:tabType/" element={<LmsCourseTabPage />} />
      <Route path="/courses/:org/:number/:run/tab/:tabType/*" element={<LmsCourseTabPage />} />
      <Route path="/courses/:coursePath/lti_tab/:providerUuid" element={<LmsCourseTabPage />} />
      <Route path="/courses/:coursePath/lti_tab/:providerUuid/" element={<LmsCourseTabPage />} />
      <Route path="/courses/:coursePath/lti_tab/:providerUuid/*" element={<LmsCourseTabPage />} />
      <Route path="/courses/:org/:number/:run/lti_tab/:providerUuid" element={<LmsCourseTabPage />} />
      <Route path="/courses/:org/:number/:run/lti_tab/:providerUuid/" element={<LmsCourseTabPage />} />
      <Route path="/courses/:org/:number/:run/lti_tab/:providerUuid/*" element={<LmsCourseTabPage />} />
      <Route path="/courses/:coursePath/courseware-search/enabled" element={<LmsCoursewareSearchPage />} />
      <Route path="/courses/:coursePath/courseware-search/enabled/" element={<LmsCoursewareSearchPage />} />
      <Route path="/courses/:org/:number/:run/courseware-search/enabled" element={<LmsCoursewareSearchPage />} />
      <Route path="/courses/:org/:number/:run/courseware-search/enabled/" element={<LmsCoursewareSearchPage />} />
      <Route path="/courses/:coursePath/masquerade" element={<LmsCourseMasqueradePage />} />
      <Route path="/courses/:coursePath/masquerade/" element={<LmsCourseMasqueradePage />} />
      <Route path="/courses/:org/:number/:run/masquerade" element={<LmsCourseMasqueradePage />} />
      <Route path="/courses/:org/:number/:run/masquerade/" element={<LmsCourseMasqueradePage />} />
      <Route path="/courses/:coursePath/edxnotes" element={<LmsCourseEdxNotesPage />} />
      <Route path="/courses/:coursePath/edxnotes/" element={<LmsCourseEdxNotesPage />} />
      <Route path="/courses/:org/:number/:run/edxnotes" element={<LmsCourseEdxNotesPage />} />
      <Route path="/courses/:org/:number/:run/edxnotes/" element={<LmsCourseEdxNotesPage />} />
      <Route path="/courses/:coursePath/enroll_staff" element={<LmsEnrollStaffPage />} />
      <Route path="/courses/:coursePath/enroll_staff/" element={<LmsEnrollStaffPage />} />
      <Route path="/courses/:org/:number/:run/enroll_staff" element={<LmsEnrollStaffPage />} />
      <Route path="/courses/:org/:number/:run/enroll_staff/" element={<LmsEnrollStaffPage />} />
      <Route path="/courses/:coursePath/discussions/settings" element={<LmsCohortsPage />} />
      <Route path="/courses/:coursePath/discussions/settings/" element={<LmsCohortsPage />} />
      <Route path="/courses/:org/:number/:run/discussions/settings" element={<LmsCohortsPage />} />
      <Route path="/courses/:org/:number/:run/discussions/settings/" element={<LmsCohortsPage />} />
      <Route path="/courses/:coursePath/cohorts/settings" element={<LmsCohortsPage />} />
      <Route path="/courses/:coursePath/cohorts/settings/" element={<LmsCohortsPage />} />
      <Route path="/courses/:coursePath/cohorts/:cohortId" element={<LmsCohortsPage />} />
      <Route path="/courses/:coursePath/cohorts/:cohortId/" element={<LmsCohortsPage />} />
      <Route path="/courses/:coursePath/cohorts/:cohortId/add" element={<LmsCohortsPage />} />
      <Route path="/courses/:coursePath/cohorts/:cohortId/add/" element={<LmsCohortsPage />} />
      <Route path="/courses/:coursePath/cohorts/:cohortId/delete" element={<LmsCohortsPage />} />
      <Route path="/courses/:coursePath/cohorts/:cohortId/delete/" element={<LmsCohortsPage />} />
      <Route path="/courses/:coursePath/cohorts/debug" element={<LmsCohortsPage />} />
      <Route path="/courses/:coursePath/cohorts/debug/" element={<LmsCohortsPage />} />
      <Route path="/courses/:org/:number/:run/cohorts/settings" element={<LmsCohortsPage />} />
      <Route path="/courses/:org/:number/:run/cohorts/:cohortId" element={<LmsCohortsPage />} />
      <Route path="/courses/:org/:number/:run/cohorts/:cohortId/add" element={<LmsCohortsPage />} />
      <Route path="/courses/:org/:number/:run/cohorts/:cohortId/delete" element={<LmsCohortsPage />} />
      <Route path="/courses/:org/:number/:run/cohorts/debug" element={<LmsCohortsPage />} />
      <Route path="/courses/:coursePath/syllabus" element={<LmsCourseSyllabusPage />} />
      <Route path="/courses/:coursePath/syllabus/" element={<LmsCourseSyllabusPage />} />
      <Route path="/courses/:coursePath/survey" element={<LmsCourseSyllabusPage />} />
      <Route path="/courses/:coursePath/survey/" element={<LmsCourseSyllabusPage />} />
      <Route path="/courses/:org/:number/:run/syllabus" element={<LmsCourseSyllabusPage />} />
      <Route path="/courses/:org/:number/:run/syllabus/" element={<LmsCourseSyllabusPage />} />
      <Route path="/courses/:org/:number/:run/survey" element={<LmsCourseSyllabusPage />} />
      <Route path="/courses/:org/:number/:run/survey/" element={<LmsCourseSyllabusPage />} />
      <Route path="/courses/:coursePath/book/:bookIndex" element={<LmsCourseBookPage />} />
      <Route path="/courses/:coursePath/book/:bookIndex/" element={<LmsCourseBookPage />} />
      <Route path="/courses/:coursePath/book/:bookIndex/:page" element={<LmsCourseBookPage />} />
      <Route path="/courses/:coursePath/pdfbook/:bookIndex" element={<LmsCourseBookPage />} />
      <Route path="/courses/:coursePath/pdfbook/:bookIndex/" element={<LmsCourseBookPage />} />
      <Route path="/courses/:coursePath/pdfbook/:bookIndex/:page" element={<LmsCourseBookPage />} />
      <Route path="/courses/:coursePath/htmlbook/:bookIndex" element={<LmsCourseBookPage />} />
      <Route path="/courses/:coursePath/htmlbook/:bookIndex/" element={<LmsCourseBookPage />} />
      <Route path="/courses/:coursePath/htmlbook/:bookIndex/chapter/:chapter" element={<LmsCourseBookPage />} />
      <Route path="/courses/:org/:number/:run/book/:bookIndex" element={<LmsCourseBookPage />} />
      <Route path="/courses/:org/:number/:run/pdfbook/:bookIndex" element={<LmsCourseBookPage />} />
      <Route path="/courses/:org/:number/:run/htmlbook/:bookIndex" element={<LmsCourseBookPage />} />
      <Route path="/courses/:coursePath/jump_to/:locationPath" element={<LmsCourseJumpPage />} />
      <Route path="/courses/:coursePath/jump_to/:locationPath/" element={<LmsCourseJumpPage />} />
      <Route path="/courses/:coursePath/jump_to_id/:moduleId" element={<LmsCourseJumpPage />} />
      <Route path="/courses/:coursePath/jump_to_id/:moduleId/" element={<LmsCourseJumpPage />} />
      <Route path="/courses/:org/:number/:run/jump_to/:locationPath" element={<LmsCourseJumpPage />} />
      <Route path="/courses/:org/:number/:run/jump_to_id/:moduleId" element={<LmsCourseJumpPage />} />
      <Route path="/courses/:coursePath/submission_history/:learnerIdentifier/:locationPath" element={<LmsSubmissionHistoryPage />} />
      <Route path="/courses/:coursePath/submission_history/:learnerIdentifier/:locationPath/" element={<LmsSubmissionHistoryPage />} />
      <Route path="/courses/:org/:number/:run/submission_history/:learnerIdentifier/:locationPath" element={<LmsSubmissionHistoryPage />} />
      <Route path="/courses/:org/:number/:run/submission_history/:learnerIdentifier/:locationPath/" element={<LmsSubmissionHistoryPage />} />
      <Route path="/courses/:coursePath/xblock/:usageKey/handler/:handlerName" element={<LmsCourseXblockRoutePage />} />
      <Route path="/courses/:coursePath/xblock/:usageKey/handler/:handlerName/" element={<LmsCourseXblockRoutePage />} />
      <Route path="/courses/:coursePath/xblock/:usageKey/handler/:handlerName/*" element={<LmsCourseXblockRoutePage />} />
      <Route path="/courses/:coursePath/xblock/:usageKey/handler_noauth/:handlerName" element={<LmsCourseXblockRoutePage />} />
      <Route path="/courses/:coursePath/xblock/:usageKey/handler_noauth/:handlerName/" element={<LmsCourseXblockRoutePage />} />
      <Route path="/courses/:coursePath/xblock/:usageKey/handler_noauth/:handlerName/*" element={<LmsCourseXblockRoutePage />} />
      <Route path="/courses/:coursePath/xblock/:usageKey/view/:viewName" element={<LmsCourseXblockRoutePage />} />
      <Route path="/courses/:coursePath/xblock/:usageKey/view/:viewName/" element={<LmsCourseXblockRoutePage />} />
      <Route path="/courses/:coursePath/xblock/:usageKey/view/:viewName/*" element={<LmsCourseXblockRoutePage />} />
      <Route path="/courses/:org/:number/:run/xblock/:usageKey/handler/:handlerName" element={<LmsCourseXblockRoutePage />} />
      <Route path="/courses/:org/:number/:run/xblock/:usageKey/handler/:handlerName/*" element={<LmsCourseXblockRoutePage />} />
      <Route path="/courses/:org/:number/:run/xblock/:usageKey/handler_noauth/:handlerName" element={<LmsCourseXblockRoutePage />} />
      <Route path="/courses/:org/:number/:run/xblock/:usageKey/handler_noauth/:handlerName/*" element={<LmsCourseXblockRoutePage />} />
      <Route path="/courses/:org/:number/:run/xblock/:usageKey/view/:viewName" element={<LmsCourseXblockRoutePage />} />
      <Route path="/courses/:org/:number/:run/xblock/:usageKey/view/:viewName/*" element={<LmsCourseXblockRoutePage />} />
      <Route path="/courses/:coursePath/xqueue/:userId/:modId/:dispatch" element={<LmsCourseAdminExtrasPage />} />
      <Route path="/courses/:coursePath/xqueue/:userId/:modId/:dispatch/" element={<LmsCourseAdminExtrasPage />} />
      <Route path="/courses/:coursePath/xqueue/:userId/:modId/:dispatch/*" element={<LmsCourseAdminExtrasPage />} />
      <Route path="/courses/:org/:number/:run/xqueue/:userId/:modId/:dispatch" element={<LmsCourseAdminExtrasPage />} />
      <Route path="/courses/:org/:number/:run/xqueue/:userId/:modId/:dispatch/" element={<LmsCourseAdminExtrasPage />} />
      <Route path="/courses/:org/:number/:run/xqueue/:userId/:modId/:dispatch/*" element={<LmsCourseAdminExtrasPage />} />
      <Route path="/courses/:org/:number/:run/:tabSlug" element={<LmsCourseTabPage />} />
      <Route path="/courses/:org/:number/:run/:tabSlug/" element={<LmsCourseTabPage />} />
      <Route path="/courses/:coursePath/*" element={<LmsCourseTabPage />} />
      <Route path="/courses/:org/:number/:run/*" element={<LmsCourseTabPage />} />
      <Route path="/programs/:programId/about" element={<LmsProgramsAboutPage />} />
      <Route path="/programs/:programId/about/" element={<LmsProgramsAboutPage />} />
      <Route path="/courses" element={<LegacyCoursesPage />} />
      <Route path="/courses/" element={<LegacyCoursesPage />} />
      <Route path="/courses/:coursePath" element={<LegacyCoursesPage />} />
      <Route path="/courses/:coursePath/" element={<LegacyCoursesPage />} />
      <Route path="/courses/*" element={<LegacyCoursesPage />} />
      <Route path="/course_modes" element={<IdentityAccessPage />} />
      <Route path="/course_modes/" element={<IdentityAccessPage />} />
      <Route path="/course_modes/:modePath" element={<IdentityAccessPage />} />
      <Route path="/course_modes/*" element={<IdentityAccessPage />} />
      <Route path="/heartbeat" element={<LmsMiscEndpointPage />} />
      <Route path="/heartbeat/" element={<LmsMiscEndpointPage />} />
      <Route path="/i18n" element={<LmsMiscEndpointPage />} />
      <Route path="/i18n/" element={<LmsMiscEndpointPage />} />
      <Route path="/openassessment/fileupload" element={<LmsMiscEndpointPage />} />
      <Route path="/openassessment/fileupload/" element={<LmsMiscEndpointPage />} />
      <Route path="/__debug__" element={<LmsMiscEndpointPage />} />
      <Route path="/__debug__/" element={<LmsMiscEndpointPage />} />
      <Route path="/_o" element={<LmsMiscEndpointPage />} />
      <Route path="/_o/" element={<LmsMiscEndpointPage />} />
      <Route path="/lti_provider" element={<LmsMiscEndpointPage />} />
      <Route path="/lti_provider/" element={<LmsMiscEndpointPage />} />
      <Route path="/favicon.ico" element={<LmsMiscEndpointPage />} />
      <Route path="/template/:template" element={<LmsTemplatePage />} />
      <Route path="/template/:template/" element={<LmsTemplatePage />} />
      <Route path="/template/*" element={<LmsTemplatePage />} />
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
      <Route path="/wiki/create-root" element={<LmsWikiRootPage />} />
      <Route path="/wiki/create-root/" element={<LmsWikiRootPage />} />
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
      <Route path="/oauth2" element={<IdentityAccessPage />} />
      <Route path="/oauth2/" element={<IdentityAccessPage />} />
      <Route path="/oauth2/*" element={<IdentityAccessPage />} />
      <Route path="/api" element={<AdditionalApiFamiliesPage />} />
      <Route path="/api/" element={<AdditionalApiFamiliesPage />} />
      <Route path="/api/*" element={<AdditionalApiFamiliesPage />} />
      <Route path="/organizations" element={<IdentityAccessPage />} />
      <Route path="/organizations/" element={<IdentityAccessPage />} />
      <Route path="/update_lang/:langPath" element={<IdentityAccessPage />} />
      <Route path="/update_lang/*" element={<IdentityAccessPage />} />
      <Route path="/update_lang" element={<LmsMiscEndpointPage />} />
      <Route path="/update_lang/" element={<LmsMiscEndpointPage />} />
      <Route path="/lang_pref/update_language" element={<IdentityAccessPage />} />
      <Route path="/lang_pref/update_language/" element={<IdentityAccessPage />} />
      <Route path="/help_token" element={<HelpCenterPage />} />
      <Route path="/help_token/" element={<HelpCenterPage />} />
      <Route path="/help_token/:tokenPath" element={<HelpCenterPage />} />
      <Route path="/help_token/*" element={<HelpCenterPage />} />
      <Route path="/howitworks" element={<LegacyEntryPage />} />
      <Route path="/howitworks/" element={<LegacyEntryPage />} />
      <Route path="/signin_redirect_to_lms" element={<LegacyEntryPage />} />
      <Route path="/signin_redirect_to_lms/" element={<LegacyEntryPage />} />
      <Route path="/request_course_creator" element={<LegacyEntryPage />} />
      <Route path="/request_course_creator/" element={<LegacyEntryPage />} />
      <Route path="/signin" element={<LegacyEntryPage />} />
      <Route path="/signin/" element={<LegacyEntryPage />} />
      <Route path="/signup" element={<LegacyEntryPage />} />
      <Route path="/signup/" element={<LegacyEntryPage />} />
      <Route path="/accessibility" element={<SystemStatusPage />} />
      <Route path="/accessibility/" element={<SystemStatusPage />} />
      <Route path="/status" element={<SystemStatusPage />} />
      <Route path="/status/" element={<SystemStatusPage />} />
      <Route path="/admin" element={<SystemStatusPage />} />
      <Route path="/admin/" element={<SystemStatusPage />} />
      <Route path="/admin/*" element={<SystemStatusPage />} />
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
      <Route path="/instructor_task_status" element={<LmsSystemConfigPage />} />
      <Route path="/instructor_task_status/" element={<LmsSystemConfigPage />} />
      <Route path="/config/programs" element={<LmsSystemConfigPage />} />
      <Route path="/config/catalog" element={<LmsSystemConfigPage />} />
      <Route path="/xdomain_proxy.html" element={<LmsSystemConfigPage />} />
      <Route path="/coverage_context" element={<LmsSystemConfigPage />} />
      <Route path="/debug/run_python" element={<LmsDebugPage />} />
      <Route path="/debug/run_python/" element={<LmsDebugPage />} />
      <Route path="/debug/show_parameters" element={<LmsDebugPage />} />
      <Route path="/debug/show_parameters/" element={<LmsDebugPage />} />
      <Route path="/reset_deadlines" element={<LmsResetDeadlinesPage />} />
      <Route path="/reset_deadlines/" element={<LmsResetDeadlinesPage />} />
      <Route path="/survey" element={<LmsSurveyPage />} />
      <Route path="/survey/" element={<LmsSurveyPage />} />
      <Route path="/embargo" element={<LmsEmbargoPage />} />
      <Route path="/embargo/" element={<LmsEmbargoPage />} />
      <Route path="/bulk_email" element={<LmsBulkEmailPage />} />
      <Route path="/bulk_email/" element={<LmsBulkEmailPage />} />
      <Route path="/provider_login" element={<LmsProviderLoginPage />} />
      <Route path="/provider_login/" element={<LmsProviderLoginPage />} />
      <Route path="/resubscribe" element={<LmsResubscribePage />} />
      <Route path="/resubscribe/" element={<LmsResubscribePage />} />
      <Route path="/logout" element={<LmsLogoutPage />} />
      <Route path="/logout/" element={<LmsLogoutPage />} />
      <Route path="/manage_user_standing" element={<LmsManageUserStandingPage />} />
      <Route path="/manage_user_standing/" element={<LmsManageUserStandingPage />} />
      <Route path="/enroll_students" element={<LmsEnrollStudentsPage />} />
      <Route path="/enroll_students/" element={<LmsEnrollStudentsPage />} />
      <Route path="/lti" element={<LmsLtiPage />} />
      <Route path="/lti/" element={<LmsLtiPage />} />
      <Route path="/lti_form" element={<LmsLtiPage />} />
      <Route path="/lti_form/" element={<LmsLtiPage />} />
      <Route path="/public_video" element={<LmsPublicVideoPage />} />
      <Route path="/public_video/" element={<LmsPublicVideoPage />} />
      <Route path="/public_video/:videoPath" element={<LmsPublicVideoPage />} />
      <Route path="/public_video/*" element={<LmsPublicVideoPage />} />
      <Route path="/public_video_share_embed" element={<LmsPublicVideoPage />} />
      <Route path="/public_video_share_embed/" element={<LmsPublicVideoPage />} />
      <Route path="/email_change_successful" element={<LmsEmailStatusPage />} />
      <Route path="/email_change_successful/" element={<LmsEmailStatusPage />} />
      <Route path="/email_change_failed" element={<LmsEmailStatusPage />} />
      <Route path="/email_change_failed/" element={<LmsEmailStatusPage />} />
      <Route path="/secondary_email_change_successful" element={<LmsEmailStatusPage />} />
      <Route path="/secondary_email_change_successful/" element={<LmsEmailStatusPage />} />
      <Route path="/secondary_email_change_failed" element={<LmsEmailStatusPage />} />
      <Route path="/secondary_email_change_failed/" element={<LmsEmailStatusPage />} />
      <Route path="/invalid_email_key" element={<LmsEmailStatusPage />} />
      <Route path="/invalid_email_key/" element={<LmsEmailStatusPage />} />
      <Route path="/email_exists" element={<LmsEmailStatusPage />} />
      <Route path="/email_exists/" element={<LmsEmailStatusPage />} />
      <Route path="/extauth_failure" element={<LmsEmailStatusPage />} />
      <Route path="/extauth_failure/" element={<LmsEmailStatusPage />} />
      <Route path="/password_reset_done" element={<LmsPasswordResetPage />} />
      <Route path="/password_reset_done/" element={<LmsPasswordResetPage />} />
      <Route path="/password_reset_confirm" element={<LmsPasswordResetPage />} />
      <Route path="/password_reset_confirm/" element={<LmsPasswordResetPage />} />
      <Route path="/password_reset_complete" element={<LmsPasswordResetPage />} />
      <Route path="/password_reset_complete/" element={<LmsPasswordResetPage />} />
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
      <Route path="/transcript_delete/:courseKey/:edxVideoId/:languageCode/*" element={<UploadsPage />} />
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
      <Route path="/preview/xblock/:usageKey/handler/:handlerName/*" element={<ContentstorePage />} />
      <Route path="/preview/xblock/*" element={<ContentstorePage />} />
      <Route path="/xblock/resource/:blockType/:resourcePath" element={<ContentstorePage />} />
      <Route path="/xblock/resource/:blockType/*" element={<ContentstorePage />} />
      <Route path="/xblock/resource/*" element={<ContentstorePage />} />
      <Route path="/courses/xblock/handler/provider_states" element={<LmsMiscEndpointPage />} />
      <Route path="/courses/xblock/handler/provider_states/" element={<LmsMiscEndpointPage />} />
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
      <Route path="/library/:libraryKey" element={<LibraryDetailPage />} />
      <Route path="/library/:libraryKey/" element={<LibraryDetailPage />} />
      <Route path="/library/:libraryKey/team" element={<TeamManagementPage />} />
      <Route path="/library/:libraryKey/team/" element={<TeamManagementPage />} />
      <Route path="/library/*" element={<LibraryDetailPage />} />
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
      <Route path="/group_configurations/:courseKey/:groupConfigurationId/:groupId/*" element={<TeamsV0Page />} />
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
      <Route path="/courses/yt_video_metadata" element={<LmsCourseAdminExtrasPage />} />
      <Route path="/courses/yt_video_metadata/" element={<LmsCourseAdminExtrasPage />} />
      <Route path="/courses/:coursePath/set_course_mode_price" element={<LmsCourseAdminExtrasPage />} />
      <Route path="/courses/:coursePath/set_course_mode_price/" element={<LmsCourseAdminExtrasPage />} />
      <Route path="/courses/:org/:number/:run/set_course_mode_price" element={<LmsCourseAdminExtrasPage />} />
      <Route path="/courses/:org/:number/:run/set_course_mode_price/" element={<LmsCourseAdminExtrasPage />} />
      <Route path="/courses/:coursePath/discussion/topics" element={<LmsCourseAdminExtrasPage />} />
      <Route path="/courses/:coursePath/discussion/topics/" element={<LmsCourseAdminExtrasPage />} />
      <Route path="/courses/:org/:number/:run/discussion/topics" element={<LmsCourseAdminExtrasPage />} />
      <Route path="/courses/:org/:number/:run/discussion/topics/" element={<LmsCourseAdminExtrasPage />} />
      <Route path="/courses/:coursePath/lti_rest_endpoints" element={<LmsCourseAdminExtrasPage />} />
      <Route path="/courses/:coursePath/lti_rest_endpoints/" element={<LmsCourseAdminExtrasPage />} />
      <Route path="/courses/:org/:number/:run/lti_rest_endpoints" element={<LmsCourseAdminExtrasPage />} />
      <Route path="/courses/:org/:number/:run/lti_rest_endpoints/" element={<LmsCourseAdminExtrasPage />} />
      <Route path="/courses/:coursePath/generate_user_cert" element={<LmsCourseAdminExtrasPage />} />
      <Route path="/courses/:coursePath/generate_user_cert/" element={<LmsCourseAdminExtrasPage />} />
      <Route path="/courses/:org/:number/:run/generate_user_cert" element={<LmsCourseAdminExtrasPage />} />
      <Route path="/courses/:org/:number/:run/generate_user_cert/" element={<LmsCourseAdminExtrasPage />} />
      <Route path="/courses/:coursePath/course" element={<LmsCourseAdminExtrasPage />} />
      <Route path="/courses/:coursePath/course/" element={<LmsCourseAdminExtrasPage />} />
      <Route path="/courses/:org/:number/:run/course" element={<LmsCourseAdminExtrasPage />} />
      <Route path="/courses/:org/:number/:run/course/" element={<LmsCourseAdminExtrasPage />} />
      <Route path="/certificates" element={<LmsCertificatesPage />} />
      <Route path="/certificates/" element={<LmsCertificatesPage />} />
      <Route path="/certificates/:certificatePath" element={<LmsCertificatesPage />} />
      <Route path="/certificates/:certificatePath/:nestedPath/signatories/:signatoryId" element={<LmsCertificatesPage />} />
      <Route path="/certificates/:certificatePath/:nestedPath/signatories/:signatoryId/" element={<LmsCertificatesPage />} />
      <Route path="/certificates/*" element={<LmsCertificatesPage />} />
      <Route path="/notifications" element={<LegacyNotificationsPage />} />
      <Route path="/notifications/" element={<LegacyNotificationsPage />} />
      <Route path="/notification-preferences" element={<NotificationPreferencesPage />} />
      <Route path="/notification-preferences/" element={<NotificationPreferencesPage />} />
      <Route path="/notification_prefs/enable" element={<LmsNotificationPrefsAjaxPage />} />
      <Route path="/notification_prefs/enable/" element={<LmsNotificationPrefsAjaxPage />} />
      <Route path="/notification_prefs/disable" element={<LmsNotificationPrefsAjaxPage />} />
      <Route path="/notification_prefs/disable/" element={<LmsNotificationPrefsAjaxPage />} />
      <Route path="/notification_prefs/status" element={<LmsNotificationPrefsAjaxPage />} />
      <Route path="/notification_prefs/status/" element={<LmsNotificationPrefsAjaxPage />} />
      <Route path="/notification_prefs/unsubscribe/:token" element={<LmsNotificationTokenPage />} />
      <Route path="/notification_prefs/unsubscribe/:token/" element={<LmsNotificationTokenPage />} />
      <Route path="/notification_prefs/unsubscribe/*" element={<LmsNotificationTokenPage />} />
      <Route path="/notification_prefs/resubscribe/:token" element={<LmsNotificationTokenPage />} />
      <Route path="/notification_prefs/resubscribe/:token/" element={<LmsNotificationTokenPage />} />
      <Route path="/notification_prefs/resubscribe/*" element={<LmsNotificationTokenPage />} />
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
      <Route path="/financial-assistance" element={<FinancialAssistancePage />} />
      <Route path="/financial-assistance/" element={<FinancialAssistancePage />} />
      <Route path="/financial-assistance/apply" element={<FinancialAssistancePage />} />
      <Route path="/financial-assistance/apply/" element={<FinancialAssistancePage />} />
      <Route path="/financial-assistance/submit" element={<FinancialAssistancePage />} />
      <Route path="/financial-assistance/submit/" element={<FinancialAssistancePage />} />
      <Route path="/financial-assistance_v2/submit" element={<FinancialAssistancePage />} />
      <Route path="/financial-assistance_v2/submit/" element={<FinancialAssistancePage />} />
      <Route path="/xqueue" element={<LmsXqueuePage />} />
      <Route path="/xqueue/" element={<LmsXqueuePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
