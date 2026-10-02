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

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [saving, setSaving] = useState(false);
  const [updatingCategoryId, setUpdatingCategoryId] =
    useState(null);

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

  useEffect(() => {
    fetchCategories();
  }, []);

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
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" &&
          category.isActive) ||
        (statusFilter === "INACTIVE" &&
          !category.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  const openCreateModal = () => {
    setEditingCategory(null);

    setFormData({
      name: "",
      description: "",
    });

    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);

    setFormData({
      name: category.name || "",
      description: category.description || "",
    });

    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingCategory(null);

    setFormData({
      name: "",
      description: "",
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingCategory) {
        const data = await updateCategory(
          editingCategory._id,
          formData
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
      } else {
        const data = await createCategory(formData);

        setCategories((current) => [
          ...current,
          data.category,
        ]);

        setSuccess(
          "Category created successfully."
        );
      }

      setModalOpen(false);
      setEditingCategory(null);

      setFormData({
        name: "",
        description: "",
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

  const handleToggleStatus = async (category) => {
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

      const data = await toggleCategoryStatus(
        category._id
      );

      setCategories((current) =>
        current.map((currentCategory) =>
          currentCategory._id === data.category._id
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

  const activeCount = categories.filter(
    (category) => category.isActive
  ).length;

  const inactiveCount = categories.filter(
    (category) => !category.isActive
  ).length;

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
            Manage categories used for campus complaints.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => fetchCategories(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-slate-800"
          >
            <RefreshCw
              size={17}
              className={
                refreshing ? "animate-spin" : ""
              }
            />
            Refresh
          </button>

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
          <XCircle size={18} className="mt-0.5 shrink-0" />
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
        <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
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

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
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

      {/* Category table */}

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
            <table className="w-full min-w-[750px] text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-slate-800 dark:bg-slate-950/50">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Category
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

                    return (
                      <tr
                        key={category._id}
                        className="border-b border-gray-100 last:border-0 dark:border-slate-800"
                      >
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
                                Category
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="max-w-md px-6 py-5">
                          <p className="truncate text-sm text-gray-600 dark:text-gray-300">
                            {category.description ||
                              "No description"}
                          </p>
                        </td>

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

      {/* Create/Edit Modal */}

      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
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
                    : "Create a new complaint category."}
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
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. TRANSPORT"
                  maxLength={50}
                  disabled={saving}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm uppercase text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

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

              {/* Modal actions */}

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