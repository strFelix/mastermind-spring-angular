package br.com.strfelix.mastermind_spring.dto.response;

public record UserResponse(
        Long id,
        String username,
        String email,
        Integer bestScore
) {}