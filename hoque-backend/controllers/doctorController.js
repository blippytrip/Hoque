const Doctor = require("../models/Doctor");

exports.createDoctor = async (req, res) => {
  try {
    const { name, specialization, isAvailable } = req.body;
    if (!name || !specialization) {
      return res.status(400).json({ message: "name and specialization are required" });
    }

    const doctor = await Doctor.create({
      name: String(name).trim(),
      specialization: String(specialization).trim(),
      isAvailable: isAvailable ?? true
    });
    return res.status(201).json(doctor);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getDoctors = async (_req, res) => {
  try {
    const doctors = await Doctor.find().sort({ name: 1 });
    return res.json(doctors);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    return res.json(doctor);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const allowed = ["name", "specialization", "isAvailable"];
    const update = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }

    const doctor = await Doctor.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true
    });

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    return res.json(doctor);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    return res.json({ message: "Doctor deleted", doctorId: doctor._id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
