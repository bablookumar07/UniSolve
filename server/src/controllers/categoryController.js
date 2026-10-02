import Category from "../models/Category.js";

/*
|--------------------------------------------------------------------------
| Get Active Categories
|--------------------------------------------------------------------------
| Used by students when creating complaints.
*/

export const getActiveCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isActive: true,
    })
      .select("_id name description")
      .sort({ name: 1 });

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
*/

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .select(
        "_id name description isActive createdAt updatedAt"
      )
      .sort({ name: 1 });

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
*/

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const normalizedName = name
      .trim()
      .toUpperCase();

    const existingCategory = await Category.findOne({
      name: normalizedName,
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name: normalizedName,
      description: description?.trim() || "",
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
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
*/

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const normalizedName = name
      .trim()
      .toUpperCase();

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const duplicateCategory =
      await Category.findOne({
        name: normalizedName,
        _id: { $ne: id },
      });

    if (duplicateCategory) {
      return res.status(409).json({
        success: false,
        message: "Another category with this name already exists",
      });
    }

    category.name = normalizedName;
    category.description =
      description?.trim() || "";

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
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
*/

export const toggleCategoryStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.isActive = !category.isActive;

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