const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const roleCheck = require("../middleware/roleMiddleware");
const patientController = require("../controllers/patientController");

/* ================================
   RECEPTIONIST - CREATE PATIENT
================================ */
router.post("/", auth, roleCheck("receptionist"), patientController.createPatient);

/* ================================
   RECEPTIONIST - LIST/READ PATIENTS
================================ */
// GET /patients?doctorAssigned=<id>&status=waiting,in-consultation&name=Alice
router.get("/", auth, roleCheck("receptionist"), patientController.getPatients);

/* ================================
   PATIENT - CHECK POSITION BY NAME
================================ */
router.get("/name/:name/position", auth, roleCheck("patient"), patientController.getPatientPositionByName);

/* ================================
   DOCTOR - VIEW QUEUE
================================ */
router.get("/doctor/:doctorId/queue", auth, roleCheck("doctor"), patientController.getDoctorQueue);
router.get("/doctor/queue", auth, roleCheck("doctor"), patientController.getDoctorQueue);

// GET /patients/:id
router.get("/:id", auth, roleCheck("receptionist"), patientController.getPatientById);

/* ================================
   RECEPTIONIST - UPDATE/DELETE PATIENT
================================ */
// PATCH /patients/:id
router.patch("/:id", auth, roleCheck("receptionist"), patientController.updatePatient);
router.put("/:id", auth, roleCheck("receptionist"), patientController.updatePatient);

// DELETE /patients/:id
router.delete("/:id", auth, roleCheck("receptionist"), patientController.deletePatient);


/* ================================
   DOCTOR - COMPLETE CONSULTATION
================================ */
router.patch("/:id/complete", auth, roleCheck("doctor"), patientController.completeConsultation);


module.exports = router;