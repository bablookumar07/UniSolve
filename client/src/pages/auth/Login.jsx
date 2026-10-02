import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
  Wrench,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const roles = [
  {
    value: "STUDENT",
    title: "Student",
    description: "Report and track campus complaints",
    icon: UserRound,
  },
  {
    value: "STAFF",
    title: "Staff",
    description: "Manage assigned complaints",
    icon: Wrench,
  },
  {
    value: "ADMIN",
    title: "Admin",
    description: "Manage the complete platform",
    icon: ShieldCheck,
  },
];

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setError("");
  };

  const handleContinue = () => {
    if (!selectedRole) {
      setError("Please select your role to continue.");
      return;
    }

    setError("");
    setStep(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleBack = () => {
    setError("");
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const data = await login({
        email,
        password,
        role: selectedRole,
      });

      const role = data?.user?.role;

      if (role === "STUDENT") {
        navigate("/student/dashboard", { replace: true });
      } else if (role === "STAFF") {
        navigate("/staff/dashboard", { replace: true });
      } else if (role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        setError("Unable to determine your account role.");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToWebsite = () => {
    const from = location.state?.from?.pathname;

    if (from && from !== "/login") {
      navigate(from);
    } else {
      navigate("/");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900 transition-colors dark:bg-slate-950 dark:text-white sm:px-6 lg:py-16">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-2">
        {/* ================= LEFT PANEL ================= */}

        <section className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

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
                Campus Resolution Platform
              </p>

              <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
                One platform. Three roles. One transparent workflow.
              </h1>

              <p className="mt-6 text-base leading-7 text-slate-400">
                Students report issues, staff resolve assigned complaints,
                and administrators oversee the complete campus resolution
                process.
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
                  Role-based access
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Each account gets access to its appropriate workspace.
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
                  Secure authentication
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Your session is protected using HTTP-only authentication
                  cookies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= RIGHT SIDE ================= */}

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

            {/* ================= STEP 1 ================= */}

            {step === 1 && (
              <>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Step 1 of 2
                  </p>

                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Choose Your Role
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                    Select the workspace you want to sign in to.
                  </p>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
                  >
                    {error}
                  </div>
                )}

                <div className="mt-8 space-y-3">
                  {roles.map((role) => {
                    const Icon = role.icon;

                    const isSelected =
                      selectedRole === role.value;

                    return (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() =>
                          handleRoleSelect(role.value)
                        }
                        className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/10 dark:border-blue-500 dark:bg-blue-500/10"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-300"
                          }`}
                        >
                          <Icon size={22} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {role.title}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {role.description}
                          </p>
                        </div>

                        <div
                          className={`h-5 w-5 shrink-0 rounded-full border-2 ${
                            isSelected
                              ? "border-blue-600 bg-blue-600"
                              : "border-gray-300 dark:border-slate-600"
                          }`}
                        >
                          {isSelected && (
                            <div className="m-1 h-1.5 w-1.5 rounded-full bg-white" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleContinue}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                >
                  Continue
                  <ArrowRight size={18} />
                </button>

                <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Create an account
                  </Link>
                </p>
              </>
            )}

            {/* ================= STEP 2 ================= */}

            {step === 2 && (
              <>
                <button
                  type="button"
                  onClick={handleBack}
                  className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <ArrowLeft size={16} />

                  Change role
                </button>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Step 2 of 2
                  </p>

                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Sign in as{" "}
                    {selectedRole.charAt(0) +
                      selectedRole.slice(1).toLowerCase()}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                    Enter the credentials associated with your{" "}
                    {selectedRole.toLowerCase()} account.
                  </p>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
                  >
                    {error}
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-5"
                >
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
                        className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
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
                        type={
                          showPassword ? "text" : "password"
                        }
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (prev) => !prev
                          )
                        }
                        disabled={loading}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
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

                  {/* Selected Role */}

                  <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/20 dark:bg-blue-500/10">
                    <ShieldCheck
                      size={20}
                      className="shrink-0 text-blue-600 dark:text-blue-400"
                    />

                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Signing in to the{" "}
                      <span className="font-semibold">
                        {selectedRole}
                      </span>{" "}
                      portal.
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
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Create an account
                  </Link>
                </p>
              </>
            )}

            <button
              type="button"
              onClick={handleBackToWebsite}
              className="mx-auto mt-5 block text-sm text-gray-500 transition hover:text-gray-900 dark:hover:text-gray-300"
            >
              ← Back to website
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;