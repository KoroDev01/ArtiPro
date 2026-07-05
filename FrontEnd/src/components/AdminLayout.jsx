import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "./Header";
import { FiTag, FiUsers, FiBriefcase, FiMenu, FiX, FiChevronRight } from "react-icons/fi";

const NAV_ITEMS = [
  { to: "/admin/candidatures", icon: <FiBriefcase size={16} />, label: "Candidatures" },
  { to: "/admin/users",        icon: <FiUsers size={16} />,     label: "Utilisateurs" },
  { to: "/admin/categories",   icon: <FiTag size={16} />,       label: "Catégories" },
];

export default function AdminLayout({ children, title, subtitle }) {
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navCls = (active) =>
    active
      ? "bg-blue-500/15 text-blue-400"
      : "text-zinc-400 hover:bg-white/5 hover:text-white";

  return (
    <div className="page-wrap">
      <Header />

      <div className="flex flex-1 mt-16">
        <aside className="fixed top-16 bottom-0 left-0 z-20 hidden w-56 flex-shrink-0 flex-col border-r border-white/10 bg-white/5 backdrop-blur-xl md:flex">
          <div className="border-b border-white/10 px-4 py-5">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Administration</p>
          </div>
          <nav className="flex-1 px-2 py-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${navCls(pathname === item.to)}`}>
                <span className={pathname === item.to ? "text-blue-400" : "text-zinc-500"}>
                  {item.icon}
                </span>
                {item.label}
                {pathname === item.to && (
                  <FiChevronRight size={12} className="ml-auto text-blue-400" />
                )}
              </Link>
            ))}
          </nav>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {sidebarOpen && (
          <div className="glass-panel fixed top-16 bottom-0 left-0 z-40 flex w-64 flex-col md:hidden !rounded-none">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Administration</p>
              <button onClick={() => setSidebarOpen(false)} className="text-zinc-500 hover:text-white">
                <FiX size={18} />
              </button>
            </div>
            <nav className="flex-1 px-2 py-3">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${navCls(pathname === item.to)}`}>
                  <span className={pathname === item.to ? "text-blue-400" : "text-zinc-500"}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}

        <main className="min-w-0 flex-1 md:ml-56">
          <div className="flex items-center gap-4 border-b border-white/10 bg-white/5 px-4 py-5 backdrop-blur-xl md:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="btn-secondary flex h-9 w-9 flex-shrink-0 items-center justify-center !p-0 md:hidden">
              <FiMenu size={18} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">{title}</h1>
              {subtitle && <p className="mt-0.5 text-sm text-zinc-500">{subtitle}</p>}
            </div>
          </div>

          <div className="px-4 py-6 md:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
