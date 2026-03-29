const mongoose = require("mongoose");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

exports.createPatient = async (req, res) => {
  try {
    const { name, age, complaint, priority, doctorAssigned } = req.body;
    if (!name || !age || !complaint || !doctorAssigned) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const doctor = await Doctor.findById(doctorAssigned);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const patient = await Patient.create({
      name,
      age,
      complaint,
      priority: priority || 1,
      doctorAssigned,
      status: "waiting"
    });
    return res.status(201).json(patient);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getPatients = async (req, res) => {
  try {
    const filter = {};
    if (req.query.doctorAssigned) filter.doctorAssigned = req.query.doctorAssigned;
    if (req.query.status) {
      const statuses = String(req.query.status)
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);
      if (statuses.length) filter.status = { $in: statuses };
    }
    if (req.query.name) filter.name = String(req.query.name).trim();

    const patients = await Patient.find(filter)
      .sort({ checkInTime: 1 })
      .populate("doctorAssigned", "name specialization");
    return res.json({ total: patients.length, patients });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate(
      "doctorAssigned",
      "name specialization"
    );
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    return res.json(patient);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const allowed = ["name", "age", "complaint", "priority", "status", "doctorAssigned"];
    const update = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }

    if (update.doctorAssigned) {
      const doctor = await Doctor.findById(update.doctorAssigned);
      if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    }

    const patient = await Patient.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true
    });
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    return res.json(patient);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    return res.json({ message: "Patient deleted", patientId: patient._id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.completeConsultation = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { doctorId } = req.body;
    if (!doctorId) {
      await session.endSession();
      return res.status(400).json({ message: "doctorId is required" });
    }

    let responsePayload = null;
    await session.withTransaction(async () => {
      const patient = await Patient.findById(req.params.id).session(session);
      if (!patient) throw new Error("PATIENT_NOT_FOUND");
      if (patient.doctorAssigned?.toString() !== String(doctorId)) {
        throw new Error("PATIENT_DOCTOR_MISMATCH");
      }

      patient.status = "completed";
      await patient.save({ session });

      const nextPatient = await Patient.findOne({
        doctorAssigned: doctorId,
        status: "waiting"
      })
        .sort({ priority: 1, checkInTime: 1 })
        .session(session);

      if (nextPatient) {
        nextPatient.status = "in-consultation";
        await nextPatient.save({ session });
      }

      responsePayload = { message: "Consultation completed", nextPatient };
    });

    await session.endSession();
    return res.json(responsePayload);
  } catch (error) {
    await session.endSession();
    if (error.message === "PATIENT_NOT_FOUND") {
      return res.status(404).json({ message: "Patient not found" });
    }
    if (error.message === "PATIENT_DOCTOR_MISMATCH") {
      return res.status(403).json({ message: "Patient not assigned to this doctor" });
    }
    return res.status(500).json({ error: error.message });
  }
};

exports.getPatientPositionByName = async (req, res) => {
  try {
    const { name } = req.params;
    const patient = await Patient.findOne({ name });
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const queue = await Patient.find({
      doctorAssigned: patient.doctorAssigned,
      status: { $in: ["waiting", "in-consultation"] }
    }).sort({ priority: 1, checkInTime: 1 });

    const position = queue.findIndex(p => p._id.equals(patient._id)) + 1;
    return res.json({
      patient: patient.name,
      status: patient.status,
      priority: patient.priority,
      position,
      totalActivePatients: queue.length
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getDoctorQueue = async (req, res) => {
  try {
    const doctorId = req.params.doctorId || req.query.doctorId;
    if (!doctorId) return res.status(400).json({ message: "doctorId is required" });

    const patients = await Patient.find({
      doctorAssigned: doctorId,
      status: { $in: ["waiting", "in-consultation"] }
    }).sort({ priority: 1, checkInTime: 1 });

    const queue = patients.map((p, index) => ({
      _id: p._id,
      name: p.name,
      priority: p.priority,
      status: p.status,
      position: index + 1
    }));

    return res.json({ doctorId, totalPatients: queue.length, queue });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
