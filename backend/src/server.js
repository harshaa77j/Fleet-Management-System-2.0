const express = require("express");
require("dotenv").config();
//const pool = require("./config/db");
const adminAuthRoutes = require("./routes/admin.auth.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// app.get("/", async (req, res) => {
//   try{
//     const result = await pool.query("SELECT NOW()");
//     res.json({
//         status: "backend running",
//         dbTime: result.rows[0].now
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({error: "Database not connected"});
//   }
// });
app.use(express.json());
app.use("/admin/auth", adminAuthRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
