const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {createCompany, getCompanies} = require("../controllers/company.controller");

// router.post("/",authMiddleware, createCompany);
router.post("/", authMiddleware("ADMIN"), createCompany);
// router.get("/",authMiddleware, getCompanies);
router.get("/",authMiddleware("ADMIN"), getCompanies);

module.exports = router;