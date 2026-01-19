import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

/* =======================
   CORS CONFIG (IMPORTANT)
======================= */
const allowedOrigins = [
  "http://localhost:5173",
  "https://chat-app-1-ddet.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Handle preflight requests
app.options("*", cors());

/* =======================
   MIDDLEWARES
======================= */
app.use(express.json());
app.use(cookieParser());

/* =======================
   ROUTES
======================= */
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

/* =======================
   SERVE FRONTEND (PROD)
======================= */
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../frontend", "dist", "index.html")
    );
  });
}

/* =======================
   START SERVER
======================= */
server.listen(PORT, () => {
  console.log("Server running on PORT:", PORT);
  connectDB();
});
