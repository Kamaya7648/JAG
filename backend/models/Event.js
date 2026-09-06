const mongoose = require("mongoose");

const EVENT_STATUSES = [
  "Received",
  "Diagnosis",
  "Repairing",
  "Quality Check",
  "Completed",
  "Meeting",
  "Other",
];

const eventSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, index: true }, // "YYYY-MM-DD"
    startHour: { type: Number, required: true, min: 0, max: 23 },
    duration: { type: Number, required: true, min: 0.5 },
    text: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: EVENT_STATUSES,
      default: "Meeting",
    },
  },
  { timestamps: true }
);

eventSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Event", eventSchema);
