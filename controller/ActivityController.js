const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");
const authenticateToken = require("../middleware/authenticateToken");
const authenticateUser = require("../middleware/authenticateUser");
const Project = require("../models/Project");

// Seed Activities
// ["Pending", "Upcoming", "In Progress", "Completed", "Cancelled"],
router.get("/seed", async (req, res) => {
  const activities = [
    {
      projectId: "632576885b2ba557950efa87",
      // vendorId: "632449ff2e3c757cbafebab3",
      // clientId: "6323d7b309953c1e202421ae",
      activityTitle: "Hacking of walls",
      activityDescription:
        "Hackers will reach around 10am to start hacking and clear tiles until 4pm. There will be lots of noise and dust.",
      activityStartDate: "2022-09-14T13:31:08.355Z",
      activityEndDate: "2022-09-14T13:31:08.355Z",
      personInCharge: "Mr Ye",
      status: "Upcoming",
    },
    {
      projectId: "632576885b2ba557950efa87",
      // vendorId: "632449ff2e3c757cbafebab3",
      // clientId: "6323d7b309953c1e202421ae",
      activityTitle: "Painting of Toilet",
      activityDescription:
        "Painters will arrive in the morning and complete in an hour",
      activityStartDate: "2022-09-14T13:31:08.355Z",
      activityEndDate: "2022-09-14T13:31:08.355Z",
      personInCharge: "Mr Clovis",
      status: "Pending",
    },
    {
      projectId: "632576885b2ba557950efa87",
      // vendorId: "632449ff2e3c757cbafebab3",
      // clientId: "6323d7b309953c1e202421ae",
      activityTitle: "Install toilet piping",
      activityDescription: "Worker will reach around 11am to install piping.",
      activityStartDate: "2022-09-14T13:31:08.355Z",
      activityEndDate: "2022-09-14T13:31:08.355Z",
      personInCharge: "Mr Kenzo",
      status: "Completed",
    },
    {
      projectId: "632576885b2ba557950efa87",
      // vendorId: "632449ff2e3c757cbafebab3",
      // clientId: "6323d7b309953c1e202421af",
      activityTitle: "Install toilet piping",
      activityDescription: "Worker will reach around 11am to install piping.",
      activityStartDate: "2022-09-14T13:31:08.355Z",
      activityEndDate: "2022-09-14T13:31:08.355Z",
      personInCharge: "Mr Kenzo",
      status: "In Progress",
    },
    {
      projectId: "632576885b2ba557950efa87",
      // vendorId: "632449ff2e3c757cbafebab4",
      // clientId: "6323d7b309953c1e202421af",
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

// //* Show all Activities based on userID (KIV)
// router.get("/", authenticateToken, async (req, res) => {
//   const { userType, userId } = req.payload
//   const userID = userType + "Id"
//   try {

//     const allActivities = await Activity.find({
//       [userID]: userId,
//     });
//     res.status(200).send(allActivities);
//   } catch (err) {
//     res.status(500).send({ err }); fgfdgtyr
//   }
// });


//* Create Activity
router.post("/", authenticateToken, authenticateUser('vendor'), async (req, res) => { // payload -> vendorID Step 3
  const { projectId } = req.body; //project id Step 1
  const { userType, userId } = req.payload
  console.log(projectId)
  const project = await Project.findById(projectId); // project details (TRUTH)  - clientId + vendor ID Step 2
  // if project == null then not found
  // if pass then payload's user ID == vendorID taken from Project database
  // if false, then say 'wrong vendor editing this project'
  // if true then execute below

  try {
    const activity = await Activity.create(activityData); // step 4
    res.status(200).send(activity);
  } catch ({ message }) {
    res.status(500).send({ message });
  }


});


//Show 1 Activity by activity ID
router.get("/id/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  console.log(req.data);
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
router.put("/id/:id", authenticateToken, async (req, res) => {
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
router.delete("/id/:id", authenticateToken, async (req, res) => {
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
router.get("/projects", authenticateToken, async (req, res) => {
  const query = req.query; //project ID
  // find from Project(truth) -  vendor and client ID
  // comppare the ID to payload userID
  try {
    const activitiesFound = await Activity.find({ projectId: query.projectId });
    res.send(activitiesFound);
  } catch (err) {
    res.status(500).send({ err });
  }
});

module.exports = router;
