package com.mcp.weather.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class WeatherController {

	private final RestTemplate restTemplate;

	@GetMapping("/weather")
	public String getWeather(@RequestParam String city) {

		log.info("RAW city: [{}]", city);
		// 🔥 FORCE CLEAN INPUT
		String cleanCity = URLDecoder.decode(city, StandardCharsets.UTF_8);

		log.info("DECODED city: [{}]", cleanCity);

		log.info("=================================");
		log.info("🌦 WEATHER API REQUEST RECEIVED");
		log.info("=================================");

		log.info("Location received: [{}]", city);

		// 1. Get coordinates
		String geoApi = "https://geocoding-api.open-meteo.com/v1/search?name={name}";
		ResponseEntity<String> geoResponse = restTemplate.getForEntity(geoApi, String.class, cleanCity);

		ObjectMapper mapper = new ObjectMapper();
		JsonNode geoRoot;

		try {
			geoRoot = mapper.readTree(geoResponse.getBody());
		} catch (Exception e) {
			throw new RuntimeException(e);
		}

		log.info("Location received: {}", city);
		log.info("Geocoding response: {}", geoResponse.getBody());
		JsonNode results = geoRoot.path("results");

		if (!results.isArray() || results.size() == 0) {
			throw new RuntimeException("No geocoding results found for location: " + city);
		}

		JsonNode first = results.get(0);

		double lat = first.path("latitude").asDouble();
		double lon = first.path("longitude").asDouble();

		// 2. Call weather API
		String api = "https://api.open-meteo.com/v1/forecast" + "?latitude=" + lat + "&longitude=" + lon
				+ "&current_weather=true";

		log.info("📡 Calling External Weather API");
		log.info("URL: {}", api);

		try {

			HttpHeaders headers = new HttpHeaders();
			headers.set("User-Agent", "Mozilla/5.0");
			HttpEntity<String> entity = new HttpEntity<>(headers);

			ResponseEntity<String> response = restTemplate.exchange(api, HttpMethod.GET, entity, String.class);

			log.info("✅ Weather API Response Received");

			if (response != null) {
				log.info("📦 Response Length: {}", response.getBody().length());
				log.debug("📦 Full Response: {}", response);
			}

			log.info("=================================");
			log.info("✅ WEATHER REQUEST COMPLETED");
			log.info("=================================");

			return response.getBody();

		} catch (Exception e) {

			log.error("=================================");
			log.error("❌ WEATHER API ERROR");
			log.error("=================================");

			log.error("Error Message: {}", e.getMessage());

			log.error("Exception: ", e);

			throw e;
		}
	}
}