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
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    date: { type: String, required: true, index: true },
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
    delete ret.owner;
    return ret;
  },
});

module.exports = mongoose.model("Event", eventSchema);