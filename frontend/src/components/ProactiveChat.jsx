import React, { useEffect, useRef, useState } from "react";
import { HeadsetIcon, ChatBubbleIcon, CloseIcon } from "../lib/icons.jsx";
import { useCart } from "../context/CartContext.jsx";

const DELAY_MS = 8000; // show after 8 seconds of idle
const TOOLTIP_DURATION = 5000; // tooltip/contact button stays for 5s
const VISIBLE_DURATION = 8000; // total visible time before auto-hide
const CYCLE_MS = 10 * 60 * 1000; // repeat every 10 minutes

export default function ProactiveChat() {
  const { isOpen: cartOpen } = useCart();
  const [visible, setVisible] = useState(false);
  const [tooltip, setTooltip] = useState(false);
  const [contactUs, setContactUs] = useState(false);
  const [muted, setMuted] = useState(false);
  const timerRef = useRef(null);
  const tooltipTimerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const cycleRef = useRef(null);
  const audioCtxRef = useRef(null);

  function clearAllTimers() {
    clearTimeout(timerRef.current);
    clearTimeout(tooltipTimerRef.current);
    clearTimeout(hideTimerRef.current);
    clearTimeout(cycleRef.current);
  }

  function showNotification() {
    if (muted || cartOpen) return;
    setVisible(true);
    setTooltip(true);
    playChime();
    tooltipTimerRef.current = setTimeout(() => {
      setTooltip(false);
      setContactUs(true);
    }, TOOLTIP_DURATION);
    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
      setTooltip(false);
      setContactUs(false);
      // schedule next appearance in 10 minutes
      cycleRef.current = setTimeout(showNotification, CYCLE_MS);
    }, VISIBLE_DURATION);
  }

  useEffect(() => {
    clearAllTimers();
    if (cartOpen) {
      setVisible(false);
      setTooltip(false);
      setContactUs(false);
      // reschedule after cart closes
      cycleRef.current = setTimeout(showNotification, CYCLE_MS);
      return;
    }
    // first appearance after delay
    timerRef.current = setTimeout(showNotification, DELAY_MS);
    return clearAllTimers;
  }, [cartOpen, muted]);

  function dismiss() {
    clearAllTimers();
    setVisible(false);
    setTooltip(false);
    setContactUs(false);
    // schedule next appearance in 10 minutes
    cycleRef.current = setTimeout(showNotification, CYCLE_MS);
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
