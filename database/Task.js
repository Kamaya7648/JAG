const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    title: { type: String, required: true, trim: true },
    daysToComplete: { type: Number, required: true, default: 1 },
    board: {
      type: String,
      enum: ["Received", "Diagnosis", "Repairing", "Quality Check", "Completed"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
