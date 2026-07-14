import React from "react";

export function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

export function Spinner({ className = "h-5 w-5" }) {
  return (
    <svg
      className={cx("animate-spin text-current", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

const buttonStyles = {
  primary:
    "bg-signal-gradient text-white hover:opacity-90 shadow-sm",
  dark: "bg-ink text-cream hover:bg-slateink",
  outline: "border border-ink/15 text-ink/70 hover:bg-ink/5",
  danger: "bg-signal text-white hover:bg-signal/90",
  ghost: "text-ink/60 hover:bg-ink/5",
};

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={cx(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-600 transition disabled:cursor-not-allowed disabled:opacity-50",
        buttonStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Field({ label, hint, children, className = "" }) {
  return (
    <label className={cx("block", className)}>
      <span className="text-xs font-600 uppercase tracking-wide text-ink/50">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="mt-1 block text-xs text-ink/40">{hint}</span>}
    </label>
  );
}

const inputBase =
  "focus-ring w-full rounded-xl border border-ink/10 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink/30";

export function Input(props) {
  return <input {...props} className={cx(inputBase, props.className || "")} />;
}

export function Textarea(props) {
  return <textarea {...props} className={cx(inputBase, "resize-y", props.className || "")} />;
}

export function Select(props) {
  return <select {...props} className={cx(inputBase, "appearance-none", props.className || "")} />;
}

const badgeStyles = {
  neutral: "bg-ink/5 text-ink/60",
  gold: "bg-gold/20 text-ink",
  signal: "bg-signal/15 text-signal",
  violet: "bg-violet/10 text-violet",
  green: "bg-emerald-100 text-emerald-700",
  red: "bg-red-100 text-red-700",
};

export function Badge({ tone = "neutral", className = "", children }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-600",
        badgeStyles[tone] || badgeStyles.neutral,
        className
      )}
    >
      {children}
    </span>
  );
}

export function Card({ className = "", children }) {
  return (
    <div className={cx("rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/5", className)}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, sub, tone = "neutral" }) {
  const accents = {
    neutral: "text-ink",
    signal: "text-signal",
    violet: "text-violet",
    gold: "text-gold",
  };
  return (
    <Card className="p-5">
      <p className="text-xs font-600 uppercase tracking-wide text-ink/40">{label}</p>
      <p className={cx("mt-1 font-display text-2xl font-700", accents[tone] || accents.neutral)}>
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-ink/40">{sub}</p>}
    </Card>
  );
}

export function EmptyState({ title, hint, action }) {
  return (
    <div className="rounded-3xl border border-dashed border-ink/10 bg-white/50 p-10 text-center">
      <p className="font-600 text-ink">{title}</p>
      {hint && <p className="mt-1 text-sm text-ink/40">{hint}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export function Drawer({ open, onClose, title, children, footer, width = "max-w-xl" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cx(
          "relative z-10 flex h-full w-full flex-col bg-cream shadow-2xl",
          width
        )}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
          <h2 className="font-display text-lg font-700 text-ink">{title}</h2>
          <button onClick={onClose} className="focus-ring rounded-full p-2 text-ink/40 hover:bg-ink/5">
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="border-t border-ink/10 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}

export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-ink/5">
        <h2 className="font-display text-lg font-700 text-ink">{title}</h2>
        <div className="mt-3">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
