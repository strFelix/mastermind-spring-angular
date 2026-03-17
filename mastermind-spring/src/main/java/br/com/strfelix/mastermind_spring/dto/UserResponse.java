package br.com.strfelix.mastermind_spring.dto;

public record UserResponse(
        Long id,
        String username,
        String email
) {}