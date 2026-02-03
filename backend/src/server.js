const express = require("express");
require("dotenv").config();
const adminAuthRoutes = require("./routes/admin.auth.routes");
const cors = require("cors");
const companyRoutes = require("./routes/company.routes");
const managerOnboardRoutes = require("./routes/manager.onboard.routes");
const authRoutes = require("./routes/auth.routes");
const managerAuthRoutes = require("./routes/manager.auth.routes");
const managerProfileRoutes = require("./routes/manager.profile.routes");
const path = require("path");
const managerVehicleRoutes = require("./routes/manager.vehicle.routes");
const managerTelemetryRoutes = require("./routes/manager.telemetry.routes");
const managerWorkerRoutes = require("./routes/manager.worker.routes");
const reportsRoutes = require("./routes/reports.routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    //origin: "http://127.0.0.1:5500",   // Live Server
    origin: ["http://localhost:5173", "http://127.0.0.1:5173 ", "http://127.0.0.1:5500"],
    credentials: true
}));

app.use(express.json());
app.use((req, res, next) => {
  console.log("➡️ HIT:", req.method, req.url);
  next();
});
app.use(express.static(path.join(__dirname, "../public")));
app.use("/admin/auth", adminAuthRoutes);
app.use("/admin/companies",companyRoutes);
app.use("/activation", managerOnboardRoutes);
app.use("/auth", authRoutes);
app.use("/manager/auth", managerAuthRoutes);
app.use("/manager",managerProfileRoutes);
app.use("/manager", managerVehicleRoutes);
app.use("/manager",managerTelemetryRoutes);
app.use("/manager", managerWorkerRoutes);
app.use("/api/reports", reportsRoutes);

if (process.env.NODE_ENV !== 'test') {
  require('./scripts/cron');
  console.log('⏰ Cron jobs initialized - Daily aggregation scheduled');
}

app.listen(PORT,"0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
