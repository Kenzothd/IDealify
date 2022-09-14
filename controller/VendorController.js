const express = require("express");
const router = express.Router();
const Vendor = require("../models/Vendor");

//* Show all Clients
router.get("/", async (req, res) => {
  try {
    const allVendors = await Vendor.find({});
    res.status(200).send(allVendors);
  } catch (err) {
    res.status(500).send({ err });
  }
});

module.exports = router;
