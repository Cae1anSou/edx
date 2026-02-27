package org.openedx.backend.common.security.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.openedx.backend.common.exception.ForbiddenException;
import org.openedx.backend.common.security.AuthContext;
import org.openedx.backend.common.security.AuthContextResolver;
import org.openedx.backend.common.security.annotation.RequireLogin;
import org.openedx.backend.common.security.annotation.RequirePermission;
import org.openedx.backend.common.security.annotation.RequireResearchGroup;
import org.openedx.backend.common.security.annotation.RequireRole;
import org.springframework.core.annotation.AnnotatedElementUtils;
import org.springframework.stereotype.Component;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.Arrays;

@Aspect
@Component
public class AccessControlAspect {

    private final AuthContextResolver authContextResolver;

    public AccessControlAspect(AuthContextResolver authContextResolver) {
        this.authContextResolver = authContextResolver;
    }

    @Before("@within(org.openedx.backend.common.security.annotation.RequireLogin) || " +
            "@annotation(org.openedx.backend.common.security.annotation.RequireLogin)")
    public void requireLogin() {
        authContextResolver.require();
    }

    @Before("@within(org.openedx.backend.common.security.annotation.RequireRole) || " +
            "@annotation(org.openedx.backend.common.security.annotation.RequireRole)")
    public void requireRole(JoinPoint jp) {
        AuthContext auth = authContextResolver.require();
        RequireRole annotation = findAnnotation(jp, RequireRole.class);
        boolean granted = annotation != null && Arrays.stream(annotation.value()).anyMatch(auth::hasRole);
        if (!granted) {
            throw new ForbiddenException("Role check failed");
        }
    }

    @Before("@within(org.openedx.backend.common.security.annotation.RequirePermission) || " +
            "@annotation(org.openedx.backend.common.security.annotation.RequirePermission)")
    public void requirePermission(JoinPoint jp) {
        AuthContext auth = authContextResolver.require();
        RequirePermission annotation = findAnnotation(jp, RequirePermission.class);
        boolean granted = annotation != null && Arrays.stream(annotation.value()).anyMatch(auth::hasPermission);
        if (!granted) {
            throw new ForbiddenException("Permission check failed");
        }
    }

    @Before("@within(org.openedx.backend.common.security.annotation.RequireResearchGroup) || " +
            "@annotation(org.openedx.backend.common.security.annotation.RequireResearchGroup)")
    public void requireResearchGroup(JoinPoint jp) {
        AuthContext auth = authContextResolver.require();
        RequireResearchGroup annotation = findAnnotation(jp, RequireResearchGroup.class);
        boolean granted = annotation != null && Arrays.stream(annotation.value()).anyMatch(auth::hasResearchGroup);
        if (!granted) {
            throw new ForbiddenException("Research group check failed");
        }
    }

    private <T extends Annotation> T findAnnotation(JoinPoint jp, Class<T> annotationType) {
        Method method = ((MethodSignature) jp.getSignature()).getMethod();
        T methodAnnotation = AnnotatedElementUtils.findMergedAnnotation(method, annotationType);
        if (methodAnnotation != null) {
            return methodAnnotation;
        }
        return AnnotatedElementUtils.findMergedAnnotation(jp.getTarget().getClass(), annotationType);
    }
}
