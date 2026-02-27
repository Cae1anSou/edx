package org.openedx.backend.common.security;

import jakarta.servlet.http.HttpServletRequest;
import org.openedx.backend.common.exception.UnauthorizedException;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

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

    public AuthContext require() {
        HttpServletRequest request = currentRequest();
        String userId = request.getHeader(HEADER_USER_ID);
        if (!StringUtils.hasText(userId)) {
            throw new UnauthorizedException("Missing X-User-Id");
        }
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
}
