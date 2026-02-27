package org.openedx.backend.agreements.api;

import org.openedx.backend.agreements.application.AgreementsService;
import org.openedx.backend.agreements.domain.IntegritySignatureRecord;
import org.openedx.backend.agreements.domain.LtiPiiSignatureRecord;
import org.openedx.backend.common.security.AuthContext;
import org.openedx.backend.common.security.AuthContextResolver;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/agreements/v1")
public class AgreementsController {

    private static final String FORBIDDEN_MSG = "User does not have permission to view integrity agreement.";
    private final AgreementsService service;
    private final AuthContextResolver authContextResolver;
    private final boolean integrityEnabled;
    private final boolean ltiPiiEnabled;

    public AgreementsController(
            AgreementsService service,
            AuthContextResolver authContextResolver,
            @Value("${app.agreements.enable-integrity-signature:true}") boolean integrityEnabled,
            @Value("${app.agreements.enable-lti-pii-acknowledgement:true}") boolean ltiPiiEnabled
    ) {
        this.service = service;
        this.authContextResolver = authContextResolver;
        this.integrityEnabled = integrityEnabled;
        this.ltiPiiEnabled = ltiPiiEnabled;
    }

    @GetMapping("/integrity_signature/{courseId}")
    public ResponseEntity<?> getIntegritySignature(
            @PathVariable String courseId,
            @RequestParam(required = false, name = "username") String requestedUsername
    ) {
        if (!integrityEnabled) {
            return ResponseEntity.notFound().build();
        }
        AuthContext auth = authContextResolver.require();
        String username = auth.userId();
        if (requestedUsername != null && !requestedUsername.isBlank() && !requestedUsername.equals(username) && !isStaff(auth)) {
            return ResponseEntity.status(403).body(Map.of("message", FORBIDDEN_MSG));
        }
        String targetUsername = requestedUsername == null || requestedUsername.isBlank() ? username : requestedUsername;
        return service.getIntegritySignature(targetUsername, courseId)
                .<ResponseEntity<?>>map(sig -> ResponseEntity.ok(toIntegrityResponse(sig)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/integrity_signature/{courseId}")
    public ResponseEntity<?> createIntegritySignature(@PathVariable String courseId) {
        if (!integrityEnabled) {
            return ResponseEntity.notFound().build();
        }
        AuthContext auth = authContextResolver.require();
        IntegritySignatureRecord signature = service.createIntegritySignature(auth.userId(), courseId);
        return ResponseEntity.ok(toIntegrityResponse(signature));
    }

    @PostMapping("/lti_pii_signature/{courseId}")
    public ResponseEntity<?> createLtiPiiSignature(
            @PathVariable String courseId,
            @RequestBody(required = false) Map<String, Object> body
    ) {
        if (!ltiPiiEnabled) {
            return ResponseEntity.notFound().build();
        }
        AuthContext auth = authContextResolver.require();
        if (body == null || !body.containsKey("lti_tools")) {
            // Django serializer invalid branch returns 500; keep this behavior for 1:1 compatibility.
            return ResponseEntity.status(500).body(Map.of("lti_tools", "This field is required."));
        }
        Object tools = body.get("lti_tools");
        if (!(tools instanceof Map<?, ?> ltiToolsMap)) {
            return ResponseEntity.status(500).body(Map.of("lti_tools", "Invalid format."));
        }
        @SuppressWarnings("unchecked")
        Map<String, Object> ltiTools = (Map<String, Object>) ltiToolsMap;
        LtiPiiSignatureRecord signature = service.upsertLtiPiiSignature(auth.userId(), courseId, ltiTools);
        return ResponseEntity.ok(toLtiPiiResponse(signature));
    }

    private boolean isStaff(AuthContext auth) {
        return auth.hasRole("STAFF") || auth.hasRole("ADMIN") || auth.hasRole("GLOBAL_STAFF");
    }

    private Map<String, Object> toIntegrityResponse(IntegritySignatureRecord record) {
        return Map.of(
                "username", record.username(),
                "course_id", record.courseId(),
                "created_at", record.createdAt().toString()
        );
    }

    private Map<String, Object> toLtiPiiResponse(LtiPiiSignatureRecord record) {
        return Map.of(
                "username", record.username(),
                "course_id", record.courseId(),
                "lti_tools", record.ltiTools(),
                "created_at", record.createdAt().toString()
        );
    }
}
