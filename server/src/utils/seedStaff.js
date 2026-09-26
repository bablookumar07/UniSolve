import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const seedStaff = async () => {
  try {
    await connectDB();

    const email = "staff@unisolve.com";

    const existingStaff = await User.findOne({ email });

    if (existingStaff) {
      console.log("Staff already exists");

      await mongoose.connection.close();
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      "Staff@123456",
      12
    );

    await User.create({
      name: "UniSolve Staff",
      email,
      password: hashedPassword,
      role: "STAFF",
      isActive: true,
    });

    console.log("Staff created successfully");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Staff seeding failed:", error.message);

    await mongoose.connection.close();
    process.exit(1);
  }
};

seedStaff();