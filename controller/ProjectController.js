const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const authenticateToken = require("../middleware/authenticateToken");

const jwt = require("jsonwebtoken");
const Client = require("../models/Client");
const Vendor = require("../models/Vendor");
const authenticateUser = require("../middleware/authenticateUser");

//config
const SECRET = process.env.SECRET ?? "KFC";

//* Seed Route
router.get("/seed", async (req, res) => {
  const projectSeed = [
    {
      vendorId: "632449ff2e3c757cbafebab3",
      clientId: "6319681c3cea7b50135ee0ce",
      projectName: "Modern Living Room",
      housingType: "4-Room Flat (HDB)",
      projectStartDate: new Date(),
      projectEndDate: new Date(),
      projectStatus: "In Progress",
      uploadedFiles: ["url", "url", "url"],
      description: "Modern theme",
      projectProgress: ["6319681c3cea7b50135ee0ce"],
      designTheme: "Modern",
    },
    {
      vendorId: "632449ff2e3c757cbafebab3",
      clientId: "6319681c3cea7b50135ee0ce",
      projectName: "Scandinavian Living Room",
      housingType: "5-Room Flat (HDB)",
      projectStartDate: new Date(),
      projectEndDate: new Date(),
      projectStatus: "Completed",
      uploadedFiles: ["url", "url", "url"],
      description: "Scandinavian theme",
      projectProgress: ["6319681c3cea7b50135ee0ce"],
      designTheme: "Scandinavian",
    },
    {
      vendorId: "63270429a292e843af504f30",
      clientId: "6319681c3cea7b50135ee0ce",
      projectName: "Black & white Living Room",
      housingType: "Apartment",
      projectStartDate: new Date(),
      projectEndDate: new Date(),
      projectStatus: "Upcoming",
      uploadedFiles: ["url", "url", "url"],
      description: "Black & white theme",
      projectProgress: ["6319681c3cea7b50135ee0ce"],
      designTheme: "Black & White",
    },
  ];

  await Project.deleteMany();

  try {
    const allProjectSeed = await Project.create(projectSeed);
    res.status(201).send(allProjectSeed);
  } catch (err) {
    res.status(500).send({ err });
  }
});

//* Show all Projects by User(Index Route)
router.get("/", authenticateToken, async (req, res) => {

  try {
    const { payload } = req
    const userID = payload.userType + "Id"
    const allProjects = await Project.find({ [userID]: payload.userId });

    if (allProjects.length === 0) {
      res.status(500).send({ error: "No Projects Found" });
    } else {
      res.status(200).send(allProjects);
    }
  } catch (err) {
    res.status(500).send({ err });
  }
});

//* Create Route
router.post("/", authenticateToken, authenticateUser('vendor'), async (req, res) => {
  const newProject = req.body;
  const { vendorId } = newProject

  const { userId } = req.payload


  if (vendorId === userId) {
    try {
      const createdProject = await Project.create(newProject);
      res.status(201).send(createdProject);
    } catch (err) {
      res.status(500).send({ err });
    }
  } else {
    res.status(401).send({ msg: "Invalid vendor" });
  }

});


//* Show 1 project by User
router.get("/id/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  console.log(id)

  const { payload } = req
  const userID = payload.userType + "Id"


  try {
    const project = await Project.find({
      [userID]: payload.userId,
      "_id": id
    });
    res.status(200).send(project);
  } catch (err) {
    res.status(404).send({ err });
  }
});



//* Update Route
router.put("/id/:id", authenticateToken, authenticateUser('vendor'), async (req, res) => {
  const { id } = req.params;
  const project = req.body;
  const { vendorId } = project

  const { userId } = req.payload


  if (vendorId === userId) {
    try {
      const newProject = await Project.findByIdAndUpdate(id, project,
        { new: 1, });
      res.status(200).send(newProject);
    } catch (err) {
      res.status(500).send({ err });
    }

  } else {
    res.status(401).send({ msg: "Invalid vendor" });
  }

});



//* Delete Route
router.delete("/id/:id", authenticateToken, authenticateUser('vendor'), async (req, res) => {
  const { id } = req.params;

  const { userId } = req.payload

  const project = await Project.find({
    vendorId: userId,
    "_id": id
  });

  console.log(project)
  if (project === undefined) {
    res.status(401).send({ msg: "Project do not belong to vendor" });
  } else {
    try {
      const deletedProject = await Project.findByIdAndDelete(id);
      res.status(200).send(deletedProject);
    } catch (err) {
      res.status(500).send({ err });
    }
  }

});

module.exports = router;
