const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    portfolioName: { type: String, required: true },
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
    images: [{ type: String }],
    description: String,
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
        "Others",
      ],
    },
  },
  { timestamps: true }
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

module.exports = Portfolio;
