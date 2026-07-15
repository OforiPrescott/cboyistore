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
    to: "/customers",
    label: "Customers",
    icon: <Icon path={<><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm6 8v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" /><path d="M3 19h18" /></>} />,
  },
  {
    to: "/trade-in",
    label: "Trade-in",
    icon: <Icon path={<><path d="M4 7h13l-3-3M20 17H7l3 3" /></>} />,
  },
  {
    to: "/workers",
    label: "Workers",
    roles: ["admin"],
    icon: <Icon path={<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>} />,
  },
  {
    to: "/audit",
    label: "Audit log",
    roles: ["admin"],
    icon: <Icon path={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>} />,
  },
  {
    to: "/coupons",
    label: "Coupons",
    roles: ["admin"],
    icon: <Icon path={<><path d="M21 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" /><path d="M3 10h18" /></>} />,
  },
];

export default function Sidebar({ onNavigate, className = "" }) {
  const { logout, adminKey, workerInfo, confirm } = useAdmin();

  const currentRole = workerInfo?.role || "admin";
  const visibleNav = nav.filter((item) => !item.roles || item.roles.includes(currentRole));

  async function handleLogout() {
    const ok = await confirm({
      title: "Log out?",
      message: "You'll need to sign in again to access the CMS.",
      confirmLabel: "Log out",
      tone: "dark",
    });
    if (ok) logout();
  }

  return (
    <aside className={cx("flex w-60 flex-col border-r border-ink/10 bg-white", className)}>
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
        {workerInfo && (
          <div className="mt-3 rounded-xl bg-cream px-3 py-2">
            <p className="text-xs font-700 text-ink">{workerInfo.name}</p>
            <p className="text-[11px] text-ink/50 capitalize">{workerInfo.role} &middot; {workerInfo.username}</p>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3">
        {visibleNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            onClick={onNavigate}
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
        {adminKey && !workerInfo && (
          <p className="truncate text-[11px] text-ink/40" title={adminKey}>
            Key: {adminKey ? "••••••••" : "none"}
          </p>
        )}
        <button
          onClick={handleLogout}
          className="focus-ring mt-2 w-full rounded-xl px-3 py-2 text-left text-sm font-600 text-ink/50 hover:bg-ink/5"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
