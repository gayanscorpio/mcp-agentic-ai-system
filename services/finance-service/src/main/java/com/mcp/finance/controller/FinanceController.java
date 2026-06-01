package com.mcp.finance.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api")
@Slf4j
@RequiredArgsConstructor
public class FinanceController {

	private final RestTemplate restTemplate;

	@GetMapping("/rates")
	public String getRates() {

		log.info("=================================");
		log.info("💱 FINANCE API REQUEST RECEIVED");
		log.info("=================================");

		String url = "https://open.er-api.com/v6/latest/USD";

		log.info("📡 Calling External Exchange Rate API");
		log.info("URL: {}", url);

		try {

			HttpHeaders headers = new HttpHeaders();
			headers.set("User-Agent", "Mozilla/5.0");

			HttpEntity<String> entity = new HttpEntity<>(headers);

			ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

			log.info("✅ Finance API Response Received");

			if (response != null && response.getBody() != null) {
				log.info("📦 Response Length: {}", response.getBody().length());
				log.debug("📦 Full Response: {}", response.getBody());
			}

			log.info("=================================");
			log.info("✅ FINANCE REQUEST COMPLETED");
			log.info("=================================");

			return response.getBody();

		} catch (Exception e) {

			log.error("=================================");
			log.error("❌ FINANCE API ERROR");
			log.error("=================================");
			log.error("Message: {}", e.getMessage(), e);

			throw e;
		}
	}
}