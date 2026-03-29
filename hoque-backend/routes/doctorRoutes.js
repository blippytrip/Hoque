const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const roleCheck = require("../middleware/roleMiddleware");
const doctorController = require("../controllers/doctorController");

/* ================================
   DOCTOR CRUD
   - Receptionist manages doctors
   - All authenticated roles can read doctors
================================ */

router.post("/", auth, roleCheck("receptionist"), doctorController.createDoctor);

router.get("/", doctorController.getDoctors);

router.get("/:id", doctorController.getDoctorById);

router.patch("/:id", auth, roleCheck("receptionist"), doctorController.updateDoctor);
router.put("/:id", auth, roleCheck("receptionist"), doctorController.updateDoctor);

router.delete("/:id", auth, roleCheck("receptionist"), doctorController.deleteDoctor);

module.exports = router;

