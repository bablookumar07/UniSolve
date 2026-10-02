import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  MapPin,
  CalendarDays,
  Tag,
  AlertCircle,
  CheckCircle2,
  UserCheck,
  Loader2,
} from "lucide-react";

import {
  getComplaintById,
  assignComplaint,
} from "../../api/complaintApi";

import { getStaffUsers } from "../../api/adminApi";

const AdminComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [staffUsers, setStaffUsers] = useState([]);

  const [selectedStaff, setSelectedStaff] = useState("");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [complaintData, staffData] = await Promise.all([
        getComplaintById(id),
        getStaffUsers(),
      ]);

      const complaintResult = complaintData.complaint;

      setComplaint(complaintResult);
      setStaffUsers(staffData.users || []);

      if (complaintResult.assignedTo?._id) {
        setSelectedStaff(complaintResult.assignedTo._id);
      }
    } catch (error) {
      console.error("Failed to fetch admin complaint details:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load complaint details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAssign = async () => {
    if (!selectedStaff) {
      setError("Please select a staff member.");
      return;
    }

    try {
      setAssigning(true);
      setError("");
      setSuccess("");

      const data = await assignComplaint(
        complaint._id,
        selectedStaff
      );

      setComplaint(data.complaint);

      setSuccess(
        "Complaint assigned successfully."
      );
    } catch (error) {
      console.error("Assign complaint error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to assign complaint."
      );
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Loader2 className="animate-spin" size={18} />
          Loading complaint...
        </div>
      </div>
    );
  }

  if (error && !complaint) {
    return (
      <div className="p-6">
        <Link
          to="/admin/complaints"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to complaints
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  if (!complaint) {
    return null;
  }

  const statusClasses = {
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
      "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400",
  };

  const priorityClasses = {
    LOW: "text-gray-600 dark:text-gray-400",
    MEDIUM: "text-blue-600 dark:text-blue-400",
    HIGH: "text-orange-600 dark:text-orange-400",
    CRITICAL: "text-red-600 dark:text-red-400",
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}

      <div className="mb-6">
        <Link
          to="/admin/complaints"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to complaints
        </Link>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-blue-600 dark:text-blue-400">
              {complaint.complaintId}
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {complaint.title}
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Complaint details and assignment management
            </p>
          </div>

          <span
            className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
              statusClasses[complaint.status]
            }`}
          >
            {complaint.status.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Alerts */}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Main content */}

        <div className="space-y-6">
          {/* Description */}

          <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
              Complaint Description
            </h2>

            <p className="whitespace-pre-wrap text-sm leading-7 text-gray-600 dark:text-gray-300">
              {complaint.description}
            </p>
          </section>

          {/* Complaint information */}

          <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-5 text-base font-semibold text-gray-900 dark:text-white">
              Complaint Information
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <InfoItem
                icon={Tag}
                label="Category"
                value={complaint.category?.name || "—"}
              />

              <InfoItem
                icon={AlertCircle}
                label="Priority"
                value={complaint.priority}
                valueClass={priorityClasses[complaint.priority]}
              />

              <InfoItem
                icon={MapPin}
                label="Location"
                value={complaint.location}
              />

              <InfoItem
                icon={CalendarDays}
                label="Created"
                value={new Date(
                  complaint.createdAt
                ).toLocaleString()}
              />
            </div>
          </section>

          {/* Student */}

          <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-5 text-base font-semibold text-gray-900 dark:text-white">
              Submitted By
            </h2>

            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-300">
                <User size={20} />
              </div>

              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {complaint.isAnonymous
                    ? "Anonymous Student"
                    : complaint.createdBy?.name || "Unknown"}
                </p>

                {!complaint.isAnonymous && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {complaint.createdBy?.email || "—"}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Evidence */}

          <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-5 text-base font-semibold text-gray-900 dark:text-white">
              Submitted Evidence
            </h2>

            {complaint.evidence?.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {complaint.evidence.map((item, index) => (
                  <a
                    key={item.publicId || index}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700"
                  >
                    <img
                      src={item.url}
                      alt={`Complaint evidence ${index + 1}`}
                      className="h-56 w-full object-cover transition hover:scale-[1.02]"
                    />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No evidence uploaded.
              </p>
            )}
          </section>

          {/* Resolution */}

          {(complaint.resolution?.notes ||
            complaint.resolution?.evidence?.length > 0) && (
            <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-5 text-base font-semibold text-gray-900 dark:text-white">
                Resolution
              </h2>

              {complaint.resolution?.notes && (
                <p className="whitespace-pre-wrap text-sm leading-7 text-gray-600 dark:text-gray-300">
                  {complaint.resolution.notes}
                </p>
              )}

              {complaint.resolution?.evidence?.length > 0 && (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {complaint.resolution.evidence.map(
                    (item, index) => (
                      <a
                        key={item.publicId || index}
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={item.url}
                          alt={`Resolution evidence ${index + 1}`}
                          className="h-48 w-full rounded-xl object-cover"
                        />
                      </a>
                    )
                  )}
                </div>
              )}
            </section>
          )}
        </div>

        {/* Sidebar */}

        <aside className="space-y-6">
          {/* Assignment */}

          <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <UserCheck size={19} />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Staff Assignment
                </h2>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Assign this complaint
                </p>
              </div>
            </div>

            {complaint.assignedTo && (
              <div className="mb-4 rounded-xl bg-gray-50 p-4 dark:bg-slate-800/60">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Currently Assigned
                </p>

                <p className="mt-1 font-medium text-gray-900 dark:text-white">
                  {complaint.assignedTo.name}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {complaint.assignedTo.email}
                </p>
              </div>
            )}

            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Staff
            </label>

            <select
              value={selectedStaff}
              onChange={(event) =>
                setSelectedStaff(event.target.value)
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option value="">Select staff member</option>

              {staffUsers.map((staff) => (
                <option
                  key={staff._id}
                  value={staff._id}
                >
                  {staff.name} — {staff.email}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleAssign}
              disabled={assigning || !selectedStaff}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {assigning && (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              )}

              {assigning
                ? "Assigning..."
                : complaint.assignedTo
                  ? "Reassign Staff"
                  : "Assign Staff"}
            </button>
          </section>

          {/* Current status */}

          <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">
              Current Status
            </h2>

            <div className="space-y-3">
              {[
                "PENDING",
                "ASSIGNED",
                "IN_PROGRESS",
                "RESOLVED",
                "CLOSED",
              ].map((status) => {
                const reached =
                  [
                    "PENDING",
                    "ASSIGNED",
                    "IN_PROGRESS",
                    "RESOLVED",
                    "CLOSED",
                  ].indexOf(status) <=
                  [
                    "PENDING",
                    "ASSIGNED",
                    "IN_PROGRESS",
                    "RESOLVED",
                    "CLOSED",
                  ].indexOf(complaint.status);

                return (
                  <div
                    key={status}
                    className="flex items-center gap-3"
                  >
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        reached
                          ? "bg-blue-600"
                          : "bg-gray-300 dark:bg-slate-700"
                      }`}
                    />

                    <span
                      className={`text-sm ${
                        reached
                          ? "font-medium text-gray-900 dark:text-white"
                          : "text-gray-400 dark:text-gray-600"
                      }`}
                    >
                      {status.replace("_", " ")}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

const InfoItem = ({
  icon: Icon,
  label,
  value,
  valueClass = "",
}) => {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-gray-400">
        <Icon size={18} />
      </div>

      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {label}
        </p>

        <p
          className={`mt-1 text-sm font-medium text-gray-900 dark:text-white ${valueClass}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

export default AdminComplaintDetails;