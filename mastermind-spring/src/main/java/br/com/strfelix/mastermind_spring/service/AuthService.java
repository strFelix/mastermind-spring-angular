package br.com.strfelix.mastermind_spring.service;

import br.com.strfelix.mastermind_spring.dto.request.LoginRequest;
import br.com.strfelix.mastermind_spring.dto.request.RegisterRequest;
import br.com.strfelix.mastermind_spring.dto.response.UserResponse;
import br.com.strfelix.mastermind_spring.exceptions.InvalidCredentialsException;
import br.com.strfelix.mastermind_spring.exceptions.UserAlreadyExistsException;
import br.com.strfelix.mastermind_spring.model.User;
import br.com.strfelix.mastermind_spring.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse register(RegisterRequest request) {

        userRepository.findByUsername(request.username())
                .ifPresent(user -> {
                    throw new UserAlreadyExistsException("User already exists");
                });

        String hashed = passwordEncoder.encode(request.password());
        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(hashed);

        User savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail()
        );
    }

    public UserResponse login(LoginRequest request) {

        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail()
        );
    }
}
