const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        trim: true
    },

    age: {
        type: Number,
        required: true,
        min: 0
    },

    complaint: {
        type: String,
        required: true,
        trim: true
    },

    // 3 = emergency
    // 2 = urgent
    // 1 = normal
    priority: {
        type: Number,
        enum: [1, 2, 3],
        default: 1
    },

    status: {
        type: String,
        enum: ["waiting", "in-consultation", "completed"],
        default: "waiting"
    },

    doctorAssigned: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        default: null
    },

    checkInTime: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Patient", patientSchema);