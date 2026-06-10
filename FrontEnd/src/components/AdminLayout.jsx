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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex-1 flex mt-16">

        <aside className="hidden md:flex w-56 flex-col flex-shrink-0 bg-white border-r border-gray-100 fixed top-16 bottom-0 left-0 z-20">
          <div className="px-4 py-5 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Administration</p>
          </div>
          <nav className="flex-1 py-3 px-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition ${
                  pathname === item.to
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}>
                <span className={pathname === item.to ? "text-blue-500" : "text-gray-400"}>
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
          <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {sidebarOpen && (
          <div className="fixed top-16 left-0 bottom-0 w-64 bg-white z-40 md:hidden shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Administration</p>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-600">
                <FiX size={18} />
              </button>
            </div>
            <nav className="flex-1 py-3 px-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium mb-1 transition ${
                    pathname === item.to
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  <span className={pathname === item.to ? "text-blue-500" : "text-gray-400"}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}

        <main className="flex-1 md:ml-56 min-w-0">

          <div className="bg-white border-b border-gray-100 px-4 md:px-8 py-5 flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition flex-shrink-0">
              <FiMenu size={18} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>

          <div className="px-4 md:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
