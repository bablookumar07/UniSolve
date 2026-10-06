import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Wrench,
  FileText,
  ArrowRight,
  Search,
  Eye,
  RefreshCw,
  AlertCircle,
  ClipboardList,
  MessageSquare,
} from "lucide-react";

import api from "../../api/axios";

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-700",
  ASSIGNED: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-purple-100 text-purple-700",
  RESOLVED: "bg-green-100 text-green-700",
  REOPENED: "bg-orange-100 text-orange-700",
  CLOSED: "bg-gray-100 text-gray-700",
};

const StudentSupport = () => {
  const [complaints, setComplaints] = useState([]);
  const [cases, setCases] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [activeType, setActiveType] = useState("ALL");

  const [search, setSearch] = useState("");

  // ============================================================
  // FETCH COMPLAINTS + CASES
  // ============================================================

  const fetchRequests = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [complaintsResponse, casesResponse] =
        await Promise.all([
          api.get("/complaints/my"),
          api.get("/cases/my"),
        ]);

      setComplaints(
        complaintsResponse.data?.complaints || []
      );

      setCases(
        casesResponse.data?.data || []
      );
    } catch (error) {
      console.error(
        "Fetch student support requests error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load your requests."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ============================================================
  // NORMALIZE COMPLAINTS + CASES
  // ============================================================

  const requests = useMemo(() => {
    const complaintRequests = complaints.map(
      (complaint) => ({
        id: complaint._id,
        requestId: complaint.complaintId,
        type: "COMPLAINT",
        title: complaint.title,
        category:
          complaint.category?.name || "—",
        status: complaint.status,
        priority: complaint.priority,
        createdAt: complaint.createdAt,
        route: `/student/complaints/${complaint._id}`,
      })
    );

    const caseRequests = cases.map((caseItem) => ({
      id: caseItem._id,
      requestId: caseItem.caseId,
      type: "CASE",
      title: caseItem.title,
      category:
        caseItem.subcategory?.name ||
        caseItem.category?.name ||
        caseItem.caseType ||
        "—",
      status: caseItem.status,
      priority: caseItem.priority,
      createdAt: caseItem.createdAt,
      route: `/student/cases/${caseItem._id}`,
    }));

    return [...complaintRequests, ...caseRequests].sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );
  }, [complaints, cases]);

  // ============================================================
  // FILTER
  // ============================================================

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesType =
        activeType === "ALL" ||
        request.type === activeType;

      const matchesSearch =
        !query ||
        request.title
          .toLowerCase()
          .includes(query) ||
        request.requestId
          .toLowerCase()
          .includes(query) ||
        request.category
          .toLowerCase()
          .includes(query);

      return matchesType && matchesSearch;
    });
  }, [requests, activeType, search]);

  const complaintCount = complaints.length;
  const caseCount = cases.length;

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <RefreshCw
            className="mx-auto mb-3 h-7 w-7 animate-spin text-blue-600"
          />

          <p className="text-sm text-gray-500">
            Loading your requests...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Student Support
        </h1>

        <h2 className="mt-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
          What do you need help with?
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Choose the right option so your request reaches the
          correct team faster.
        </p>
      </div>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle size={20} />

          <p className="text-sm">
            {error}
          </p>
        </div>
      )}

      {/* ======================================================
          ACTION CARDS
      ====================================================== */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* COMPLAINT */}
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm dark:border-blue-900/40 dark:from-blue-950/30 dark:to-slate-900">

          <div className="flex items-start justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
              <Wrench size={28} />
            </div>

            <ArrowRight
              className="text-blue-500"
              size={22}
            />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
            Report a Complaint
          </h2>

          <p className="mt-2 font-medium text-blue-700 dark:text-blue-400">
            Something is broken or needs fixing?
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
            Use the complaint system for physical,
            maintenance or infrastructure-related issues.
          </p>

          <div className="mt-5 rounded-xl border border-blue-100 bg-white/70 p-4 dark:border-blue-900/40 dark:bg-slate-900/50">

            <p className="text-sm font-semibold text-blue-800 dark:text-blue-400">
              Examples:
            </p>

            <div className="mt-3 grid gap-2 text-sm text-gray-600 dark:text-gray-400 sm:grid-cols-2">
              <span>• Fan / AC / Light not working</span>
              <span>• Furniture repair</span>
              <span>• Water leakage</span>
              <span>• Electrical problems</span>
              <span>• Hostel maintenance</span>
              <span>• Plumbing issues</span>
              <span>• Cleanliness issues</span>
              <span>• Campus maintenance</span>
            </div>
          </div>

          <Link
            to="/student/complaints/new"
            className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Report Complaint
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* CASE */}
        <div className="rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-6 shadow-sm dark:border-green-900/40 dark:from-green-950/30 dark:to-slate-900">

          <div className="flex items-start justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400">
              <FileText size={28} />
            </div>

            <ArrowRight
              className="text-green-500"
              size={22}
            />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
            Raise a Case
          </h2>

          <p className="mt-2 font-medium text-green-700 dark:text-green-400">
            Need academic, IT or administrative help?
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
            Use the case system for academic, IT,
            administrative and support-related requests.
          </p>

          <div className="mt-5 rounded-xl border border-green-100 bg-white/70 p-4 dark:border-green-900/40 dark:bg-slate-900/50">

            <p className="text-sm font-semibold text-green-800 dark:text-green-400">
              Examples:
            </p>

            <div className="mt-3 grid gap-2 text-sm text-gray-600 dark:text-gray-400 sm:grid-cols-2">
              <span>• Examination issues</span>
              <span>• Library requests</span>
              <span>• Internal marks</span>
              <span>• Transport issues</span>
              <span>• Attendance issues</span>
              <span>• Administrative support</span>
              <span>• IT / Portal problems</span>
              <span>• Academic queries</span>
            </div>
          </div>

          <Link
            to="/student/cases/new"
            className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Raise Case
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>

      {/* ======================================================
          MY REQUESTS
      ====================================================== */}

      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

        {/* Header */}
        <div className="border-b border-gray-100 p-6 dark:border-slate-800">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Requests
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                All your complaints and cases in one place.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fetchRequests(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <RefreshCw
                  size={16}
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

          {/* Search */}
          <div className="mt-5 flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by title, ID or category..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <select
              value={activeType}
              onChange={(e) =>
                setActiveType(e.target.value)
              }
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option value="ALL">
                All Types
              </option>

              <option value="COMPLAINT">
                Complaints
              </option>

              <option value="CASE">
                Cases
              </option>
            </select>
          </div>

          {/* Tabs */}
          <div className="mt-5 flex flex-wrap gap-2">

            <button
              type="button"
              onClick={() => setActiveType("ALL")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium ${
                activeType === "ALL"
                  ? "bg-blue-600 text-white"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800"
              }`}
            >
              <ClipboardList size={16} />
              All Requests ({requests.length})
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveType("COMPLAINT")
              }
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium ${
                activeType === "COMPLAINT"
                  ? "bg-blue-600 text-white"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800"
              }`}
            >
              <MessageSquare size={16} />
              Complaints ({complaintCount})
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveType("CASE")
              }
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium ${
                activeType === "CASE"
                  ? "bg-green-600 text-white"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800"
              }`}
            >
              <FileText size={16} />
              Cases ({caseCount})
            </button>
          </div>
        </div>

        {/* ====================================================
            DESKTOP TABLE
        ==================================================== */}

        <div className="hidden overflow-x-auto md:block">

          <table className="w-full text-left">

            <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-slate-950/50">
              <tr>
                <th className="px-5 py-4">
                  ID
                </th>

                <th className="px-5 py-4">
                  Type
                </th>

                <th className="px-5 py-4">
                  Title
                </th>

                <th className="px-5 py-4">
                  Category
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4">
                  Created
                </th>

                <th className="px-5 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">

              {filteredRequests.map((request) => (
                <tr
                  key={`${request.type}-${request.id}`}
                  className="transition hover:bg-gray-50 dark:hover:bg-slate-800/50"
                >
                  <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-gray-500">
                    {request.requestId}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        request.type === "COMPLAINT"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {request.type === "COMPLAINT" ? (
                        <Wrench size={13} />
                      ) : (
                        <FileText size={13} />
                      )}

                      {request.type === "COMPLAINT"
                        ? "Complaint"
                        : "Case"}
                    </span>
                  </td>

                  <td className="max-w-xs px-5 py-4">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {request.title}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {request.category}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        statusStyles[
                          request.status
                        ] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                    {new Date(
                      request.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <Link
                      to={request.route}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800"
                    >
                      <Eye size={14} />
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>

        {/* ====================================================
            MOBILE CARDS
        ==================================================== */}

        <div className="space-y-3 p-4 md:hidden">

          {filteredRequests.map((request) => (
            <div
              key={`${request.type}-${request.id}`}
              className="rounded-xl border border-gray-200 p-4 dark:border-slate-700"
            >
              <div className="flex items-start justify-between gap-3">

                <div>
                  <p className="font-mono text-xs text-gray-500">
                    {request.requestId}
                  </p>

                  <h3 className="mt-1 font-semibold text-gray-900 dark:text-white">
                    {request.title}
                  </h3>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    request.type === "COMPLAINT"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-green-50 text-green-700"
                  }`}
                >
                  {request.type}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {request.category}
                </span>

                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    statusStyles[
                      request.status
                    ] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {request.status}
                </span>
              </div>

              <Link
                to={request.route}
                className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium dark:border-slate-700"
              >
                <Eye size={15} />
                View Details
              </Link>
            </div>
          ))}

        </div>

        {/* Empty */}
        {filteredRequests.length === 0 && (
          <div className="p-12 text-center">
            <ClipboardList className="mx-auto h-10 w-10 text-gray-400" />

            <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">
              No requests found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filter.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default StudentSupport;