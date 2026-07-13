import React, { useEffect, useRef, useState } from "react";
import { answer, SUGGESTED, WHATSAPP_LINK } from "../lib/chatbot.js";

function linkify(text) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return parts.map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noreferrer"
        className="text-signal underline break-all"
      >
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function timeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const GREETING = `🔌 ${timeGreeting()}! I'm Unplug Ur Plug, your Cboyistore assistant. Ask me anything about our phones, laptops, trade-in or delivery — or tap a question below.`;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: "bot", text: GREETING }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing, open]);

  function send(text) {
    const q = (text ?? input).trim();
    if (!q) return;
    setMessages((m) => [...m, { from: "user", text: q }]);
    setInput("");
    setTyping(true);
    // Small delay so the reply feels human and the typing indicator shows.
    setTimeout(() => {
      const reply = answer(q);
      setMessages((m) => [...m, { from: "bot", text: reply }]);
      setTyping(false);
    }, 450);
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="focus-ring fixed bottom-6 right-6 z-[70] flex items-center gap-2 rounded-full bg-signal-gradient px-5 py-3.5 font-600 text-white shadow-xl shadow-signal/30 transition-transform hover:scale-105"
        >
          <span className="text-lg">🔌</span> Plug me
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-[70] flex h-[32rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-ink/10">
          <div className="flex items-center justify-between bg-ink px-4 py-3 text-cream">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔌</span>
              <div>
                <p className="font-display text-sm font-700 leading-tight">Unplug Ur Plug</p>
                <p className="text-[11px] text-cream/60">Cboyistore assistant</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="focus-ring rounded-full p-1.5 text-cream/70 hover:bg-cream/10 hover:text-cream"
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-cream/40 p-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm ${
                    m.from === "user"
                      ? "bg-signal-gradient text-white"
                      : "bg-white text-ink ring-1 ring-ink/5"
                  }`}
                >
                  {linkify(m.text)}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white px-3.5 py-3 text-ink/50 ring-1 ring-ink/5">
                  <span className="animate-pulse">•••</span>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-1">
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="focus-ring rounded-full bg-white px-3 py-1.5 text-xs font-600 text-ink/70 ring-1 ring-ink/10 transition-colors hover:bg-ink hover:text-cream"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 border-t border-ink/10 bg-white p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Unplug Ur Plug…"
              className="focus-ring flex-1 rounded-full border border-ink/10 px-4 py-2.5 text-sm"
            />
            <button
              type="submit"
              aria-label="Send"
              className="focus-ring rounded-full bg-signal-gradient px-4 py-2.5 text-sm font-600 text-white"
            >
              ➤
            </button>
          </form>

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            className="block bg-cream/60 py-2 text-center text-[11px] text-ink/50 hover:text-ink"
          >
            Still stuck? Chat with us on WhatsApp 💬
          </a>
        </div>
      )}
    </>
  );
}
