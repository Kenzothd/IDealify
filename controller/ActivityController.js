const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");

//* Show all Clients
router.get("/", async (req, res) => {
  try {
    const allActivities = await Activity.find({});
    res.status(200).send(allActivities);
  } catch (err) {
    res.status(500).send({ err });
  }
});

module.exports = router;
