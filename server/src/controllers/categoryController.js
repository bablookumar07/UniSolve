import Category from "../models/Category.js";

/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

const ALLOWED_CASE_TYPES = [
  "CAMPUS",
  "ACADEMIC",
  "IT",
  "ADMINISTRATIVE",
  "TRANSPORT",
  "LIBRARY",
  "SAFETY",
  "OTHER",
];

/*
|--------------------------------------------------------------------------
| Helper: Validate Case Type
|--------------------------------------------------------------------------
*/

const normalizeCaseType = (caseType) => {
  if (!caseType) return null;

  return caseType.trim().toUpperCase();
};

/*
|--------------------------------------------------------------------------
| Helper: Validate Parent Category
|--------------------------------------------------------------------------
*/

const validateParentCategory = async ({
  parent,
  caseType,
  currentCategoryId = null,
}) => {
  // No parent means root category
  if (!parent) {
    return {
      valid: true,
      parentCategory: null,
    };
  }

  // Prevent category from being its own parent
  if (
    currentCategoryId &&
    parent.toString() === currentCategoryId.toString()
  ) {
    return {
      valid: false,
      status: 400,
      message: "A category cannot be its own parent",
    };
  }

  const parentCategory = await Category.findById(parent);

  if (!parentCategory) {
    return {
      valid: false,
      status: 404,
      message: "Parent category not found",
    };
  }

  // Parent must belong to same case type
  if (parentCategory.caseType !== caseType) {
    return {
      valid: false,
      status: 400,
      message:
        "Parent category must belong to the same case type",
    };
  }

  return {
    valid: true,
    parentCategory,
  };
};

/*
|--------------------------------------------------------------------------
| Get Active Categories
|--------------------------------------------------------------------------
| Used by students/users when creating a case or complaint.
|
| Optional query parameters:
|
| GET /categories
| GET /categories?caseType=ACADEMIC
| GET /categories?caseType=TRANSPORT
| GET /categories?caseType=ACADEMIC&parent=<id>
|--------------------------------------------------------------------------
*/

