import React, { useEffect, useRef, useState } from "react";
import { HeadsetIcon, ChatBubbleIcon, CloseIcon } from "../lib/icons.jsx";
import { useCart } from "../context/CartContext.jsx";

const DELAY_MS = 8000; // show after 8 seconds
const TOOLTIP_DURATION = 6000; // tooltip stays for 6 seconds
const COOLDOWN_MS = 120_000; // don't re-show for 2 minutes

export default function ProactiveChat() {
  const { isOpen: cartOpen } = useCart();
  const [visible, setVisible] = useState(false);
  const [tooltip, setTooltip] = useState(false);
  const [contactUs, setContactUs] = useState(false);
  const [muted, setMuted] = useState(false);
  const timerRef = useRef(null);
  const tooltipTimerRef = useRef(null);
  const cooldownRef = useRef(null);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    if (cartOpen) return;

    timerRef.current = setTimeout(() => {
      setVisible(true);
      setTooltip(true);
      if (!muted) playChime();
      tooltipTimerRef.current = setTimeout(() => {
        setTooltip(false);
        setContactUs(true);
      }, TOOLTIP_DURATION);
    }, DELAY_MS);

    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(tooltipTimerRef.current);
      clearTimeout(cooldownRef.current);
    };
  }, [cartOpen, muted]);

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

  function dismiss() {
    setVisible(false);
    setTooltip(false);
    setContactUs(false);
    cooldownRef.current = setTimeout(() => {
      setVisible(false);
      setTooltip(false);
      setContactUs(false);
    }, COOLDOWN_MS);
  }

  function handleChatClick() {
    dismiss();
    document.querySelector<HTMLElement>("[data-chat-fab]")?.click();
  }

  if (cartOpen || !visible) return null;

  return (
    <div className="fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-[65] flex items-end gap-2 sm:right-6 sm:bottom-6">
      {tooltip && (
        <div className="max-w-[14rem] rounded-2xl bg-white px-4 py-3 text-sm text-ink shadow-xl ring-1 ring-ink/10 animate-bounce">
          <p className="font-600">We are here to assist</p>
          <p className="mt-0.5 text-xs text-ink/60">Need help with a product, order or delivery?</p>
        </div>
      )}
      {contactUs && (
        <button
          onClick={dismiss}
          className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-600 text-ink shadow-lg ring-1 ring-ink/10 hover:bg-ink/5"
        >
          <ChatBubbleIcon className="h-4 w-4 text-signal" /> Contact us for assistance
        </button>
      )}
      <div className="relative flex items-center gap-2">
        {!muted && (
          <button
            onClick={() => setMuted(true)}
            className="focus-ring rounded-full bg-white/90 p-2 text-ink/50 shadow ring-1 ring-ink/10 hover:text-ink"
            aria-label="Mute notification"
            title="Mute"
          >
            🔊
          </button>
        )}
        <button
          onClick={handleChatClick}
          data-chat-fab="true"
          className="focus-ring relative flex h-14 w-14 items-center justify-center rounded-full bg-signal-gradient shadow-xl shadow-signal/30 transition-transform hover:scale-105"
          aria-label="Chat with us"
        >
          <HeadsetIcon className="h-6 w-6 text-white" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-700 text-signal ring-2 ring-signal">1</span>
        </button>
      </div>
    </div>
  );
}
