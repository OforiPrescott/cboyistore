import React, { useEffect, useRef, useState } from "react";
import { answer, SUGGESTED, WHATSAPP_LINK } from "../lib/chatbot.js";
import { useCart } from "../context/CartContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { fetchProducts } from "../lib/api.js";
import ProductModal from "./ProductModal.jsx";
import {
  PlugIcon,
  MicIcon,
  SendIcon,
  CloseIcon,
  ChatBubbleIcon,
  WhatsAppIcon,
  ShoppingBagIcon,
} from "../lib/icons.jsx";

function linkify(text) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return parts.map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noreferrer" className="text-signal underline break-all">
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

const ASSISTANT_GREETING = `${timeGreeting()}! I'm Unplug Ur Plug — your Cboyistore assistant. Ask me anything about our phones, laptops, trade-in, delivery, warranty or payments.`;

const SHOP_GREETING = `${timeGreeting()}! I'm your shopping assistant — search the catalogue by typing a product, brand or category (e.g. "iPhone 17", "MacBook", "PS5").`;

function ProductCardInline({ product, onAdd }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="flex cursor-pointer flex-col overflow-hidden rounded-xl bg-cream/80 ring-1 ring-ink/5 transition-colors hover:ring-ink/15"
      >
        <img
          src={product.images?.[0] || product.image}
          alt={product.name}
          className="h-20 w-full object-cover"
        />
        <div className="p-2">
          <p className="text-[11px] font-700 text-ink leading-snug line-clamp-1">{product.name}</p>
          <p className="text-[10px] font-600 text-signal">{product.price ? `${product.price.toLocaleString()} GHS` : ""}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(product);
            }}
            className="focus-ring mt-1 w-full rounded-lg bg-ink py-1.5 text-[10px] font-700 text-cream"
          >
            Add to cart
          </button>
        </div>
      </div>
      {open && (
        <ProductModal
          product={product}
          onClose={() => setOpen(false)}
          onAdd={(variant) => {
            onAdd(product, variant);
            setOpen(false);
          }}
        />
      )}
    </>
  );
}

