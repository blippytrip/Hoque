const Transaction = require("../models/Transaction");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

exports.createTransaction = async (req, res) => {
  try {
    const { patient, doctor, amount, transactionDate, notes } = req.body;
    if (!patient || !doctor || amount === undefined || !transactionDate) {
      return res.status(400).json({ message: "patient, doctor, amount, transactionDate are required" });
    }

    const [patientDoc, doctorDoc] = await Promise.all([
      Patient.findById(patient),
      Doctor.findById(doctor)
    ]);

    if (!patientDoc) return res.status(404).json({ message: "Patient not found" });
    if (!doctorDoc) return res.status(404).json({ message: "Doctor not found" });
    if (patientDoc.doctorAssigned?.toString() !== doctorDoc._id.toString()) {
      return res.status(400).json({ message: "Patient is not assigned to this doctor" });
    }
    if (new Date(transactionDate).toString() === "Invalid Date") {
      return res.status(400).json({ message: "Invalid transactionDate" });
    }

    const transaction = await Transaction.create({
      patient,
      doctor,
      amount,
      transactionDate,
      notes: notes || "",
      status: "pending"
    });

    return res.status(201).json(transaction);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.patient) filter.patient = req.query.patient;
    if (req.query.doctor) filter.doctor = req.query.doctor;

    const transactions = await Transaction.find(filter)
      .sort({ transactionDate: -1 })
      .populate("patient", "name")
      .populate("doctor", "name specialization");

    return res.json({ total: transactions.length, transactions });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate("patient", "name")
      .populate("doctor", "name specialization");
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    return res.json(transaction);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    return res.json(transaction);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
