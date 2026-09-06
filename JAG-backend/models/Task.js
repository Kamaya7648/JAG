const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    vehicleId: { type: String, required: true, trim: true, index: true },
    text: { type: String, required: true, trim: true },
    days: { type: Number, default: 1, min: 1 },
    columnId: { type: String, required: true },
  },
  { timestamps: true }
);

taskSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Task", taskSchema);
