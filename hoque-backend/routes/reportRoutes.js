const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const roleCheck = require("../middleware/roleMiddleware");
const reportController = require("../controllers/reportController");

// GET /reports/summary?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
router.get("/summary", auth, roleCheck("receptionist", "doctor"), reportController.getSummaryReport);

module.exports = router;
