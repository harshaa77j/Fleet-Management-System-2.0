const express = require("express");
require("dotenv").config();
const adminAuthRoutes = require("./routes/admin.auth.routes");
const cors = require("cors");
const companyRoutes = require("./routes/company.routes");
const managerOnboardRoutes = require("./routes/manager.onboard.routes");
const authRoutes = require("./routes/auth.routes");
const managerAuthRoutes = require("./routes/manager.auth.routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "http://127.0.0.1:5500",   // Live Server
    credentials: true
}));

app.use(express.json());
app.use("/admin/auth", adminAuthRoutes);
app.use("/admin/companies",companyRoutes);
app.use("/activation", managerOnboardRoutes);
app.use("/auth", authRoutes);
app.use("/manager/auth", managerAuthRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
