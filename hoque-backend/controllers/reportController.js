const Patient = require("../models/Patient");
const Transaction = require("../models/Transaction");

exports.getSummaryReport = async (req, res) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date("1970-01-01");
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    const [patientStats, transactionStats] = await Promise.all([
      Patient.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]),
      Transaction.aggregate([
        {
          $match: {
            transactionDate: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalAmount: { $sum: "$amount" }
          }
        }
      ])
    ]);

    const toObject = (rows, defaultKey = "count") =>
      rows.reduce((acc, row) => {
        acc[row._id] = row[defaultKey];
        return acc;
      }, {});

    const report = {
      range: { startDate, endDate },
      patientsByStatus: toObject(patientStats),
      transactionsByStatus: toObject(transactionStats),
      transactionAmountByStatus: transactionStats.reduce((acc, row) => {
        acc[row._id] = row.totalAmount;
        return acc;
      }, {})
    };

    return res.json(report);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
