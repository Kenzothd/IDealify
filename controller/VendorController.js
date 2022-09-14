const express = require("express");
const router = express.Router();
const Vendor = require("../models/Vendor");

//* SEED ROUTE
router.get("/seed", async (req, res) => {
  const vendorSeed = [
    {
      email: "admin123@hotmail.com",
      contactPersonName: "Admin",
      username: "admin123",
      password: "password123",
      contactNumber: 92839485,
      companyName: "Admin Pte Ltd",
      registrationNumber: "201783726D",
      incorporationDate: new Date(2022, 09, 14),
      registeredOfficeAddress: "123 Admin Road Singapore 123456",
      uploadedFile: [{ name: "company ACRA document", url: "url here" }],
      trackedProjects: [],
      brandSummary: "some say best in batam",
    },
    {
      email: "faith@hotmail.com",
      contactPersonName: "faith",
      username: "faith123",
      password: "password123",
      contactNumber: 90015846,
      companyName: "Faith Pte Ltd",
      registrationNumber: "201784526D",
      incorporationDate: new Date(2022, 09, 12),
      registeredOfficeAddress: "123 Faith Road Singapore 123456",
      uploadedFile: [{ name: "company ACRA document", url: "url here" }],
      trackedProjects: [],
      brandSummary: "some say best in johor",
    },
    {
      email: "clovis123@hotmail.com",
      contactPersonName: "Clovis",
      username: "clovis123",
      password: "password123",
      contactNumber: 92445485,
      companyName: "Clovis Pte Ltd",
      registrationNumber: "201783726D",
      incorporationDate: new Date(2022, 08, 14),
      registeredOfficeAddress: "123 Clovis Road Singapore 123456",
      uploadedFile: [{ name: "company ACRA document", url: "url here" }],
      trackedProjects: [],
      brandSummary: "some say best in korea",
    },
    {
      email: "kenzo123@hotmail.com",
      contactPersonName: "Kenzo",
      username: "kenzo123",
      password: "password123",
      contactNumber: 92834825,
      companyName: "Kenzo Pte Ltd",
      registrationNumber: "201783726D",
      incorporationDate: new Date(2022, 05, 14),
      registeredOfficeAddress: "123 Kenzo Road Singapore 123456",
      uploadedFile: [{ name: "company ACRA document", url: "url here" }],
      trackedProjects: [],
      brandSummary: "some say best in japan",
    },
  ];
  try {
    await Vendor.deleteMany();
    Vendor.insertMany(vendorSeed, (err, vendors) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(vendors);
      }
    });
  } catch (err) {
    res.send({ err: err });
  }
});

//* SHOW ALL VENDORS
router.get("/", async (req, res) => {
  try {
    const allVendors = await Vendor.find();
    res.status(200).send(allVendors);
  } catch (err) {
    res.status(500).send({ err });
  }
});

//* GET VENDOR BY ID
router.get("/id/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const vendor = await Vendor.findById(id);
    res.status(200).send(vendor);
  } catch (err) {
    res.status(500).send({ err });
  }
});

//* CREATE VENDOR
router.post("/", (req, res) => {
  const newVendor = req.body;
  Vendor.create(newVendor, (err, vendor) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(vendor);
    }
  });
});

//* UPDATE VENDOR

router.put("/id/:id", async (req, res) => {
  const { id } = req.params;
  const vendor = req.body;
  console.log("body", vendor);
  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(id, vendor, {
      new: true,
    });
    console.log("return vendor", updatedVendor);
    if (updatedVendor === null) {
      res.status(400).send({ error: "No Vendor found" });
    } else {
      res.send(updatedVendor);
    }
  } catch (error) {
    res.status(400).send({ error });
  }
});

//* DELETE VENDOR

module.exports = router;
