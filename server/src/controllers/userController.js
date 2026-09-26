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