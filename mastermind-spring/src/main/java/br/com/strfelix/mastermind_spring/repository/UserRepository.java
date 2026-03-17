package br.com.strfelix.mastermind_spring.repository;

import br.com.strfelix.mastermind_spring.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

}
