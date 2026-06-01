package com.mcp.server.service;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.mcp.server.dto.ToolDefinition;

@Service
public class ToolExecutionService {

	private static final Logger log = LoggerFactory.getLogger(ToolExecutionService.class);

	public String execute(ToolDefinition tool, Map<String, String> input) {

		long start = System.currentTimeMillis();
		RestTemplate restTemplate = new RestTemplate();

		try {

			log.info("=================================");
			log.info("🚀 TOOL EXECUTION STARTED");
			log.info("=================================");

			log.info("Tool Name : {}", tool.getName());
			log.info("Method    : {}", tool.getMethod());
			log.info("Base URL  : {}", tool.getUrl());
			log.info("Input     : {}", input);

			if ("GET".equalsIgnoreCase(tool.getMethod())) {

				UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(tool.getUrl());
				if (input != null) {
					input.forEach(builder::queryParam);
				}

				String finalUrl = builder.toUriString();
				log.info("Final URL : {}", finalUrl);

				String response = restTemplate.getForObject(finalUrl, String.class);

				long duration = System.currentTimeMillis() - start;

				log.info("✅ TOOL EXECUTION SUCCESS");
				log.info("Duration  : {} ms", duration);

				return response;
			}

			throw new UnsupportedOperationException("Only GET supported for now");

		} catch (Exception e) {

			long duration = System.currentTimeMillis() - start;

			log.error("=================================");
			log.error("❌ TOOL EXECUTION FAILED");
			log.error("=================================");
			log.error("Tool      : {}", tool.getName());
			log.error("Error     : {}", e.getMessage());
			log.error("Duration  : {} ms", duration);
			log.error("Exception :", e);

			throw e;
		}
	}

}