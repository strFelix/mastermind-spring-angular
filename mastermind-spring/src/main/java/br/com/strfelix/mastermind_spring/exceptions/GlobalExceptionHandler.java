package br.com.strfelix.mastermind_spring.exceptions;

import br.com.strfelix.mastermind_spring.dto.ErrorResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @Value("${spring.profiles.active}")
    private String activeProfile;

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<?> handleUserExists(UserAlreadyExistsException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(error(ex.getMessage()));
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<?> handleInvalidCredentials(InvalidCredentialsException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(error(ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneric(Exception ex) {

        String message;

        if ("dev".equals(activeProfile)) {
            message = ex.getMessage();
        } else {
            message = "Internal server error";
        }

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(error(message));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex) {

        List<Map<String, String>> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> {
                    assert err.getDefaultMessage() != null;
                    return Map.of(
                            "field", err.getField(),
                            "message", err.getDefaultMessage()
                    );
                })
                .toList();

        return ResponseEntity.badRequest().body(
                Map.of(
                        "message", "Validation error",
                        "errors", errors,
                        "timestamp", LocalDateTime.now()
                )
        );
    }

    private ErrorResponse error(String message) {
        return new ErrorResponse(message, LocalDateTime.now());
    }
}
