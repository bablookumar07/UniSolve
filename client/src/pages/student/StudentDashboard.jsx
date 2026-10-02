import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  Plus,
  RefreshCcw,
  Wrench,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { getMyComplaints } from "../../api/complaintApi";

const StudentDashboard = () => {
  const { user } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyComplaints();

      setComplaints(data.complaints || []);
    } catch (err) {
      console.error("Failed to load complaints:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load your complaints."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const statistics = useMemo(() => {
    return {
      total: complaints.length,

      pending: complaints.filter(
        (complaint) => complaint.status === "PENDING"
      ).length,

      assigned: complaints.filter(
        (complaint) => complaint.status === "ASSIGNED"
      ).length,

      inProgress: complaints.filter(
        (complaint) => complaint.status === "IN_PROGRESS"
      ).length,

      resolved: complaints.filter(
        (complaint) => complaint.status === "RESOLVED"
      ).length,

      reopened: complaints.filter(
        (complaint) => complaint.status === "REOPENED"
      ).length,

      closed: complaints.filter(
        (complaint) => complaint.status === "CLOSED"
      ).length,
    };
  }, [complaints]);

  const recentComplaints = complaints.slice(0, 5);

  const statCards = [
    {
      label: "Total Complaints",
      value: statistics.total,
      icon: FileText,
    },
    {
      label: "Pending",
      value: statistics.pending,
      icon: Clock3,
    },
    {
      label: "In Progress",
      value: statistics.inProgress,
      icon: Wrench,
    },
    {
      label: "Resolved",
      value: statistics.resolved,
      icon: CheckCircle2,
    },
    {
      label: "Closed",
      value: statistics.closed,
      icon: CheckCircle2,
    },
  ];

  const getStatusClass = (status) => {
    const classes = {
      PENDING:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",

      ASSIGNED:
        "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",

      IN_PROGRESS:
        "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",

      RESOLVED:
        "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",

      REOPENED:
        "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",

      CLOSED:
        "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300",
    };

    return (
      classes[status] ||
      "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300"
    );
  };

  const getPriorityClass = (priority) => {
    const classes = {
      LOW:
        "text-gray-600 dark:text-gray-400",

      MEDIUM:
        "text-blue-600 dark:text-blue-400",

      HIGH:
        "text-orange-600 dark:text-orange-400",

      CRITICAL:
        "text-red-600 dark:text-red-400",
    };

    return classes[priority] || "text-gray-600 dark:text-gray-400";
  };

  return (
    <div className="min-h-full bg-gray-50 p-4 dark:bg-slate-950 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Student Portal
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Welcome back, {user?.name?.split(" ")[0] || "Student"}
            </h1>

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Track your campus complaints and stay updated on their progress.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={fetchComplaints}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-slate-800"
            >
              <RefreshCcw
                size={17}
                className={loading ? "animate-spin" : ""}
              />

              Refresh
            </button>

            <Link
              to="/student/complaints/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus size={18} />
              Report Complaint
            </Link>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            <AlertCircle className="mt-0.5 shrink-0" size={20} />

            <div>
              <p className="font-medium">
                Unable to load dashboard
              </p>

              <p className="mt-1 text-sm">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Statistics */}
        <section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {statCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.label}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between">
                    <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      <Icon size={20} />
                    </div>

                    {loading && (
                      <Loader2
                        size={17}
                        className="animate-spin text-gray-400"
                      />
                    )}
                  </div>

                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    {card.label}
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                    {loading ? "—" : card.value}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Complaints */}
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-slate-800 sm:px-6">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Recent Complaints
              </h2>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Your latest submitted complaints
              </p>
            </div>

            <Link
              to="/student/complaints"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center px-6 py-12">
              <Loader2
                size={24}
                className="animate-spin text-blue-600"
              />
            </div>
          ) : recentComplaints.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText
                size={36}
                className="mx-auto text-gray-400"
              />

              <h3 className="mt-3 font-medium text-gray-900 dark:text-white">
                No complaints yet
              </h3>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                You haven't reported any campus issues yet.
              </p>

              <Link
                to="/student/complaints/new"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Plus size={17} />
                Report your first complaint
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500 dark:border-slate-800 dark:text-gray-400">
                    <th className="px-6 py-4 font-medium">
                      Complaint
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Category
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Priority
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Status
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentComplaints.map((complaint) => (
                    <tr
                      key={complaint._id}
                      className="border-b border-gray-100 last:border-0 dark:border-slate-800/70"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {complaint.title}
                          </p>

                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {complaint.complaintId}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {complaint.category?.name || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-medium ${getPriorityClass(
                            complaint.priority
                          )}`}
                        >
                          {complaint.priority}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                            complaint.status
                          )}`}
                        >
                          {complaint.status.replaceAll("_", " ")}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(
                          complaint.createdAt
                        ).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default StudentDashboard;