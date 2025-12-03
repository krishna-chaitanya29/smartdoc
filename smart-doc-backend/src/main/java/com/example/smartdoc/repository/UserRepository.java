package com.example.smartdoc.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.smartdoc.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}