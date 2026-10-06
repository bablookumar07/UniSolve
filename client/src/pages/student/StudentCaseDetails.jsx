import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Clock,
  User,
  MapPin,
  Tag,
  FileText,
} from "lucide-react";

import { getCaseById } from "../../api/caseApi";

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-700",
  ASSIGNED: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-purple-100 text-purple-700",
  RESOLVED: "bg-green-100 text-green-700",
  REOPENED: "bg-orange-100 text-orange-700",
  CLOSED: "bg-gray-100 text-gray-700",
};

const priorityStyles = {
  LOW: "text-green-600",
  MEDIUM: "text-yellow-600",
  HIGH: "text-orange-600",
  CRITICAL: "text-red-600",
};

const StudentCaseDetails = () => {
  const { id } = useParams();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchCase = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await getCaseById(id);

      setCaseData(response.data);
    } catch (error) {
      console.error("Fetch case details error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load case details."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCase();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <RefreshCw
            size={18}
            className="animate-spin"
          />
          Loading case details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Link
  to="/student/requests"
  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800"
>
  <ArrowLeft size={16} />
  Back to My Requests
</Link>

        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p className="font-medium">
              Unable to load case
            </p>

            <p className="mt-1 text-sm">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            to="/student/cases"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
          >
            <ArrowLeft size={16} />
            Back to My Cases
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm text-gray-500">
              {caseData.caseId}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                statusStyles[caseData.status] ||
                "bg-gray-100 text-gray-700"
              }`}
            >
              {caseData.status}
            </span>
          </div>

          <h1 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
            {caseData.title}
          </h1>
        </div>

        <button
          type="button"
          onClick={() => fetchCase(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <RefreshCw
            size={16}
            className={
              refreshing ? "animate-spin" : ""
            }
          />
          Refresh
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="space-y-6 lg:col-span-2">
          {/* Description */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2">
              <FileText
                size={18}
                className="text-blue-600"
              />

              <h2 className="font-semibold text-gray-900 dark:text-white">
                Description
              </h2>
            </div>

            <p className="whitespace-pre-wrap text-sm leading-7 text-gray-600 dark:text-gray-300">
              {caseData.description}
            </p>
          </section>

          {/* Resolution */}
          {caseData.resolution?.notes && (
            <section className="rounded-2xl border border-green-200 bg-green-50 p-6 dark:border-green-900/40 dark:bg-green-950/20">
              <h2 className="font-semibold text-green-800 dark:text-green-400">
                Resolution
              </h2>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-green-700 dark:text-green-300">
                {caseData.resolution.notes}
              </p>

              {caseData.resolvedAt && (
                <p className="mt-3 text-xs text-green-600">
                  Resolved on{" "}
                  {new Date(
                    caseData.resolvedAt
                  ).toLocaleString()}
                </p>
              )}
            </section>
          )}

          {/* Reopen reason */}
          {caseData.resolution?.reopenReason && (
            <section className="rounded-2xl border border-orange-200 bg-orange-50 p-6 dark:border-orange-900/40 dark:bg-orange-950/20">
              <h2 className="font-semibold text-orange-800 dark:text-orange-400">
                Reopen Reason
              </h2>

              <p className="mt-3 text-sm leading-7 text-orange-700 dark:text-orange-300">
                {caseData.resolution.reopenReason}
              </p>
            </section>
          )}
        </div>

        {/* Sidebar information */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-5 font-semibold text-gray-900 dark:text-white">
              Case Information
            </h2>

            <div className="space-y-5">
              <div>
                <p className="text-xs text-gray-500">
                  Case Type
                </p>

                <p className="mt-1 font-medium text-gray-900 dark:text-white">
                  {caseData.caseType}
                </p>
              </div>

              <div className="flex gap-3">
                <Tag
                  size={17}
                  className="mt-0.5 text-gray-400"
                />

                <div>
                  <p className="text-xs text-gray-500">
                    Category
                  </p>

                  <p className="mt-1 font-medium text-gray-900 dark:text-white">
                    {caseData.category?.name || "—"}
                  </p>

                  {caseData.subcategory && (
                    <p className="mt-1 text-xs text-gray-500">
                      {caseData.subcategory.name}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Priority
                </p>

                <p
                  className={`mt-1 font-semibold ${
                    priorityStyles[
                      caseData.priority
                    ] || ""
                  }`}
                >
                  {caseData.priority}
                </p>
              </div>

              {caseData.location && (
                <div className="flex gap-3">
                  <MapPin
                    size={17}
                    className="mt-0.5 text-gray-400"
                  />

                  <div>
                    <p className="text-xs text-gray-500">
                      Location
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                      {caseData.location}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Clock
                  size={17}
                  className="mt-0.5 text-gray-400"
                />

                <div>
                  <p className="text-xs text-gray-500">
                    Created
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(
                      caseData.createdAt
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              {caseData.assignedTo && (
                <div className="flex gap-3">
                  <User
                    size={17}
                    className="mt-0.5 text-gray-400"
                  />

                  <div>
                    <p className="text-xs text-gray-500">
                      Assigned To
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                      {caseData.assignedTo.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {caseData.assignedTo.email}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StudentCaseDetails;