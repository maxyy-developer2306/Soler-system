import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

// Models are tried from top to bottom. Add or remove names here as needed.
const MODELS = [
  "gemini-flash-lite-latest", // tried first
  "gemini-3.8-flash",
  "gemini-3.8-flash-lite",
  "gemini-3.7-flash",
  "gemini-3.5-flash",
  "gemini-3.1-flash",
  "gemini-3-flash",
  "gemini-flash-latest",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

// Models that returned 404 (removed or wrong name) are skipped next time
const deadModels = new Set();

// Change this to your real website / company name
const SITE_NAME = "Solar Calculator Website";

// Owner contact details (shared only when the user asks for them)
const OWNER_EMAIL = "wk0644365@gmail.com";
const OWNER_WHATSAPP = "03155988771";

// Everything the chatbot should know about the website
const SYSTEM_PROMPT = `
You are the friendly AI assistant of "${SITE_NAME}".

ABOUT THE WEBSITE:
- The website helps people calculate their household electricity usage and find out what size of solar system they need.
- It has an "All Appliances Calculator" page.
- On that page the user sees a table of household appliances. For each appliance the user enters:
  1. Quantity (how many of that appliance)
  2. Days (how many days per month it is used)
  3. Hours/Day (how many hours per day it runs)
- The user then clicks the "Calculate" button.

APPLIANCES AND THEIR FIXED WATTAGE IN THE CALCULATOR:
- Lights: 24W
- Air Conditioner: 1500W
- Refrigerator: 150W
- Fan: 80W
- Television: 120W
- Computer: 200W
- Iron: 1000W
- Kitchen Appliance: 1000W
- Microwave: 1200W
- Washing Machine: 500W

HOW THE CALCULATION WORKS:
- Units (kWh) for each appliance = (Watts x Quantity x Days x Hours per day) / 1000
- Monthly Usage = sum of the units of all appliances (estimated for 30 days)
- Daily Usage = Monthly Usage / 30
- Connected Load = sum of (Watts x Quantity) of all appliances
- Recommended Solar System (kW) = Daily Usage / 5 (5 peak sun hours per day) / 0.8 (20% system losses)
- Number of Solar Panels = Recommended Solar System / 0.55, rounded up (each panel is 550W)

RESULTS SHOWN TO THE USER:
- Daily Usage (kWh)
- Monthly Usage (kWh)
- Connected Load (W)
- Recommended Solar size (kW) and the number of 550W panels needed

IMPORTANT NOTES:
- The results are estimates. Real electricity use and the right solar system size can differ, so for an exact design the user should contact the owner.
- If the user asks how to use the calculator, explain it step by step with full details.
- If the user asks about something that is not on the website, say clearly that you do not have that information and suggest contacting the owner. Never invent prices, offers, addresses or services.

OWNER CONTACT (share ONLY when the user asks to contact the owner/company, wants a quote, or needs help beyond the calculator):
- Gmail: ${OWNER_EMAIL}
- WhatsApp: ${OWNER_WHATSAPP}

GENERAL BEHAVIOR:
- You can also answer general questions about solar energy, solar panels, batteries, inverters, electricity, appliances, technology, programming, education and everyday topics. Do not restrict yourself to the website only.
- Reply in the same language the user writes in (English, Urdu, Roman Urdu, etc.).
- Keep answers simple, clear and easy to understand.
`;

// Checks an error object for a specific HTTP status code
const hasCode = (error, code) =>
  error?.status === code ||
  error?.code === code ||
  String(error?.message).includes(String(code));

// On these errors we move on to the next model
const shouldTryNext = (error) =>
  hasCode(error, 503) || // server busy
  hasCode(error, 429) || // rate limit
  hasCode(error, 404) || // model removed or wrong name
  hasCode(error, 500); // server error

function MiniChatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! 👋 I am your AI Assistant. How can I help you?",
    },
  ]);

  // Sends the message to Gemini, falling back to the next model on failure
  const getAIResponse = async (userMessage) => {
    let lastError;

    for (const model of MODELS) {
      if (deadModels.has(model)) continue;

      try {
        const response = await ai.models.generateContent({
          model,
          contents: userMessage,
          config: {
            systemInstruction: SYSTEM_PROMPT,
          },
        });

        console.log("Answered by:", model);
        return response.text;
      } catch (error) {
        console.log(`Model ${model} failed:`, error);
        lastError = error;

        if (hasCode(error, 404)) {
          deadModels.add(model);
        }

        // Errors like an invalid API key will fail on every model, so stop
        if (!shouldTryNext(error)) {
          throw error;
        }
      }
    }

    throw lastError || new Error("No model available");
  };

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    setMessages((old) => [...old, { sender: "user", text: userMessage }]);
    setMessage("");
    setLoading(true);

    try {
      const reply = await getAIResponse(userMessage);
      setMessages((old) => [...old, { sender: "bot", text: reply }]);
    } catch (error) {
      console.log("Gemini Error:", error);

      let text = "Sorry, I could not get a response. Please try again.";

      if (hasCode(error, 429)) {
        text = "Too many requests right now. Please try again in a little while.";
      } else if (hasCode(error, 503)) {
        text = "The server is busy. Please try again in a moment.";
      }

      setMessages((old) => [...old, { sender: "bot", text }]);
    }

    setLoading(false);
  };

  // Send the message when Enter is pressed
  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="w-80 h-96 bg-black border border-slate-700 rounded-lg shadow-lg flex flex-col mb-3">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 rounded-t-lg flex justify-between items-center border-b border-slate-700">
            <div>
              <h2 className="font-bold">AI Assistant</h2>
              <p className="text-xs text-slate-300">Ask me anything</p>
            </div>

            <button onClick={() => setOpen(false)} className="text-xl">
              ×
            </button>
          </div>

          {/* Chat area: black background */}
          <div className="flex-1 overflow-y-auto p-3 bg-black">
            {messages.map((item, index) => (
              <div
                key={index}
                className={`mb-3 flex ${
                  item.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-2 rounded-lg max-w-[80%] text-sm whitespace-pre-wrap ${
                    item.sender === "user"
                      ? "bg-white text-black"
                      : "bg-black text-white font-medium border border-slate-700"
                  }`}
                >
                  {item.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-sm text-slate-400">Thinking...</div>
            )}
          </div>

          {/* Input area */}
          <div className="p-3 border-t border-slate-700 bg-black flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className="flex-1 bg-slate-900 text-white placeholder-slate-400 border border-slate-700 rounded-lg px-3 py-2 outline-none"
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-white text-black px-4 rounded-lg font-medium disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Floating open button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-slate-900 text-white w-14 h-14 rounded-full shadow-lg text-xl"
        >
          💬
        </button>
      )}
    </div>
  );
}

export default MiniChatbot;