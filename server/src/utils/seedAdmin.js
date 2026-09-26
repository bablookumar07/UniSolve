import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = "admin@unisolve.com";

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists");

      await mongoose.connection.close();
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      "Admin@123456",
      12
    );

    await User.create({
      name: "UniSolve Admin",
      email,
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
    });

    console.log("Admin created successfully");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Admin seeding failed:", error.message);

    await mongoose.connection.close();
    process.exit(1);
  }
};

seedAdmin();