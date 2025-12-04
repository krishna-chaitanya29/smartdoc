package com.example.smartdoc.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springdoc.core.customizers.OpenApiCustomizer;

@Configuration
public class SwaggerConfig {

	@Bean
	public OpenApiCustomizer customOpenApiCustomizer() {
		return openApi -> {
			openApi.getInfo()
				.title("SmartDoc API")
				.version("1.0.0")
				.description("Document Management API for SmartDoc");
		};
	}
}

