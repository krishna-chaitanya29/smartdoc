package com.example.smartdoc;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class SmartdocApplication {
	private static final Logger logger = LoggerFactory.getLogger(SmartdocApplication.class);

	public static void main(String[] args) {
		ConfigurableApplicationContext context = SpringApplication.run(SmartdocApplication.class, args);
		String activeProfile = context.getEnvironment().getActiveProfiles().length > 0 
			? context.getEnvironment().getActiveProfiles()[0] 
			: "default";
		logger.info("SmartDoc application started successfully on profile: {}", activeProfile);
	}

}
