import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import auditLogRoutes from "./routes/auditLogRoutes.js";




const app = express();

app.use(express.json());
app.use(cookieParser());


app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);


app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/audit-logs", auditLogRoutes);


app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "UniSolve API is running",
  });
});

export default app;