const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const roleCheck = require("../middleware/roleMiddleware");
const userController = require("../controllers/userController");

router.post("/", auth, roleCheck("receptionist", "admin"), userController.createUser);
router.get("/", auth, roleCheck("receptionist", "admin"), userController.getUsers);
router.get("/:id", auth, roleCheck("receptionist", "admin"), userController.getUserById);
router.patch("/:id", auth, roleCheck("receptionist", "admin"), userController.updateUser);
router.put("/:id", auth, roleCheck("receptionist", "admin"), userController.updateUser);
router.delete("/:id", auth, roleCheck("receptionist", "admin"), userController.deleteUser);

module.exports = router;
