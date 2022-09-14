const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  activityTitle: String,
  activityStartDate: Date,
  activityEndDate: Date,
  personInCharge: String,
  activityDescription: String,
  status: String,
  photos: [String],
});

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
