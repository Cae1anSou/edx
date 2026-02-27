package org.openedx.backend.common.openapi;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiGroupingConfig {

    @Bean
    public GroupedOpenApi platformApi() {
        return GroupedOpenApi.builder()
                .group("platform")
                .pathsToMatch("/api/v1/health", "/api/v1/jobs/**")
                .build();
    }

    @Bean
    public GroupedOpenApi identityCourseApi() {
        return GroupedOpenApi.builder()
                .group("identity-course")
                .pathsToMatch("/api/v1/users/**", "/api/v1/courses/**")
                .build();
    }

    @Bean
    public GroupedOpenApi learningApi() {
        return GroupedOpenApi.builder()
                .group("learning")
                .pathsToMatch(
                        "/api/v1/notification-preferences/**",
                        "/api/v1/courses/*/enrollments/**",
                        "/api/v1/courses/*/progress/**",
                        "/api/v1/courses/*/grades/**",
                        "/api/v1/courses/*/certificates/**"
                )
                .build();
    }
}
