import "dotenv/config";
import mongoose from "mongoose";
import Category from "../src/models/Category.js";

const EXPECTED_DB_NAME = "unisolve";

const LEGACY_CATEGORY_MIGRATIONS = [
  {
    name: "ELECTRICAL",
    caseType: "CAMPUS",
  },
  {
    name: "PLUMBING",
    caseType: "CAMPUS",
  },
  {
    name: "CLEANLINESS",
    caseType: "CAMPUS",
  },
  {
    name: "HOSTEL",
    caseType: "CAMPUS",
  },
  {
    name: "MESS",
    caseType: "CAMPUS",
  },
  {
    name: "INTERNET",
    caseType: "IT",
  },
  {
    name: "SECURITY",
    caseType: "SAFETY",
  },
  {
    name: "MAINTENANCE",
    caseType: "CAMPUS",
  },
  {
    name: "OTHER",
    caseType: "OTHER",
  },
  {
    name: "TRANS",
    caseType: "TRANSPORT",
  },
];

const REQUIRED_CASE_TYPES = [
  "CAMPUS",
  "ACADEMIC",
  "IT",
  "ADMINISTRATIVE",
  "TRANSPORT",
  "LIBRARY",
  "SAFETY",
  "OTHER",
];

const ensureCaseType = (caseType) => {
  if (!REQUIRED_CASE_TYPES.includes(caseType)) {
    throw new Error(`Invalid caseType: ${caseType}`);
  }
};

const updateLegacyCategories = async () => {
  console.log("\n🔄 Updating legacy categories...\n");

  for (const item of LEGACY_CATEGORY_MIGRATIONS) {
    ensureCaseType(item.caseType);

    const category = await Category.findOne({
      name: item.name,
    });

    if (!category) {
      console.log(`⚠️ Not found: ${item.name}`);
      continue;
    }

    const oldCaseType = category.caseType || null;
    const oldParent = category.parent || null;

    category.caseType = item.caseType;
    category.parent = null;

    await category.save();

    console.log(
      `✅ ${item.name}: ${oldCaseType || "NONE"} → ${item.caseType}`
    );

    if (oldParent) {
      console.log(`   ↳ Parent cleared`);
    }
  }
};

const renameTransToTransport = async () => {
  console.log("\n🔄 Checking TRANS → TRANSPORT...\n");

  const trans = await Category.findOne({
    name: "TRANS",
  });

  if (!trans) {
    console.log("⏭️ TRANS does not exist.");
    return;
  }

  const existingTransport = await Category.findOne({
    name: "TRANSPORT",
  });

  if (existingTransport && existingTransport._id.toString() !== trans._id.toString()) {
    console.log(
      "⚠️ TRANSPORT already exists as a different category."
    );

    console.log(
      "⏭️ Keeping TRANS unchanged to avoid duplicate/reference issues."
    );

    return;
  }

  trans.name = "TRANSPORT";
  trans.caseType = "TRANSPORT";
  trans.parent = null;

  await trans.save();

  console.log("✅ TRANS renamed to TRANSPORT");
  console.log(`   Preserved _id: ${trans._id}`);
};

const verifyExistingStructuredCategories = async () => {
  console.log("\n🔍 Verifying existing structured categories...\n");

  const examination = await Category.findOne({
    name: "EXAMINATION",
  });

  if (examination) {
    examination.caseType = "ACADEMIC";
    examination.parent = null;
    await examination.save();

    console.log("✅ EXAMINATION → ACADEMIC");
  }

  const internalMarks = await Category.findOne({
    name: "INTERNAL MARKS",
  });

  if (internalMarks) {
    if (!examination) {
      throw new Error(
        "EXAMINATION category is required before INTERNAL MARKS."
      );
    }

    internalMarks.caseType = "ACADEMIC";
    internalMarks.parent = examination._id;

    // Preserve existing active/inactive state.
    await internalMarks.save();

    console.log(
      `✅ INTERNAL MARKS → ACADEMIC → EXAMINATION`
    );
    console.log(
      `   isActive preserved: ${internalMarks.isActive}`
    );
  }

  const bus = await Category.findOne({
    name: "BUS",
  });

  if (bus) {
    bus.caseType = "TRANSPORT";
    bus.parent = null;
    await bus.save();

    console.log("✅ BUS → TRANSPORT");
  }

  const busBreakdown = await Category.findOne({
    name: "BUS BREAKDOWN",
  });

  if (busBreakdown) {
    if (!bus) {
      throw new Error(
        "BUS category is required before BUS BREAKDOWN."
      );
    }

    busBreakdown.caseType = "TRANSPORT";
    busBreakdown.parent = bus._id;

    await busBreakdown.save();

    console.log(
      "✅ BUS BREAKDOWN → TRANSPORT → BUS"
    );
  }
};

const printCategorySummary = async () => {
  console.log("\n📊 FINAL CATEGORY SUMMARY\n");

  const categories = await Category.find({})
    .populate("parent", "name caseType")
    .sort({ caseType: 1, name: 1 })
    .lean();

  for (const category of categories) {
    const parentName = category.parent
      ? category.parent.name
      : "ROOT";

    console.log(
      `${category.name} | ${category.caseType || "MISSING"} | Parent: ${parentName} | Active: ${category.isActive}`
    );
  }

  console.log(`\nTotal categories: ${categories.length}`);
};

const main = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined.");
    }

    if (process.env.NODE_ENV !== "development") {
      throw new Error(
        "Migration blocked: NODE_ENV must be development."
      );
    }

    console.log("🔌 Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");
    console.log(
      `🗄️ Connected database: ${mongoose.connection.name}`
    );

    // Critical safety check.
    if (mongoose.connection.name !== EXPECTED_DB_NAME) {
      throw new Error(
        `Wrong database! Expected "${EXPECTED_DB_NAME}", connected to "${mongoose.connection.name}".`
      );
    }

    console.log(
      `🛡️ Database safety check passed: ${EXPECTED_DB_NAME}`
    );

    await updateLegacyCategories();

    await renameTransToTransport();

    await verifyExistingStructuredCategories();

    await printCategorySummary();

    console.log("\n🎉 Category migration completed successfully.");
  } catch (error) {
    console.error("\n❌ Category migration failed:");
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB connection closed.");
  }
};

main();