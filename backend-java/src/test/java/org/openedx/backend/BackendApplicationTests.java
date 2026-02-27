package org.openedx.backend;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

@SpringBootTest
@AutoConfigureMockMvc
class BackendApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void healthEndpointShouldReturnUp() throws Exception {
        mockMvc.perform(get("/api/v1/health"))
                .andExpect(status().isOk())
                .andExpect(header().exists("X-Request-Id"))
                .andExpect(jsonPath("$.data.status").value("UP"));
    }

    @Test
    void v1NotificationPreferenceShouldSupportPutThenGet() throws Exception {
        mockMvc.perform(withAuth(put("/api/v1/notification-preferences/u-100"), "notification:write", null)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "emailEnabled": true,
                                  "smsEnabled": false
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(header().exists("X-Request-Id"))
                .andExpect(jsonPath("$.data.userId").value("u-100"))
                .andExpect(jsonPath("$.data.emailEnabled").value(true))
                .andExpect(jsonPath("$.data.smsEnabled").value(false));

        mockMvc.perform(withAuth(get("/api/v1/notification-preferences/u-100"), "notification:read", null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.userId").value("u-100"));
    }

    @Test
    void notificationPreferenceShouldBeIdempotentByHeaderKey() throws Exception {
        String key = "idem-001";
        mockMvc.perform(withAuth(put("/api/v1/notification-preferences/u-idem"), "notification:write", null)
                        .header("X-Idempotency-Key", key)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "emailEnabled": true,
                                  "smsEnabled": false
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.emailEnabled").value(true))
                .andExpect(jsonPath("$.data.smsEnabled").value(false));

        mockMvc.perform(withAuth(put("/api/v1/notification-preferences/u-idem"), "notification:write", null)
                        .header("X-Idempotency-Key", key)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "emailEnabled": false,
                                  "smsEnabled": true
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.emailEnabled").value(true))
                .andExpect(jsonPath("$.data.smsEnabled").value(false));
    }

    @Test
    void legacyNotificationPreferenceEndpointShouldMapSnakeCase() throws Exception {
        mockMvc.perform(withAuth(put("/api/legacy/users/u-legacy/notification-preferences"), "notification:write", null)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email_enabled": false,
                                  "sms_enabled": true
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.user_id").value("u-legacy"))
                .andExpect(jsonPath("$.data.email_enabled").value(false))
                .andExpect(jsonPath("$.data.sms_enabled").value(true));

        mockMvc.perform(withAuth(get("/api/legacy/users/u-legacy/notification-preferences"), "notification:read", null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.user_id").value("u-legacy"));
    }

    @Test
    void userRegistrationShouldCreateAndFetchUser() throws Exception {
        MvcResult result = mockMvc.perform(withAuth(post("/api/v1/users"), "identity:user:create", null)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "student@example.com",
                                  "displayName": "Student One"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.email").value("student@example.com"))
                .andReturn();
        String userId = JsonPath.read(result.getResponse().getContentAsString(), "$.data.userId");

        mockMvc.perform(withAuth(get("/api/v1/users/" + userId), "identity:user:read", null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.displayName").value("Student One"));

        mockMvc.perform(withAuth(get("/api/v1/users?page=0&size=10"), "identity:user:list", null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.total").isNumber());
    }

    @Test
    void enrollmentShouldSupportEnrollGetAndUnenroll() throws Exception {
        mockMvc.perform(withAuth(put("/api/v1/courses/course-v1-demo/enrollments/u-200"), "enrollment:write", "teaching"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("ENROLLED"));

        mockMvc.perform(withAuth(get("/api/v1/courses/course-v1-demo/enrollments/u-200"), "enrollment:read", null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("ENROLLED"));

        mockMvc.perform(withAuth(delete("/api/v1/courses/course-v1-demo/enrollments/u-200"), "enrollment:write", "teaching"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("UNENROLLED"));
    }

    @Test
    void learningProgressShouldSupportUpdateAndGet() throws Exception {
        mockMvc.perform(withAuth(put("/api/v1/courses/course-v1-demo/progress/u-300"), "progress:write", null)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "progressPercent": 45
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.progressPercent").value(45))
                .andExpect(jsonPath("$.data.completed").value(false));

        mockMvc.perform(withAuth(get("/api/v1/courses/course-v1-demo/progress/u-300"), "progress:read", null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.progressPercent").value(45));
    }

    @Test
    void shouldReturnForbiddenWhenPermissionMissing() throws Exception {
        mockMvc.perform(withAuth(get("/api/v1/courses/course-v1-demo/progress/u-404"), "notification:read", null))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("FORBIDDEN"));
    }

    @Test
    void gradingShouldSupportUpdateAndGet() throws Exception {
        mockMvc.perform(withAuth(put("/api/v1/courses/course-v1-demo/grades/u-500"), "grade:write", null)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "score": 92.5
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.score").value(92.5))
                .andExpect(jsonPath("$.data.letterGrade").value("A"));

        mockMvc.perform(withAuth(get("/api/v1/courses/course-v1-demo/grades/u-500"), "grade:read", null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.letterGrade").value("A"));
    }

    @Test
    void certificateShouldSupportIssueGetAndRevoke() throws Exception {
        mockMvc.perform(withAuth(post("/api/v1/courses/course-v1-demo/certificates/u-600"), "certificate:write", null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("ISSUED"));

        mockMvc.perform(withAuth(get("/api/v1/courses/course-v1-demo/certificates/u-600"), "certificate:read", null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("ISSUED"));

        mockMvc.perform(withAuth(delete("/api/v1/courses/course-v1-demo/certificates/u-600"), "certificate:write", null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("REVOKED"));
    }

    @Test
    void courseMetadataShouldSupportUpsertAndGet() throws Exception {
        mockMvc.perform(withAuth(put("/api/v1/courses/course-v1-advanced"), "course:write", null)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Advanced Spring Backend",
                                  "status": "PUBLISHED",
                                  "ownerUserId": "u-owner-1"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.courseId").value("course-v1-advanced"))
                .andExpect(jsonPath("$.data.status").value("PUBLISHED"));

        mockMvc.perform(withAuth(get("/api/v1/courses/course-v1-advanced"), "course:read", null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("Advanced Spring Backend"));

        mockMvc.perform(withAuth(get("/api/v1/courses/list?page=0&size=10"), "course:list", null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.total").isNumber());
    }

    @Test
    void jobOrchestratorShouldSupportSubmitGetAndTransitions() throws Exception {
                MvcResult result = mockMvc.perform(withAuth(post("/api/v1/jobs"), "job:submit", null)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "jobType": "GRADE_RECALCULATION",
                                  "payload": "{\\\"courseId\\\":\\\"course-v1-demo\\\"}"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("PENDING"))
                .andReturn();
        String jobId = JsonPath.read(result.getResponse().getContentAsString(), "$.data.jobId");

        mockMvc.perform(withAuth(get("/api/v1/jobs/" + jobId), "job:read", null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.jobId").value(jobId));

        mockMvc.perform(withAuth(get("/api/v1/jobs?page=0&size=10"), "job:list", null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.total").isNumber());

        mockMvc.perform(withAuth(put("/api/v1/jobs/" + jobId + "/running"), "job:manage", null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("RUNNING"));

        mockMvc.perform(withAuth(put("/api/v1/jobs/" + jobId + "/succeeded"), "job:manage", null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("SUCCEEDED"));

        mockMvc.perform(withAuth(put("/api/v1/jobs/run-once"), "job:manage", null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isNumber());
    }

    @Test
    void courseXShouldSupportCreateGetAndList() throws Exception {
        MvcResult result = mockMvc.perform(withAuth(post("/api/v1/coursexs"), "coursex:create", null)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "parentCourseId": "course-v1-demo",
                                  "displayName": "Course Run A",
                                  "ownerUserId": "u-owner"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.parentCourseId").value("course-v1-demo"))
                .andReturn();
        String courseXId = JsonPath.read(result.getResponse().getContentAsString(), "$.data.courseXId");

        mockMvc.perform(withAuth(get("/api/v1/coursexs/" + courseXId), "coursex:read", null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.courseXId").value(courseXId));

        mockMvc.perform(withAuth(get("/api/v1/coursexs?page=0&size=10"), "coursex:list", null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.total").isNumber());
    }

    @Test
    void enterpriseLearnerShouldSupportUpsertAndQueryByUsername() throws Exception {
        mockMvc.perform(withAuth(post("/enterprise/api/v1/enterprise-learner"), "enterprise:learner:write", null)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "test-learner",
                                  "enterpriseId": "ent-01",
                                  "active": true
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.username").value("test-learner"));

        mockMvc.perform(withAuth(get("/enterprise/api/v1/enterprise-learner/?username=test-learner"), "enterprise:learner:read", null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.enterpriseId").value("ent-01"));
    }

    @Test
    void consentShouldSupportUpsertAndGet() throws Exception {
        mockMvc.perform(withAuth(post("/consent/api/v1/data_sharing_consent"), "consent:write", null)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "test-learner",
                                  "consented": true
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.consented").value(true));

        mockMvc.perform(withAuth(get("/consent/api/v1/data_sharing_consent?username=test-learner"), "consent:read", null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.username").value("test-learner"));
    }

    @Test
    void taxonomyLearnerCurrentJobShouldSupportUpsertAndList() throws Exception {
        mockMvc.perform(withAuth(post("/taxonomy/api/v1/learners-current-job"), "taxonomy:learner-job:write", null)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "test-learner",
                                  "company": "Open Learning Inc",
                                  "jobTitle": "Learning Engineer"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.company").value("Open Learning Inc"));

        mockMvc.perform(withAuth(get("/taxonomy/api/v1/learners-current-job/?page_size=1000"), "taxonomy:learner-job:read", null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.total").isNumber());
    }

    @Test
    void zendeskProxyV1ShouldReturnBadRequestOnInvalidPayload() throws Exception {
        mockMvc.perform(post("/zendesk_proxy/v1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "subject": "",
                                  "comment": {}
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void zendeskApiV2ShouldReturnServiceUnavailableWhenZendeskNotConfigured() throws Exception {
        mockMvc.perform(post("/api/v2/tickets.json")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "ticket": {
                                    "subject": "Need help",
                                    "comment": {
                                      "body": "details"
                                    }
                                  }
                                }
                                """))
                .andExpect(status().isServiceUnavailable());
    }

    @Test
    void agreementsIntegritySignatureShouldSupportCreateGetAndStaffAccessRules() throws Exception {
        mockMvc.perform(withAuth(post("/api/agreements/v1/integrity_signature/course-v1-demo"), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("u-test"))
                .andExpect(jsonPath("$.course_id").value("course-v1-demo"));

        mockMvc.perform(withAuth(get("/api/agreements/v1/integrity_signature/course-v1-demo"), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("u-test"));

        mockMvc.perform(withAuth(get("/api/agreements/v1/integrity_signature/course-v1-demo?username=other-user"), null, null))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("User does not have permission to view integrity agreement."));

        mockMvc.perform(withAuthWithUserAndRoles(post("/api/agreements/v1/integrity_signature/course-v1-demo"), "other-user", "LEARNER", null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("other-user"));

        mockMvc.perform(withAuthWithUserAndRoles(get("/api/agreements/v1/integrity_signature/course-v1-demo?username=other-user"), "staff-user", "STAFF", null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("other-user"));
    }

    @Test
    void agreementsLtiPiiSignatureShouldValidateAndUpsert() throws Exception {
        mockMvc.perform(withAuth(post("/api/agreements/v1/lti_pii_signature/course-v1-demo"), null, null)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isInternalServerError());

        mockMvc.perform(withAuth(post("/api/agreements/v1/lti_pii_signature/course-v1-demo"), null, null)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "lti_tools": {
                                    "first_lti_tool": "Tool A",
                                    "second_lti_tool": "Tool B"
                                  }
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("u-test"))
                .andExpect(jsonPath("$.course_id").value("course-v1-demo"))
                .andExpect(jsonPath("$.lti_tools.first_lti_tool").value("Tool A"));
    }

    @Test
    void bookmarksShouldSupportCreateListGetAndDelete() throws Exception {
        String usageId = "block-v1:OpenedX+Demo+2026+type@vertical+block@v1";

        mockMvc.perform(withAuth(post("/api/bookmarks/v1/bookmarks/"), null, null)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "usage_id": "block-v1:OpenedX+Demo+2026+type@vertical+block@v1"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.usage_id").value(usageId))
                .andExpect(jsonPath("$.display_name").value("v1"))
                .andExpect(jsonPath("$.path[0].usage_id").value(usageId));

        mockMvc.perform(withAuth(get("/api/bookmarks/v1/bookmarks/?course_id=block-v1:OpenedX+Demo+2026"), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count").value(1))
                .andExpect(jsonPath("$.num_pages").value(1))
                .andExpect(jsonPath("$.results[0].usage_id").value(usageId));

        mockMvc.perform(withAuth(get("/api/bookmarks/v1/bookmarks/u-test," + usageId + "/?fields=display_name,path"), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.usage_id").value(usageId))
                .andExpect(jsonPath("$.display_name").value("v1"))
                .andExpect(jsonPath("$.path[0].display_name").value("v1"));

        mockMvc.perform(withAuthWithUserAndRoles(get("/api/bookmarks/v1/bookmarks/other-user," + usageId + "/"), "u-test", "LEARNER", null, null))
                .andExpect(status().isForbidden());

        mockMvc.perform(withAuth(delete("/api/bookmarks/v1/bookmarks/u-test," + usageId + "/"), null, null))
                .andExpect(status().isNoContent());

        mockMvc.perform(withAuth(get("/api/bookmarks/v1/bookmarks/u-test," + usageId + "/"), null, null))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.developer_message").value("Bookmark with usage_id: " + usageId + " does not exist."));
    }

    @Test
    void bookmarksShouldReturnExpectedErrorsForInvalidInput() throws Exception {
        mockMvc.perform(withAuth(post("/api/bookmarks/v1/bookmarks/"), null, null)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.developer_message").value("No data provided."));

        mockMvc.perform(withAuth(post("/api/bookmarks/v1/bookmarks/"), null, null)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "usage_id": "i4x"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.developer_message").value("Invalid usage_id: i4x."));

        mockMvc.perform(withAuth(get("/api/bookmarks/v1/bookmarks/u-test,i4x/"), null, null))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.user_message").value("Invalid usage_id: i4x."));
    }

    @Test
    void courseExperienceResetDeadlinesShouldSupportCoreFlows() throws Exception {
        mockMvc.perform(withAuth(post("/api/course_experience/v1/reset_course_deadlines")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"), null, null))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.detail").value("'course_key' is required."));

        mockMvc.perform(withAuth(post("/api/course_experience/v1/reset_course_deadlines")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "course_key": "course-v1-demo"
                                }
                                """), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Deadlines successfully reset."));

        mockMvc.perform(withAuth(put("/api/v1/courses/course-v1-demo/enrollments/u-test"), "enrollment:write", "teaching"))
                .andExpect(status().isOk());

        mockMvc.perform(withAuth(post("/api/course_experience/v1/reset_all_course_deadlines/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success_course_keys[0]").value("course-v1-demo"));
    }

    @Test
    void courseExperienceMobileDeadlinesShouldReturn401And404And200() throws Exception {
        mockMvc.perform(get("/api/course_experience/v1/course_deadlines_info/course-v1-demo"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(withAuth(get("/api/course_experience/v1/course_deadlines_info/course-v1-unknown"), null, null))
                .andExpect(status().isNotFound());

        mockMvc.perform(withAuth(put("/api/v1/courses/course-v1-mobile"), "course:write", null)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Mobile Course",
                                  "status": "DRAFT",
                                  "ownerUserId": "u-test"
                                }
                                """))
                .andExpect(status().isOk());

        mockMvc.perform(withAuth(get("/api/course_experience/v1/course_deadlines_info/course-v1-mobile"), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dates_banner_info.missed_deadlines").exists())
                .andExpect(jsonPath("$.dates_banner_info.missed_gated_content").exists())
                .andExpect(jsonPath("$.dates_banner_info.content_type_gating_enabled").exists())
                .andExpect(jsonPath("$.dates_banner_info.verified_upgrade_link").exists());
    }

    @Test
    void languagePreferenceShouldSupportPatchAndPreviewLangEndpoints() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch("/lang_pref/update_language")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "pref-lang": "eo"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(header().string("Set-Cookie", org.hamcrest.Matchers.containsString("openedx-language-preference=eo")));

        mockMvc.perform(get("/update_lang/"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(withAuth(get("/update_lang/"), null, null))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Preview Language Administration")));

        mockMvc.perform(withAuth(post("/update_lang/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "action": "set_preview_language",
                                  "preview_language": "fr"
                                }
                                """), null, null))
                .andExpect(status().isFound())
                .andExpect(header().string("Location", "/update_lang/"));
    }

    @Test
    void toggleStateShouldEnforceStaffAndReturnReportShape() throws Exception {
        mockMvc.perform(withAuth(get("/api/toggles/v0/state/"), null, null))
                .andExpect(status().isForbidden());

        mockMvc.perform(withAuthWithUserAndRoles(get("/api/toggles/v0/state/"), "u-staff", "STAFF", null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.django_settings[0].name").value("FEATURES['MILESTONES_APP']"))
                .andExpect(jsonPath("$.waffle_flags").isArray());
    }

    @Test
    void userCompatShouldSupportRegistrationSessionAndPreferences() throws Exception {
        mockMvc.perform(post("/api/user/v1/account/registration/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "student",
                                  "email": "student@example.com",
                                  "name": "Student One"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("student"));

        mockMvc.perform(withAuth(get("/api/user/v1/accounts/"), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("u-test"));

        mockMvc.perform(withAuth(post("/api/user/v1/account/login_session/"), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("u-test"));

        mockMvc.perform(withAuth(post("/api/user/v1/preferences/email_opt_in/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "course_id": "course-v1-demo",
                                  "email_opt_in": "true"
                                }
                                """), null, null))
                .andExpect(status().isOk());

        mockMvc.perform(withAuth(put("/api/user/v1/preferences/test1/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "value": "abc"
                                }
                                """), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.preference_key").value("test1"));

        mockMvc.perform(get("/api/user/v0/accounts/student"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("student"));

        mockMvc.perform(get("/api/user/v0/preferences/student"))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/user/v1/validation/registration")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "new-user",
                                  "email": "new-user@example.com"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void legacyCompatibilityShouldSupportTeamAndUploadFlows() throws Exception {
        mockMvc.perform(withAuth(get("/api/contentstore/v2/downstreams/"), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.results").isArray());

        mockMvc.perform(withAuth(post("/api/contentstore/v2/downstreams/block-v1-sync/sync"), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.downstream_block_id").value("block-v1-sync"))
                .andExpect(jsonPath("$.status").value("SYNCED"))
                .andExpect(jsonPath("$.synced_at").exists());

        mockMvc.perform(withAuth(get("/api/contentstore/v2/downstreams/"), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.results[0].downstream_block_id").value("block-v1-sync"));

        mockMvc.perform(withAuth(get("/api/team/v0/teams/"), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.results[0].id").value("test-team"));

        mockMvc.perform(withAuth(get("/api/team/v0/teams/no_such_team?expand=user"), null, null))
                .andExpect(status().isNotFound());

        mockMvc.perform(withAuth(get("/api/team/v0/team_membership/test-team,u-test?admin=true"), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.admin").value(true));

        mockMvc.perform(withAuth(get("/api/team/v0/topics/no_such_topic,course/1"), null, null))
                .andExpect(status().isNotFound());

        MvcResult uploadResult = mockMvc.perform(post("/api/v2/uploads.json?filename=test.png"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.upload.token").exists())
                .andReturn();
        String token = JsonPath.read(uploadResult.getResponse().getContentAsString(), "$.upload.token");

        mockMvc.perform(get("/api/v2/uploads/" + token + ".json"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.upload.status").value("uploaded"))
                .andExpect(jsonPath("$.upload.attachment").value("test.png"));

        mockMvc.perform(get("/api/v2/uploads/not-exists.json"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.upload.status").value("not_found"));

        mockMvc.perform(get("/api/v2/help_center/articles/search.json"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("query is required"));

        mockMvc.perform(get("/api/v2/help_center/articles/search.json?query=account"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.results[0].title").value("Account setup guide"));
    }

    @Test
    void legacyMfeBrandingAndUserToursShouldSupportCoreFlows() throws Exception {
        mockMvc.perform(get("/api/mfe_config/v1?mfe=learning"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.BASE_URL").value("http://localhost:2000/learning"));

        mockMvc.perform(get("/api/branding/v1/footer").header("Accept", "application/json"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.navigation_links[0].name").value("about"));

        mockMvc.perform(get("/api/user_tours/v1/u-test"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(withAuth(get("/api/user_tours/v1/u-test"), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.course_home_tour_status").value("not_started"));

        mockMvc.perform(withAuth(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch("/api/user_tours/v1/u-test")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "course_home_tour_status": "dismissed",
                                  "show_courseware_tour": false
                                }
                                """), null, null))
                .andExpect(status().isOk());

        mockMvc.perform(withAuth(get("/api/user_tours/v1/u-test"), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.course_home_tour_status").value("dismissed"))
                .andExpect(jsonPath("$.show_courseware_tour").value(false));

        mockMvc.perform(withAuth(get("/api/user_tours/v1/other-user"), null, null))
                .andExpect(status().isBadRequest());

        mockMvc.perform(withAuthWithUserAndRoles(get("/api/user_tours/v1/other-user"), "u-staff", "STAFF", null, null))
                .andExpect(status().isOk());

        mockMvc.perform(withAuth(get("/api/user_tours/v1/discussions/"), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));

        mockMvc.perform(withAuth(put("/api/user_tours/v1/discussions/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "show_tour": false
                                }
                                """), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.show_tour").value(false));

        mockMvc.perform(withAuth(put("/api/user_tours/v1/discussions/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "show_tour": false
                                }
                                """), null, null))
                .andExpect(status().isNotFound());
    }

    @Test
    void legacyNotificationsSupportAndTasksShouldSupportCoreFlows() throws Exception {
        mockMvc.perform(get("/api/notifications/"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(withAuth(get("/api/notifications/"), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count").isNumber());

        mockMvc.perform(withAuth(get("/api/notifications/count/"), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.show_notifications_tray").value(true));

        mockMvc.perform(withAuth(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch("/api/notifications/read/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "app_name": "discussion"
                                }
                                """), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Notifications marked read."));

        mockMvc.perform(withAuth(put("/api/notifications/mark-seen/discussion/"), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Notifications marked as seen."));

        mockMvc.perform(withAuth(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch("/api/notifications/read/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"), null, null))
                .andExpect(status().isBadRequest());

        mockMvc.perform(get("/api/notifications/v2/configurations/"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(withAuth(get("/api/notifications/v2/configurations/"), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.version").value("v2"));

        mockMvc.perform(get("/api/notifications/preferences/update/hash-user/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").value("success"));
        mockMvc.perform(get("/api/notifications/preferences/update/hash-user/patch-token/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").value("success"));

        mockMvc.perform(withAuth(get("/api/support/v1/manage_course_team/"), null, null))
                .andExpect(status().isBadRequest());

        mockMvc.perform(withAuth(get("/api/support/v1/manage_course_team/?email=u@example.com"), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].course_id").value("course-v1:edX+DemoX+2025_T1"));

        mockMvc.perform(withAuth(put("/api/support/v1/manage_course_team/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "u@example.com",
                                  "bulk_role_operations": [
                                    {
                                      "course_id": "course-v1:edX+DemoX+2025_T1",
                                      "role": "instructor",
                                      "action": "assign"
                                    }
                                  ]
                                }
                                """), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.results[0].status").value("success"));

        mockMvc.perform(withAuth(put("/api/support/v1/manage_course_team/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "u@example.com",
                                  "bulk_role_operations": [
                                    {
                                      "course_id": "course-v1:edX+DemoX+2025_T2",
                                      "role": "invalid-role",
                                      "action": "assign"
                                    }
                                  ]
                                }
                                """), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.results[0].status").value("failed"));

        mockMvc.perform(withAuth(get("/api/tasks/v0/"), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.results").isArray());

        MvcResult taskResult = mockMvc.perform(withAuth(post("/api/tasks/v0/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "task_type": "grade-export"
                                }
                                """), null, null))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.state").value("PENDING"))
                .andReturn();
        Integer taskId = JsonPath.read(taskResult.getResponse().getContentAsString(), "$.id");

        mockMvc.perform(withAuth(get("/api/tasks/v0/" + taskId + "/"), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.task_type").value("grade-export"));

        mockMvc.perform(withAuth(get("/api/tasks/v0/999999/"), null, null))
                .andExpect(status().isNotFound());
    }

    @Test
    void legacyAdditionalApiFamiliesShouldExposeDjangoParityPrefixes() throws Exception {
        mockMvc.perform(post("/api/bulk_enroll/v1/bulk_enroll")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("accepted"));

        mockMvc.perform(get("/api/change_email_settings/"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(withAuth(get("/api/change_email_settings/"), null, null))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/dashboard/"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(withAuth(get("/api/dashboard/"), null, null))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/course_home/v1/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.version").value("v1"));

        mockMvc.perform(get("/api/instructor/v1/"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(withAuth(get("/api/instructor/v1/"), null, null))
                .andExpect(status().isBadRequest());
        mockMvc.perform(withAuth(get("/api/instructor/v1/?course_id=course-v1:edX+DemoX+2025_T1"), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.course_id").value("course-v1:edX+DemoX+2025_T1"));

        mockMvc.perform(get("/api/instructor/v2/"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(withAuth(get("/api/instructor/v2/"), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.results").isArray());
        mockMvc.perform(withAuth(get("/api/instructor/v2/courses/course-v1:edX+DemoX+2025_T1"), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.course_id").value("course-v1:edX+DemoX+2025_T1"));
        mockMvc.perform(withAuth(get("/api/instructor/v2/courses/course-v1:edX+DemoX+2025_T1/instructor_tasks"), null, null))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.course_id").value("course-v1:edX+DemoX+2025_T1"));

        mockMvc.perform(get("/api/youtube/courses/course-v1-demo/edx-video-ids"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.course_id").value("course-v1-demo"));
    }

    private MockHttpServletRequestBuilder withAuth(
            MockHttpServletRequestBuilder builder,
            String permissions,
            String researchGroups
    ) {
        return withAuthWithUserAndRoles(builder, "u-test", "LEARNER,INSTRUCTOR", permissions, researchGroups);
    }

    private MockHttpServletRequestBuilder withAuthWithUserAndRoles(
            MockHttpServletRequestBuilder builder,
            String userId,
            String roles,
            String permissions,
            String researchGroups
    ) {
        builder.header("X-User-Id", userId);
        builder.header("X-Roles", roles);
        if (permissions != null) {
            builder.header("X-Permissions", permissions);
        }
        if (researchGroups != null) {
            builder.header("X-Research-Groups", researchGroups);
        }
        return builder;
    }
}
