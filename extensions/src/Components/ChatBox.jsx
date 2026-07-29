import { useState, useRef, useEffect } from "react";

function ChatBox({ messages, askAI, loading }) {
    const [message, setMessage] = useState("");
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    function send() {
        if (!message.trim() || loading) return;
        askAI(message.trim());
        setMessage("");
    }

    return (
        <div className="card">
            <h3>🤖 AI Assistant</h3>
            <br />

            <div className="chatHistory">
                {messages.length === 0 && (
                    <p className="chatEmpty">Ask me anything about your studies...</p>
                )}
                {messages.map((m, i) => (
                    <div key={i} className={`chatMsg ${m.role}`}>
                        <span className="chatLabel">{m.role === "user" ? "You" : "AI"}</span>
                        <p style={{ whiteSpace: "pre-wrap" }}>{m.content}</p>
                    </div>
                ))}
                {loading && (
                    <div className="chatMsg assistant">
                        <span className="chatLabel">AI</span>
                        <p>⏳ Thinking...</p>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <div className="chatInput">
                <textarea
                    rows="3"
                    placeholder="Ask your study assistant..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            send();
                        }
                    }}
                />
                <button onClick={send} disabled={loading}>
                    {loading ? "..." : "Send"}
                </button>
            </div>
        </div>
    );
}

export default ChatBox;
