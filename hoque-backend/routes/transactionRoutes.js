const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const roleCheck = require("../middleware/roleMiddleware");
const transactionController = require("../controllers/transactionController");

// Create transaction
router.post("/", auth, roleCheck("receptionist"), transactionController.createTransaction);

// Read transactions
router.get("/", auth, roleCheck("receptionist", "doctor","admin"), transactionController.getTransactions);
router.get("/:id", auth, roleCheck("receptionist", "doctor","admin"), transactionController.getTransactionById);

// Update transaction status
router.patch("/:id/status", auth, roleCheck("receptionist"), transactionController.updateTransactionStatus);

module.exports = router;
