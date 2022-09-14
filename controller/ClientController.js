const express = require("express");
const router = express.Router();
const Client = require("../models/Client");

//* Show all Clients
router.get("/", async (req, res) => {
  try {
    const allClients = await Client.find({});
    res.status(200).send(allClients);
  } catch (err) {
    res.status(500).send({ err });
  }
});

module.exports = router;
