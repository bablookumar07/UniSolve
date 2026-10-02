import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FileImage,
  Info,
  Loader2,
  MapPin,
  Send,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";

import { getCategories } from "../../api/categoryApi";

import {
  createComplaint,
  uploadComplaintEvidence,
} from "../../api/complaintApi";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const NewComplaint = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "MEDIUM",
    location: "",
    isAnonymous: false,
  });

  const [evidenceFile, setEvidenceFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [uploadingEvidence, setUploadingEvidence] =
    useState(false);

  // ============================================================
  // LOAD CATEGORIES
  // ============================================================

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);

        const data = await getCategories();

        setCategories(data.categories || []);
      } catch (error) {
        console.error(
          "Failed to load categories:",
          error
        );

        setSubmitError(
          error.response?.data?.message ||
            "Unable to load complaint categories."
        );
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  // ============================================================
  // CLEANUP IMAGE PREVIEW
  // ============================================================

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // ============================================================
  // HANDLE INPUT
  // ============================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setSubmitError("");
  };

  // ============================================================
  // HANDLE ANONYMOUS TOGGLE
  // ============================================================

  const handleAnonymousChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      isAnonymous: event.target.checked,
    }));

    setSubmitError("");
  };

  // ============================================================
  // HANDLE EVIDENCE
  // ============================================================

  const handleEvidenceChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setErrors((previous) => ({
      ...previous,
      evidence: "",
    }));

    setSubmitError("");

    // File type validation
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setErrors((previous) => ({
        ...previous,
        evidence:
          "Only JPEG, PNG, and WebP images are allowed.",
      }));

      event.target.value = "";
      return;
    }

    // File size validation
    if (file.size > MAX_FILE_SIZE) {
      setErrors((previous) => ({
        ...previous,
        evidence:
          "Image size must be less than 5 MB.",
      }));

      event.target.value = "";
      return;
    }

    // Cleanup previous preview
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const newPreviewUrl = URL.createObjectURL(file);

    setEvidenceFile(file);
    setPreviewUrl(newPreviewUrl);
  };

  // ============================================================
  // REMOVE EVIDENCE
  // ============================================================

  const handleRemoveEvidence = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setEvidenceFile(null);
    setPreviewUrl("");

    const input = document.getElementById(
      "evidence"
    );

    if (input) {
      input.value = "";
    }

    setErrors((previous) => ({
      ...previous,
      evidence: "",
    }));
  };

  // ============================================================
  // VALIDATION
  // ============================================================

  const validateForm = () => {
    const newErrors = {};

    const title = formData.title.trim();
    const description = formData.description.trim();
    const location = formData.location.trim();

    if (!title) {
      newErrors.title = "Complaint title is required.";
    } else if (title.length < 5) {
      newErrors.title =
        "Title must be at least 5 characters.";
    } else if (title.length > 100) {
      newErrors.title =
        "Title cannot exceed 100 characters.";
    }

    if (!description) {
      newErrors.description =
        "Complaint description is required.";
    } else if (description.length < 10) {
      newErrors.description =
        "Description must be at least 10 characters.";
    } else if (description.length > 2000) {
      newErrors.description =
        "Description cannot exceed 2000 characters.";
    }

    if (!formData.category) {
      newErrors.category =
        "Please select a complaint category.";
    }

    if (!formData.priority) {
      newErrors.priority =
        "Please select a priority.";
    }

    if (!location) {
      newErrors.location =
        "Complaint location is required.";
    } else if (location.length > 150) {
      newErrors.location =
        "Location cannot exceed 150 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      // --------------------------------------------------------
      // 1. CREATE COMPLAINT
      // --------------------------------------------------------

      const data = await createComplaint({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        priority: formData.priority,
        location: formData.location.trim(),
        isAnonymous: formData.isAnonymous,
      });

      const createdComplaint = data.complaint;

      // --------------------------------------------------------
      // 2. UPLOAD EVIDENCE
      // --------------------------------------------------------

      if (evidenceFile && createdComplaint?.id) {
        try {
          setUploadingEvidence(true);

          await uploadComplaintEvidence(
            createdComplaint.id,
            evidenceFile
          );
        } catch (uploadError) {
          console.error(
            "Evidence upload failed:",
            uploadError
          );

          /*
            Complaint has already been created successfully.

            We do NOT treat the complete complaint creation
            as failed just because optional evidence upload
            failed.
          */

          setSubmitError(
            "Complaint created successfully, but the evidence image could not be uploaded."
          );

          setUploadingEvidence(false);

          setTimeout(() => {
            navigate(
              `/student/complaints/${createdComplaint.id}`
            );
          }, 1800);

          return;
        } finally {
          setUploadingEvidence(false);
        }
      }

      // --------------------------------------------------------
      // 3. REDIRECT
      // --------------------------------------------------------

      navigate(
        `/student/complaints/${createdComplaint.id}`,
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error(
        "Create complaint error:",
        error
      );

      setSubmitError(
        error.response?.data?.message ||
          "Unable to create complaint. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // CHARACTER COUNTS
  // ============================================================

  const titleLength = formData.title.length;
  const descriptionLength =
    formData.description.length;

  return (
    <div className="min-h-full bg-gray-50 p-4 dark:bg-slate-950 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* ====================================================
            BACK
        ==================================================== */}

        <Link
          to="/student/complaints"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft size={17} />

          Back to My Complaints
        </Link>

        {/* ====================================================
            HEADER
        ==================================================== */}

        <section>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Student Portal
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            Report a Complaint
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
            Provide accurate details about the issue so it
            can be reviewed and resolved efficiently.
          </p>
        </section>

        {/* ====================================================
            ERROR
        ==================================================== */}

        {submitError && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
          >
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-medium">
                Something needs attention
              </p>

              <p className="mt-1 text-sm">
                {submitError}
              </p>
            </div>
          </div>
        )}

        {/* ====================================================
            FORM
        ==================================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* ==================================================
              BASIC INFORMATION
          ================================================== */}

          <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <div className="border-b border-gray-200 px-5 py-5 dark:border-slate-800 sm:px-6">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Complaint Information
              </h2>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Describe the issue clearly and accurately.
              </p>
            </div>

            <div className="space-y-6 p-5 sm:p-6">

              {/* Title */}
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Complaint Title
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <span className="text-xs text-gray-400">
                    {titleLength}/100
                  </span>
                </div>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={submitting}
                  maxLength={100}
                  placeholder="e.g. Fan not working in hostel room"
                  className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 ${
                    errors.title
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-200 focus:border-blue-500 dark:border-slate-700"
                  }`}
                />

                {errors.title && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Description
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <span className="text-xs text-gray-400">
                    {descriptionLength}/2000
                  </span>
                </div>

                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  disabled={submitting}
                  maxLength={2000}
                  placeholder="Explain what happened, where the issue is, and any relevant details..."
                  className={`mt-2 w-full resize-y rounded-xl border bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 ${
                    errors.description
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-200 focus:border-blue-500 dark:border-slate-700"
                  }`}
                />

                {errors.description && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Category + Priority */}
              <div className="grid gap-5 sm:grid-cols-2">

                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Category
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={
                      submitting ||
                      categoriesLoading
                    }
                    className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-800 dark:text-white ${
                      errors.category
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-blue-500 dark:border-slate-700"
                    }`}
                  >
                    <option value="">
                      {categoriesLoading
                        ? "Loading categories..."
                        : "Select category"}
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category._id}
                        value={category._id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {errors.category && (
                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <label
                    htmlFor="priority"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Priority
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    disabled={submitting}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
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

                  {errors.priority && (
                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                      {errors.priority}
                    </p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  <MapPin size={16} />

                  Location
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={submitting}
                  maxLength={150}
                  placeholder="e.g. Hostel Block A, Room 204"
                  className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 ${
                    errors.location
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-200 focus:border-blue-500 dark:border-slate-700"
                  }`}
                />

                {errors.location && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                    {errors.location}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* ==================================================
              EVIDENCE
          ================================================== */}

          <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <div className="border-b border-gray-200 px-5 py-5 dark:border-slate-800 sm:px-6">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Supporting Evidence
              </h2>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Add an image that helps explain the issue.
              </p>
            </div>

            <div className="p-5 sm:p-6">

              {!evidenceFile ? (
                <label
                  htmlFor="evidence"
                  className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 px-6 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50/50 dark:border-slate-700 dark:hover:border-blue-500 dark:hover:bg-blue-500/5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition group-hover:bg-blue-100 group-hover:text-blue-600 dark:bg-slate-800 dark:text-gray-400 dark:group-hover:bg-blue-500/10 dark:group-hover:text-blue-400">
                    <Upload size={22} />
                  </div>

                  <p className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
                    Upload evidence image
                  </p>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    JPEG, PNG or WebP • Maximum 5 MB
                  </p>

                  <input
                    id="evidence"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleEvidenceChange}
                    disabled={submitting}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-700">
                  <img
                    src={previewUrl}
                    alt="Evidence preview"
                    className="max-h-[400px] w-full object-contain bg-gray-50 dark:bg-slate-950"
                  />

                  <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex min-w-0 items-center gap-3">
                      <FileImage
                        size={19}
                        className="shrink-0 text-blue-600 dark:text-blue-400"
                      />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {evidenceFile.name}
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(
                            evidenceFile.size /
                            (1024 * 1024)
                          ).toFixed(2)}{" "}
                          MB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveEvidence}
                      disabled={submitting}
                      className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                      aria-label="Remove evidence"
                    >
                      <X size={19} />
                    </button>
                  </div>
                </div>
              )}

              {errors.evidence && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                  {errors.evidence}
                </p>
              )}
            </div>
          </section>

          {/* ==================================================
              PRIVACY
          ================================================== */}

          <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <div className="p-5 sm:p-6">

              <label className="flex cursor-pointer items-start gap-4">
                <input
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={handleAnonymousChange}
                  disabled={submitting}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800"
                />

                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck
                      size={18}
                      className="text-blue-600 dark:text-blue-400"
                    />

                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Submit anonymously
                    </p>
                  </div>

                  <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                    Your complaint will be marked as anonymous.
                    Your account is still used internally for
                    authorization and complaint ownership.
                  </p>
                </div>
              </label>
            </div>
          </section>

          {/* ==================================================
              INFORMATION
          ================================================== */}

          <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/20 dark:bg-blue-500/5">
            <Info
              size={19}
              className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
            />

            <p className="text-sm leading-6 text-blue-800 dark:text-blue-300">
              Please provide accurate information. Once
              submitted, your complaint will enter the campus
              resolution workflow for review and assignment.
            </p>
          </div>

          {/* ==================================================
              ACTIONS
          ================================================== */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <Link
              to="/student/complaints"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-slate-800"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={
                submitting ||
                categoriesLoading
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  {uploadingEvidence
                    ? "Uploading evidence..."
                    : "Submitting complaint..."}
                </>
              ) : (
                <>
                  <Send size={18} />

                  Submit Complaint
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewComplaint;