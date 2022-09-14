const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  email: { type: String, required: true },
  contactPersonName: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  contactNumber: Number,
  companyName: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  incorporationDate: { type: Date, required: true },
  registeredOfficeAddress: { type: String, required: true },
  uploadedFiles: { type: String, required: true },
  trackedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  brandSummary: String,
});

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
