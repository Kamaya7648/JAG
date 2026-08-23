const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    vehicleId: { type: String, required: true, unique: true, trim: true },
    vehicleModel: { type: String, required: true, trim: true },
    numberPlate: { type: String, required: true, trim: true },
    vehicleStatus: {
      type: String,
      enum: ["Received", "Diagnosis", "Repairing", "Quality Check", "Completed"],
      default: "Received",
    },
    customerName: { type: String, required: true, trim: true },
    customerAddress: { type: String, required: true, trim: true },
    telephoneNo: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
