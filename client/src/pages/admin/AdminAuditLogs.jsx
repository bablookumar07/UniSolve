import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  FileText,
  User,
  ClipboardList,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { getAuditLogs } from "../../api/adminApi";

const AdminAuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchAuditLogs = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getAuditLogs();

      setAuditLogs(data.auditLogs || []);
    } catch (error) {
      console.error(
        "Failed to fetch audit logs:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load audit logs."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    return auditLogs.filter((log) => {
      const matchesSearch =
        !normalizedSearch ||
        log.action
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        log.details
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        log.performedBy?.name
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        log.performedBy?.email
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        log.complaint?.complaintId
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        log.complaint?.title
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesAction =
        actionFilter === "ALL" ||
        log.action === actionFilter;

      return matchesSearch && matchesAction;
    });
  }, [auditLogs, search, actionFilter]);

  const actionClasses = {
    CREATED:
      "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400",

    ASSIGNED:
      "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",

    STARTED:
      "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",

    RESOLVED:
      "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",

    REOPENED:
      "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",

    CLOSED:
      "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400",
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Loader2
            size={18}
            className="animate-spin"
          />
          Loading audit logs...
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
            Audit Logs
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Track important actions performed across complaints.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchAuditLogs(true)}
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

      {/* Summary */}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={FileText}
          label="Total Events"
          value={auditLogs.length}
        />

        <SummaryCard
          icon={ClipboardList}
          label="Created"
          value={
            auditLogs.filter(
              (log) => log.action === "CREATED"
            ).length
          }
        />

        <SummaryCard
          icon={ArrowRight}
          label="Assignments"
          value={
            auditLogs.filter(
              (log) => log.action === "ASSIGNED"
            ).length
          }
        />

        <SummaryCard
          icon={User}
          label="Resolutions"
          value={
            auditLogs.filter(
              (log) => log.action === "RESOLVED"
            ).length
          }
        />
      </div>

      {/* Filters */}

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
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
              placeholder="Search complaint, user, action..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <select
            value={actionFilter}
            onChange={(event) =>
              setActionFilter(event.target.value)
            }
            className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-gray-300"
          >
            <option value="ALL">
              All Actions
            </option>

            <option value="CREATED">
              Created
            </option>

            <option value="ASSIGNED">
              Assigned
            </option>

            <option value="STARTED">
              Started
            </option>

            <option value="RESOLVED">
              Resolved
            </option>

            <option value="REOPENED">
              Reopened
            </option>

            <option value="CLOSED">
              Closed
            </option>
          </select>
        </div>
      </div>

      {/* Result count */}

      <div className="mb-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {filteredLogs.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {auditLogs.length}
          </span>{" "}
          events
        </p>
      </div>

      {/* Logs */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {filteredLogs.length === 0 ? (
          <div className="flex min-h-60 flex-col items-center justify-center px-6 text-center">
            <FileText
              size={36}
              className="mb-3 text-gray-300 dark:text-slate-700"
            />

            <h3 className="font-semibold text-gray-900 dark:text-white">
              No audit logs found
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try changing your search or action filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-slate-800 dark:bg-slate-950/50">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Action
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Complaint
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Performed By
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Status Change
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Details
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredLogs.map((log) => (
                  <tr
                    key={log._id}
                    className="border-b border-gray-100 last:border-0 dark:border-slate-800"
                  >
                    {/* Action */}

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          actionClasses[log.action] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>

                    {/* Complaint */}

                    <td className="px-6 py-5">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {log.complaint
                            ?.complaintId ||
                            "—"}
                        </p>

                        <p className="mt-0.5 max-w-xs truncate text-xs text-gray-500 dark:text-gray-400">
                          {log.complaint?.title ||
                            "Complaint unavailable"}
                        </p>
                      </div>
                    </td>

                    {/* Performed By */}

                    <td className="px-6 py-5">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {log.performedBy
                            ?.name || "Unknown"}
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          {log.performedBy?.role ||
                            "—"}
                        </p>
                      </div>
                    </td>

                    {/* Status */}

                    <td className="px-6 py-5">
                      {log.previousStatus ||
                      log.newStatus ? (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="rounded-md bg-gray-100 px-2 py-1 font-medium text-gray-600 dark:bg-slate-800 dark:text-gray-400">
                            {log.previousStatus ||
                              "—"}
                          </span>

                          <ArrowRight
                            size={14}
                            className="text-gray-400"
                          />

                          <span className="rounded-md bg-blue-50 px-2 py-1 font-medium text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                            {log.newStatus || "—"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">
                          —
                        </span>
                      )}
                    </td>

                    {/* Details */}

                    <td className="max-w-xs px-6 py-5">
                      <p className="truncate text-sm text-gray-600 dark:text-gray-300">
                        {log.details || "—"}
                      </p>
                    </td>

                    {/* Date */}

                    <td className="whitespace-nowrap px-6 py-5 text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(
                          log.createdAt
                        ).toLocaleDateString()}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-400">
                        {new Date(
                          log.createdAt
                        ).toLocaleTimeString()}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {label}
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400">
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
};

export default AdminAuditLogs;