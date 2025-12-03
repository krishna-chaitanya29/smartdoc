package com.example.smartdoc.service;

import com.example.smartdoc.model.ChatLog;
import com.example.smartdoc.repository.ChatLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIService {

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ChatLogRepository chatLogRepository; // <--- The Database Connection

    // 1. UPLOAD
    public String uploadDocument(MultipartFile file, String userId) throws IOException {
        String url = aiServiceUrl + "/ingest";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("user_id", userId);

        ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() { return file.getOriginalFilename(); }
        };
        body.add("file", fileResource);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);
            return "Success: " + response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("AI Service Upload Failed: " + e.getMessage());
        }
    }

    // 2. CHAT (Now with Saving!)
    // In AIService.java
public String askQuestion(String question, String userId, String filename) { // <--- Added filename
    String url = aiServiceUrl + "/ask";

    Map<String, String> requestBody = Map.of(
        "question", question, 
        "user_id", userId
        // We don't necessarily need to send filename to Python if Python doesn't use it, 
        // but we MUST use it for the DB below.
    );
    
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);
    
    try {
        ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);
        String answer = (String) response.getBody().get("answer");

        // --- SAVE TO DATABASE ---
        ChatLog log = new ChatLog();
        log.setUsername(userId);
        log.setQuestion(question);
        log.setAnswer(answer);
        log.setFileName(filename); // <--- NOW SAVING FILENAME!
        log.setTimestamp(LocalDateTime.now());
        chatLogRepository.save(log);

        return answer;
    } catch (Exception e) {
         return "Error: " + e.getMessage();
    }
}
    // 3. DELETE (From Python + DB)
    public void deleteDocument(String filename, String userId) {
        // Delete from Python (Vectors)
        String url = aiServiceUrl + "/delete";
        Map<String, String> requestBody = Map.of("filename", filename, "user_id", userId);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);
        restTemplate.postForEntity(url, requestEntity, Map.class);

        // Delete from SQL History
        // Note: For now, we only delete vectors. You can uncomment below to wipe chat history too.
        // chatLogRepository.deleteByUsername(userId);
    }

    // 4. GET HISTORY
    public List<ChatLog> getChatHistory(String username) {
        return chatLogRepository.findByUsername(username);
    }
    @Transactional // <--- IMPORTANT: Required for delete operations
public void clearChatHistory(String userId) {
    chatLogRepository.deleteByUsername(userId);
}
}