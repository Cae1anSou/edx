package org.openedx.backend.common.security;

import jakarta.servlet.http.HttpServletRequest;
import org.openedx.backend.common.exception.UnauthorizedException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class AuthContextResolver {

    private static final String HEADER_USER_ID = "X-User-Id";
    private static final String HEADER_ROLES = "X-Roles";
    private static final String HEADER_PERMISSIONS = "X-Permissions";
    private static final String HEADER_RESEARCH_GROUPS = "X-Research-Groups";
    private static final String HEADER_SIGNATURE = "X-Auth-Context-Signature";

    private final String authContextSignatureSecret;

    public AuthContextResolver(
            @Value("${app.security.auth-context-signature-secret:}") String authContextSignatureSecret
    ) {
        this.authContextSignatureSecret = authContextSignatureSecret;
    }

    public AuthContext require() {
        HttpServletRequest request = currentRequest();
        String userId = request.getHeader(HEADER_USER_ID);
        if (!StringUtils.hasText(userId)) {
            throw new UnauthorizedException("Missing X-User-Id");
        }

        validateAuthSignatureIfConfigured(request, userId);

        return new AuthContext(
                userId,
                parseSet(request.getHeader(HEADER_ROLES)),
                parseSet(request.getHeader(HEADER_PERMISSIONS)),
                parseSet(request.getHeader(HEADER_RESEARCH_GROUPS))
        );
    }

    private HttpServletRequest currentRequest() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs == null) {
            throw new UnauthorizedException("No request context");
        }
        return attrs.getRequest();
    }

    private Set<String> parseSet(String raw) {
        if (!StringUtils.hasText(raw)) {
            return Collections.emptySet();
        }
        return Arrays.stream(raw.split(","))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .collect(Collectors.toSet());
    }

    private void validateAuthSignatureIfConfigured(HttpServletRequest request, String userId) {
        if (!StringUtils.hasText(authContextSignatureSecret)) {
            return;
        }

        String provided = request.getHeader(HEADER_SIGNATURE);
        if (!StringUtils.hasText(provided)) {
            throw new UnauthorizedException("Missing X-Auth-Context-Signature");
        }

        String roles = headerOrEmpty(request, HEADER_ROLES);
        String permissions = headerOrEmpty(request, HEADER_PERMISSIONS);
        String researchGroups = headerOrEmpty(request, HEADER_RESEARCH_GROUPS);
        String payload = String.join("|", userId, roles, permissions, researchGroups);
        String expected = hmacSha256Hex(payload, authContextSignatureSecret);

        if (!MessageDigest.isEqual(
                expected.getBytes(StandardCharsets.UTF_8),
                provided.getBytes(StandardCharsets.UTF_8)
        )) {
            throw new UnauthorizedException("Invalid X-Auth-Context-Signature");
        }
    }

    private static String headerOrEmpty(HttpServletRequest request, String name) {
        String value = request.getHeader(name);
        return value == null ? "" : value;
    }

    private static String hmacSha256Hex(String payload, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] digest = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(digest.length * 2);
            for (byte b : digest) {
                sb.append(Character.forDigit((b >> 4) & 0xF, 16));
                sb.append(Character.forDigit(b & 0xF, 16));
            }
            return sb.toString();
        } catch (Exception ex) {
            throw new UnauthorizedException("Failed to validate auth signature");
        }
    }
}
