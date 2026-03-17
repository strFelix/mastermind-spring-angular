package br.com.strfelix.mastermind_spring.dto;

import java.time.LocalDateTime;

public record ErrorResponse(
        String message,
        LocalDateTime timestamp
) { }