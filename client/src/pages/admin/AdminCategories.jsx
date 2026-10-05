import { useEffect, useMemo, useState } from "react";

import {
  Search,
  RefreshCw,
  Plus,
  Pencil,
  Tags,
  Loader2,
  X,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import {
  getAdminCategories,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
} from "../../api/adminApi";

/*
|--------------------------------------------------------------------------
| Case Types
|--------------------------------------------------------------------------
*/

const CASE_TYPES = [
  {
    value: "CAMPUS",
    label: "Campus",
  },
  {
    value: "ACADEMIC",
    label: "Academic",
  },
  {
    value: "IT",
    label: "IT",
  },
  {
    value: "ADMINISTRATIVE",
    label: "Administrative",
  },
  {
    value: "TRANSPORT",
    label: "Transport",
  },
  {
    value: "LIBRARY",
    label: "Library",
  },
  {
    value: "SAFETY",
    label: "Safety",
  },
  {
    value: "OTHER",
    label: "Other",
  },
];

/*
|--------------------------------------------------------------------------
| Initial Form State
|--------------------------------------------------------------------------
*/

const INITIAL_FORM_DATA = {
  name: "",
  description: "",
  caseType: "CAMPUS",
  parent: "",
};

/*
|--------------------------------------------------------------------------
| Admin Categories
|--------------------------------------------------------------------------
*/

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [caseTypeFilter, setCaseTypeFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState(null);

  const [formData, setFormData] =
    useState(INITIAL_FORM_DATA);

  const [saving, setSaving] = useState(false);
  const [updatingCategoryId, setUpdatingCategoryId] =
    useState(null);

  /*
  |--------------------------------------------------------------------------
  | Fetch Categories
  |--------------------------------------------------------------------------
  */

  const fetchCategories = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getAdminCategories();

      setCategories(data.categories || []);
    } catch (error) {
      console.error(
        "Failed to fetch categories:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load categories."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Initial Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchCategories();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Parent Categories
  |--------------------------------------------------------------------------
  |
  | Parent options are limited to:
  |
  | 1. Same case type
  | 2. Active categories
  | 3. Root categories
  |
  */

  const parentCategories = useMemo(() => {
    if (!formData.caseType) {
      return [];
    }

    return categories.filter(
      (category) =>
        category.caseType === formData.caseType &&
        category.isActive &&
        !category.parent &&
        category._id !== editingCategory?._id
    );
  }, [
    categories,
    formData.caseType,
    editingCategory,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Filter Categories
  |--------------------------------------------------------------------------
  */

  const filteredCategories = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    return categories.filter((category) => {
      const matchesSearch =
        !normalizedSearch ||
        category.name
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        category.description
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        category.caseType
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        category.parent?.name
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" &&
          category.isActive) ||
        (statusFilter === "INACTIVE" &&
          !category.isActive);

      const matchesCaseType =
        caseTypeFilter === "ALL" ||
        category.caseType === caseTypeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCaseType
      );
    });
  }, [
    categories,
    search,
    statusFilter,
    caseTypeFilter,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Open Create Modal
  |--------------------------------------------------------------------------
  */

  const openCreateModal = () => {
    setEditingCategory(null);

    setFormData({
      ...INITIAL_FORM_DATA,
    });

    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  /*
  |--------------------------------------------------------------------------
  | Open Edit Modal
  |--------------------------------------------------------------------------
  */

  const openEditModal = (category) => {
    setEditingCategory(category);

    setFormData({
      name: category.name || "",
      description: category.description || "",
      caseType: category.caseType || "CAMPUS",
      parent: category.parent?._id || "",
    });

    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  /*
  |--------------------------------------------------------------------------
  | Close Modal
  |--------------------------------------------------------------------------
  */

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingCategory(null);

    setFormData({
      ...INITIAL_FORM_DATA,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Input Change
  |--------------------------------------------------------------------------
  */

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    /*
    |--------------------------------------------------------------------------
    | If Case Type Changes
    |--------------------------------------------------------------------------
    |
    | Parent category from the previous case type
    | should not remain selected.
    |
    */

    if (name === "caseType") {
      setFormData((current) => ({
        ...current,
        caseType: value,
        parent: "",
      }));

      return;
    }

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Submit Category
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    /*
    |--------------------------------------------------------------------------
    | Basic Validation
    |--------------------------------------------------------------------------
    */

    if (!formData.name.trim()) {
      setError("Category name is required.");
      return;
    }

    if (!formData.caseType) {
      setError("Case type is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        caseType: formData.caseType,
        parent: formData.parent || null,
      };

      /*
      |--------------------------------------------------------------------------
      | Update
      |--------------------------------------------------------------------------
      */

      if (editingCategory) {
        const data = await updateCategory(
          editingCategory._id,
          payload
        );

        setCategories((current) =>
          current.map((category) =>
            category._id === data.category._id
              ? data.category
              : category
          )
        );

        setSuccess(
          "Category updated successfully."
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Create
      |--------------------------------------------------------------------------
      */

      else {
        const data =
          await createCategory(payload);

        setCategories((current) => [
          ...current,
          data.category,
        ]);

        setSuccess(
          "Category created successfully."
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Close Modal
      |--------------------------------------------------------------------------
      */

      setModalOpen(false);
      setEditingCategory(null);

      setFormData({
        ...INITIAL_FORM_DATA,
      });
    } catch (error) {
      console.error(
        "Category save error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to save category."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Toggle Category Status
  |--------------------------------------------------------------------------
  */

  const handleToggleStatus = async (
    category
  ) => {
    const action = category.isActive
      ? "deactivate"
      : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} the ${category.name} category?`
    );

    if (!confirmed) return;

    try {
      setUpdatingCategoryId(category._id);
      setError("");
      setSuccess("");

      const data =
        await toggleCategoryStatus(
          category._id
        );

      setCategories((current) =>
        current.map((currentCategory) =>
          currentCategory._id ===
          data.category._id
            ? data.category
            : currentCategory
        )
      );

      setSuccess(data.message);
    } catch (error) {
      console.error(
        "Toggle category status error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update category status."
      );
    } finally {
      setUpdatingCategoryId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Stats
  |--------------------------------------------------------------------------
  */

  const activeCount = categories.filter(
    (category) => category.isActive
  ).length;

  const inactiveCount = categories.filter(
    (category) => !category.isActive
  ).length;

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Loader2
            size={18}
            className="animate-spin"
          />

          Loading categories...
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-blue-600 dark:text-blue-400">
            Administration
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Categories
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Manage categories and case types used across
            UniSolve.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Refresh */}

          <button
            type="button"
            onClick={() => fetchCategories(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-slate-800"
          >
            <RefreshCw
              size={17}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          {/* Add Category */}

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={17} />

            Add Category
          </button>
        </div>
      </div>

      {/* Alerts */}

      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <XCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400">
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{success}</span>
        </div>
      )}

      {/* Stats */}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Categories"
          value={categories.length}
          icon={Tags}
        />

        <StatCard
          label="Active"
          value={activeCount}
          icon={CheckCircle2}
        />

        <StatCard
          label="Inactive"
          value={inactiveCount}
          icon={XCircle}
        />
      </div>

      {/* Filters */}

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-3 lg:grid-cols-[1fr_200px_220px]">
          {/* Search */}

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
              placeholder="Search categories..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          {/* Case Type Filter */}

          <select
            value={caseTypeFilter}
            onChange={(event) =>
              setCaseTypeFilter(
                event.target.value
              )
            }
            className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-gray-300"
          >
            <option value="ALL">
              All Case Types
            </option>

            {CASE_TYPES.map((type) => (
              <option
                key={type.value}
                value={type.value}
              >
                {type.label}
              </option>
            ))}
          </select>

          {/* Status Filter */}

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-gray-300"
          >
            <option value="ALL">
              All Status
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="INACTIVE">
              Inactive
            </option>
          </select>
        </div>
      </div>

      {/* Results */}

      <div className="mb-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {filteredCategories.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {categories.length}
          </span>{" "}
          categories
        </p>
      </div>

      {/* Category Table */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {filteredCategories.length === 0 ? (
          <div className="flex min-h-60 flex-col items-center justify-center px-6 text-center">
            <Tags
              size={36}
              className="mb-3 text-gray-300 dark:text-slate-700"
            />

            <h3 className="font-semibold text-gray-900 dark:text-white">
              No categories found
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-slate-800 dark:bg-slate-950/50">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Category
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Case Type
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Parent
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Description
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCategories.map(
                  (category) => {
                    const updating =
                      updatingCategoryId ===
                      category._id;

                    const caseTypeLabel =
                      CASE_TYPES.find(
                        (type) =>
                          type.value ===
                          category.caseType
                      )?.label ||
                      category.caseType ||
                      "—";

                    return (
                      <tr
                        key={category._id}
                        className="border-b border-gray-100 last:border-0 dark:border-slate-800"
                      >
                        {/* Category */}

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                              <Tags size={18} />
                            </div>

                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {category.name}
                              </p>

                              <p className="mt-0.5 text-xs text-gray-400">
                                {category.parent
                                  ? "Subcategory"
                                  : "Root category"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Case Type */}

                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                            {caseTypeLabel}
                          </span>
                        </td>

                        {/* Parent */}

                        <td className="px-6 py-5">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {category.parent?.name ||
                              "—"}
                          </span>
                        </td>

                        {/* Description */}

                        <td className="max-w-md px-6 py-5">
                          <p className="truncate text-sm text-gray-600 dark:text-gray-300">
                            {category.description ||
                              "No description"}
                          </p>
                        </td>

                        {/* Status */}

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-2 text-sm font-medium ${
                              category.isActive
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                category.isActive
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }`}
                            />

                            {category.isActive
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>

                        {/* Actions */}

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                openEditModal(
                                  category
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800"
                            >
                              <Pencil size={14} />

                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleToggleStatus(
                                  category
                                )
                              }
                              disabled={updating}
                              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                category.isActive
                                  ? "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
                                  : "border-green-200 text-green-600 hover:bg-green-50 dark:border-green-900/50 dark:text-green-400 dark:hover:bg-green-950/30"
                              }`}
                            >
                              {updating ? (
                                <Loader2
                                  size={14}
                                  className="animate-spin"
                                />
                              ) : category.isActive ? (
                                "Deactivate"
                              ) : (
                                "Activate"
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}

      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingCategory
                    ? "Edit Category"
                    : "Add Category"}
                </h2>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {editingCategory
                    ? "Update category information."
                    : "Create a category for a specific case type."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              {/* Case Type */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Case Type
                </label>

                <select
                  name="caseType"
                  value={formData.caseType}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  {CASE_TYPES.map((type) => (
                    <option
                      key={type.value}
                      value={type.value}
                    >
                      {type.label}
                    </option>
                  ))}
                </select>

                <p className="mt-1 text-xs text-gray-400">
                  Select the domain this category belongs to.
                </p>
              </div>

              {/* Parent Category */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Parent Category
                </label>

                <select
                  name="parent"
                  value={formData.parent}
                  onChange={handleInputChange}
                  disabled={
                    saving ||
                    parentCategories.length === 0
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="">
                    No Parent — Root Category
                  </option>

                  {parentCategories.map(
                    (category) => (
                      <option
                        key={category._id}
                        value={category._id}
                      >
                        {category.name}
                      </option>
                    )
                  )}
                </select>

                <p className="mt-1 text-xs text-gray-400">
                  {parentCategories.length > 0
                    ? "Select a parent to create a subcategory."
                    : "No active root category available for this case type."}
                </p>
              </div>

              {/* Category Name */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. ELECTRICAL"
                  maxLength={50}
                  disabled={saving}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm uppercase text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              {/* Description */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe what this category is used for..."
                  rows={4}
                  maxLength={200}
                  disabled={saving}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />

                <p className="mt-1 text-right text-xs text-gray-400">
                  {formData.description.length}/200
                </p>
              </div>

              {/* Modal Actions */}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving && (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {saving
                    ? "Saving..."
                    : editingCategory
                    ? "Update Category"
                    : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Stat Card
|--------------------------------------------------------------------------
*/

const StatCard = ({
  label,
  value,
  icon: Icon,
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

export default AdminCategories;