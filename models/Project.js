const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  vendorID: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  clientID: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  projectName: { type: String, required: true },
  housingType: { type: String, required: true },
  projectStartDate: { type: Date, required: true },
  projectEndDate: { type: Date, required: true },
  projectStatus: { type: String, required: true },
  uploadedFiles: [{ type: String, required: true }],
  description: String,
  projectProgress: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
  // review:{type: mongoose.Schema.Types.ObjectId, ref: "Review" },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
