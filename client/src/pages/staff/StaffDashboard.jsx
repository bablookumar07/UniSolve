import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Loader2,
  RefreshCw,
  ClipboardList,
  ArrowRight,
} from "lucide-react";

import { getAssignedComplaints } from "../../api/complaintApi";

const StaffDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

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

  const stats = useMemo(() => {
    return {
      total: complaints.length,

      assigned: complaints.filter(
        (complaint) => complaint.status === "ASSIGNED"
      ).length,

      inProgress: complaints.filter(
        (complaint) => complaint.status === "IN_PROGRESS"
      ).length,

      resolved: complaints.filter(
        (complaint) => complaint.status === "RESOLVED"
      ).length,
    };
  }, [complaints]);

  const recentComplaints = useMemo(() => {
    return complaints.slice(0, 5);
  }, [complaints]);

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
          <span>Loading staff dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Staff Dashboard
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage and resolve complaints assigned to you.
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
              <p className="font-medium">Unable to load complaints</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Assigned
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.total}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <ClipboardList size={21} />
              </div>
            </div>
          </div>

          {/* Assigned */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Awaiting Action
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.assigned}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                <Clock3 size={21} />
              </div>
            </div>
          </div>

          {/* In Progress */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  In Progress
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.inProgress}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                <Loader2 size={21} />
              </div>
            </div>
          </div>

          {/* Resolved */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Resolved
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.resolved}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400">
                <CheckCircle2 size={21} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">

          <div className="flex flex-col justify-between gap-3 border-b border-gray-200 px-5 py-5 sm:flex-row sm:items-center dark:border-slate-800">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Assigned Complaints
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Complaints that require your attention.
              </p>
            </div>

            <Link
              to="/staff/complaints"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Empty State */}
          {recentComplaints.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400">
                <ClipboardList size={24} />
              </div>

              <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
                No complaints assigned
              </h3>

              <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                Assigned complaints will appear here when an administrator
                assigns them to you.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 dark:border-slate-800 dark:text-gray-400">
                    <th className="px-5 py-4 font-medium">
                      Complaint
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Category
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
                  {recentComplaints.map((complaint) => (
                    <tr
                      key={complaint._id}
                      className="border-b border-gray-100 last:border-0 dark:border-slate-800/70"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
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
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
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
                          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
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

export default StaffDashboard;