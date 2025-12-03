package com.example.smartdoc.controller;

import com.example.smartdoc.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/docs")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DocumentController {

    private final AIService aiService;

    @PostMapping("/upload")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file, 
                                    @RequestParam("user_id") String userId) {
        try {
            String result = aiService.uploadDocument(file, userId);
            return ResponseEntity.ok(Map.of("message", result));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Upload failed: " + e.getMessage());
        }
    }

    // In DocumentController.java
@PostMapping("/chat")
public ResponseEntity<?> chat(@RequestBody Map<String, String> payload) {
    String question = payload.get("question");
    String userId = payload.get("user_id");
    String filename = payload.get("filename"); // <--- Extract Filename
    
    // Pass it to the service
    String answer = aiService.askQuestion(question, userId, filename);
    return ResponseEntity.ok(Map.of("answer", answer));
}

    // --- NEW ENDPOINTS ---

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(@RequestParam("user_id") String userId) {
        return ResponseEntity.ok(aiService.getChatHistory(userId));
    }
    // Inside DocumentController class

@DeleteMapping("/history") // <--- NEW ENDPOINT
public ResponseEntity<?> clearHistory(@RequestParam("user_id") String userId) {
    aiService.clearChatHistory(userId);
    return ResponseEntity.ok(Map.of("message", "Chat history cleared"));
}

    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(@RequestParam("filename") String filename, 
                                    @RequestParam("user_id") String userId) {
        aiService.deleteDocument(filename, userId);
        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }
}