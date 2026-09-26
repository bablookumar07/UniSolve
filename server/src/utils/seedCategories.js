import dotenv from "dotenv";
import mongoose from "mongoose";

import Category from "../models/Category.js";
import connectDB from "../config/db.js";

dotenv.config();

const categories = [
  {
    name: "ELECTRICAL",
    description: "Electrical equipment, lights, switches, power issues, and related problems.",
  },
  {
    name: "PLUMBING",
    description: "Water supply, taps, pipes, drainage, and plumbing issues.",
  },
  {
    name: "CLEANLINESS",
    description: "Cleaning, sanitation, waste management, and hygiene-related issues.",
  },
  {
    name: "HOSTEL",
    description: "Hostel room, furniture, common area, and accommodation-related issues.",
  },
  {
    name: "MESS",
    description: "Food quality, hygiene, menu, and mess-related issues.",
  },
  {
    name: "INTERNET",
    description: "Wi-Fi, network connectivity, and internet-related issues.",
  },
  {
    name: "SECURITY",
    description: "Security, access control, safety, and related campus issues.",
  },
  {
    name: "MAINTENANCE",
    description: "General infrastructure, repair, and maintenance issues.",
  },
  {
    name: "OTHER",
    description: "Issues that do not fit into the available categories.",
  },
];

const seedCategories = async () => {
  try {
    await connectDB();

    await Category.deleteMany();

    await Category.insertMany(categories);

    console.log("Categories seeded successfully");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Category seeding failed:", error.message);

    await mongoose.connection.close();
    process.exit(1);
  }
};

seedCategories();