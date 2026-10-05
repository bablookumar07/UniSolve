import { useEffect, useMemo, useState } from "react";

import {
  Search,
  RefreshCw,
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  BriefcaseBusiness,
  GraduationCap,
  Loader2,
  UserPlus,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

import {
  getAllUsers,
  toggleUserStatus,
  createStaffUser,
} from "../../api/adminApi";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [updatingUserId, setUpdatingUserId] = useState(null);

  // Create staff modal
  const [showCreateStaffModal, setShowCreateStaffModal] = useState(false);

  const [staffForm, setStaffForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [creatingStaff, setCreatingStaff] = useState(false);
  const [createStaffError, setCreateStaffError] = useState("");
  const [createStaffSuccess, setCreateStaffSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // --------------------------------------------------
  // FETCH USERS
  // --------------------------------------------------

  const fetchUsers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getAllUsers();

      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --------------------------------------------------
  // TOGGLE USER STATUS
  // --------------------------------------------------

  const handleToggleStatus = async (user) => {
    const action = user.isActive
      ? "deactivate"
      : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${user.name}?`
    );

    if (!confirmed) return;

    try {
      setUpdatingUserId(user._id);
      setError("");

      const data = await toggleUserStatus(user._id);

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser._id === data.user.id
            ? {
                ...currentUser,
                isActive: data.user.isActive,
              }
            : currentUser
        )
      );
    } catch (error) {
      console.error(
        "Failed to update user status:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update user status."
      );
    } finally {
      setUpdatingUserId(null);
    }
  };

  // --------------------------------------------------
  // CREATE STAFF FORM
  // --------------------------------------------------

  const handleStaffFormChange = (event) => {
    const { name, value } = event.target;

    setStaffForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // OPEN CREATE STAFF MODAL
  // --------------------------------------------------

  const openCreateStaffModal = () => {
    setStaffForm({
      name: "",
      email: "",
      password: "",
    });

    setCreateStaffError("");
    setCreateStaffSuccess("");
    setShowPassword(false);

    setShowCreateStaffModal(true);
  };

  // --------------------------------------------------
  // CLOSE CREATE STAFF MODAL
  // --------------------------------------------------

  const closeCreateStaffModal = () => {
    if (creatingStaff) return;

    setShowCreateStaffModal(false);

    setStaffForm({
      name: "",
      email: "",
      password: "",
    });

    setCreateStaffError("");
    setCreateStaffSuccess("");
    setShowPassword(false);
  };

  // --------------------------------------------------
  // CREATE STAFF
  // --------------------------------------------------

  const handleCreateStaff = async (event) => {
    event.preventDefault();

    setCreateStaffError("");
    setCreateStaffSuccess("");

    const name = staffForm.name.trim();
    const email = staffForm.email.trim().toLowerCase();
    const password = staffForm.password;

    // Client-side validation
    if (!name) {
      setCreateStaffError("Staff name is required.");
      return;
    }

    if (name.length < 2) {
      setCreateStaffError(
        "Staff name must be at least 2 characters."
      );
      return;
    }

    if (!email) {
      setCreateStaffError("Staff email is required.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setCreateStaffError(
        "Please enter a valid email address."
      );
      return;
    }

    if (!password) {
      setCreateStaffError(
        "Temporary password is required."
      );
      return;
    }

    if (password.length < 6) {
      setCreateStaffError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setCreatingStaff(true);

      const data = await createStaffUser({
        name,
        email,
        password,
      });

      setCreateStaffSuccess(
        data.message ||
          "Staff account created successfully."
      );

      // Add newly created staff directly to table
      if (data.user) {
        setUsers((currentUsers) => [
          data.user,
          ...currentUsers,
        ]);
      } else {
        await fetchUsers(true);
      }

      // Reset form
      setStaffForm({
        name: "",
        email: "",
        password: "",
      });

      // Close after short success feedback
      setTimeout(() => {
        setShowCreateStaffModal(false);
        setCreateStaffSuccess("");
      }, 1200);
    } catch (error) {
      console.error(
        "Failed to create staff:",
        error
      );

      setCreateStaffError(
        error.response?.data?.message ||
          "Failed to create staff account."
      );
    } finally {
      setCreatingStaff(false);
    }
  };

  // --------------------------------------------------
  // FILTER USERS
  // --------------------------------------------------

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !normalizedSearch ||
        user.name
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        user.email
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesRole =
        roleFilter === "ALL" ||
        user.role === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" &&
          user.isActive) ||
        (statusFilter === "INACTIVE" &&
          !user.isActive);

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ]);

  // --------------------------------------------------
  // STATS
  // --------------------------------------------------

  const stats = useMemo(() => {
    return {
      total: users.length,

      students: users.filter(
        (user) => user.role === "STUDENT"
      ).length,

      staff: users.filter(
        (user) => user.role === "STAFF"
      ).length,

      admins: users.filter(
        (user) => user.role === "ADMIN"
      ).length,

      active: users.filter(
        (user) => user.isActive
      ).length,

      inactive: users.filter(
        (user) => !user.isActive
      ).length,
    };
  }, [users]);

  // --------------------------------------------------
  // ROLE ICON
  // --------------------------------------------------

  const getRoleIcon = (role) => {
    if (role === "ADMIN") return ShieldCheck;

    if (role === "STAFF") {
      return BriefcaseBusiness;
    }

    return GraduationCap;
  };

  // --------------------------------------------------
  // ROLE COLORS
  // --------------------------------------------------

  const getRoleClasses = (role) => {
    if (role === "ADMIN") {
      return "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400";
    }

    if (role === "STAFF") {
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
    }

    return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Loader2
            size={18}
            className="animate-spin"
          />

          Loading users...
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-blue-600 dark:text-blue-400">
            Administration
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Users
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Manage students, staff, and administrator accounts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">

          {/* Add Staff */}
          <button
            type="button"
            onClick={openCreateStaffModal}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <UserPlus size={17} />
            Add Staff
          </button>

          {/* Refresh */}
          <button
            type="button"
            onClick={() => fetchUsers(true)}
            disabled={refreshing}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-slate-800"
          >
            <RefreshCw
              size={17}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard
          icon={Users}
          label="Total"
          value={stats.total}
        />

        <StatCard
          icon={GraduationCap}
          label="Students"
          value={stats.students}
        />

        <StatCard
          icon={BriefcaseBusiness}
          label="Staff"
          value={stats.staff}
        />

        <StatCard
          icon={ShieldCheck}
          label="Admins"
          value={stats.admins}
        />

        <StatCard
          icon={UserCheck}
          label="Active"
          value={stats.active}
        />

        <StatCard
          icon={UserX}
          label="Inactive"
          value={stats.inactive}
        />
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-3 lg:grid-cols-[1fr_200px_200px]">

          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by name or email..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          {/* Role */}
          <select
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(event.target.value)
            }
            className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-gray-300"
          >
            <option value="ALL">
              All Roles
            </option>

            <option value="STUDENT">
              Students
            </option>

            <option value="STAFF">
              Staff
            </option>

            <option value="ADMIN">
              Admins
            </option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-gray-300"
          >
            <option value="ALL">
              All Status
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="INACTIVE">
              Inactive
            </option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {filteredUsers.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {users.length}
          </span>{" "}
          users
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {filteredUsers.length === 0 ? (
          <div className="flex min-h-60 flex-col items-center justify-center px-6 text-center">
            <Users
              size={36}
              className="mb-3 text-gray-300 dark:text-slate-700"
            />

            <h3 className="font-semibold text-gray-900 dark:text-white">
              No users found
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-slate-800 dark:bg-slate-950/50">

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    User
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Role
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Joined
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => {
                  const RoleIcon = getRoleIcon(
                    user.role
                  );

                  const isUpdating =
                    updatingUserId === user._id;

                  return (
                    <tr
                      key={user._id}
                      className="border-b border-gray-100 last:border-0 dark:border-slate-800"
                    >
                      {/* User */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </p>

                          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${getRoleClasses(
                            user.role
                          )}`}
                        >
                          <RoleIcon size={13} />

                          {user.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 text-sm font-medium ${
                            user.isActive
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              user.isActive
                                ? "bg-green-500"
                                : "bg-gray-400"
                            }`}
                          />

                          {user.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleStatus(user)
                          }
                          disabled={isUpdating}
                          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            user.isActive
                              ? "border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
                              : "border border-green-200 text-green-600 hover:bg-green-50 dark:border-green-900/50 dark:text-green-400 dark:hover:bg-green-950/30"
                          }`}
                        >
                          {isUpdating ? (
                            <Loader2
                              size={14}
                              className="animate-spin"
                            />
                          ) : user.isActive ? (
                            <UserX size={14} />
                          ) : (
                            <UserCheck size={14} />
                          )}

                          {isUpdating
                            ? "Updating..."
                            : user.isActive
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ==================================================
          CREATE STAFF MODAL
      ================================================== */}

      {showCreateStaffModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !creatingStaff
            ) {
              closeCreateStaffModal();
            }
          }}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5 dark:border-slate-800">
              <div>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <UserPlus size={20} />
                </div>

                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Create Staff Account
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Create login credentials for a new staff member.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateStaffModal}
                disabled={creatingStaff}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-gray-200"
              >
                <X size={19} />
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={handleCreateStaff}
              className="space-y-5 p-6"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="staff-name"
                  className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Full Name
                </label>

                <input
                  id="staff-name"
                  name="name"
                  type="text"
                  value={staffForm.name}
                  onChange={handleStaffFormChange}
                  placeholder="Enter staff name"
                  autoComplete="name"
                  disabled={creatingStaff}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="staff-email"
                  className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email Address
                </label>

                <input
                  id="staff-email"
                  name="email"
                  type="email"
                  value={staffForm.email}
                  onChange={handleStaffFormChange}
                  placeholder="staff@example.com"
                  autoComplete="email"
                  disabled={creatingStaff}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="staff-password"
                  className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Temporary Password
                </label>

                <div className="relative">
                  <input
                    id="staff-password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={staffForm.password}
                    onChange={handleStaffFormChange}
                    placeholder="Minimum 6 characters"
                    autoComplete="new-password"
                    disabled={creatingStaff}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    disabled={creatingStaff}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-slate-800 dark:hover:text-gray-200"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>

                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  The staff member will use this password to log in.
                </p>
              </div>

              {/* Error */}
              {createStaffError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                  {createStaffError}
                </div>
              )}

              {/* Success */}
              {createStaffSuccess && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400">
                  {createStaffSuccess}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t border-gray-200 pt-5 dark:border-slate-800">
                <button
                  type="button"
                  onClick={closeCreateStaffModal}
                  disabled={creatingStaff}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creatingStaff}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creatingStaff && (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {creatingStaff
                    ? "Creating..."
                    : "Create Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ======================================================
// STAT CARD
// ======================================================

const StatCard = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {label}
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;