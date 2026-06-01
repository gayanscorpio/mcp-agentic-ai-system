package com.mcp.server.dto;

import java.util.Map;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ToolDefinition {

	private String name;
	private String url;
	private String method;
	private String description;
	private Object exampleInput;

	private Map<String, String> queryParams;
}
