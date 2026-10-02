import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  FileText,
  Plus,
  RefreshCcw,
  Search,
} from "lucide-react";

import { getMyComplaints } from "../../api/complaintApi";

const StudentComplaints = () => {
  const [complaints, setComplaints] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyComplaints();

      setComplaints(data.complaints || []);
    } catch (error) {
      console.error("Failed to load complaints:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load your complaints."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const filteredComplaints = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return complaints.filter((complaint) => {
      const matchesSearch =
        !normalizedSearch ||
        complaint.title?.toLowerCase().includes(normalizedSearch) ||
        complaint.complaintId
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        complaint.location
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        complaint.category?.name
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" ||
        complaint.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" ||
        complaint.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    complaints,
    search,
    statusFilter,
    priorityFilter,
  ]);

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
      LOW: "text-gray-600 dark:text-gray-400",
      MEDIUM: "text-blue-600 dark:text-blue-400",
      HIGH: "text-orange-600 dark:text-orange-400",
      CRITICAL: "text-red-600 dark:text-red-400",
    };

    return (
      classes[priority] ||
      "text-gray-600 dark:text-gray-400"
    );
  };

  return (
    <div className="min-h-full bg-gray-50 p-4 dark:bg-slate-950 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Student Portal
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              My Complaints
            </h1>

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              View and track all complaints you have submitted.
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
              New Complaint
            </Link>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

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
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">

            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by title, ID, location or category..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300"
            >
              <option value="ALL">
                All Statuses
              </option>

              <option value="PENDING">
                Pending
              </option>

              <option value="ASSIGNED">
                Assigned
              </option>

              <option value="IN_PROGRESS">
                In Progress
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

            {/* Priority */}
            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value)
              }
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300"
            >
              <option value="ALL">
                All Priorities
              </option>

              <option value="LOW">
                Low
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="HIGH">
                High
              </option>

              <option value="CRITICAL">
                Critical
              </option>
            </select>
          </div>
        </section>

        {/* Results */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

          {/* Result Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-slate-800 sm:px-6">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Complaints
              </h2>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {loading
                  ? "Loading..."
                  : `${filteredComplaints.length} complaint${
                      filteredComplaints.length !== 1
                        ? "s"
                        : ""
                    } found`}
              </p>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center px-6 py-16">
              <RefreshCcw
                size={25}
                className="animate-spin text-blue-600"
              />
            </div>
          )}

          {/* Empty */}
          {!loading && filteredComplaints.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400">
                <FileText size={25} />
              </div>

              <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
                No complaints found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
                {complaints.length === 0
                  ? "You haven't submitted any complaints yet."
                  : "Try changing your search or filters."}
              </p>

              {complaints.length === 0 && (
                <Link
                  to="/student/complaints/new"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Plus size={17} />
                  Report Complaint
                </Link>
              )}
            </div>
          )}

          {/* Table */}
          {!loading &&
            filteredComplaints.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px]">
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
                        Location
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredComplaints.map(
                      (complaint) => (
                        <tr
                          key={complaint._id}
                          className="border-b border-gray-100 last:border-0 dark:border-slate-800/70"
                        >
                          <td className="px-6 py-5">
                            <div>
                              <Link
                                to={`/student/complaints/${complaint._id}`}
                                className="font-medium text-gray-900 transition hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                              >
                                {complaint.title}
                              </Link>

                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {complaint.complaintId}
                              </p>
                            </div>
                          </td>

                          <td className="px-6 py-5 text-sm text-gray-600 dark:text-gray-300">
                            {complaint.category?.name ||
                              "—"}
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`text-sm font-medium ${getPriorityClass(
                                complaint.priority
                              )}`}
                            >
                              {complaint.priority}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                                complaint.status
                              )}`}
                            >
                              {complaint.status.replaceAll(
                                "_",
                                " "
                              )}
                            </span>
                          </td>

                          <td className="max-w-[180px] px-6 py-5 text-sm text-gray-600 dark:text-gray-300">
                            <span className="block truncate">
                              {complaint.location}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-500 dark:text-gray-400">
                            {new Date(
                              complaint.createdAt
                            ).toLocaleDateString(
                              "en-IN"
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
        </section>
      </div>
    </div>
  );
};

export default StudentComplaints;