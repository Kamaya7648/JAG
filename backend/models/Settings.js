const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    garageName: {
      type: String,
      default: "AutoCare Garage"
    },

    address: {
      type: String,
      default: "123, Main Road, Colombo, Sri Lanka"
    },

    phone: {
      type: String,
      default: "+94 77 123 4567"
    },

    currency: {
      type: String,
      default: "LKR"
    },

    dateFormat: {
      type: String,
      default: "DD MMM YYYY"
    },

    timeFormat: {
      type: String,
      default: "12"
    },

    timezone: {
      type: String,
      default: "Colombo"
    },

    language: {
      type: String,
      default: "English"
    },

    emailNotifications: {
      type: Boolean,
      default: true
    },

    autoBackup: {
      type: Boolean,
      default: true
    },

    lowStockAlert: {
      type: Boolean,
      default: true
    },

    jobCompletionAlert: {
      type: Boolean,
      default: true
    },

    darkMode: {
      type: Boolean,
      default: false
    },

    vehiclesPerPage: {
      type: String,
      default: "10"
    },

    defaultView: {
      type: String,
      default: "Assigned Vehicles"
    },

    compactSidebar: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

settingsSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model("Settings", settingsSchema);