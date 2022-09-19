const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  // vendorId: { type: String, required: true },
  // clientId: { type: String, required: true },
  activityTitle: { type: String, required: true },
  activityDescription: { type: String, required: true },
  activityStartDate: { type: Date, required: true },
  activityEndDate: { type: Date, required: true },
  personInCharge: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Upcoming", "In Progress", "Completed", "Cancelled"],
    required: true,
  },
  photos: [String],
  // comments: {type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
});

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
