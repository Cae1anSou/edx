package org.openedx.backend.common.web;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.openedx.backend.common.api.ApiResponse;
import org.openedx.backend.common.api.ApiError;
import org.openedx.backend.common.api.DomainNotFoundException;
import org.openedx.backend.common.exception.BusinessException;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DomainNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(DomainNotFoundException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.failure(
                        "RESOURCE_NOT_FOUND",
                        ex.getMessage(),
                        buildError("RESOURCE_NOT_FOUND", ex.getMessage(), request, null)
                ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleMethodValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<String> details = ex.getBindingResult().getFieldErrors().stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .toList();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.failure(
                        "INVALID_ARGUMENT",
                        "Request validation failed",
                        buildError("INVALID_ARGUMENT", "Request validation failed", request, details)
                ));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleConstraintViolation(ConstraintViolationException ex, HttpServletRequest request) {
        List<String> details = ex.getConstraintViolations().stream()
                .map(v -> v.getPropertyPath() + " " + v.getMessage())
                .toList();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.failure(
                        "INVALID_ARGUMENT",
                        "Request validation failed",
                        buildError("INVALID_ARGUMENT", "Request validation failed", request, details)
                ));
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusiness(BusinessException ex, HttpServletRequest request) {
        return ResponseEntity.status(ex.getStatus())
                .body(ApiResponse.failure(
                        ex.getCode(),
                        ex.getMessage(),
                        buildError(ex.getCode(), ex.getMessage(), request, null)
                ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneric(Exception ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.failure(
                        "INTERNAL_ERROR",
                        "Unexpected server error",
                        buildError("INTERNAL_ERROR", "Unexpected server error", request, null)
                ));
    }

    private ApiError buildError(String code, String message, HttpServletRequest request, Object details) {
        return new ApiError(
                code,
                message,
                RequestIdFilter.requestId(request),
                request.getRequestURI(),
                details
        );
    }
}
