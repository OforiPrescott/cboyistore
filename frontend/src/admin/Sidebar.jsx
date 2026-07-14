import React from "react";
import { NavLink } from "react-router-dom";
import { cx } from "./ui.jsx";
import { useAdmin } from "./AdminContext.jsx";

function Icon({ path }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
      {path}
    </svg>
  );
}

const nav = [
  {
    to: "/",
    label: "Dashboard",
    icon: <Icon path={<><path d="M3 13h8V3H3v10z" /><path d="M13 21h8V11h-8v10z" /><path d="M13 3v6h8V3h-8z" /><path d="M3 21h8v-6H3v6z" /></>} />,
  },
  {
    to: "/products",
    label: "Products",
    icon: <Icon path={<><path d="M3 7l9-4 9 4-9 4-9-4z" /><path d="M3 7v10l9 4 9-4V7" /><path d="M12 11v10" /></>} />,
  },
  {
    to: "/orders",
    label: "Orders",
    icon: <Icon path={<><path d="M6 2l1.5 3h9L18 2" /><path d="M5 5h14l-1 15H6L5 5z" /><path d="M9 9v6M15 9v6" /></>} />,
  },
  {
    to: "/analytics",
    label: "Analytics",
    icon: <Icon path={<><path d="M4 19V5" /><path d="M4 19h16" /><path d="M8 16l3-4 3 3 4-6" /></>} />,
  },
  {
    to: "/trade-in",
    label: "Trade-in",
    icon: <Icon path={<><path d="M4 7h13l-3-3M20 17H7l3 3" /></>} />,
  },
];

export default function Sidebar() {
  const { logout, adminKey } = useAdmin();
  return (
    <aside className="flex w-60 flex-col border-r border-ink/10 bg-white">
      <div className="px-5 py-5">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-signal-gradient font-display text-lg font-700 text-white">
            C
          </span>
          <div className="leading-tight">
            <p className="font-display text-sm font-700 text-ink">Cboyistore</p>
            <p className="text-[11px] text-ink/40">Staff CMS</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cx(
                "focus-ring mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-600 transition",
                isActive ? "bg-ink text-cream" : "text-ink/60 hover:bg-ink/5"
              )
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-ink/10 px-4 py-4">
        <p className="truncate text-[11px] text-ink/40" title={adminKey}>
          Key: {adminKey ? "••••••••" : "none"}
        </p>
        <button
          onClick={logout}
          className="focus-ring mt-2 w-full rounded-xl px-3 py-2 text-left text-sm font-600 text-ink/50 hover:bg-ink/5"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
