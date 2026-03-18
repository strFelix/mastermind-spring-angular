package br.com.strfelix.mastermind_spring.exceptions.game;

public class GameAlreadyFinishedException extends RuntimeException {
    public GameAlreadyFinishedException(String message) {
        super(message);
    }
}
