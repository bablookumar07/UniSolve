import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ClipboardList,
  Eye,
  Filter,
  Loader2,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import { getAssignedComplaints } from "../../api/complaintApi";

const StaffComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const fetchComplaints = useCallback(async (isRefresh = false) => {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getAssignedComplaints();

      setComplaints(data.complaints || []);
    } catch (error) {
      console.error("Failed to fetch assigned complaints:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load assigned complaints."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const filteredComplaints = useMemo(() => {
    const query = search.trim().toLowerCase();

    return complaints.filter((complaint) => {
      const matchesSearch =
        !query ||
        complaint.title?.toLowerCase().includes(query) ||
        complaint.complaintId?.toLowerCase().includes(query) ||
        complaint.location?.toLowerCase().includes(query) ||
        complaint.category?.name?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        complaint.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" ||
        complaint.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [complaints, search, statusFilter, priorityFilter]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
  };

  const hasActiveFilters =
    search.trim() ||
    statusFilter !== "ALL" ||
    priorityFilter !== "ALL";

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClasses = (status) => {
    const classes = {
      ASSIGNED:
        "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",

      IN_PROGRESS:
        "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",

      RESOLVED:
        "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",

      REOPENED:
        "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    };

    return (
      classes[status] ||
      "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300"
    );
  };

  const getPriorityClasses = (priority) => {
    const classes = {
      LOW: "text-gray-600 dark:text-gray-400",
      MEDIUM: "text-blue-600 dark:text-blue-400",
      HIGH: "text-orange-600 dark:text-orange-400",
      CRITICAL: "text-red-600 dark:text-red-400",
    };

    return classes[priority] || "text-gray-600 dark:text-gray-400";
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <Loader2 className="animate-spin" size={20} />
          <span>Loading assigned complaints...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Assigned Complaints
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View and manage complaints assigned to you.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchComplaints(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-slate-800"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />

            <div>
              <p className="font-medium">
                Unable to load complaints
              </p>

              <p className="mt-1 text-sm">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search complaints..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-10 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-gray-500"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <Filter
                size={16}
                className="hidden text-gray-400 sm:block"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-gray-300"
              >
                <option value="ALL">All Status</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">
                  In Progress
                </option>
                <option value="RESOLVED">Resolved</option>
                <option value="REOPENED">Reopened</option>
              </select>
            </div>

            {/* Priority */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-gray-300"
            >
              <option value="ALL">All Priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>

            {/* Clear */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Result count */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {filteredComplaints.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {complaints.length}
            </span>{" "}
            complaints
          </p>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">

          {filteredComplaints.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400">
                <ClipboardList size={24} />
              </div>

              <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
                No complaints found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                {hasActiveFilters
                  ? "Try changing your search or filters."
                  : "There are currently no complaints assigned to you."}
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 dark:border-slate-800 dark:text-gray-400">
                    <th className="px-5 py-4 font-medium">
                      Complaint
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Category
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Location
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Priority
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Status
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Date
                    </th>

                    <th className="px-5 py-4 text-right font-medium">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredComplaints.map((complaint) => (
                    <tr
                      key={complaint._id}
                      className="border-b border-gray-100 last:border-0 dark:border-slate-800/70"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="max-w-[220px] truncate font-medium text-gray-900 dark:text-white">
                            {complaint.title}
                          </p>

                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {complaint.complaintId}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {complaint.category?.name || "—"}
                      </td>

                      <td className="max-w-[180px] truncate px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {complaint.location || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`text-sm font-semibold ${getPriorityClasses(
                            complaint.priority
                          )}`}
                        >
                          {complaint.priority}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                            complaint.status
                          )}`}
                        >
                          {complaint.status.replaceAll("_", " ")}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {formatDate(complaint.createdAt)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Link
                          to={`/staff/complaints/${complaint._id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
                        >
                          <Eye size={16} />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StaffComplaints;