export default function UnifiedChat() {
  const { addItem } = useCart();
  const { modalOpen } = useUI();
  const [mode, setMode] = useState("assistant"); // "assistant" | "shop"
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: "bot", text: ASSISTANT_GREETING, mode: "assistant" }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [catalog, setCatalog] = useState([]);
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);
  const typingTimer = useRef(null);

  useEffect(() => {
    fetchProducts({}).then(setCatalog).catch(() => {});
  }, []);

  useEffect(() => {
    return () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing, open, mode]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || "")
        .join(" ")
        .trim();
      if (transcript) {
        setInput(transcript);
        send(transcript);
      }
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, []);

  function switchMode(newMode) {
    setMode(newMode);
    const greeting = newMode === "assistant" ? ASSISTANT_GREETING : SHOP_GREETING;
    setMessages((m) => [...m, { from: "bot", text: greeting, mode: newMode }]);
  }

  function findProducts(query) {
    const q = query.toLowerCase();
    if (!q || catalog.length === 0) return [];
    return catalog.filter((p) => {
      const hay = `${p.name} ${p.brand} ${p.category} ${p.spec || ""}`.toLowerCase();
      const words = q.split(/\s+/).filter(Boolean);
      return words.some((w) => hay.includes(w));
    });
  }

  function send(text) {
    const q = (text ?? input).trim();
    if (!q) return;
    setMessages((m) => [...m, { from: "user", text: q, mode }]);
    setInput("");
    setTyping(true);

    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      if (mode === "shop") {
        const products = findProducts(q);
        if (products.length > 0) {
          const names = products.slice(0, 4).map((p) => p.name).join(", ");
          setMessages((m) => [
            ...m,
            {
              from: "bot",
              text: `Found ${products.length} result${products.length > 1 ? "s" : ""} for "${q}": ${names}. Tap Add to cart directly, or say "show more" for the full list.`,
              mode: "shop",
              products: products.slice(0, 4),
            },
          ]);
        } else {
          setMessages((m) => [
            ...m,
            {
              from: "bot",
              text: `No products matched "${q}". Try a different keyword like "iPhone", "Samsung", "MacBook", "PS5" or "watch".`,
              mode: "shop",
            },
          ]);
        }
      } else {
        const reply = answer(q);
        setMessages((m) => [...m, { from: "bot", text: reply, mode: "assistant" }]);
      }
      setTyping(false);
    }, 500);
  }

  return (
    <>
      {!open && !modalOpen && (
        <button
          onClick={() => setOpen(true)}
          className="focus-ring fixed right-4 z-[70] flex items-center gap-2 rounded-full bg-signal-gradient px-5 py-3.5 font-600 text-white shadow-xl shadow-signal/30 transition-transform hover:scale-105 bottom-[calc(6rem+env(safe-area-inset-bottom))] sm:right-6 md:bottom-6"
        >
          <ChatBubbleIcon className="h-5 w-5" /> Chat with us
        </button>
      )}

      {open && (
        <div className="fixed inset-x-0 bottom-0 z-[70] flex max-h-[92vh] flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl ring-1 ring-ink/10 sm:bottom-6 sm:right-6 sm:left-auto sm:max-w-[24rem] sm:rounded-3xl sm:border sm:border-ink/10">
          <div className="flex items-center justify-between bg-ink px-4 py-3 text-cream">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-signal/20 text-gold">
                <PlugIcon className="h-4 w-4" />
              </span>
              <div>
                <p className="font-display text-sm font-700 leading-tight">Unplug Ur Plug</p>
                <p className="text-[11px] text-cream/60">
                  {mode === "shop" ? "Shopping assistant · browse & add to cart" : "Support · FAQs & order help"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="focus-ring rounded-full p-1.5 text-cream/70 hover:bg-cream/10 hover:text-cream"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 border-b border-ink/10 bg-cream/40 px-2 py-1.5">
            <button
              onClick={() => mode !== "assistant" && switchMode("assistant")}
              className={`focus-ring flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-600 transition-colors ${
                mode === "assistant"
                  ? "bg-white text-ink shadow-sm ring-1 ring-ink/10"
                  : "text-ink/50 hover:text-ink"
              }`}
            >
              <ChatBubbleIcon className="h-3.5 w-3.5" />
              Assistant
            </button>
            <button
              onClick={() => mode !== "shop" && switchMode("shop")}
              className={`focus-ring flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-600 transition-colors ${
                mode === "shop"
                  ? "bg-white text-ink shadow-sm ring-1 ring-ink/10"
                  : "text-ink/50 hover:text-ink"
              }`}
            >
              <ShoppingBagIcon className="h-3.5 w-3.5" />
              Shop
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-cream/40 p-4">
            {messages
              .filter((m) => !m.mode || m.mode === mode)
              .map((m, i) => (
                <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm ${
                      m.from === "user"
                        ? "bg-signal-gradient text-white"
                        : "bg-white text-ink ring-1 ring-ink/5"
                    }`}
                  >
                    {linkify(m.text)}
                    {m.products && m.products.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {m.products.map((p) => (
                          <ProductCardInline key={p.id} product={p} onAdd={(variant) => addItem(p, variant)} />
                        ))}
                      </div>
                    )}
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
              {(mode === "assistant" ? SUGGESTED : SUGGESTED.slice(0, 5)).map((q) => (
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
              placeholder={mode === "shop" ? "Try 'iPhone 17' or 'PS5'…" : "Ask Unplug Ur Plug…"}
              className="focus-ring flex-1 rounded-full border border-ink/10 px-4 py-2.5 text-sm"
            />
            <button
              type="button"
              onClick={() => {
                if (!recognitionRef.current) return;
                if (listening) {
                  recognitionRef.current.stop();
                  setListening(false);
                } else {
                  recognitionRef.current.start();
                  setListening(true);
                }
              }}
              aria-label="Voice input"
              className={`focus-ring rounded-full px-3 py-2.5 text-sm font-600 ${listening ? "bg-gold text-ink" : "bg-cream text-ink/70"}`}
            >
              <MicIcon className="h-4 w-4" />
            </button>
            <button
              type="submit"
              aria-label="Send"
              className="focus-ring rounded-full bg-signal-gradient px-4 py-2.5 text-sm font-600 text-white"
            >
              <SendIcon className="h-4 w-4" />
            </button>
          </form>

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 bg-cream/60 py-2 text-center text-[11px] text-ink/50 hover:text-ink"
          >
            <WhatsAppIcon className="h-3.5 w-3.5 text-emerald-600" /> Still stuck? Chat with us on WhatsApp
          </a>
        </div>
      )}
    </>
  );
}
