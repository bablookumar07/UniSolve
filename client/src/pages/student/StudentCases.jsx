import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  RefreshCw,
  Plus,
  FileText,
  Clock,
  AlertCircle,
} from "lucide-react";

import { getMyCases } from "../../api/caseApi";

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

const StudentCases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchCases = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await getMyCases();

      setCases(response.data || []);
    } catch (error) {
      console.error("Fetch student cases error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load your cases"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-3 h-7 w-7 animate-spin" />
          <p className="text-gray-500">
            Loading your cases...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Cases
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track and manage the cases you have submitted.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => fetchCases(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 dark:hover:bg-gray-800"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>

          <Link
            to="/student/cases/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Raise Case
          </Link>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!error && cases.length === 0 && (
        <div className="rounded-xl border border-dashed p-10 text-center dark:border-gray-700">
          <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            No cases yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            You haven't raised any cases yet. Create your first case
            to get help from the appropriate campus team.
          </p>

          <Link
            to="/student/cases/new"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Raise Your First Case
          </Link>
        </div>
      )}

      {/* Cases */}
      {cases.length > 0 && (
        <div className="grid gap-4">
          {cases.map((caseItem) => (
            <div
              key={caseItem._id}
              className="rounded-xl border bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Main Information */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-gray-500">
                      {caseItem.caseId}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        statusStyles[caseItem.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {caseItem.status}
                    </span>
                  </div>

                  <h2 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {caseItem.title}
                  </h2>

                  <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                    {caseItem.description}
                  </p>

                  {/* Metadata */}
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
                    <span>
                      Type:{" "}
                      <strong className="text-gray-700 dark:text-gray-300">
                        {caseItem.caseType}
                      </strong>
                    </span>

                    <span>
                      Category:{" "}
                      <strong className="text-gray-700 dark:text-gray-300">
                        {caseItem.category?.name || "—"}
                      </strong>
                    </span>

                    {caseItem.subcategory && (
                      <span>
                        Subcategory:{" "}
                        <strong className="text-gray-700 dark:text-gray-300">
                          {caseItem.subcategory.name}
                        </strong>
                      </span>
                    )}

                    <span
                      className={
                        priorityStyles[caseItem.priority] || ""
                      }
                    >
                      <Clock className="mr-1 inline h-3.5 w-3.5" />
                      {caseItem.priority}
                    </span>
                  </div>
                </div>

                {/* Action */}
                <div>
                  <Link
                    to={`/student/cases/${caseItem._id}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 lg:w-auto dark:hover:bg-gray-800"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCases;