import React, { useEffect, useRef, useState } from "react";
import { HeadsetIcon, ChatBubbleIcon, CloseIcon } from "../lib/icons.jsx";
import { useCart } from "../context/CartContext.jsx";

const DELAY_MS = 5000;
const VISIBLE_DURATION = 10 * 60 * 1000;
const CYCLE_MS = 10 * 60 * 1000;

export default function ProactiveChat() {
  const { isOpen: cartOpen } = useCart();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const cycleRef = useRef(null);
  const audioCtxRef = useRef(null);

  function clearAllTimers() {
    clearTimeout(timerRef.current);
    clearTimeout(hideTimerRef.current);
    clearTimeout(cycleRef.current);
  }

  function playChime() {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // silent fallback if audio is blocked
    }
  }

  function showNotification() {
    if (cartOpen) return;
    setMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
    playChime();
    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => setMounted(false), 300);
      cycleRef.current = setTimeout(showNotification, CYCLE_MS);
    }, VISIBLE_DURATION);
  }

  useEffect(() => {
    clearAllTimers();
    if (cartOpen) {
      setVisible(false);
      setTimeout(() => setMounted(false), 300);
      cycleRef.current = setTimeout(showNotification, CYCLE_MS);
      return clearAllTimers;
    }
    timerRef.current = setTimeout(showNotification, DELAY_MS);
    return clearAllTimers;
  }, [cartOpen]);

  function dismiss() {
    clearAllTimers();
    setVisible(false);
    setTimeout(() => setMounted(false), 300);
    cycleRef.current = setTimeout(showNotification, CYCLE_MS);
  }

  function handleChatClick() {
    dismiss();
    window.dispatchEvent(new Event("open-chat-panel"));
  }

  if (cartOpen || !mounted) return null;

  return (
    <div
      className={`fixed right-4 z-[65] transition-all duration-300 ease-out bottom-[calc(5rem+env(safe-area-inset-bottom))] sm:right-6 md:bottom-6 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="flex items-end gap-2">
        <button
          onClick={dismiss}
          className="focus-ring rounded-full bg-white/95 p-2 text-ink/60 shadow-lg ring-1 ring-ink/10 hover:bg-white hover:text-ink"
          aria-label="Dismiss notification"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
        <button
          onClick={handleChatClick}
          data-chat-fab="true"
          className="focus-ring relative flex items-center gap-2 rounded-full bg-signal-gradient pl-5 pr-6 py-3.5 font-600 text-white shadow-xl shadow-signal/30 transition-transform hover:scale-105"
          aria-label="Chat with us"
        >
          <HeadsetIcon className="h-5 w-5" />
          <span className="text-sm">We are here to assist</span>
        </button>
      </div>
    </div>
  );
}
