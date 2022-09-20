const Project = require("../models/Project");

// Middleware for Activity
const authenticateVendorProject = async (projectId, userId, req, res, next) => {
  const project = await Project.findById(projectId);

  if (project === null) {
    res.status(404).send({ msg: "Project not found" });
  } else {
    const { vendorId } = project;

    if (vendorId.valueOf() === userId) {
      next();
    } else {
      res.status(404).send({ msg: "Not vendor's project" });
    }
  }
};

module.exports = authenticateVendorProject;
