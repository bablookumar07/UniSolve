import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { createCase } from "../../api/caseApi";
import api from "../../api/axios";

const CASE_TYPES = [
  "CAMPUS",
  "ACADEMIC",
  "IT",
  "ADMINISTRATIVE",
  "TRANSPORT",
  "LIBRARY",
  "SAFETY",
  "OTHER",
];

const PRIORITIES = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
];

const NewCase = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    caseType: "",
    category: "",
    subcategory: "",
    title: "",
    description: "",
    priority: "MEDIUM",
    location: "",
    isAnonymous: false,
  });

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================================================
  // FETCH ACTIVE CATEGORIES
  // ============================================================

const fetchCategories = async (caseType = "") => {
  try {
    setLoadingCategories(true);
    setError("");

    // No case type selected
    if (!caseType) {
      setCategories([]);
      return;
    }

    const response = await api.get("/categories", {
      params: {
        caseType,
      },
    });

    console.log("CASE CATEGORIES RESPONSE:", response.data);

    const categoryData =
      response.data?.data ||
      response.data?.categories ||
      [];

    setCategories(categoryData);
  } catch (error) {
    console.error("Fetch case categories error:", error);

    setCategories([]);

    setError(
      error.response?.data?.message ||
        "Failed to load case categories."
    );
  } finally {
    setLoadingCategories(false);
  }
};

  useEffect(() => {
    fetchCategories(formData.caseType);
  }, [formData.caseType]);

  // ============================================================
  // ROOT CATEGORIES FOR SELECTED CASE TYPE
  // ============================================================

  const rootCategories = useMemo(() => {
    if (!formData.caseType) {
      return [];
    }

    return categories.filter(
      (category) =>
        category.caseType === formData.caseType &&
        !category.parent
    );
  }, [categories, formData.caseType]);

  // ============================================================
  // SUBCATEGORIES
  // ============================================================

  const subcategories = useMemo(() => {
  if (!formData.category) {
    return [];
  }

  return categories.filter((category) => {
    const parentId =
      typeof category.parent === "object"
        ? category.parent?._id
        : category.parent;

    return (
      category.caseType === formData.caseType &&
      parentId === formData.category
    );
  });
}, [
  categories,
  formData.caseType,
  formData.category,
]);
  // ============================================================
  // INPUT CHANGE
  // ============================================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccess("");
  };

  // ============================================================
  // CASE TYPE CHANGE
  // ============================================================

  const handleCaseTypeChange = (event) => {
    const caseType = event.target.value;

    setFormData((current) => ({
      ...current,
      caseType,
      category: "",
      subcategory: "",
    }));

    setError("");
  };

  // ============================================================
  // CATEGORY CHANGE
  // ============================================================

  const handleCategoryChange = (event) => {
    const category = event.target.value;

    setFormData((current) => ({
      ...current,
      category,
      subcategory: "",
    }));

    setError("");
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Basic frontend validation
    if (!formData.caseType) {
      setError("Please select a case type.");
      return;
    }

    if (!formData.category) {
      setError("Please select a category.");
      return;
    }

    if (!formData.title.trim()) {
      setError("Case title is required.");
      return;
    }

    if (formData.title.trim().length < 5) {
      setError(
        "Case title must be at least 5 characters."
      );
      return;
    }

    if (!formData.description.trim()) {
      setError("Case description is required.");
      return;
    }

    if (formData.description.trim().length < 10) {
      setError(
        "Case description must be at least 10 characters."
      );
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        caseType: formData.caseType,
        category: formData.category,
        subcategory:
          formData.subcategory || null,
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        location: formData.location.trim() || null,
        isAnonymous: formData.isAnonymous,
      };

      await createCase(payload);

      setSuccess("Case created successfully.");

      setTimeout(() => {
        navigate("/student/cases");
      }, 800);
    } catch (error) {
      console.error("Create case error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create case."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
  to="/student/requests"
  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800"
>
  <ArrowLeft size={16} />
  Back to My Requests
</Link>

        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Raise a New Case
        </h1>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Select the appropriate case type and category so your
          issue can reach the right team.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700 dark:border-green-900/50 dark:bg-green-950/20 dark:text-green-400">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm">{success}</p>
        </div>
      )}

      <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6 sm:p-8"
        >
          {/* Case Classification */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Case Classification
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Tell us what kind of issue you are reporting.
            </p>
          </div>

          {/* Case Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Case Type <span className="text-red-500">*</span>
            </label>

            <select
              name="caseType"
              value={formData.caseType}
              onChange={handleCaseTypeChange}
              disabled={loadingCategories}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option value="">
                Select case type
              </option>

              {CASE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category <span className="text-red-500">*</span>
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleCategoryChange}
              disabled={
                !formData.caseType ||
                loadingCategories
              }
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option value="">
                {!formData.caseType
                  ? "Select case type first"
                  : "Select category"}
              </option>

              {rootCategories.map((category) => (
                <option
                  key={category._id}
                  value={category._id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          {formData.category &&
            subcategories.length > 0 && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Subcategory
                </label>

                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="">
                    Select subcategory
                  </option>

                  {subcategories.map((subcategory) => (
                    <option
                      key={subcategory._id}
                      value={subcategory._id}
                    >
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-slate-800" />

          {/* Case Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Case Information
            </h2>
          </div>

          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              maxLength={150}
              placeholder="Briefly describe your issue"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />

            <p className="mt-1 text-xs text-gray-400">
              {formData.title.length}/150
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description <span className="text-red-500">*</span>
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              maxLength={3000}
              placeholder="Explain the issue in detail..."
              className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />

            <p className="mt-1 text-xs text-gray-400">
              {formData.description.length}/3000
            </p>
          </div>

          {/* Priority + Location */}
          <div className="grid gap-5 md:grid-cols-2">
            {/* Priority */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Priority
              </label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                {PRIORITIES.map((priority) => (
                  <option
                    key={priority}
                    value={priority}
                  >
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                maxLength={200}
                placeholder="e.g. Block A, Room 204"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>

          {/* Anonymous */}
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4 dark:border-slate-700">
            <input
              type="checkbox"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />

            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Submit anonymously
              </p>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Your identity can be hidden from normal case
                display where supported.
              </p>
            </div>
          </label>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end dark:border-slate-800">
            <Link
              to="/student/cases"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting || loadingCategories}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Raise Case
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCase;