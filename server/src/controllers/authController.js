import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic input check
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // 2. Check whether user already exists
    const existingUser = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create user
    const user = await User.create({
      name,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: "STUDENT",
    });

    // 5. Return safe response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 1. Validate input
    if (!email || !password || !role) {
      console.log("❌ Login validation failed:", {
        hasEmail: !!email,
        hasPassword: !!password,
        hasRole: !!role,
      });

      return res.status(400).json({
        success: false,
        message: "Email, password, and role are required",
      });
    }

    // 2. Normalize role
    const normalizedRole = role.trim().toUpperCase();

    const allowedRoles = ["STUDENT", "STAFF", "ADMIN"];

    if (!allowedRoles.includes(normalizedRole)) {
      console.log("❌ Invalid role received:", normalizedRole);

      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // 3. Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    console.log("\n================ LOGIN DEBUG ================");
    console.log("🔍 Login attempt:", {
      email: normalizedEmail,
      role: normalizedRole,
    });

    // 4. Find user and explicitly include password
    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    console.log("👤 User found:", !!user);

    if (user) {
      console.log("👤 User details:", {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        hasPassword: !!user.password,
      });
    }

    if (!user) {
      console.log("❌ USER NOT FOUND");
      console.log("============================================\n");

      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 5. Check account status
    if (!user.isActive) {
      console.log("❌ ACCOUNT INACTIVE");
      console.log("============================================\n");

      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated",
      });
    }

    // 6. Verify selected role against database role
    console.log("🎭 Role comparison:", {
      selectedRole: normalizedRole,
      databaseRole: user.role,
      match: user.role === normalizedRole,
    });

    if (user.role !== normalizedRole) {
      console.log("❌ ROLE MISMATCH");
      console.log("============================================\n");

      return res.status(401).json({
        success: false,
        message: "The selected role does not match this account",
      });
    }

    // 7. Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    console.log("🔐 Password match:", isPasswordCorrect);

    if (!isPasswordCorrect) {
      console.log("❌ PASSWORD MISMATCH");
      console.log("============================================\n");

      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 8. Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    console.log("✅ Password verified");
    console.log("🔑 JWT generated");

    // 9. Store JWT in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    console.log("🍪 Authentication cookie set");
    console.log("✅ LOGIN SUCCESS");
    console.log("============================================\n");

    // 10. Return safe user information
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};