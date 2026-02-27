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
                                  "payload": "{\"courseId\":\"course-v1-demo\"}"
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

    private MockHttpServletRequestBuilder withAuth(
            MockHttpServletRequestBuilder builder,
            String permissions,
            String researchGroups
    ) {
        builder.header("X-User-Id", "u-test");
        builder.header("X-Roles", "LEARNER,INSTRUCTOR");
        if (permissions != null) {
            builder.header("X-Permissions", permissions);
        }
        if (researchGroups != null) {
            builder.header("X-Research-Groups", researchGroups);
        }
        return builder;
    }
}
