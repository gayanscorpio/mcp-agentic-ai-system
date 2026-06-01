package com.mcp.server.registry;

import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Component;

import com.mcp.server.dto.ToolDefinition;

@Component
public class ToolRegistry {

	private final Map<String, ToolDefinition> tools = new HashMap<>();

	public ToolRegistry() {

		ToolDefinition weather = new ToolDefinition();
		weather.setName("weather.get");
		weather.setUrl("http://localhost:8081/api/weather");
		weather.setMethod("GET");

		weather.setDescription("Get weather details for a city or country");

		weather.setExampleInput(Map.of("city", "Colombo"));

		ToolDefinition finance = new ToolDefinition();

		finance.setName("finance.rates");
		finance.setUrl("http://localhost:8082/api/rates");
		finance.setMethod("GET");

		finance.setDescription("Get currency exchange rates such as USD to LKR");

		finance.setExampleInput(Map.of("base", "USD"));

		tools.put("weather.get", weather);
		tools.put("finance.rates", finance);
	}

	public ToolDefinition get(String tool) {
		return tools.get(tool);
	}

	public Map<String, ToolDefinition> getAll() {
		return tools;
	}
}
