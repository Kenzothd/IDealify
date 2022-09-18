const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");

//* Show all Activities
router.get("/", async (req, res) => {
  try {
    const allActivities = await Activity.find({});
    res.status(200).send(allActivities);
  } catch (err) {
    res.status(500).send({ err });
  }
});

// Seed Activities
// ["Pending", "Upcoming", "In Progress", "Completed", "Cancelled"],
router.get("/seed", async (req, res) => {
  const activities = [
    {
      projectId: "6326add7293f1c7cc52a78da",
      activityTitle: "Hacking of walls",
      activityDescription:
        "Hackers will reach around 10am to start hacking and clear tiles until 4pm. There will be lots of noise and dust.",
      activityStartDate: "2022-09-14T13:31:08.355Z",
      activityEndDate: "2022-09-14T13:31:08.355Z",
      personInCharge: "Mr Ye",
      status: "Upcoming",
    },
    {
      projectId: "6326add7293f1c7cc52a78d8",
      activityTitle: "Painting of Toilet",
      activityDescription:
        "Painters will arrive in the morning and complete in an hour",
      activityStartDate: "2022-09-14T13:31:08.355Z",
      activityEndDate: "2022-09-14T13:31:08.355Z",
      personInCharge: "Mr Clovis",
      status: "Pending",
    },
    {
      projectId: "6326add7293f1c7cc52a78da",
      activityTitle: "Install toilet piping",
      activityDescription: "Worker will reach around 11am to install piping.",
      activityStartDate: "2022-09-14T13:31:08.355Z",
      activityEndDate: "2022-09-14T13:31:08.355Z",
      personInCharge: "Mr Kenzo",
      status: "Completed",
    },
    {
      projectId: "6326add7293f1c7cc52a78d8",
      activityTitle: "Install toilet piping",
      activityDescription: "Worker will reach around 11am to install piping.",
      activityStartDate: "2022-09-14T13:31:08.355Z",
      activityEndDate: "2022-09-14T13:31:08.355Z",
      personInCharge: "Mr Kenzo",
      status: "In Progress",
    },
    {
      projectId: "6322ca80102f0fb0edf322e6",
      activityTitle: "Install toilet piping",
      activityDescription: "Worker will reach around 11am to install piping.",
      activityStartDate: "2022-09-14T13:31:08.355Z",
      activityEndDate: "2022-09-14T13:31:08.355Z",
      personInCharge: "Mr Kenzo",
      status: "Cancelled",
    },
  ];

  await Activity.deleteMany();
  try {
    const seedActivities = await Activity.create(activities);
    res.status(200).send(seedActivities);
  } catch (err) {
    res.status(500).send({ err });
  }
});

//* Create Activity
router.post("/", async (req, res) => {
  const activityData = req.body;
  try {
    const activity = await Activity.create(activityData);
    res.status(200).send(activity);
  } catch (err) {
    res.status(500).send({ err });
  }
});

//Show 1 Activity by activity ID
router.get("/id/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const newActivity = await Activity.findById(id);
    if (newActivity === null) {
      res.status(400).send({ error: "No activity found!" });
    }
    res.status(200).send(newActivity);
  } catch (err) {
    res.status(500).send({ err });
  }
});

//Update Activity
router.put("/id/:id", async (req, res) => {
  const { id } = req.params;
  const activityUpdates = req.body;
  try {
    const updatedActivity = await Activity.findByIdAndUpdate(
      id,
      activityUpdates,
      { new: true }
    );
    if (updatedActivity === null) {
      res.status(400).send({ error: "No activity found!" });
    } else {
      res.status(200).send(updatedActivity);
    }
  } catch (err) {
    res.status(500).send({ err });
  }
});

//Delete Activity
router.delete("/id/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteActivity = await Activity.findByIdAndDelete(id);
    if (deleteActivity === null) {
      res.status(400).send({ error: "No activity found!" });
    } else {
      res.status(200).send(deleteActivity);
    }
  } catch (err) {
    res.status(500).send({ err });
  }
});

// Get Activities based on Project Id
router.get("/project", async (req, res) => {
  const query = req.query;
  try {
    const activitiesFound = await Activity.find({ projectId: query.projectId });
    res.send(activitiesFound);
  } catch (err) {
    res.status(500).send({ err });
  }
});

module.exports = router;
