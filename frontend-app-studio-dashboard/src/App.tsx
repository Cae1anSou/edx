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

export function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/course" element={<DashboardPage />} />
      <Route path="/course/" element={<DashboardPage />} />
      <Route path="/rerun" element={<RerunCoursePage />} />
      <Route path="/rerun/:sourceCourseKey" element={<RerunCoursePage />} />
      <Route path="/course_rerun" element={<RerunCoursePage />} />
      <Route path="/course_rerun/" element={<RerunCoursePage />} />
      <Route path="/course_rerun/:sourceCourseKey" element={<RerunCoursePage />} />
      <Route path="/course_rerun/:sourceCourseKey/" element={<RerunCoursePage />} />
      <Route path="/team" element={<TeamManagementPage />} />
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/notifications" element={<LegacyNotificationsPage />} />
      <Route path="/notification-preferences" element={<NotificationPreferencesPage />} />
      <Route path="/help-center" element={<HelpCenterPage />} />
      <Route path="/user-tours" element={<UserToursPage />} />
      <Route path="/mfe-branding" element={<MfeBrandingPage />} />
      <Route path="/legacy-compatibility" element={<LegacyCompatibilityPage />} />
      <Route path="/api-families" element={<AdditionalApiFamiliesPage />} />
      <Route path="/teams-v0" element={<TeamsV0Page />} />
      <Route path="/uploads" element={<UploadsPage />} />
      <Route path="/contentstore" element={<ContentstorePage />} />
      <Route path="/learner-services" element={<LearnerServicesPage />} />
      <Route path="/instructor-tools" element={<InstructorToolsPage />} />
      <Route path="/legacy-system-apis" element={<LegacySystemApisPage />} />
      <Route path="/course-operations" element={<CourseOperationsPage />} />
      <Route path="/learner-experience" element={<LearnerExperiencePage />} />
      <Route path="/platform-integrations" element={<PlatformIntegrationsPage />} />
      <Route path="/search-commerce" element={<SearchCommercePage />} />
      <Route path="/authoring-apis" element={<AuthoringApisPage />} />
      <Route path="/identity-access" element={<IdentityAccessPage />} />
      <Route path="/compliance" element={<CompliancePage />} />
      <Route path="/system-status" element={<SystemStatusPage />} />
      <Route path="/notifications-center" element={<NotificationsCenterPage />} />
      <Route path="/resource-builder" element={<ResourceBuilderPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
