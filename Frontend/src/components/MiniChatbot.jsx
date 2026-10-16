// MiniChatbot.jsx
// Frontend-only chatbot: calls Gemini directly. Black background, white text.
import { useState, useRef, useEffect } from "react";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Models are tried in order. If one fails, the next one is used.
// Fast and cheap models first, bigger models last.
const MODELS = [
  "gemini-flash-latest",
  "gemini-flash-lite-latest",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash-001",
  "gemini-2.0-flash-lite-001",
  "gemini-3-flash-preview",
  "gemini-2.5-pro",
  "gemini-pro-latest",
];

// Instructions that tell the bot about the website
const SYSTEM_PROMPT = `
You are the helpful assistant of a solar and electricity calculator website.
The website has an "All Appliances" calculator page where users select
their home appliances and the site calculates the total load, units and
the solar system size they need.
When asked, explain the website and its features in detail.
If someone wants to contact the company owner, share:
Gmail: wk0644365@gmail.com
WhatsApp: 03155988771
Reply in the same language the user writes in (English, Urdu or Roman Urdu).
`;

async function askGemini(messages) {
  // Convert our messages to the Gemini format
  const contents = messages.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.text }],
  }));

  let lastError = "Unknown error";

  for (const model of MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": API_KEY,
          },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        lastError = data?.error?.message || `Error ${res.status}`;
        console.error(`Model ${model} failed:`, lastError);

        // 401/403 means the API key itself is bad (invalid or leaked).
        // Other models will fail too, so stop here.
        if (res.status === 401 || res.status === 403) break;

        continue; // 404, 429, 500, 503 etc: try the next model
      }

      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply) return reply;

      // Empty reply (for example blocked by safety filters): try the next model
      lastError = "Empty reply from " + model;
    } catch (err) {
      // Network error: try the next model
      lastError = err.message;
    }
  }

  throw new Error(lastError);
}

export default function MiniChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! Ask me anything about our solar calculator." },
  ]);
  const bottomRef = useRef(null);

  // Scroll to the latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const updated = [...messages, { role: "user", text }];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const reply = await askGemini(updated);
      setMessages([...updated, { role: "bot", text: reply }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...updated,
        { role: "bot", text: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: 12, right: 12, zIndex: 9999 }}>
      {open && (
        <div
          style={{
            width: "min(320px, calc(100vw - 24px))",
            height: "min(420px, calc(100dvh - 96px))",
            background: "#000",
            color: "#fff",
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            marginBottom: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: 12, borderBottom: "1px solid #333", fontWeight: 600 }}>
            Solar Assistant
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  textAlign: m.role === "user" ? "right" : "left",
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: 10,
                    background: m.role === "user" ? "#2563eb" : "#111",
                    color: "#fff",
                    maxWidth: "85%",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {m.text}
                </span>
              </div>
            ))}
            {loading && <div style={{ color: "#aaa" }}>Typing...</div>}
            <div ref={bottomRef} />
          </div>

          <div style={{ display: "flex", borderTop: "1px solid #333" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your question..."
              style={{
                flex: 1,
                padding: 10,
                background: "#000",
                color: "#fff",
                border: "none",
                outline: "none",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                padding: "0 16px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#000",
          color: "#fff",
          border: "1px solid #444",
          fontSize: 24,
          cursor: "pointer",
        }}
      >
        {open ? "×" : "💬"}
      </button>
    </div>
  );
}