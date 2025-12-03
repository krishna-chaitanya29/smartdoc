package com.example.smartdoc.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class ChatLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username; // Links to the user
    private String fileName;
    
    @Column(length = 5000) // Allow long texts
    private String question;
    
    @Column(length = 5000)
    private String answer;

    private LocalDateTime timestamp = LocalDateTime.now();
}