package br.com.strfelix.mastermind_spring.dto.response;

public record GuessResponse(
        Integer correctPositions,
        boolean finished,
        boolean won
) {}