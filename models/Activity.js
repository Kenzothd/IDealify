const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  activityTitle: String,
  activityDescription: String,
  activityStartDate: Date,
  activityEndDate: Date,
  personInCharge: String,
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
