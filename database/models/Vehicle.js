const mongoose = require("mongoose");

const STATUS_OPTIONS = [
  "Received",
  "Diagnosis",
  "Repairing",
  "Quality Check",
  "Completed",
];

const vehicleSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    model: { type: String, required: true, trim: true },
    plate: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: STATUS_OPTIONS,
      default: "Received",
    },
    customerName: { type: String, required: true, trim: true },
    customerAddress: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

vehicleSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
module.exports.STATUS_OPTIONS = STATUS_OPTIONS;