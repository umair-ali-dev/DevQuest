import { useState } from "react";
import {
  Settings as SettingsIcon,
  UserRound,
  Palette,
  ShieldCheck,
  LockKeyhole,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sun,
  Moon,
  Loader2,
} from "lucide-react";

import { Link } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

const Settings = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    setMessage({ type: "", text: "" });

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({
        type: "error",
        text: "Please complete all password fields.",
      });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "New password must contain at least 8 characters.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({
        type: "error",
        text: "New password and confirmation do not match.",
      });
      return;
    }

    if (currentPassword === newPassword) {
      setMessage({
        type: "error",
        text: "Your new password must be different from the current password.",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await api.patch("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      setMessage({
        type: "success",
        text:
          response.data.message || "Password changed successfully.",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to change your password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white";

  const sectionClass =
    "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-950";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300";

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-7 pb-10">

        {/* PAGE HEADER */}
        <div>
          <div className="mb-2 flex items-center gap-2 text-violet-600 dark:text-violet-400">
            <SettingsIcon size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">
              Preferences
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Settings
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Manage your account, appearance and security preferences.
          </p>
        </div>

        {/* ACCOUNT INFORMATION */}
        <section className={sectionClass}>
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-violet-100 p-3 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                <UserRound size={21} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  Account Information
                </h2>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your registered account details.
                </p>
              </div>
            </div>

            <Link
              to="/profile"
              className="flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400"
            >
              Edit Profile
              <ExternalLink size={14} />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className={labelClass}>Full Name</p>
              <div className={inputClass}>
                {user?.name || "Not available"}
              </div>
            </div>

            <div>
              <p className={labelClass}>Username</p>
              <div className={inputClass}>
                {user?.username ? `@${user.username}` : "Not available"}
              </div>
            </div>

            <div className="sm:col-span-2">
              <p className={labelClass}>Email Address</p>
              <div className={inputClass}>
                {user?.email || "Not available"}
              </div>
            </div>
          </div>
        </section>

        {/* APPEARANCE */}
        <section className={sectionClass}>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-amber-100 p-3 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <Palette size={21} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">
                Appearance
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customize how DevQuest looks.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`flex flex-1 items-center gap-4 rounded-xl border p-4 text-left transition ${
                theme === "light"
                  ? "border-violet-500 bg-violet-50 ring-2 ring-violet-500/10 dark:bg-violet-500/10"
                  : "border-slate-200 hover:border-violet-300 dark:border-slate-700"
              }`}
            >
              <div className="rounded-lg bg-amber-100 p-3 text-amber-600">
                <Sun size={22} />
              </div>

              <div className="flex-1">
                <p className="font-bold text-slate-900 dark:text-white">
                  Light Mode
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Clean and bright appearance.
                </p>
              </div>

              {theme === "light" && (
                <CheckCircle2 className="text-violet-600" size={20} />
              )}
            </button>

            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`flex flex-1 items-center gap-4 rounded-xl border p-4 text-left transition ${
                theme === "dark"
                  ? "border-violet-500 bg-violet-50 ring-2 ring-violet-500/10 dark:bg-violet-500/10"
                  : "border-slate-200 hover:border-violet-300 dark:border-slate-700"
              }`}
            >
              <div className="rounded-lg bg-slate-800 p-3 text-white">
                <Moon size={22} />
              </div>

              <div className="flex-1">
                <p className="font-bold text-slate-900 dark:text-white">
                  Dark Mode
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Comfortable low-light appearance.
                </p>
              </div>

              {theme === "dark" && (
                <CheckCircle2 className="text-violet-600" size={20} />
              )}
            </button>
          </div>

          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Your theme preference is saved automatically.
          </p>
        </section>

        {/* SECURITY */}
        <section className={sectionClass}>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <ShieldCheck size={21} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">
                Security
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Keep your DevQuest account secure.
              </p>
            </div>
          </div>

          <div className="mb-5 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <LockKeyhole
              size={19}
              className="mt-0.5 shrink-0 text-violet-600 dark:text-violet-400"
            />

            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                Change Password
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Enter your current password and choose a new password
                containing at least 8 characters.
              </p>
            </div>
          </div>

          {message.text && (
            <div
              role="alert"
              className={`mb-5 flex items-start gap-2 rounded-xl border p-3 text-sm ${
                message.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              ) : (
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
              )}

              {message.text}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-5">
            {/* CURRENT PASSWORD */}
            <div>
              <label className={labelClass}>
                Current Password
              </label>

              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(event) =>
                    setCurrentPassword(event.target.value)
                  }
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  maxLength={128}
                  className={`${inputClass} pr-12`}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword((previous) => !previous)
                  }
                  aria-label="Toggle current password visibility"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* NEW PASSWORD */}
            <div>
              <label className={labelClass}>
                New Password
              </label>

              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  className={`${inputClass} pr-12`}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword((previous) => !previous)
                  }
                  aria-label="Toggle new password visibility"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  {showNewPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className={labelClass}>
                Confirm New Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  maxLength={128}
                  className={`${inputClass} pr-12`}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((previous) => !previous)
                  }
                  aria-label="Toggle confirm password visibility"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  <LockKeyhole size={17} />
                  Update Password
                </>
              )}
            </button>
          </form>
        </section>

        {/* FOOTER */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
            DevQuest account settings. Your profile information and
            security credentials are managed through authenticated
            server requests.
          </p>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Settings;