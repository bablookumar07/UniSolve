import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileImage,
  Loader2,
  MapPin,
  Play,
  Send,
  User,
} from "lucide-react";

import {
  getComplaintById,
  startComplaint,
  resolveComplaint,
  uploadResolutionEvidence,
} from "../../api/complaintApi";

const StaffComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const [resolutionNotes, setResolutionNotes] = useState("");

  const [evidenceFile, setEvidenceFile] = useState(null);
  const [evidencePreview, setEvidencePreview] = useState("");

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getComplaintById(id);

      setComplaint(data.complaint);
    } catch (error) {
      console.error("Failed to fetch complaint:", error);

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

  useEffect(() => {
    return () => {
      if (evidencePreview) {
        URL.revokeObjectURL(evidencePreview);
      }
    };
  }, [evidencePreview]);

  const handleStartComplaint = async () => {
    try {
      setActionLoading(true);
      setActionError("");

      const data = await startComplaint(id);

      setComplaint(data.complaint);
    } catch (error) {
      console.error("Start complaint error:", error);

      setActionError(
        error.response?.data?.message ||
          "Unable to start complaint."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleEvidenceChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setActionError(
        "Only JPEG, PNG, and WebP images are allowed."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setActionError("Evidence image must be smaller than 5 MB.");

      event.target.value = "";
      return;
    }

    if (evidencePreview) {
      URL.revokeObjectURL(evidencePreview);
    }

    setEvidenceFile(file);
    setEvidencePreview(URL.createObjectURL(file));
    setActionError("");
  };

  const handleResolveComplaint = async () => {
    const notes = resolutionNotes.trim();

    if (!notes) {
      setActionError("Please provide resolution notes.");
      return;
    }

    if (notes.length < 10) {
      setActionError(
        "Resolution notes must contain at least 10 characters."
      );
      return;
    }

    try {
      setActionLoading(true);
      setActionError("");

      let updatedComplaint;

      /*
       * First upload evidence if selected.
       */
      if (evidenceFile) {
        const evidenceResponse =
          await uploadResolutionEvidence(
            id,
            evidenceFile
          );

        updatedComplaint = evidenceResponse.complaint;
      }

      /*
       * Then mark complaint as resolved.
       */
      const resolveResponse = await resolveComplaint(
        id,
        notes
      );

      setComplaint(resolveResponse.complaint);

      setResolutionNotes("");
      setEvidenceFile(null);

      if (evidencePreview) {
        URL.revokeObjectURL(evidencePreview);
        setEvidencePreview("");
      }
    } catch (error) {
      console.error("Resolve complaint error:", error);

      setActionError(
        error.response?.data?.message ||
          "Unable to resolve complaint."
      );

      /*
       * Refresh the complaint because evidence may have
       * uploaded successfully before resolution failed.
       */
      await fetchComplaint();
    } finally {
      setActionLoading(false);
    }
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

    return (
      classes[priority] ||
      "text-gray-600 dark:text-gray-400"
    );
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <Loader2
            size={20}
            className="animate-spin"
          />
          <span>Loading complaint...</span>
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <section className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/staff/complaints"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to complaints
          </Link>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-500/20 dark:bg-red-500/10">
            <div className="flex items-start gap-3 text-red-700 dark:text-red-400">
              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0"
              />

              <div>
                <h2 className="font-semibold">
                  Unable to load complaint
                </h2>

                <p className="mt-1 text-sm">
                  {error ||
                    "Complaint could not be found."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const canStart =
    complaint.status === "ASSIGNED" ||
    complaint.status === "REOPENED";

  const canResolve =
    complaint.status === "IN_PROGRESS";

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Back */}
        <Link
          to="/staff/complaints"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to complaints
        </Link>

        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {complaint.complaintId}
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {complaint.title}
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Submitted on {formatDate(complaint.createdAt)}
            </p>
          </div>

          <span
            className={`inline-flex w-fit rounded-full px-3 py-1.5 text-sm font-medium ${getStatusClasses(
              complaint.status
            )}`}
          >
            {complaint.status.replaceAll("_", " ")}
          </span>
        </div>

        {/* Action Error */}
        {actionError && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm">
              {actionError}
            </p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

          {/* Main */}
          <div className="space-y-6">

            {/* Complaint Information */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Complaint Details
              </h2>

              <div className="mt-5">
                <p className="whitespace-pre-wrap text-sm leading-7 text-gray-600 dark:text-gray-300">
                  {complaint.description}
                </p>
              </div>
            </div>

            {/* Evidence */}
            {complaint.evidence?.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2">
                  <FileImage
                    size={19}
                    className="text-gray-500 dark:text-gray-400"
                  />

                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Submitted Evidence
                  </h2>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {complaint.evidence.map(
                    (image, index) => (
                      <a
                        key={
                          image.publicId ||
                          image.url ||
                          index
                        }
                        href={image.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700"
                      >
                        <img
                          src={image.url}
                          alt={`Complaint evidence ${
                            index + 1
                          }`}
                          className="h-52 w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      </a>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Resolution */}
            {complaint.resolution?.notes && (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-6 dark:border-green-500/20 dark:bg-green-500/5">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={19}
                    className="text-green-600 dark:text-green-400"
                  />

                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Resolution
                  </h2>
                </div>

                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-gray-700 dark:text-gray-300">
                  {complaint.resolution.notes}
                </p>

                {complaint.resolvedAt && (
                  <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                    Resolved on{" "}
                    {formatDate(
                      complaint.resolvedAt
                    )}
                  </p>
                )}
              </div>
            )}

            {/* Resolution Evidence */}
            {complaint.resolution?.evidence?.length >
              0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Resolution Evidence
                </h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {complaint.resolution.evidence.map(
                    (image, index) => (
                      <a
                        key={
                          image.publicId ||
                          image.url ||
                          index
                        }
                        href={image.url}
                        target="_blank"
                        rel="noreferrer"
                        className="overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700"
                      >
                        <img
                          src={image.url}
                          alt={`Resolution evidence ${
                            index + 1
                          }`}
                          className="h-52 w-full object-cover"
                        />
                      </a>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">

            {/* Complaint Meta */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Information
              </h2>

              <div className="mt-5 space-y-5">

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Category
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">
                    {complaint.category?.name ||
                      "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Priority
                  </p>

                  <p
                    className={`mt-1 text-sm font-semibold ${getPriorityClasses(
                      complaint.priority
                    )}`}
                  >
                    {complaint.priority}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Location
                  </p>

                  <div className="mt-1 flex items-start gap-2">
                    <MapPin
                      size={16}
                      className="mt-0.5 shrink-0 text-gray-400"
                    />

                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {complaint.location}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Reported By
                  </p>

                  <div className="mt-1 flex items-center gap-2">
                    <User
                      size={16}
                      className="text-gray-400"
                    />

                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {complaint.isAnonymous
                        ? "Anonymous"
                        : complaint.createdBy
                            ?.name || "Student"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Workflow */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Workflow
              </h2>

              <div className="mt-5 space-y-4">

                <div
                  className={`flex items-center gap-3 ${
                    complaint.status === "ASSIGNED"
                      ? "text-blue-600 dark:text-blue-400"
                      : complaint.status ===
                          "IN_PROGRESS" ||
                        complaint.status ===
                          "RESOLVED"
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-400"
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border">
                    <ClipboardIcon />
                  </div>

                  <span className="text-sm font-medium">
                    Assigned
                  </span>
                </div>

                <div
                  className={`flex items-center gap-3 ${
                    complaint.status ===
                    "IN_PROGRESS"
                      ? "text-amber-600 dark:text-amber-400"
                      : complaint.status ===
                          "RESOLVED"
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-400"
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border">
                    <Clock3 size={15} />
                  </div>

                  <span className="text-sm font-medium">
                    In Progress
                  </span>
                </div>

                <div
                  className={`flex items-center gap-3 ${
                    complaint.status === "RESOLVED"
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-400"
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border">
                    <CheckCircle2 size={15} />
                  </div>

                  <span className="text-sm font-medium">
                    Resolved
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {canStart && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Take Action
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  Start working on this complaint to
                  move it into the in-progress state.
                </p>

                <button
                  type="button"
                  onClick={handleStartComplaint}
                  disabled={actionLoading}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {actionLoading ? (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <Play size={17} />
                  )}

                  {actionLoading
                    ? "Starting..."
                    : "Start Work"}
                </button>
              </div>
            )}

            {/* Resolve Form */}
            {canResolve && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Resolve Complaint
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  Add details about the work completed
                  before marking this complaint as
                  resolved.
                </p>

                <div className="mt-5">
                  <label
                    htmlFor="resolutionNotes"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Resolution Notes
                  </label>

                  <textarea
                    id="resolutionNotes"
                    rows={5}
                    value={resolutionNotes}
                    onChange={(e) =>
                      setResolutionNotes(
                        e.target.value
                      )
                    }
                    placeholder="Describe the issue resolution..."
                    maxLength={2000}
                    className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-gray-500"
                  />

                  <p className="mt-1 text-right text-xs text-gray-400">
                    {resolutionNotes.length}/2000
                  </p>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="resolutionEvidence"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Resolution Evidence
                    <span className="ml-1 font-normal text-gray-400">
                      (Optional)
                    </span>
                  </label>

                  <input
                    id="resolutionEvidence"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleEvidenceChange}
                    className="block w-full cursor-pointer rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-600 file:mr-3 file:border-0 file:bg-gray-100 file:px-3 file:py-2.5 file:text-sm file:font-medium dark:border-slate-700 dark:bg-slate-950 dark:text-gray-400 dark:file:bg-slate-800"
                  />

                  <p className="mt-1 text-xs text-gray-400">
                    JPEG, PNG or WebP · Maximum 5 MB
                  </p>

                  {evidencePreview && (
                    <div className="relative mt-4 overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700">
                      <img
                        src={evidencePreview}
                        alt="Resolution evidence preview"
                        className="h-48 w-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleResolveComplaint}
                  disabled={actionLoading}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {actionLoading ? (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <Send size={17} />
                  )}

                  {actionLoading
                    ? "Processing..."
                    : "Mark as Resolved"}
                </button>
              </div>
            )}

            {/* Resolved State */}
            {complaint.status === "RESOLVED" && (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-6 dark:border-green-500/20 dark:bg-green-500/5">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 text-green-600 dark:text-green-400"
                  />

                  <div>
                    <h2 className="font-semibold text-green-800 dark:text-green-300">
                      Complaint Resolved
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-green-700 dark:text-green-400">
                      The complaint has been marked as
                      resolved. The student can now verify
                      the resolution or reopen it if the
                      issue persists.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
};

/*
 * Small local icon component so the workflow section
 * doesn't need another icon import.
 */
const ClipboardIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="8" height="4" x="8" y="2" rx="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
  </svg>
);

export default StaffComplaintDetails;