# frontend-app-studio-dashboard

Standalone Studio dashboard micro-frontend built with React + Vite + TypeScript.

## Local development

```bash
cd frontend-app-studio-dashboard
npm install
npm run dev
```

The app expects backend endpoints at:

- `GET /api/studio/v1/dashboard`
- `GET /api/studio/v1/organizations`
- `POST /api/studio/v1/courses`
- `POST /api/studio/v1/courses/rerun`
- `POST /api/studio/v1/libraries`
- `DELETE /api/studio/v1/notifications/{notificationId}`
- `GET /api/support/v1/manage_course_team/?email=...`
- `PUT /api/support/v1/manage_course_team/`
- `GET /api/tasks/v0/`
- `POST /api/tasks/v0/`
- `GET /api/tasks/v0/{taskId}/`
- `GET /api/notifications/`
- `PATCH /api/notifications/read/`
- `PUT /api/notifications/mark-seen/{appName}/`
- `GET /api/notifications/v3/configurations/`
- `POST /api/notifications/preferences/update/{username}/`
- `GET /api/v2/help_center/articles/search.json?query=...`
- `GET /api/mfe_config/v1?mfe=...`
- `GET /api/branding/v1/footer` (`Accept: application/json`)
- `GET /api/branding/v1/footer` (`Accept: text/html`)
- `GET /api/user_tours/v1/{username}`
- `PATCH /api/user_tours/v1/{username}`
- `GET /api/user_tours/v1/discussions/`
- `PUT /api/user_tours/v1/discussions/{tourId}`
- `GET /api/v1/bookmarks/`
- `GET /api/v1/search/?course_id=...&user=...`
- `GET /api/commerce/v0/baskets/`
- `GET /api/content-staging/v1/clipboard/`
- `GET /api/contentstore/v2/downstreams/`
- `POST /api/contentstore/v2/downstreams/{downstreamBlockId}/sync`
- `GET /api/team/v0/teams/`
- `GET /api/team/v0/teams/{teamId}`
- `GET /api/team/v0/teams/{teamId}/assignments`
- `GET /api/team/v0/team_memberships/`
- `GET /api/team/v0/team_membership/{teamId},{username}`
- `GET /api/team/v0/topics/{topicId},{courseId}`
- `POST /api/v2/uploads.json?filename=...`
- `GET /api/v2/uploads/{fileToken}.json`
- `POST /api/bulk_enroll/v1/bulk_enroll`
- `GET /api/instructor/v1/?course_id=...`
- `GET /api/instructor/v2/courses/{courseId}`
- `GET /api/instructor/v2/courses/{courseId}/instructor_tasks`
- `GET /api/mobile/{apiVersion}`
- `GET /api/youtube/courses/{courseId}/edx-video-ids`
- plus all listed `LegacyAdditionalApiFamiliesController` GET routes (`/api/*/v*/`) via API Families page

Routes:

- `/` dashboard
- `/rerun?source_course_key=course-v1:...` rerun page
- `/course_rerun/{sourceCourseKey}` legacy-compatible rerun page
- `/team` team management page
- `/tasks` tasks page
- `/notifications` notifications page
- `/notification-preferences` notification prefs page
- `/help-center` help center search page
- `/user-tours` user tours page
- `/mfe-branding` mfe/branding inspector page
- `/legacy-compatibility` compatibility endpoints page (bookmarks/team/content/uploads)
- `/api-families` additional legacy API families runner page
- `/teams-v0` dedicated teams v0 page
- `/uploads` dedicated uploads page
- `/contentstore` dedicated contentstore/staging page
- `/learner-services` enrollment/entitlement/financial/profile-image page
- `/instructor-tools` instructor summary/course/tasks page
- `/legacy-system-apis` dedicated legacy system API families page
- `/course-operations` dedicated course operations page
- `/learner-experience` dedicated learner experience page
- `/platform-integrations` dedicated platform integration APIs page
- `/search-commerce` dedicated search/commerce/credit page
- `/authoring-apis` dedicated authoring API families page
- `/identity-access` dedicated identity/access integrations page
- `/compliance` dedicated compliance/control page
- `/system-status` dedicated system status/health page
- `/notifications-center` unified notifications operations page
- `/resource-builder` dedicated course/library/rerun builder page

For same-origin local dev, run this app behind the same host as `backend-java`.
