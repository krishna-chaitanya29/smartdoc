package com.example.smartdoc.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.smartdoc.model.ChatLog;

public interface ChatLogRepository extends JpaRepository<ChatLog, Long> {
    List<ChatLog> findByUsername(String username);
    void deleteByUsernameAndFileName(String username, String fileName);
    void deleteByUsername(String username);
}