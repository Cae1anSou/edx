# Frontend Migration Map (master -> React)

This map records legacy CMS routes discovered from `master:cms/urls.py` and their React destination in `frontend-app-studio-dashboard`.

## Source snapshots pulled from master
- `migration-reference/master/cms/urls.py`
- `migration-reference/master/cms/course-create-rerun.html`
- `migration-reference/master/cms/manage_users.html`
- `migration-reference/master/cms/library.html`
- `migration-reference/master/cms/videos_index.html`
- `migration-reference/master/lms/urls.py`
- `migration-reference/master/lms/dashboard.html`

## Route mapping
- `/home`, `/home/` -> `DashboardPage`
- `/home_library`, `/home_library/` -> `DashboardPage`
- `/course/{courseKey}` (including `org/course/run` style) -> `DashboardPage`
- `/course_rerun/{sourceCourseKey}` -> `RerunCoursePage`
- `/library/{libraryKey}` -> `DashboardPage`
- `/library/{libraryKey}/team` -> `TeamManagementPage`
- `/team`, `/team/{courseKey}` -> `TeamManagementPage`
- `/course_team/{courseKey}/...` -> `TeamManagementPage`
- `/tasks` -> `TasksPage`
- `/videos/{courseKey}[/{edxVideoId}]` -> `UploadsPage`
- `/video_images/{courseKey}[/{edxVideoId}]` -> `UploadsPage`
- `/generate_video_upload_link/{courseKey}` -> `UploadsPage`
- `/video_features`, `/video_images_upload_enabled` -> `UploadsPage`
- `/transcript_preferences/{courseKey}`, `/transcript_credentials/{courseKey}` -> `UploadsPage`
- `/transcript_download`, `/transcript_upload`, `/transcript_upload_api` -> `UploadsPage`
- `/transcript_delete/{courseKey}[/{edxVideoId}[/{languageCode}]]` -> `UploadsPage`
- `/video_encodings_download/{courseKey}` -> `UploadsPage`
- `/group_configurations/{courseKey}[/{groupConfigurationId}[/{groupId}]]` -> `TeamsV0Page`
- `/settings/details/{courseKey}` -> `ResourceBuilderPage`
- `/settings/grading/{courseKey}[/{graderIndex}]` -> `InstructorToolsPage`
- `/settings/advanced/{courseKey}` -> `AuthoringApisPage`
- `/authoring-apis/*` -> `AuthoringApisPage`
- `/legacy-system-apis/*` -> `LegacySystemApisPage`
- `/course_info/{courseKey}`, `/course_info_update/{courseKey}[/{providedId}]` (with optional trailing `/`) -> `ResourceBuilderPage`
- `/course_notifications/{courseKey}[/{actionStateId}]` (with optional trailing `/`) -> `NotificationsCenterPage`
- `/course/{courseKey}/search_reindex` (including `org/course/run` style) -> `CourseOperationsPage`
- `/xblock/outline/{usageKey}`, `/xblock/container/{usageKey}`, `/xblock/{usageKey}[/{viewName}]` -> `ContentstorePage`
- `/transcripts/upload|download|check|choose|replace|rename` -> `UploadsPage`
- `/import*`, `/export*`, `/checklists*` -> `CourseOperationsPage`
- `/export_git/*` -> `CourseOperationsPage`
- `/container*`, `/container_embed*`, `/orphan*`, `/tabs*`, `/textbooks*` -> `ContentstorePage`
- `/preview/xblock/*`, `/xblock/resource/*` -> `ContentstorePage`
- `/howitworks`, `/signin_redirect_to_lms`, `/request_course_creator`, `/signin`, `/signup` (with optional trailing `/`) -> `DashboardPage`
- `/lang_pref/update_language` (with optional trailing `/`) -> `IdentityAccessPage`
- `/accessibility`, `/status` -> `SystemStatusPage`
- `/not_found`, `/server_error`, `/403`, `/404`, `/429`, `/500` -> `SystemStatusPage`
- `/event`, `/calculate` (with optional trailing `/`) -> `SystemStatusPage`
- `/course/{courseKey}/entrance_exam` (including `org/course/run` style) -> `InstructorToolsPage`
- `/certificates/*` -> `CompliancePage`
- `/authoring-api/ui`, `/authoring-api/schema` (with optional trailing `/`) -> `AuthoringApisPage`

## LMS route mapping
- `/dashboard` and `/dashboard/*` -> `LmsDashboardPage`
- `/change_enrollment` -> `LearnerServicesPage`
- `/courses/*` -> `LegacyCoursesPage` (view-aware sub-routing for `about/courseware/progress/instructor/discussion/bookmarks`)
- `/course_modes*`, `/verify_student*`, `/api-admin*` -> `IdentityAccessPage`
- `/update_lang/*` -> `IdentityAccessPage`
- `/organizations` -> `IdentityAccessPage`
- `/support*` -> `HelpCenterPage`
- `/search*`, `/catalog*` -> `SearchCommercePage`
- `/rss_proxy*` (including root `/rss_proxy`, with optional trailing `/`) -> `PlatformIntegrationsPage`
- `/wiki*` -> `LearnerExperiencePage`
- `/notify*` (including root `/notify`, with optional trailing `/`) -> `LearnerExperiencePage`
- `/help_token*` -> `HelpCenterPage`

## Note
`frontend-app-studio-dashboard` also includes wildcard fallback routes (`*`) for legacy keys containing `/`.
