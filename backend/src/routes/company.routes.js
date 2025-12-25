const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {createCompany, getCompanies} = require("../controllers/company.controller");

router.post("/",authMiddleware, createCompany);
router.get("/",authMiddleware, getCompanies);

module.exports = router;