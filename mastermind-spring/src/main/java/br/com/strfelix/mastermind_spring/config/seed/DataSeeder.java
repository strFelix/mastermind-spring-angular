package br.com.strfelix.mastermind_spring.config.seed;

import br.com.strfelix.mastermind_spring.model.User;
import br.com.strfelix.mastermind_spring.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@Profile("dev")
public class DataSeeder {

    @Bean
    public CommandLineRunner seedUser(UserRepository userRepository,
                                      PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                User user = new User();
                user.setUsername("admin");
                user.setEmail("admin@email.com");
                user.setPassword(passwordEncoder.encode("123456"));
                user.setBestScore(0);

                userRepository.save(user);
            }
        };
    }
}
