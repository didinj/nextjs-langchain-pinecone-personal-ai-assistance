"use client";

import { useState } from "react";

type Message = {
  sender: "user" | "assistant";
  content: string;
};

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input })
      });

      const data = await res.json();

      const aiMessage: Message = {
        sender: "assistant",
        content: data.answer ?? "Sorry, I couldn’t find an answer."
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <div className="h-[400px] overflow-y-auto space-y-3 mb-4 px-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-[80%] ${
              msg.sender === "user"
                ? "bg-blue-100 self-end ml-auto text-right"
                : "bg-gray-200 self-start"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="italic text-gray-500">AI is thinking...</div>
        )}
      </div>
      <textarea
        className="w-full border rounded-md p-2 resize-none"
        rows={3}
        placeholder="Ask me anything..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={sendMessage}
        disabled={loading}
        className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
      >
        Send
      </button>
    </div>
  );
}
