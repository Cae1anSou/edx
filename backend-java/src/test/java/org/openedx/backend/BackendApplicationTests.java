package org.openedx.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
                .andExpect(jsonPath("$.status").value("UP"));
    }

    @Test
    void v1NotificationPreferenceShouldSupportPutThenGet() throws Exception {
        mockMvc.perform(put("/api/v1/notification-preferences/u-100")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "emailEnabled": true,
                                  "smsEnabled": false
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(header().exists("X-Request-Id"))
                .andExpect(jsonPath("$.userId").value("u-100"))
                .andExpect(jsonPath("$.emailEnabled").value(true))
                .andExpect(jsonPath("$.smsEnabled").value(false));

        mockMvc.perform(get("/api/v1/notification-preferences/u-100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value("u-100"));
    }

    @Test
    void legacyNotificationPreferenceEndpointShouldMapSnakeCase() throws Exception {
        mockMvc.perform(put("/api/legacy/users/u-legacy/notification-preferences")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email_enabled": false,
                                  "sms_enabled": true
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user_id").value("u-legacy"))
                .andExpect(jsonPath("$.email_enabled").value(false))
                .andExpect(jsonPath("$.sms_enabled").value(true));

        mockMvc.perform(get("/api/legacy/users/u-legacy/notification-preferences"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user_id").value("u-legacy"));
    }
}
