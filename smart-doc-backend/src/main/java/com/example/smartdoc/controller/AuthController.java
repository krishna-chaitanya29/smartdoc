package com.example.smartdoc.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.smartdoc.model.User;
import com.example.smartdoc.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> request) {
        try {
            authService.register(request.get("username"), request.get("password"));
            return ResponseEntity.ok(Map.of("message", "User registered successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            User user = authService.login(request.get("username"), request.get("password"));
            // In a real app, we would return a JWT Token here. 
            // For now, we return the username to let React know login succeeded.
            return ResponseEntity.ok(Map.of("username", user.getUsername(), "status", "success"));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Login failed");
        }
    }
}