package org.openedx.backend.zendesk.application;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

@Service
public class ZendeskProxyService {

    private static final String TICKETS_PATH = "/api/v2/tickets.json";
    private final RestTemplate restTemplate = new RestTemplate();
    private final String zendeskUrl;
    private final String oauthToken;

    public ZendeskProxyService(
            @Value("${app.zendesk.url:}") String zendeskUrl,
            @Value("${app.zendesk.oauth-token:}") String oauthToken
    ) {
        this.zendeskUrl = zendeskUrl == null ? "" : zendeskUrl.trim();
        this.oauthToken = oauthToken == null ? "" : oauthToken.trim();
    }

    public int createTicketV0(Map<String, Object> payload) {
        String requesterName = asString(payload.get("name"));
        Map<String, Object> email = asMap(payload.get("email"));
        String requesterEmail = asString(email.get("from"));
        String subject = asString(email.get("subject"));
        String body = asString(email.get("message"));
        List<String> tags = asStringList(payload.get("tags"));
        return createTicket(requesterName, requesterEmail, subject, body, null, tags);
    }

    public int createTicketV1(Map<String, Object> payload, String requesterNameHeader, String requesterEmailHeader) {
        String requesterName = requesterNameHeader == null || requesterNameHeader.isBlank()
                ? asString(asMap(payload.get("requester")).get("name"))
                : requesterNameHeader;
        String requesterEmail = requesterEmailHeader == null || requesterEmailHeader.isBlank()
                ? asString(asMap(payload.get("requester")).get("email"))
                : requesterEmailHeader;
        String subject = asString(payload.get("subject"));
        String body = asString(asMap(payload.get("comment")).get("body"));
        List<Map<String, Object>> customFields = asMapList(payload.get("custom_fields"));
        List<String> tags = asStringList(payload.get("tags"));
        return createTicket(requesterName, requesterEmail, subject, body, customFields, tags);
    }

    public int proxyTicketPayload(Map<String, Object> payload) {
        if (!isConfigured()) {
            return 503;
        }
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    buildTicketsUrl(),
                    HttpMethod.POST,
                    new HttpEntity<>(payload, buildHeaders()),
                    String.class
            );
            return response.getStatusCode().value();
        } catch (HttpStatusCodeException ex) {
            return ex.getStatusCode().value();
        } catch (RestClientException ex) {
            return 500;
        }
    }

    private int createTicket(
            String requesterName,
            String requesterEmail,
            String subject,
            String body,
            List<Map<String, Object>> customFields,
            List<String> tags
    ) {
        if (!isConfigured()) {
            return 503;
        }
        Map<String, Object> ticket = Map.of(
                "requester", Map.of("name", requesterName, "email", requesterEmail),
                "subject", subject,
                "comment", Map.of("body", body),
                "custom_fields", customFields == null ? List.of() : customFields,
                "tags", deduplicate(tags)
        );
        return proxyTicketPayload(Map.of("ticket", ticket));
    }

    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(oauthToken);
        return headers;
    }

    private String buildTicketsUrl() {
        return zendeskUrl.endsWith("/") ? zendeskUrl.substring(0, zendeskUrl.length() - 1) + TICKETS_PATH : zendeskUrl + TICKETS_PATH;
    }

    private boolean isConfigured() {
        return !zendeskUrl.isBlank() && !oauthToken.isBlank();
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> asMap(Object value) {
        if (!(value instanceof Map<?, ?> map)) {
            throw new IllegalArgumentException("Expected object");
        }
        return (Map<String, Object>) map;
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> asMapList(Object value) {
        if (value == null) {
            return List.of();
        }
        if (!(value instanceof List<?> list)) {
            throw new IllegalArgumentException("Expected list");
        }
        List<Map<String, Object>> out = new ArrayList<>();
        for (Object item : list) {
            out.add(asMap(item));
        }
        return out;
    }

    @SuppressWarnings("unchecked")
    private List<String> asStringList(Object value) {
        if (value == null) {
            return List.of();
        }
        if (!(value instanceof List<?> list)) {
            throw new IllegalArgumentException("Expected list");
        }
        List<String> out = new ArrayList<>();
        for (Object item : list) {
            out.add(asString(item));
        }
        return out;
    }

    private String asString(Object value) {
        if (!(value instanceof String s) || s.isBlank()) {
            throw new IllegalArgumentException("Expected non-empty string");
        }
        return s;
    }

    private List<String> deduplicate(List<String> tags) {
        return new ArrayList<>(new LinkedHashSet<>(tags));
    }
}