export const getActiveCategories = async (req, res) => {
  try {
    const { caseType, parent } = req.query;

    const filter = {
      isActive: true,
    };

    /*
    |--------------------------------------------------------------------------
    | Case Type Filter
    |--------------------------------------------------------------------------
    */

    if (caseType) {
      const normalizedCaseType =
        normalizeCaseType(caseType);

      if (
        !ALLOWED_CASE_TYPES.includes(
          normalizedCaseType
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid case type",
        });
      }

      filter.caseType = normalizedCaseType;
    }

    /*
    |--------------------------------------------------------------------------
    | Parent Filter
    |--------------------------------------------------------------------------
    */

    if (parent === "ROOT") {
      filter.parent = null;
    } else if (parent) {
      filter.parent = parent;
    }

    const categories = await Category.find(filter)
      .select(
        "_id name description caseType parent isActive"
      )
      .populate("parent", "_id name caseType")
      .sort({
        caseType: 1,
        name: 1,
      });

    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error(
      "Get active categories error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get All Categories
|--------------------------------------------------------------------------
| Admin only.
|
| Optional query parameters:
|
| GET /categories/admin
| GET /categories/admin?caseType=ACADEMIC
| GET /categories/admin?parent=ROOT
| GET /categories/admin?isActive=true
|--------------------------------------------------------------------------
*/

export const getAllCategories = async (req, res) => {
  try {
    const {
      caseType,
      parent,
      isActive,
    } = req.query;

    const filter = {};

    /*
    |--------------------------------------------------------------------------
    | Case Type Filter
    |--------------------------------------------------------------------------
    */

    if (caseType) {
      const normalizedCaseType =
        normalizeCaseType(caseType);

      if (
        !ALLOWED_CASE_TYPES.includes(
          normalizedCaseType
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid case type",
        });
      }

      filter.caseType = normalizedCaseType;
    }

    /*
    |--------------------------------------------------------------------------
    | Parent Filter
    |--------------------------------------------------------------------------
    */

    if (parent === "ROOT") {
      filter.parent = null;
    } else if (parent) {
      filter.parent = parent;
    }

    /*
    |--------------------------------------------------------------------------
    | Active / Inactive Filter
    |--------------------------------------------------------------------------
    */

    if (isActive === "true") {
      filter.isActive = true;
    }

    if (isActive === "false") {
      filter.isActive = false;
    }

    const categories = await Category.find(filter)
      .select(
        "_id name description caseType parent isActive createdAt updatedAt"
      )
      .populate(
        "parent",
        "_id name caseType"
      )
      .sort({
        caseType: 1,
        name: 1,
      });

    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error(
      "Get all categories error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Create Category
|--------------------------------------------------------------------------
| Admin only.
|--------------------------------------------------------------------------
*/

export const createCategory = async (req, res) => {
  try {
    const {
      name,
      description,
      caseType,
      parent,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Validate Name
    |--------------------------------------------------------------------------
    */

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Case Type
    |--------------------------------------------------------------------------
    */

    const normalizedCaseType =
      normalizeCaseType(caseType);

    if (!normalizedCaseType) {
      return res.status(400).json({
        success: false,
        message: "Case type is required",
      });
    }

    if (
      !ALLOWED_CASE_TYPES.includes(
        normalizedCaseType
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid case type",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Normalize Category Name
    |--------------------------------------------------------------------------
    */

    const normalizedName = name
      .trim()
      .toUpperCase();

    /*
    |--------------------------------------------------------------------------
    | Check Duplicate Category
    |--------------------------------------------------------------------------
    */

    const existingCategory =
      await Category.findOne({
        name: normalizedName,
      });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Parent
    |--------------------------------------------------------------------------
    */

    const parentValidation =
      await validateParentCategory({
        parent,
        caseType: normalizedCaseType,
      });

    if (!parentValidation.valid) {
      return res.status(
        parentValidation.status
      ).json({
        success: false,
        message: parentValidation.message,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Create Category
    |--------------------------------------------------------------------------
    */

    const category = await Category.create({
      name: normalizedName,
      description:
        description?.trim() || "",
      caseType: normalizedCaseType,
      parent:
        parentValidation.parentCategory?._id ||
        null,
    });

    /*
    |--------------------------------------------------------------------------
    | Populate Parent
    |--------------------------------------------------------------------------
    */

    await category.populate(
      "parent",
      "_id name caseType"
    );

    return res.status(201).json({
      success: true,
      message:
        "Category created successfully",
      category,
    });
  } catch (error) {
    console.error(
      "Create category error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update Category
|--------------------------------------------------------------------------
| Admin only.
|--------------------------------------------------------------------------
*/

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      caseType,
      parent,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Validate Name
    |--------------------------------------------------------------------------
    */

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Case Type
    |--------------------------------------------------------------------------
    */

    const normalizedCaseType =
      normalizeCaseType(caseType);

    if (!normalizedCaseType) {
      return res.status(400).json({
        success: false,
        message: "Case type is required",
      });
    }

    if (
      !ALLOWED_CASE_TYPES.includes(
        normalizedCaseType
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid case type",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Normalize Name
    |--------------------------------------------------------------------------
    */

    const normalizedName = name
      .trim()
      .toUpperCase();

    /*
    |--------------------------------------------------------------------------
    | Find Category
    |--------------------------------------------------------------------------
    */

    const category =
      await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Check Duplicate Category
    |--------------------------------------------------------------------------
    */

    const duplicateCategory =
      await Category.findOne({
        name: normalizedName,
        _id: { $ne: id },
      });

    if (duplicateCategory) {
      return res.status(409).json({
        success: false,
        message:
          "Another category with this name already exists",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Parent
    |--------------------------------------------------------------------------
    */

    const parentValidation =
      await validateParentCategory({
        parent,
        caseType: normalizedCaseType,
        currentCategoryId: id,
      });

    if (!parentValidation.valid) {
      return res.status(
        parentValidation.status
      ).json({
        success: false,
        message: parentValidation.message,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Prevent Circular Parent Relationship
    |--------------------------------------------------------------------------
    |
    | Example:
    |
    | A → B → C
    |
    | C cannot become parent of A.
    |
    |--------------------------------------------------------------------------
    */

    if (parent) {
      let currentParent =
        parentValidation.parentCategory;

      while (currentParent) {
        if (
          currentParent._id.toString() ===
          id.toString()
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Circular parent relationship is not allowed",
          });
        }

        if (!currentParent.parent) {
          break;
        }

        currentParent =
          await Category.findById(
            currentParent.parent
          );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Update Category
    |--------------------------------------------------------------------------
    */

    category.name = normalizedName;

    category.description =
      description?.trim() || "";

    category.caseType =
      normalizedCaseType;

    category.parent =
      parentValidation.parentCategory?._id ||
      null;

    await category.save();

    /*
    |--------------------------------------------------------------------------
    | Populate Parent
    |--------------------------------------------------------------------------
    */

    await category.populate(
      "parent",
      "_id name caseType"
    );

    return res.status(200).json({
      success: true,
      message:
        "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error(
      "Update category error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Toggle Category Status
|--------------------------------------------------------------------------
| Admin only.
|--------------------------------------------------------------------------
*/

export const toggleCategoryStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const category =
      await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.isActive =
      !category.isActive;

    await category.save();

    return res.status(200).json({
      success: true,
      message: category.isActive
        ? "Category activated successfully"
        : "Category deactivated successfully",
      category,
    });
  } catch (error) {
    console.error(
      "Toggle category status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};