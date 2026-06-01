import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../index.css";

function ChatWindow() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const chatEndRef = useRef(null);

    const addLog = (log) => {
        setLogs((prev) => [...prev, log]);
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const sendMessage = async () => {
        if (!message.trim()) return;

        const userMsg = { role: "user", content: message };
        setMessages((prev) => [...prev, userMsg]);

        setMessage("");
        setLoading(true);
        setLogs([]);

        try {
            addLog("🚀 Sending request to MCP Orchestrator");

            const res = await axios.post("http://localhost:8080/chat", {
                message: userMsg.content,
            });

            addLog("✅ Response received from backend");

            const data = res.data;

            // TOOL RESPONSE
            if (data.type === "tool") {
                addLog(`🛠 Tool executed: ${data.tool}`);

                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: JSON.stringify(data.data, null, 2),
                        type: "tool",
                    },
                ]);

                // AGENTIC RESPONSE
            } else if (data.type === "agentic-mcp") {
                addLog("🧠 Agentic flow executed");

                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: JSON.stringify(data, null, 2),
                        type: "agent",
                    },
                ]);

                // NORMAL LLM RESPONSE
            } else {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: data.answer,
                    },
                ]);
            }

        } catch (err) {
            addLog("❌ Error calling backend");

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Error: " + err.message,
                },
            ]);
        }

        setLoading(false);
    };

    return (
        <div className="chat-container">

            {/* HEADER */}
            <div className="chat-header">
                🧠 MCP Agentic Chat System
            </div>

            {/* CHAT AREA */}
            <div className="chat-box">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`message ${msg.role === "user"
                            ? "user"
                            : "assistant"
                            }`}
                    >
                        <pre>{msg.content}</pre>
                    </div>
                ))}

                {loading && (
                    <div className="thinking">
                        🧠 MCP is thinking...
                    </div>
                )}

                <div ref={chatEndRef} />
            </div>

            {/* INPUT AREA */}
            <div className="input-box">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask MCP anything..."
                    rows={2}
                />

                <button onClick={sendMessage}>
                    Send
                </button>
            </div>

            {/* DEBUG PANEL */}
            <div className="debug">
                <h4>🔍 MCP Execution Logs</h4>
                {logs.map((l, i) => (
                    <div key={i}>• {l}</div>
                ))}
            </div>

        </div>
    );
}

export default ChatWindow;