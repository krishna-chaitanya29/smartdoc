package com.example.smartdoc.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
	private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<Map<String, Object>> handleResourceNotFound(
			ResourceNotFoundException ex, WebRequest request) {
		logger.error("Resource not found: {}", ex.getMessage());
		Map<String, Object> response = buildErrorResponse(
			HttpStatus.NOT_FOUND.value(),
			ex.getMessage(),
			request.getDescription(false)
		);
		return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<Map<String, Object>> handleIllegalArgument(
			IllegalArgumentException ex, WebRequest request) {
		logger.error("Illegal argument: {}", ex.getMessage());
		Map<String, Object> response = buildErrorResponse(
			HttpStatus.BAD_REQUEST.value(),
			ex.getMessage(),
			request.getDescription(false)
		);
		return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, Object>> handleGlobalException(
			Exception ex, WebRequest request) {
		logger.error("An unexpected error occurred", ex);
		Map<String, Object> response = buildErrorResponse(
			HttpStatus.INTERNAL_SERVER_ERROR.value(),
			"An unexpected error occurred. Please try again later.",
			request.getDescription(false)
		);
		return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	private Map<String, Object> buildErrorResponse(int status, String message, String path) {
		Map<String, Object> response = new HashMap<>();
		response.put("timestamp", LocalDateTime.now());
		response.put("status", status);
		response.put("message", message);
		response.put("path", path);
		return response;
	}
}
