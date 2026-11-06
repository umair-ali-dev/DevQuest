import { useCallback, useEffect, useState } from "react";
import {
    User,
    Mail,
    CalendarDays,
    Trophy,
    Code2,
    CheckCircle2,
    Target,
    Flame,
    Clock,
    Pencil,
    X,
    Save,
    Loader2,
    RefreshCw,
    ExternalLink,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const formatRuntime = (time) => {
    if (time === null || time === undefined) return "N/A";
    return `${time}s`;
};

const verdictStyles = {
    Accepted:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    "Wrong Answer":
        "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    "Time Limit Exceeded":
        "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    "Runtime Error":
        "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
    "Compilation Error":
        "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
    Pending:
        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

const StatCard = ({ icon: Icon, label, value, description }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {label}
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                    {value}
                </h3>
            </div>

            <div className="rounded-xl bg-violet-100 p-3 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400">
                <Icon size={22} />
            </div>
        </div>

        {description && (
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                {description}
            </p>
        )}
    </div>
);

const Profile = () => {
    const { user, updateUser } = useAuth();

    const [profileData, setProfileData] = useState(null);
    const [avatarFailure, setAvatarFailure] = useState({
        url: "",
        failed: false,
    });
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState("");
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [formError, setFormError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        avatar: "",
    });

    const fetchProfile = useCallback(async () => {
        try {
            const response = await api.get("/profile");
            const data = response.data;

            setProfileData(data);

            setFormData({
                name: data.profile?.name || "",
                username: data.profile?.username || "",
                avatar: data.profile?.avatar || "",
            });
        } catch (error) {
            console.error("Profile fetch error:", error);

            setPageError(
                error.response?.data?.message ||
                "Unable to load your profile. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let ignore = false;

        const loadProfile = async () => {
            try {
                const response = await api.get("/profile");

                if (ignore) return;

                const data = response.data;

                setProfileData(data);

                setFormData({
                    name: data.profile?.name || "",
                    username: data.profile?.username || "",
                    avatar: data.profile?.avatar || "",
                });

            } catch (error) {
                if (ignore) return;

                setPageError(
                    error.response?.data?.message ||
                    error.message ||
                    "Unable to load profile. Please try again."
                );
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        loadProfile();

        return () => {
            ignore = true;
        };
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleEdit = () => {
        setFormError("");
        setSuccessMessage("");

        setFormData({
            name: profileData.profile?.name || "",
            username: profileData.profile?.username || "",
            avatar: profileData.profile?.avatar || "",
        });

        setEditing(true);
    };

    const handleCancel = () => {
        setEditing(false);
        setFormError("");

        setFormData({
            name: profileData.profile?.name || "",
            username: profileData.profile?.username || "",
            avatar: profileData.profile?.avatar || "",
        });
    };

    const handleSave = async (event) => {
        event.preventDefault();

        setFormError("");
        setSuccessMessage("");

        const name = formData.name.trim();
        const username = formData.username.trim().toLowerCase();
        const avatar = formData.avatar.trim();

        if (name.length < 2 || name.length > 50) {
            setFormError("Name must contain between 2 and 50 characters.");
            return;
        }

        if (!/^[a-z0-9_]{3,20}$/.test(username)) {
            setFormError(
                "Username must be 3–20 characters and contain only lowercase letters, numbers, and underscores."
            );
            return;
        }

        if (avatar && !/^https?:\/\/.+/i.test(avatar)) {
            setFormError("Please enter a valid avatar URL.");
            return;
        }

        try {
            setSaving(true);

            console.log("Avatar being sent:", avatar);

            const response = await api.patch("/auth/profile", {
                name,
                username,
                avatar,
            });

            console.log("Profile update response:", response.data);
            console.log("Avatar returned by backend:", response.data.user.avatar);

            const updatedUser = response.data.user;

            updateUser(updatedUser);

            setProfileData((previous) => ({
                ...previous,
                profile: {
                    ...previous.profile,
                    ...updatedUser,
                },
            }));

            setFormData({
                name: updatedUser.name || "",
                username: updatedUser.username || "",
                avatar: updatedUser.avatar || "",
            });

            setEditing(false);
            setSuccessMessage("Your profile has been updated successfully.");
        } catch (error) {
            console.error("Profile update error:", error);

            setFormError(
                error.response?.data?.message ||
                "Unable to update your profile. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    const profile = profileData?.profile;
    const statistics = profileData?.statistics;
    const recentSubmissions = profileData?.recentSubmissions || [];
    const rank = profileData?.leaderboard?.rank;

    const displayName = profile?.name || user?.name || "User";
    const username = profile?.username || user?.username || "";
    const avatar = profile?.avatar || "";

    const avatarError =
        avatarFailure.url === avatar && avatarFailure.failed;

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="text-center">
                        <Loader2
                            size={35}
                            className="mx-auto animate-spin text-violet-600"
                        />
                        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                            Loading your profile...
                        </p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (pageError) {
        return (
            <DashboardLayout>
                <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-white p-8 text-center dark:border-red-900/50 dark:bg-slate-900">
                    <p className="font-semibold text-red-600 dark:text-red-400">
                        {pageError}
                    </p>

                    <button
                        onClick={() => {
                            setLoading(true);
                            setPageError("");
                            fetchProfile();
                        }}
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
                    >
                        <RefreshCw size={16} />
                        Try Again
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-7">

                {/* Page Heading */}
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        My Profile
                    </h1>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Manage your account and track your coding progress.
                    </p>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-500/10 dark:text-emerald-400">
                        {successMessage}
                    </div>
                )}

                {/* Profile Information */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

                        <div className="flex items-center gap-5">
                            {avatar && !avatarError ? (
                                <img
                                    src={avatar}
                                    alt={displayName}
                                    className="h-20 w-20 rounded-2xl border border-slate-200 object-cover dark:border-slate-700"
                                    onError={() =>
                                        setAvatarFailure({
                                            url: avatar,
                                            failed: true,
                                        })
                                    }
                                />
                            ) : (
                                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-3xl font-bold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                            )}

                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {displayName}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    @{username}
                                </p>

                                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-400">
                                    <User size={13} />
                                    {profile?.role === "admin" ? "Administrator" : "Developer"}
                                </div>
                            </div>
                        </div>

                        {!editing && (
                            <button
                                onClick={handleEdit}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
                            >
                                <Pencil size={16} />
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <div className="mt-7 grid gap-5 border-t border-slate-200 pt-6 dark:border-slate-800 md:grid-cols-2">

                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-slate-100 p-3 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                                <Mail size={19} />
                            </div>

                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Email Address
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                                    {profile?.email || "N/A"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-slate-100 p-3 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                                <CalendarDays size={19} />
                            </div>

                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Member Since
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                                    {formatDate(profile?.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Edit Profile Form */}
                    {editing && (
                        <form
                            onSubmit={handleSave}
                            className="mt-7 space-y-5 border-t border-slate-200 pt-6 dark:border-slate-800"
                        >
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                Edit Account Information
                            </h3>

                            {formError && (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-500/10 dark:text-red-400">
                                    {formError}
                                </div>
                            )}

                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        maxLength={50}
                                        required
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Username
                                    </label>

                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        minLength={3}
                                        maxLength={20}
                                        required
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Avatar Image URL
                                    </label>

                                    <input
                                        type="url"
                                        name="avatar"
                                        value={formData.avatar}
                                        onChange={handleInputChange}
                                        placeholder="https://example.com/avatar.png"
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                    />

                                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                        Enter an image URL or leave it empty to use your initials.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Save size={16} />
                                    )}
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={saving}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    <X size={16} />
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </section>

                {/* Coding Statistics */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            Coding Statistics
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Your programming performance on DevQuest.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                            icon={Code2}
                            label="Total Submissions"
                            value={statistics?.totalSubmissions ?? 0}
                            description="All submitted solutions"
                        />

                        <StatCard
                            icon={CheckCircle2}
                            label="Problems Solved"
                            value={statistics?.problemsSolved ?? 0}
                            description="Unique accepted problems"
                        />

                        <StatCard
                            icon={Target}
                            label="Acceptance Rate"
                            value={`${statistics?.acceptanceRate ?? 0}%`}
                            description="Accepted / evaluated submissions"
                        />

                        <StatCard
                            icon={Flame}
                            label="Current Streak"
                            value={`${statistics?.currentStreak ?? 0} days`}
                            description="Consecutive days with accepted solutions"
                        />
                    </div>
                </section>

                {/* Ranking */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-amber-100 p-4 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                            <Trophy size={28} />
                        </div>

                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Global Leaderboard Ranking
                            </p>

                            <h2 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                                {rank ? `#${rank}` : "Unranked"}
                            </h2>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {rank
                                    ? "Your current position among ranked developers."
                                    : "Solve a problem to appear on the leaderboard."}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Recent Activity */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Recent Submissions
                            </h2>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Your five latest coding attempts.
                            </p>
                        </div>

                        <a
                            href="/submissions"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400"
                        >
                            View All
                            <ExternalLink size={15} />
                        </a>
                    </div>

                    {recentSubmissions.length === 0 ? (
                        <div className="py-10 text-center">
                            <Code2
                                size={35}
                                className="mx-auto text-slate-300 dark:text-slate-700"
                            />

                            <p className="mt-3 font-medium text-slate-700 dark:text-slate-300">
                                No submissions yet
                            </p>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Start solving problems to build your coding history.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentSubmissions.map((submission) => (
                                <div
                                    key={submission.id}
                                    className="flex flex-col justify-between gap-4 rounded-xl border border-slate-100 p-4 dark:border-slate-800 sm:flex-row sm:items-center"
                                >
                                    <div className="min-w-0">
                                        {submission.problem?.slug ? (
                                            <a
                                                href={`/problems/${submission.problem.slug}`}
                                                className="font-semibold text-slate-900 hover:text-violet-600 dark:text-white dark:hover:text-violet-400"
                                            >
                                                {submission.problem.title}
                                            </a>
                                        ) : (
                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                {submission.problem?.title || "Deleted Problem"}
                                            </p>
                                        )}

                                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                            <span className="uppercase">
                                                {submission.language}
                                            </span>

                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {formatRuntime(submission.executionTime)}
                                            </span>

                                            <span>
                                                {submission.passedTestCases ?? 0}/
                                                {submission.totalTestCases ?? 0} test cases
                                            </span>

                                            <span>{formatDate(submission.createdAt)}</span>
                                        </div>
                                    </div>

                                    <span
                                        className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${verdictStyles[submission.verdict] ||
                                            "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                            }`}
                                    >
                                        {submission.verdict}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </DashboardLayout>
    );
};

export default Profile;
