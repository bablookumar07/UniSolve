import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";

import { registerUser } from "../../api/authApi";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (name.length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        name,
        email,
        password,
      });

      setSuccess(
        "Account created successfully. Redirecting you to login..."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: {
            registered: true,
            email,
          },
        });
      }, 1200);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900 transition-colors dark:bg-slate-950 dark:text-white sm:px-6 lg:py-16">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-2">
        {/* ================= LEFT PANEL ================= */}

        <section className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative z-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xl font-bold"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
                U
              </span>

              UniSolve
            </Link>

            <div className="mt-20 max-w-md">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                Join UniSolve
              </p>

              <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
                A better way to manage campus problems.
              </h1>

              <p className="mt-6 text-base leading-7 text-slate-400">
                Create an account and get a transparent way to report,
                monitor, and follow up on campus and hostel issues.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2
                size={21}
                className="mt-0.5 shrink-0 text-blue-400"
              />

              <div>
                <h3 className="font-semibold">
                  Track your complaints
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Know what is happening at every stage.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2
                size={21}
                className="mt-0.5 shrink-0 text-blue-400"
              />

              <div>
                <h3 className="font-semibold">
                  Stay informed
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Receive notifications when your complaint changes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2
                size={21}
                className="mt-0.5 shrink-0 text-blue-400"
              />

              <div>
                <h3 className="font-semibold">
                  Secure by design
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Your account uses protected authentication and
                  role-based access.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= REGISTER FORM ================= */}

        <section className="flex items-center p-6 sm:p-10 lg:p-12 xl:p-14">
          <div className="mx-auto w-full max-w-md">
            {/* Mobile Brand */}
            <div className="mb-10 lg:hidden">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                  U
                </span>

                UniSolve
              </Link>
            </div>

            {/* Heading */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Get started
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                Create your UniSolve student account to start managing
                campus complaints.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
              >
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div
                role="status"
                className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
              >
                {success}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Full name
                </label>

                <div className="relative">
                  <User
                    size={19}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    disabled={loading}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition hover:text-gray-700 dark:hover:text-gray-200"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    disabled={loading}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition hover:text-gray-700 dark:hover:text-gray-200"
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Security notice */}
              <div className="flex gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                />

                <p className="text-xs leading-5 text-gray-600 dark:text-gray-400">
                  New public accounts are created with the Student role.
                  Staff and Admin access is managed separately.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Login */}
            <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign in
              </Link>
            </p>

            {/* Back */}
            <Link
              to="/"
              className="mx-auto mt-5 block w-fit text-sm text-gray-500 transition hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-300"
            >
              ← Back to website
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Register;