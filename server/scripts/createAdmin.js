import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/User.js";

const createAdmin = async () => {
  try {
    // Safety check
    if (process.env.NODE_ENV !== "development") {
      console.error("❌ This script can only run in development mode.");
      process.exit(1);
    }

    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is not defined.");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");
    console.log(
      "🗄️ Database:",
      mongoose.connection.name
    );

    // Check whether admin already exists
    const existingAdmin = await User.findOne({
      email: "admin@unisolve.com",
    });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists.");
      console.log("Email:", existingAdmin.email);
      console.log("Role:", existingAdmin.role);

      await mongoose.disconnect();
      return;
    }

    // Temporary development password
    const password = "Admin@123";

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await User.create({
      name: "UniSolve Admin",
      email: "admin@unisolve.com",
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
    });

    console.log("\n🎉 Development Admin created successfully!");
    console.log("-----------------------------------------");
    console.log("Email:    ", admin.email);
    console.log("Password: ", password);
    console.log("Role:     ", admin.role);
    console.log("Database: ", mongoose.connection.name);
    console.log("-----------------------------------------");

    await mongoose.disconnect();

    console.log("🔌 MongoDB connection closed.");
  } catch (error) {
    console.error("❌ Failed to create development admin:");
    console.error(error);

    await mongoose.disconnect();
    process.exit(1);
  }
};

createAdmin();