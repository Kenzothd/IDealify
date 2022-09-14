const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  vendorID: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  clientID: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  projectName: { type: String, required: true },
  housingType: {
    type: String,
    required: true,
    enum: [
      "1-Room Flat (HDB)",
      "2-Room Flat (HDB)",
      "3-Room Flat (HDB)",
      "4-Room Flat (HDB)",
      "5-Room Flat (HDB)",
      "Executive Flat (HDB)",
      "Studio Apartment (HDB)",
      "Detached House",
      "Semi-detached House",
      "Terrace House",
      "Condominium",
      "Executive Condominium",
      "Apartment",
      "Others",
    ],
  },
  projectStartDate: { type: Date, required: true },
  projectEndDate: { type: Date, required: true },
  projectStatus: {
    type: String,
    required: true,
    enum: ["Upcoming", "In Progress", "Completed", "Cancelled"],
  },
  uploadedFiles: [{ type: String, required: true }],
  description: String,
  projectProgress: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
  // review:{type: mongoose.Schema.Types.ObjectId, ref: "Review" },
  designTheme: {
    type: String,
    enum: [
      "Modern",
      "Mid-century modern",
      "Minimalist",
      "Scandinavian",
      "Industrial style",
      "Contemporary interior design",
      "Urban style",
      "Traditional / Classic style",
      "Transitional style",
      "Art Deco style",
      "Country style",
      "Coastal style",
      "Shabby chic",
      "Eclectic",
      "Vintage style",
      "Asian / Zen interior design",
      "Bohemian style",
      "Tropical style",
      "Rustic style ",
      "Hollywood Regency",
      "Modern farmhouse",
      "Black & White",
    ],
  },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
