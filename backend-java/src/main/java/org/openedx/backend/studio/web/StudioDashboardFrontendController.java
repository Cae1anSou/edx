package org.openedx.backend.studio.web;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.nio.file.Path;
import java.time.Duration;

@Controller
public class StudioDashboardFrontendController {

    private final String distDir;

    public StudioDashboardFrontendController(
            @Value("${app.studio-dashboard.dist-dir:../frontend-app-studio-dashboard/dist}") String distDir
    ) {
        this.distDir = distDir;
    }

    @GetMapping({
            "/",
            "/course",
            "/course/",
            "/course/{courseKey:.+}",
            "/course/{courseKey:.+}/",
            "/home",
            "/home/",
            "/home_library",
            "/home_library/",
            "/library/{libraryKey:.+}",
            "/library/{libraryKey:.+}/team",
            "/library/{libraryKey:.+}/team/",
            "/rerun",
            "/rerun/",
            "/rerun/{sourceCourseKey:.+}",
            "/rerun/{sourceCourseKey:.+}/",
            "/course_rerun",
            "/course_rerun/",
            "/course_rerun/{sourceCourseKey:.+}",
            "/course_rerun/{sourceCourseKey:.+}/",
            "/team",
            "/team/{courseKey:.+}",
            "/team/{courseKey:.+}/",
            "/course_team/{courseKey:.+}",
            "/course_team/{courseKey:.+}/",
            "/course_team/{courseKey:.+}/{email:.+}",
            "/course_team/{courseKey:.+}/{email:.+}/",
            "/dashboard",
            "/dashboard/",
            "/dashboard/{dashboardPath:.+}",
            "/dashboard/{dashboardPath:.+}/",
            "/change_enrollment",
            "/change_enrollment/",
            "/courses",
            "/courses/",
            "/courses/{coursePath:.+}",
            "/courses/{coursePath:.+}/",
            "/courses/{*coursePath}",
            "/course_modes",
            "/course_modes/",
            "/course_modes/{modePath:.+}",
            "/verify_student",
            "/verify_student/",
            "/verify_student/{verifyPath:.+}",
            "/support",
            "/support/",
            "/support/{supportPath:.+}",
            "/wiki",
            "/wiki/",
            "/wiki/{wikiPath:.+}",
            "/notify",
            "/notify/",
            "/notify/{notifyPath:.+}",
            "/notify/{notifyPath:.+}/",
            "/search",
            "/search/",
            "/search/{searchPath:.+}",
            "/catalog",
            "/catalog/",
            "/catalog/{catalogPath:.+}",
            "/rss_proxy",
            "/rss_proxy/",
            "/rss_proxy/{rssPath:.+}",
            "/rss_proxy/{rssPath:.+}/",
            "/api-admin",
            "/api-admin/",
            "/api-admin/{adminPath:.+}",
            "/organizations",
            "/organizations/",
            "/lang_pref/update_language",
            "/lang_pref/update_language/",
            "/update_lang/{langPath:.+}",
            "/help_token",
            "/help_token/",
            "/help_token/{tokenPath:.+}",
            "/howitworks",
            "/howitworks/",
            "/signin_redirect_to_lms",
            "/signin_redirect_to_lms/",
            "/request_course_creator",
            "/request_course_creator/",
            "/signin",
            "/signin/",
            "/signup",
            "/signup/",
            "/accessibility",
            "/accessibility/",
            "/status",
            "/status/",
            "/not_found",
            "/server_error",
            "/403",
            "/404",
            "/429",
            "/500",
            "/event",
            "/event/",
            "/calculate",
            "/calculate/",
            "/import/{importPath:.+}",
            "/import_status/{importStatusPath:.+}",
            "/export/{exportPath:.+}",
            "/export_output/{exportOutputPath:.+}",
            "/export_status/{exportStatusPath:.+}",
            "/export_git/{exportGitPath:.+}",
            "/checklists/{checklistPath:.+}",
            "/course/{courseKey:.+}/search_reindex",
            "/course/{courseKey:.+}/search_reindex/",
            "/course/{org}/{number}/{run}/search_reindex",
            "/course/{org}/{number}/{run}/search_reindex/",
            "/container/{containerPath:.+}",
            "/container_embed/{containerPath:.+}",
            "/orphan/{orphanPath:.+}",
            "/tabs/{tabPath:.+}",
            "/textbooks/{textbookPath:.+}",
            "/video_images/{videoImagePath:.+}",
            "/video_images_upload_enabled",
            "/video_features",
            "/video_features/",
            "/generate_video_upload_link/{courseKey:.+}",
            "/generate_video_upload_link/{courseKey:.+}/",
            "/transcript_preferences/{courseKey:.+}",
            "/transcript_preferences/{courseKey:.+}/",
            "/transcript_credentials/{courseKey:.+}",
            "/transcript_credentials/{courseKey:.+}/",
            "/transcript_download",
            "/transcript_download/",
            "/transcript_upload",
            "/transcript_upload/",
            "/transcript_upload_api",
            "/transcript_upload_api/",
            "/transcript_delete/{courseKey:.+}",
            "/transcript_delete/{courseKey:.+}/",
            "/transcript_delete/{courseKey:.+}/{edxVideoId:.+}",
            "/transcript_delete/{courseKey:.+}/{edxVideoId:.+}/",
            "/transcript_delete/{courseKey:.+}/{edxVideoId:.+}/{languageCode:.+}",
            "/video_encodings_download/{courseKey:.+}",
            "/video_encodings_download/{courseKey:.+}/",
            "/transcripts/upload",
            "/transcripts/upload/",
            "/transcripts/download",
            "/transcripts/download/",
            "/transcripts/check",
            "/transcripts/check/",
            "/transcripts/choose",
            "/transcripts/choose/",
            "/transcripts/replace",
            "/transcripts/replace/",
            "/transcripts/rename",
            "/transcripts/rename/",
            "/xblock/outline/{usageKey}",
            "/xblock/container/{usageKey}",
            "/xblock/{usageKey}",
            "/xblock/{usageKey}/{viewName}",
            "/preview/xblock/{usageKey:.+}",
            "/xblock/resource/{blockType}/{*resourcePath}",
            "/course_info/{courseKey:.+}",
            "/course_info/{courseKey:.+}/",
            "/course_info_update/{courseKey:.+}",
            "/course_info_update/{courseKey:.+}/",
            "/course_info_update/{courseKey:.+}/{providedId:.+}",
            "/course_info_update/{courseKey:.+}/{providedId:.+}/",
            "/course_notifications/{courseKey:.+}",
            "/course_notifications/{courseKey:.+}/",
            "/course_notifications/{courseKey:.+}/{actionStateId:.+}",
            "/course_notifications/{courseKey:.+}/{actionStateId:.+}/",
            "/tasks",
            "/tasks/",
            "/videos/{courseKey:.+}",
            "/videos/{courseKey:.+}/",
            "/videos/{courseKey:.+}/{edxVideoId:.+}",
            "/videos/{courseKey:.+}/{edxVideoId:.+}/",
            "/group_configurations/{courseKey:.+}",
            "/group_configurations/{courseKey:.+}/",
            "/group_configurations/{courseKey:.+}/{groupConfigurationId:.+}",
            "/group_configurations/{courseKey:.+}/{groupConfigurationId:.+}/",
            "/group_configurations/{courseKey:.+}/{groupConfigurationId:.+}/{groupId:.+}",
            "/group_configurations/{courseKey:.+}/{groupConfigurationId:.+}/{groupId:.+}/",
            "/settings/details/{courseKey:.+}",
            "/settings/details/{courseKey:.+}/",
            "/settings/grading/{courseKey:.+}",
            "/settings/grading/{courseKey:.+}/",
            "/settings/grading/{courseKey:.+}/{graderIndex:.+}",
            "/settings/grading/{courseKey:.+}/{graderIndex:.+}/",
            "/settings/advanced/{courseKey:.+}",
            "/settings/advanced/{courseKey:.+}/",
            "/authoring-api/ui",
            "/authoring-api/ui/",
            "/authoring-api/schema",
            "/authoring-api/schema/",
            "/course/{courseKey:.+}/entrance_exam",
            "/course/{courseKey:.+}/entrance_exam/",
            "/course/{org}/{number}/{run}/entrance_exam",
            "/course/{org}/{number}/{run}/entrance_exam/",
            "/certificates/{certificatePath:.+}",
            "/notifications",
            "/notifications/",
            "/notification-preferences",
            "/notification-preferences/",
            "/help-center",
            "/help-center/",
            "/user-tours",
            "/user-tours/",
            "/mfe-branding",
            "/mfe-branding/",
            "/legacy-compatibility",
            "/legacy-compatibility/",
            "/api-families",
            "/api-families/",
            "/teams-v0",
            "/teams-v0/",
            "/uploads",
            "/uploads/",
            "/contentstore",
            "/contentstore/",
            "/learner-services",
            "/learner-services/",
            "/instructor-tools",
            "/instructor-tools/",
            "/legacy-system-apis",
            "/legacy-system-apis/",
            "/legacy-system-apis/{systemPath:.+}",
            "/course-operations",
            "/course-operations/",
            "/learner-experience",
            "/learner-experience/",
            "/platform-integrations",
            "/platform-integrations/",
            "/search-commerce",
            "/search-commerce/",
            "/authoring-apis",
            "/authoring-apis/",
            "/authoring-apis/{authoringPath:.+}",
            "/identity-access",
            "/identity-access/",
            "/compliance",
            "/compliance/",
            "/system-status",
            "/system-status/",
            "/notifications-center",
            "/notifications-center/",
            "/resource-builder",
            "/resource-builder/",
    })
    public ResponseEntity<Resource> spaIndex() {
        Resource index = resolveResource("index.html");
        if (!index.exists()) {
            return ResponseEntity.status(503).contentType(MediaType.TEXT_PLAIN)
                    .body(new ClassPathResource("static/studio-dashboard-unavailable.txt"));
        }
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .cacheControl(CacheControl.noStore())
                .body(index);
    }

    @GetMapping("/assets/**")
    public ResponseEntity<Resource> assets(HttpServletRequest request) {
        String requestUri = request.getRequestURI();
        String assetPath = requestUri.length() > "/assets/".length()
                ? requestUri.substring("/assets/".length())
                : "";
        if (assetPath.isBlank() || assetPath.contains("..")) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = resolveResource("assets/" + assetPath);
        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }
        MediaType mediaType = MediaTypeFactory.getMediaType(assetPath).orElse(MediaType.APPLICATION_OCTET_STREAM);
        return ResponseEntity.ok()
                .contentType(mediaType)
                .cacheControl(CacheControl.maxAge(Duration.ofDays(365)).cachePublic().immutable())
                .body(resource);
    }

    private Resource resolveResource(String relativePath) {
        Path normalizedPath = Path.of(relativePath).normalize();
        if (normalizedPath.startsWith("..")) {
            return new ClassPathResource("static/never-exists");
        }
        Path filePath = Path.of(distDir).resolve(normalizedPath).normalize();
        Resource fileResource = new FileSystemResource(filePath);
        if (fileResource.exists()) {
            return fileResource;
        }
        return new ClassPathResource("static/" + normalizedPath);
    }
}
