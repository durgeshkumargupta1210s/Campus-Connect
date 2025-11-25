// server/server.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import eventRoutes from "./routes/eventRoutes.js";
import showRoutes from "./routes/showRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

// middleware (before routes)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// health check
app.get("/", (_req, res) => {
  res.send("CampusConnect server is live!");
});

// test route for debugging
app.get("/test", (_req, res) => {
  res.json({ message: "Test endpoint working", timestamp: new Date() });
});

// routes
app.use("/api/events", eventRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error("Server error:", err);
  res.status(500).json({ 
    error: "Internal server error", 
    message: err.message 
  });
});

// Start server with proper async handling
(async () => {
  try {
    // Try to connect to database
    await connectDB();
    console.log('✅ Database initialization complete');
  } catch (dbError) {
    console.log('⚠️ Database error during startup (server will continue to run)');
  }

  app.listen(port, () => {
    console.log(`\n🚀 Server is running at http://localhost:${port}`);
    console.log(`📝 API Base URL: http://localhost:${port}/api`);
    console.log(`✅ Test endpoint: http://localhost:${port}/test`);
    console.log(`\nRoutes available:`);
    console.log(`  - GET  http://localhost:${port}/api/events`);
    console.log(`  - GET  http://localhost:${port}/api/shows`);
    console.log(`  - GET  http://localhost:${port}/api/bookings`);
    console.log(`  - GET  http://localhost:${port}/api/users`);
    console.log(`  - GET  http://localhost:${port}/api/admin/dashboard/stats\n`);
  });
})();
