import React, { useEffect, useState } from "react";
import { DownloadIcon, CloseIcon } from "../lib/icons.jsx";

export default function PWAInstallPrompt() {
  const [deferred, setDeferred] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e) => {
      e.preventDefault();
      setDeferred(e);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function install() {
    if (!deferred) return;
    deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    }
    setDeferred(null);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-20 z-[60] flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl bg-ink px-5 py-3.5 shadow-2xl ring-1 ring-white/10">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-signal/20 text-signal">
          <DownloadIcon className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-700 text-cream">Install Cboyistore</p>
          <p className="text-xs text-cream/60">Add to home screen for faster browsing</p>
        </div>
        <button
          onClick={install}
          className="focus-ring rounded-full bg-signal-gradient px-4 py-2 text-xs font-700 text-white shadow-lg shadow-signal/30"
        >
          Install
        </button>
        <button
          onClick={() => setVisible(false)}
          aria-label="Dismiss"
          className="focus-ring rounded-full p-1.5 text-cream/60 hover:text-cream"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
