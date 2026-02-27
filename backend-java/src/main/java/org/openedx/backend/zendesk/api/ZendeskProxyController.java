package org.openedx.backend.zendesk.api;

import jakarta.servlet.http.HttpServletRequest;
import org.openedx.backend.zendesk.application.ZendeskProxyService;
import org.openedx.backend.zendesk.application.ZendeskRateLimiter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class ZendeskProxyController {

    private final ZendeskProxyService service;
    private final ZendeskRateLimiter limiter;

    public ZendeskProxyController(ZendeskProxyService service, ZendeskRateLimiter limiter) {
        this.service = service;
        this.limiter = limiter;
    }

    @PostMapping("/zendesk_proxy/v0")
    public ResponseEntity<Void> proxyV0(@RequestBody Map<String, Object> payload) {
        if (!limiter.allow("zendesk-proxy-v0-global")) {
            return ResponseEntity.status(429).build();
        }
        try {
            return ResponseEntity.status(service.createTicketV0(payload)).build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/zendesk_proxy/v1")
    public ResponseEntity<Void> proxyV1(
            @RequestBody Map<String, Object> payload,
            @RequestHeader(value = "X-User-Id", required = false) String requesterNameHeader,
            @RequestHeader(value = "X-User-Email", required = false) String requesterEmailHeader,
            HttpServletRequest request
    ) {
        String requesterKey = requesterNameHeader == null || requesterNameHeader.isBlank()
                ? "anon:" + request.getRemoteAddr()
                : requesterNameHeader;
        if (!limiter.allow("zendesk-proxy-v1-" + requesterKey)) {
            return ResponseEntity.status(429).build();
        }
        try {
            return ResponseEntity.status(service.createTicketV1(payload, requesterNameHeader, requesterEmailHeader)).build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/api/v2/tickets.json")
    public ResponseEntity<Void> proxyZendeskTickets(@RequestBody Map<String, Object> payload, HttpServletRequest request) {
        if (!limiter.allow("zendesk-api-v2-" + request.getRemoteAddr())) {
            return ResponseEntity.status(429).build();
        }
        return ResponseEntity.status(service.proxyTicketPayload(payload)).build();
    }
}
