export type StudioCourseItem = {
  id: string;
  courseKey: string;
  displayName: string;
  org: string;
  number: string;
  run: string;
  canEdit: boolean;
  url: string;
  lmsLink: string | null;
  rerunLink: string | null;
};

export type StudioLibraryItem = {
  id: string;
  courseKey: string;
  displayName: string;
  org: string;
  number: string;
  canEdit: boolean;
  url: string;
};

export type StudioPermissions = {
  canCreateCourse: boolean;
  canCreateLibrary: boolean;
  allowReruns: boolean;
};

export type StudioNotification = {
  id: string;
  title: string;
  message: string;
};

export type StudioDashboard = {
  courses: StudioCourseItem[];
  archivedCourses: StudioCourseItem[];
  libraries: StudioLibraryItem[];
  notifications: StudioNotification[];
  permissions: StudioPermissions;
};

export type CreatedResource = {
  id: string;
  url: string;
};

export type CourseTeamAssignment = {
  course_id: string;
  course_name: string;
  org: string;
  role: string | null;
};

export type CourseTeamUpdateResult = {
  course_id: string;
  role: string;
  action: 'assign' | 'revoke';
  status: string;
  error?: string;
};

export type LegacyTaskItem = {
  id: number;
  task_type: string;
  state: string;
  created: string;
};

export type LegacyNotificationItem = {
  id: number;
  app_name: string;
  content: string;
  created: string;
  last_read: string | null;
  last_seen: string | null;
};

export type HelpCenterArticle = {
  id: number;
  title: string;
  url: string;
};

export type UserTourState = {
  course_home_tour_status: string;
  show_courseware_tour: boolean;
};

export type DiscussionTourState = {
  id: number;
  tour_name: string;
  show_tour: boolean;
};
