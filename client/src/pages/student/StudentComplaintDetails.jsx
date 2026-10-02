import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  MessageSquare,
  RotateCcw,
  ShieldCheck,
  User,
  Wrench,
  XCircle,
} from "lucide-react";

import {
  closeComplaint,
  getComplaintById,
  reopenComplaint,
} from "../../api/complaintApi";

const StudentComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [showReopenForm, setShowReopenForm] = useState(false);
  const [reopenReason, setReopenReason] = useState("");

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getComplaintById(id);

      setComplaint(data.complaint);
    } catch (error) {
      console.error("Failed to load complaint:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load complaint details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const handleClose = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to close this complaint? This means you accept the resolution."
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");

      await closeComplaint(complaint._id);

      await fetchComplaint();
    } catch (error) {
      console.error("Close complaint error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to close the complaint."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleReopen = async (event) => {
    event.preventDefault();

    if (!reopenReason.trim()) {
      setError("Please provide a reason for reopening the complaint.");
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await reopenComplaint(
        complaint._id,
        reopenReason.trim()
      );

      setReopenReason("");
      setShowReopenForm(false);

      await fetchComplaint();
    } catch (error) {
      console.error("Reopen complaint error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to reopen the complaint."
      );
    } finally {
      setActionLoading(false);
    }
  };

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

  const workflowSteps = [
    {
      status: "PENDING",
      label: "Submitted",
      icon: FileText,
    },
    {
      status: "ASSIGNED",
      label: "Assigned",
      icon: User,
    },
    {
      status: "IN_PROGRESS",
      label: "In Progress",
      icon: Wrench,
    },
    {
      status: "RESOLVED",
      label: "Resolved",
      icon: CheckCircle2,
    },
    {
      status: "CLOSED",
      label: "Closed",
      icon: ShieldCheck,
    },
  ];

  const getStepState = (stepStatus) => {
    if (!complaint) return "upcoming";

    const statusOrder = [
      "PENDING",
      "ASSIGNED",
      "IN_PROGRESS",
      "RESOLVED",
      "CLOSED",
    ];

    const currentStatus =
      complaint.status === "REOPENED"
        ? "IN_PROGRESS"
        : complaint.status;

    const currentIndex =
      statusOrder.indexOf(currentStatus);

    const stepIndex =
      statusOrder.indexOf(stepStatus);

    if (stepIndex < currentIndex) return "completed";

    if (stepIndex === currentIndex) return "current";

    return "upcoming";
  };

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-gray-50 dark:bg-slate-950">
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <Clock3
            size={20}
            className="animate-spin"
          />
          Loading complaint...
        </div>
      </div>
    );
  }

  if (error && !complaint) {
    return (
      <div className="min-h-full bg-gray-50 p-6 dark:bg-slate-950">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/student/complaints"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to complaints
          </Link>

          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            <div className="flex items-start gap-3">
              <AlertCircle size={21} />

              <div>
                <h2 className="font-semibold">
                  Unable to load complaint
                </h2>

                <p className="mt-1 text-sm">
                  {error}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!complaint) return null;

  return (
    <div className="min-h-full bg-gray-50 p-4 dark:bg-slate-950 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Back */}
        <Link
          to="/student/complaints"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to My Complaints
        </Link>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm">
              {error}
            </p>
          </div>
        )}

        {/* Header */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {complaint.complaintId}
                </span>

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                    complaint.status
                  )}`}
                >
                  {complaint.status.replaceAll(
                    "_",
                    " "
                  )}
                </span>
              </div>

              <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {complaint.title}
              </h1>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Submitted on{" "}
                {new Date(
                  complaint.createdAt
                ).toLocaleString("en-IN")}
              </p>
            </div>

            {/* Student Actions */}
            <div className="flex flex-wrap gap-3">
              {complaint.status === "RESOLVED" && (
                <>
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={actionLoading}
                    className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <CheckCircle2 size={17} />
                    Accept & Close
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setShowReopenForm(
                        (previous) => !previous
                      )
                    }
                    disabled={actionLoading}
                    className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-700 transition hover:bg-orange-100 disabled:opacity-60 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400"
                  >
                    <RotateCcw size={17} />
                    Reopen
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Reopen Form */}
        {showReopenForm && (
          <form
            onSubmit={handleReopen}
            className="rounded-2xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-500/20 dark:bg-orange-500/5"
          >
            <div className="flex items-start gap-3">
              <RotateCcw
                size={20}
                className="mt-0.5 shrink-0 text-orange-600 dark:text-orange-400"
              />

              <div className="w-full">
                <h2 className="font-semibold text-orange-900 dark:text-orange-300">
                  Reopen Complaint
                </h2>

                <p className="mt-1 text-sm text-orange-800 dark:text-orange-400">
                  Explain why the issue has not been fully resolved.
                </p>

                <textarea
                  value={reopenReason}
                  onChange={(event) =>
                    setReopenReason(event.target.value)
                  }
                  rows={4}
                  placeholder="Describe what is still wrong..."
                  className="mt-4 w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-orange-500/20 dark:bg-slate-900 dark:text-white"
                />

                <div className="mt-3 flex gap-3">
                  <button
                    type="submit"
                    disabled={
                      actionLoading ||
                      !reopenReason.trim()
                    }
                    className="rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {actionLoading
                      ? "Reopening..."
                      : "Confirm Reopen"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setShowReopenForm(false)
                    }
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Workflow */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Clock3
              size={19}
              className="text-blue-600 dark:text-blue-400"
            />

            <h2 className="font-semibold text-gray-900 dark:text-white">
              Complaint Progress
            </h2>
          </div>

          <div className="mt-8 overflow-x-auto pb-2">
            <div className="flex min-w-[700px] items-start">
              {workflowSteps.map(
                (step, index) => {
                  const Icon = step.icon;
                  const state =
                    getStepState(step.status);

                  return (
                    <div
                      key={step.status}
                      className="relative flex flex-1 flex-col items-center"
                    >
                      {index !== 0 && (
                        <div
                          className={`absolute right-1/2 top-5 h-0.5 w-full ${
                            state === "completed" ||
                            state === "current"
                              ? "bg-blue-600"
                              : "bg-gray-200 dark:bg-slate-700"
                          }`}
                        />
                      )}

                      <div
                        className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                          state === "completed"
                            ? "border-blue-600 bg-blue-600 text-white"
                            : state === "current"
                              ? "border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                              : "border-gray-200 bg-white text-gray-400 dark:border-slate-700 dark:bg-slate-900"
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                      <p
                        className={`mt-3 text-xs font-medium ${
                          state === "upcoming"
                            ? "text-gray-400 dark:text-gray-600"
                            : "text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {complaint.status === "REOPENED" && (
            <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-500/20 dark:bg-orange-500/10">
              <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                This complaint has been reopened.
              </p>

              {complaint.resolution?.reopenReason && (
                <p className="mt-1 text-sm text-orange-700 dark:text-orange-400">
                  Reason:{" "}
                  {complaint.resolution.reopenReason}
                </p>
              )}
            </div>
          )}
        </section>

        {/* Complaint Information */}
        <div className="grid gap-6 lg:grid-cols-3">

          <section className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <FileText
                size={19}
                className="text-blue-600 dark:text-blue-400"
              />

              <h2 className="font-semibold text-gray-900 dark:text-white">
                Complaint Description
              </h2>
            </div>

            <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-gray-600 dark:text-gray-300">
              {complaint.description}
            </p>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Details
            </h2>

            <div className="mt-5 space-y-5">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Category
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {complaint.category?.name || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Priority
                </p>

                <p
                  className={`mt-1 text-sm font-semibold ${getPriorityClass(
                    complaint.priority
                  )}`}
                >
                  {complaint.priority}
                </p>
              </div>

              <div>
                <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                  <MapPin size={14} />
                  Location
                </p>

                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {complaint.location}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Submitted As
                </p>

                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {complaint.isAnonymous
                    ? "Anonymous"
                    : "Your account"}
                </p>
              </div>

              {complaint.assignedTo && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Assigned Staff
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {complaint.assignedTo.name}
                  </p>

                  {complaint.assignedTo.email && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {complaint.assignedTo.email}
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Evidence */}
        {complaint.evidence?.length > 0 && (
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <FileText
                size={19}
                className="text-blue-600 dark:text-blue-400"
              />

              <h2 className="font-semibold text-gray-900 dark:text-white">
                Submitted Evidence
              </h2>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {complaint.evidence.map(
                (item, index) => (
                  <a
                    key={item.publicId || index}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700"
                  >
                    <img
                      src={item.url}
                      alt={`Complaint evidence ${index + 1}`}
                      className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
                    />

                    <div className="p-3 text-xs font-medium text-gray-600 dark:text-gray-300">
                      Evidence {index + 1}
                    </div>
                  </a>
                )
              )}
            </div>
          </section>
        )}

        {/* Resolution */}
        {complaint.resolution?.notes && (
          <section className="rounded-2xl border border-green-200 bg-green-50 p-6 dark:border-green-500/20 dark:bg-green-500/5">
            <div className="flex items-start gap-3">
              <CheckCircle2
                size={21}
                className="mt-0.5 shrink-0 text-green-600 dark:text-green-400"
              />

              <div className="flex-1">
                <h2 className="font-semibold text-green-900 dark:text-green-300">
                  Resolution
                </h2>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-green-800 dark:text-green-400">
                  {complaint.resolution.notes}
                </p>

                {complaint.resolvedAt && (
                  <p className="mt-3 text-xs text-green-700 dark:text-green-500">
                    Resolved on{" "}
                    {new Date(
                      complaint.resolvedAt
                    ).toLocaleString("en-IN")}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Resolution Evidence */}
        {complaint.resolution?.evidence?.length > 0 && (
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <Wrench
                size={19}
                className="text-blue-600 dark:text-blue-400"
              />

              <h2 className="font-semibold text-gray-900 dark:text-white">
                Resolution Evidence
              </h2>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {complaint.resolution.evidence.map(
                (item, index) => (
                  <a
                    key={item.publicId || index}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700"
                  >
                    <img
                      src={item.url}
                      alt={`Resolution evidence ${index + 1}`}
                      className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
                    />

                    <div className="p-3 text-xs font-medium text-gray-600 dark:text-gray-300">
                      Resolution evidence {index + 1}
                    </div>
                  </a>
                )
              )}
            </div>
          </section>
        )}

        {/* Closed Information */}
        {complaint.status === "CLOSED" &&
          complaint.closedAt && (
            <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <ShieldCheck
                size={21}
                className="mt-0.5 text-green-600 dark:text-green-400"
              />

              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Complaint closed
                </p>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  You accepted the resolution on{" "}
                  {new Date(
                    complaint.closedAt
                  ).toLocaleString("en-IN")}.
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default StudentComplaintDetails;