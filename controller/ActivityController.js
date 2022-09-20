const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");
const authenticateToken = require("../middleware/authenticateToken");
const authenticateUser = require("../middleware/authenticateUser");
const Project = require("../models/Project");
const authenticateVendorProject = require("../middleware/authenticateVendorProject");

// Seed Activities
// ["Pending", "Upcoming", "In Progress", "Completed", "Cancelled"],
router.get("/seed", async (req, res) => {
  const activities = [
    {
      projectId: "63287b6abd1f48cde993272e",
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
      projectId: "63287b6abd1f48cde993272e",
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
      projectId: "63287b6abd1f48cde993272e",
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
router.post(
  "/",
  authenticateToken,
  authenticateUser("vendor"),
  async (req, res) => {
    const activityData = req.body;
    const { projectId } = activityData;

    const { userId } = req.payload;

    const createActivity = async () => {
      try {
        const activity = await Activity.create(activityData);
        res.status(200).send(activity);
      } catch ({ message }) {
        res.status(500).send({ message });
      }
    };

    authenticateVendorProject(projectId, userId, createActivity);
  }
);

// //Show 1 Activity by activity ID (KIV)
// router.get("/id/:id", authenticateToken, async (req, res) => {
//   const { id } = req.params;
//   console.log(req.data);
//   try {
//     const newActivity = await Activity.findById(id);
//     if (newActivity === null) {
//       res.status(400).send({ error: "No activity found!" });
//     }
//     res.status(200).send(newActivity);
//   } catch (err) {
//     res.status(500).send({ err });
//   }
// });

//Update Activity
router.put(
  "/id/:id",
  authenticateToken,
  authenticateUser("vendor"),
  async (req, res) => {
    const { id } = req.params;
    const activityUpdates = req.body;
    const { projectId } = activityUpdates;

    const { userId } = req.payload;

    const updatedActivity = async () => {
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
    };

    authenticateVendorProject(projectId, userId, updatedActivity);
  }
);

//Delete Activity
router.delete(
  "/id/:id",
  authenticateToken,
  authenticateUser("vendor"),
  async (req, res) => {
    // vendor A
    const { id } = req.params;
    const activity = await Activity.findById(id);

    const { userId } = req.payload;

    const deleteActivity = async () => {
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
    };

    if (activity === null) {
      res.status(404).send({ msg: "Activity not found" });
    } else {
      const { projectId } = activity;
      authenticateVendorProject(projectId, userId, deleteActivity);
    }
  }
);

// Get Activities based on Project Id
router.get(
  "/projects",
  authenticateToken,
  authenticateUser("vendor"),
  async (req, res) => {
    console.log("trying to get projects...");
    const { projectId } = req.query;
    const { userId } = req.payload;
    const getActivitiesByProject = async () => {
      try {
        const activitiesFound = await Activity.find({ projectId });
        res.send(activitiesFound);
      } catch (err) {
        res.status(500).send({ err });
      }
    };
    authenticateVendorProject(projectId, userId, getActivitiesByProject);
  }
);

module.exports = router;
