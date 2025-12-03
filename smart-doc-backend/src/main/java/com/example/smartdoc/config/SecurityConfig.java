package com.example.smartdoc.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

   @Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(auth -> auth
            // UPDATE THIS LINE: Add "/api/docs/**" to the permit list
            .requestMatchers("/api/auth/**", "/api/docs/**").permitAll() 
            .anyRequest().authenticated()
        )
        .httpBasic(basic -> basic.disable())
        .formLogin(login -> login.disable());
    
    return http.build();
}
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Encrypts passwords (e.g., "123456" -> "$2a$10$...")
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // ❌ OLD: configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        
        // ✅ NEW: Allow your Vercel App (Replace with your actual Vercel URL)
        // OR use "*" to allow everyone (Easiest for testing)
        configuration.setAllowedPatterns(List.of("*")); // For Spring Boot 3.x, use setAllowedOriginPatterns("*")
        configuration.setAllowedOriginPatterns(List.of("*")); // Use this one!
        
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}