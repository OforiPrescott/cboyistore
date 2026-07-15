import React, { useEffect, useRef, useState } from "react";
import { HeadsetIcon, ChatBubbleIcon, CloseIcon } from "../lib/icons.jsx";
import { useCart } from "../context/CartContext.jsx";

const DELAY_MS = 5000; // first notification after 5 seconds
const VISIBLE_DURATION = 10 * 60 * 1000; // stay visible for 10 minutes
const CYCLE_MS = 10 * 60 * 1000; // repeat every 10 minutes

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
    document.querySelector<HTMLElement>("[data-chat-fab]")?.click();
  }

  if (cartOpen || !mounted) return null;

  return (
    <div
      className={`fixed left-4 right-4 top-4 z-[65] sm:left-auto sm:right-6 sm:top-6 sm:w-80 transition-all duration-300 ease-out ${
        visible ? "translate-x-0 opacity-100" : "-translate-x-full sm:translate-x-full opacity-0"
      }`}
    >
      <div className="rounded-2xl bg-white shadow-2xl ring-1 ring-ink/10 overflow-hidden">
        <div className="flex items-start gap-3 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-signal-gradient shadow-lg shadow-signal/30">
            <HeadsetIcon className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-700 text-ink">We are here to assist</p>
            <p className="mt-0.5 text-xs text-ink/60 leading-relaxed">
              Need help with a product, order or delivery? Our team is online.
            </p>
          </div>
          <button
            onClick={dismiss}
            className="focus-ring shrink-0 rounded-full p-1 text-ink/40 hover:bg-ink/5 hover:text-ink"
            aria-label="Dismiss"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="border-t border-ink/5 bg-cream/40 px-4 py-2.5 flex items-center justify-between">
          <span className="text-[11px] text-ink/50">We typically reply in minutes</span>
          <button
            onClick={handleChatClick}
            className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-signal-gradient px-4 py-1.5 text-xs font-600 text-white shadow-md shadow-signal/20 hover:opacity-90 transition-opacity"
          >
            <ChatBubbleIcon className="h-3.5 w-3.5" /> Contact us
          </button>
        </div>
      </div>
    </div>
  );
}
