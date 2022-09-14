const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

//* Show all Clients
router.get("/", async (req, res) => {
  try {
    const allProjects = await Project.find({});
    res.status(200).send(allProjects);
  } catch (err) {
    res.status(500).send({ err });
  }
});

module.exports = router;
