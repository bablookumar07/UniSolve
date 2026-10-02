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
} from "lucide-react";

import {
  getAllUsers,
  toggleUserStatus,
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
        (statusFilter === "ACTIVE" && user.isActive) ||
        (statusFilter === "INACTIVE" && !user.isActive);

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [users, search, roleFilter, statusFilter]);

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

  const getRoleIcon = (role) => {
    if (role === "ADMIN") return ShieldCheck;
    if (role === "STAFF") return BriefcaseBusiness;

    return GraduationCap;
  };

  const getRoleClasses = (role) => {
    if (role === "ADMIN") {
      return "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400";
    }

    if (role === "STAFF") {
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
    }

    return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";
  };

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

        <button
          type="button"
          onClick={() => fetchUsers(true)}
          disabled={refreshing}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-slate-800"
        >
          <RefreshCw
            size={17}
            className={
              refreshing ? "animate-spin" : ""
            }
          />
          Refresh
        </button>
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
            <option value="ALL">All Roles</option>
            <option value="STUDENT">Students</option>
            <option value="STAFF">Staff</option>
            <option value="ADMIN">Admins</option>
          </select>

          {/* Status */}

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-gray-300"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
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
    </div>
  );
};

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