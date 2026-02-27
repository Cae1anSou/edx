package org.openedx.backend.common.api;

public record ApiResponse<T>(
        String code,
        String message,
        T data,
        ApiError error
) {

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>("OK", "success", data, null);
    }

    public static <T> ApiResponse<T> failure(String code, String message, ApiError error) {
        return new ApiResponse<>(code, message, null, error);
    }
}
