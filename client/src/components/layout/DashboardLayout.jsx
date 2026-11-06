import { useState } from "react";
import { Menu, Bell, Search } from "lucide-react";

import Sidebar from "./Sidebar";
import ThemeToggle from "../common/ThemeToggle";
import { useAuth } from "../../context/AuthContext";

const DashboardLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  const displayName = user?.name || "Developer";
  const avatar = user?.avatar || "";

  const [avatarFailure, setAvatarFailure] = useState({
    url: "",
    failed: false,
  });

  const avatarError =
    avatarFailure.url === avatar && avatarFailure.failed;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>

            <div className="hidden items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 dark:bg-slate-900 md:flex">
              <Search size={18} className="text-slate-400" />

              <input
                type="text"
                placeholder="Search challenges..."
                className="w-52 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-white"
              />

              <span className="rounded bg-white px-2 py-1 text-xs text-slate-400 dark:bg-slate-800">
                /
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 md:hidden">
              DevQuest
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <button
              aria-label="Notifications"
              className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              <Bell size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="hidden items-center gap-3 border-l border-slate-200 pl-4 dark:border-slate-800 sm:flex">
              {avatar && !avatarError ? (
                <img
                  src={avatar}
                  alt={displayName}
                  className="h-10 w-10 shrink-0 rounded-xl border border-slate-200 object-cover dark:border-slate-700"
                  onError={() =>
                    setAvatarFailure({
                      url: avatar,
                      failed: true,
                    })
                  }
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 font-bold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {displayName}
                </p>

                <p className="text-xs text-slate-500">
                  {user?.role === "admin" ? "Administrator" : "Developer"}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] p-5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
