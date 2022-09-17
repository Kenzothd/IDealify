const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

const jwt = require("jsonwebtoken");
const Client = require("../models/Client");
const Vendor = require("../models/Vendor");

//config
const SECRET = process.env.SECRET ?? "KFC";

//* Seed Route
router.get("/seed", async (req, res) => {
  const projectSeed = [
    {
      vendorID: "6319681c3cea7b50135ee0ce",
      clientID: "6319681c3cea7b50135ee0ce",
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
      vendorID: "6319681c3cea7b50135ee0ce",
      clientID: "6319681c3cea7b50135ee0ce",
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
      vendorID: "6319681c3cea7b50135ee0ce",
      clientID: "6319681c3cea7b50135ee0ce",
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

//* Show all Projects(Index Route)
router.get("/", async (req, res) => {

  const bearer = req.get("Authorization");
  const token = bearer.split(" ")[1];


  try {
    const payload = jwt.verify(token, SECRET);
    const vendorID = payload.userId
    console.log(vendorID)


    const allProjects = await Project.find({ vendorID: vendorID });
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
router.post("/", async (req, res) => {
  const newProject = req.body;
  try {
    const createdProject = await Project.create(newProject);
    res.status(201).send(createdProject);
  } catch (err) {
    res.status(500).send({ err });
  }
});

//* Show Projects By ID
router.get("/id/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id);
    res.status(200).send(project);
  } catch (err) {
    res.status(404).send({ err });
  }
});

//* Update Route
router.put("/id/:id", async (req, res) => {
  const { id } = req.params;
  const project = req.body;
  try {
    const newProject = await Project.findByIdAndUpdate(id, project, {
      new: 1,
    });
    res.status(200).send(newProject);
  } catch (err) {
    res.status(500).send({ err });
  }
});

//* Delete Route
router.delete("/id/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProject = await Project.findByIdAndDelete(id);
    res.status(200).send(deletedProject);
  } catch (err) {
    res.status(500).send({ err });
  }
});

module.exports = router;
