import {
    LayoutDashboard,
    Code2,
    History,
    Trophy,
    UserRound,
    Settings,
    LogOut,
    Flame,
    X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import Logo from "../common/Logo";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setMobileOpen(false);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const links = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Problems",
      path: "/problems",
      icon: Code2,
    },
    {
      label: "Submission History",
      path: "/submissions",
      icon: History,
    },
    {
      label: "Leaderboard",
      path: "/leaderboard",
      icon: Trophy,
    },
    {
      label: "Profile",
      path: "/profile",
      icon: UserRound,
    },
    {
      label: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-800 dark:bg-slate-950 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* SIDEBAR HEADER */}
        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6 dark:border-slate-800">
          <Logo />

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto px-4 py-7">
          <p className="mb-4 px-4 text-xs font-bold uppercase tracking-widest text-slate-400">
            Workspace
          </p>

          <nav className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === "/dashboard"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition ${
                      isActive
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900"
                    }`
                  }
                >
                  <Icon size={19} />
                  {link.label}
                </NavLink>
              );
            })}
          </nav>

          {/* DAILY STREAK */}
          <div className="mt-10 rounded-2xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-500/20 dark:bg-violet-500/10">
            <div className="flex items-center gap-2">
              <Flame className="text-orange-500" size={20} />

              <span className="font-bold text-slate-800 dark:text-white">
                Daily Streak
              </span>
            </div>

            <p className="mt-3 text-3xl font-extrabold text-violet-600">
              5 Days
            </p>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Keep your coding momentum alive!
            </p>
          </div>
        </div>

        {/* LOGOUT */}
        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-500 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
