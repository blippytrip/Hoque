const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const roleCheck = require("../middleware/roleMiddleware");
const userController = require("../controllers/userController");

router.post("/", auth, roleCheck("receptionist"), userController.createUser);
router.get("/", auth, roleCheck("receptionist"), userController.getUsers);
router.get("/:id", auth, roleCheck("receptionist"), userController.getUserById);
router.patch("/:id", auth, roleCheck("receptionist"), userController.updateUser);
router.put("/:id", auth, roleCheck("receptionist"), userController.updateUser);
router.delete("/:id", auth, roleCheck("receptionist"), userController.deleteUser);

module.exports = router;
