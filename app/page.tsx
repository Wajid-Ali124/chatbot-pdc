'use client';
import { askGemini } from "@/src/lib/gemini";
import { RAG } from "@/src/lib/RAG_API";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  type Message = { role: "user" | "bot"; text: string };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await RAG(input);
      const botMsg: Message = { role: "bot", text: reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: Message = { role: "bot", text: "Something went wrong. Please try again." };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      
      {/* Header */}
      <header className="p-5 shadow-md bg-white border-b border-gray-200 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900 tracking-wide">Iqra University Admission Policy Chatbot</h1>
      </header>

      {/* Optional Loading Bar */}
      {loading && (
        <div className="h-1 w-full bg-blue-100">
          <div className="h-full bg-blue-600 animate-pulse w-1/3"></div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-3 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-200">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xl px-5 py-3 rounded-2xl text-base shadow-md select-text break-words
                ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white border border-gray-300 text-gray-900 rounded-bl-none'
                }`}
              style={{ wordBreak: 'break-word' }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}

        {/* Loading Dots as Typing Indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-300 text-gray-500 rounded-2xl px-5 py-3 shadow-md">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-bounce" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 shadow-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-3 max-w-4xl mx-auto"
        >
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your message here..."
            className="flex-1 border border-gray-300 px-5 py-3 rounded-full shadow-md placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out resize-none"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 active:bg-blue-800 transition duration-200 ease-in-out font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
