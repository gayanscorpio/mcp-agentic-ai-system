package com.mcp.server.controller;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mcp.server.dto.ToolDefinition;
import com.mcp.server.registry.ToolRegistry;
import com.mcp.server.service.ToolExecutionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/tools")
@RequiredArgsConstructor
public class ToolController {

	private static final Logger log = LogManager.getLogger(ToolController.class);

	private final ToolRegistry registry;

	private final ToolExecutionService toolExecutionService;

	@PostMapping("/{tool}")
	public ResponseEntity<?> execute(@PathVariable String tool,
			@RequestBody(required = false) Map<String, String> input) {

		log.info("Available tools: {}", registry.getAll().keySet());

		log.info("=================================");
		log.info("MCP TOOL EXECUTION REQUEST");
		log.info("=================================");
		log.info("Tool Name : {}", tool);
		log.info("Tool Input: {}", input);

		ToolDefinition definition = registry.get(tool);

		if (definition == null) {
			log.error("Unknown tool requested: {}", tool);
			return ResponseEntity.badRequest().body(Map.of("error", "Unknown tool"));

		}
		try {

			log.info("Tool Definition Found");
			log.info("URL    : {}", definition.getUrl());
			log.info("Method : {}", definition.getMethod());

			String response = toolExecutionService.execute(definition, input);

			log.info("Tool execution successful");
			log.info("Returning response to orchestrator");

			return ResponseEntity.ok(Map.of("tool", tool, "response", response));

		} catch (Exception e) {

			log.error("=================================");
			log.error("MCP TOOL EXECUTION FAILED");
			log.error("=================================");
			log.error("Tool: {}", tool);
			log.error("Error: {}", e.getMessage(), e);

			return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
		}
	}

	@GetMapping
	public Map<String, ToolDefinition> getAllTools() {
		log.info("getAllTools ...............");
		return registry.getAll();
	}

	@GetMapping("/health")
	public ResponseEntity<?> health() {
		log.info("Health check requested");

		return ResponseEntity.ok(Map.of("status", "UP", "service", "mcp-server"));
	}
}
