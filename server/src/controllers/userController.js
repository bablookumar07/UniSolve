import User from "../models/User.js";

/**
 * Get all active staff users
 * Used by Admin when assigning/reassigning complaints.
 */
export const getStaffUsers = async (req, res) => {
  try {
    const staffUsers = await User.find({
      role: "STAFF",
      isActive: true,
    })
      .select("_id name email")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: staffUsers.length,
      users: staffUsers,
    });
  } catch (error) {
    console.error("Get staff users error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Get currently authenticated user.
 */
export const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      isActive: req.user.isActive,
    },
  });
};

/**
 * Admin authorization test.
 */
export const adminTest = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Admin authorization successful",
    user: {
      id: req.user._id,
      role: req.user.role,
    },
  });
};

/**
 * Get all users.
 * Admin only.
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("_id name email role isActive createdAt updatedAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Activate / deactivate a user.
 * Admin only.
 */
export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent an Admin from deactivating their own account.
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot deactivate your own account",
      });
    }

    user.isActive = !user.isActive;

    await user.save();

    return res.status(200).json({
      success: true,
      message: user.isActive
        ? "User activated successfully"
        : "User deactivated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Toggle user status error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};