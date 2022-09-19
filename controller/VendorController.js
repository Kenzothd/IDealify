require("dotenv").config();
const express = require("express");
const router = express.Router();
const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authenticateToken = require("../middleware/authenticateToken");
const multer = require("multer"); // image upload trial
const path = require("path"); // image upload trial

// const multerStorage = multer.memoryStorage(); // image upload trial
// const upload = multer({ storage: multerStorage }); // image upload trial

router.use(
  "../src/assets/uploads",
  express.static(path.join(__dirname, "uploads"))
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../src/assets/uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const upload = multer({ storage: storage });

//config
const SECRET = process.env.SECRET ?? "KFC";

//* SEED ROUTE
router.get("/seed", async (req, res) => {
  const vendorSeed = [
    {
      email: "admin123@hotmail.com",
      contactPersonName: "Admin",
      username: "admin123",
      password: bcrypt.hashSync("password123", 10),
      contactNumber: 92839485,
      companyName: "Admin Pte Ltd",
      registrationNumber: "201783726D",
      incorporationDate: new Date("2022-03-25"),
      registeredOfficeAddress: "123 Admin Road Singapore 123456",
      uploadedFiles: "url",
      trackedProjects: [],
      brandSummary: "some say best in batam",
    },
    {
      email: "faith@hotmail.com",
      contactPersonName: "faith",
      username: "faith123",
      password: bcrypt.hashSync("password123", 10),
      contactNumber: 90015846,
      companyName: "Faith Pte Ltd",
      registrationNumber: "201784526D",
      incorporationDate: new Date("2021-05-25"),
      registeredOfficeAddress: "123 Faith Road Singapore 123456",
      uploadedFiles: "url",
      trackedProjects: [],
      brandSummary: "some say best in johor",
    },
    {
      email: "clovis123@hotmail.com",
      contactPersonName: "Clovis",
      username: "clovis123",
      password: bcrypt.hashSync("password123", 10),
      contactNumber: 92445485,
      companyName: "Clovis Pte Ltd",
      registrationNumber: "201783726D",
      incorporationDate: new Date("2020-10-27"),
      registeredOfficeAddress: "123 Clovis Road Singapore 123456",
      uploadedFiles: "url",
      trackedProjects: [],
      brandSummary: "some say best in korea",
    },
    {
      email: "kenzo123@hotmail.com",
      contactPersonName: "Kenzo",
      username: "kenzo123",
      password: bcrypt.hashSync("password123", 10),
      contactNumber: 92834825,
      companyName: "Kenzo Pte Ltd",
      registrationNumber: "201783726D",
      incorporationDate: new Date(2022, 05, 14),
      registeredOfficeAddress: "123 Kenzo Road Singapore 123456",
      uploadedFiles: "url",
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
router.get("/", authenticateToken, async (req, res) => {
  try {
    const allVendors = await Vendor.find();
    res.status(200).send(allVendors);
  } catch (err) {
    res.status(500).send({ err });
  }
});

//* Find by Name
router.get("/findByName/:name", authenticateToken, async (req, res) => {
  const { name } = req.params;
  const vendor = await Vendor.find({ username: name });
  if (vendor.length === 0) {
    res.status(200).send([]);
  } else {
    res.status(200).send(vendor);
  }
});

//* Find by Registration Number
router.get(
  "/findByRegistrationNum/:num",
  authenticateToken,
  async (req, res) => {
    const { num } = req.params;
    const vendor = await Vendor.find({ registrationNumber: num });
    if (vendor.length === 0) {
      res.status(200).send([]);
    } else {
      res.status(200).send(vendor);
    }
  }
);

//VENDOR LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const vendor = await Vendor.findOne({ username });
  if (vendor === null) {
    res.status(400).send({ error: "Vendor Not Found" });
  } else if (bcrypt.compareSync(password, vendor.password)) {
    const userId = vendor._id;
    const username = vendor.username;
    const payload = { userId, username };
    const token = jwt.sign(payload, SECRET, { expiresIn: "30m" });
    console.log(token);
    res.status(200).send({ msg: "login", token });
  } else {
    res.status(400).send({ error: "Wrong Password" });
  }
});

// faith's comment, verify route is not necesary with the authenticateToken Middleware
//VENDOR VERIFY
router.post("/verify", authenticateToken, async (req, res) => {
  const bearer = req.get("Authorization");
  const token = bearer.split(" ")[1];
  console.log(token);

  try {
    const payload = jwt.verify(token, SECRET);
    const vendorID = payload.userId;
    console.log(vendorID);

    const vendor = await Vendor.findById(vendorID);
    if (vendor.length === 0) {
      res.status(500).send({ error: "Not Authorized Vendor" });
    } else {
      res.status(200).send(vendor);
    }
  } catch (err) {
    res.status(500).send({ err });
  }
});

//* GET VENDOR BY ID
router.get("/id/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const vendor = await Vendor.findById(id);
    res.status(200).send(vendor);
  } catch (err) {
    res.status(500).send({ err });
  }
});

//* CREATE VENDOR
router.post("/", async (req, res) => {
  const newVendor = req.body;
  newVendor.password = bcrypt.hashSync(newVendor.password, 10);
  console.log(newVendor);
  const findUsername = await Vendor.find({ username: newVendor.username });
  const findEmail = await Vendor.find({ email: newVendor.email });
  const findRegistrationNumber = await Vendor.find({
    registrationNumber: newVendor.registrationNumber,
  });
  console.log(findRegistrationNumber);
  if (
    findUsername.length !== 0 &&
    findEmail.length !== 0 &&
    findRegistrationNumber.length !== 0
  ) {
    res
      .status(400)
      .send({ error: "Username, Email and Registration Number existed" });
  } else if (findUsername.length !== 0 && findEmail.length !== 0) {
    res.status(400).send({ error: "Username existed and Email Existed" });
  } else if (findUsername.length !== 0 && findRegistrationNumber.length !== 0) {
    res.status(400).send({ error: "Username and Registration Number Existed" });
  } else if (findEmail.length !== 0 && findRegistrationNumber.length !== 0) {
    res.status(400).send({ error: "Email and Registration Number Existed" });
  } else if (findUsername.length !== 0) {
    res.status(400).send({ error: "Username existed" });
  } else if (findEmail.length !== 0) {
    res.status(400).send({ error: "Email existed" });
  } else if (findRegistrationNumber.length !== 0) {
    res.status(400).send({ error: "Registration Number existed" });
  } else {
    await Vendor.create(newVendor, (error, vendor) => {
      if (error) {
        res.status(500).send({ error: "Missing fields, please try again" });
      } else {
        const userId = vendor._id;
        const username = vendor.username;
        const payload = { userId, username };
        const token = jwt.sign(payload, SECRET, { expiresIn: "30m" });
        res.status(200).send({ vendor, token });
      }
    });
  }
});

//* UPDATE VENDOR
router.put("/id/:id", authenticateToken, async (req, res) => {
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

//image update trial
// router.put("/id/:id", upload.single("uploadedFiles"), async (req, res) => {
//   const { id } = req.params;
//   const body = req.body;
//   // const image = req.file;
//   console.log(body);
//   // console.log(req.file.filename);

//   const vendor = {
//     email: body.email,
//     contactPersonName: body.contactPersonName,
//     username: body.username,
//     password: body.password,
//     contactNumber: body.contactNumber,
//     companyName: body.companyName,
//     registrationNumber: body.registrationNumber,
//     incorporationDate: body.incorporationDate,
//     registeredOfficeAddress: body.registeredOfficeAddress,
//     uploadedFiles:
//       req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename,
//     // trackedProjects: [""],
//     // brandSummary: "",
//   };
//   try {
//     const updatedVendor = await Vendor.findByIdAndUpdate(id, vendor, {
//       new: true,
//     });
//     console.log("return vendor", updatedVendor);
//     if (updatedVendor === null) {
//       res.status(400).send({ error: "No Vendor found" });
//     } else {
//       res.send(updatedVendor);
//     }
//   } catch (error) {
//     res.status(400).send({ error });
//   }
// });

//* DELETE VENDOR
router.delete("/id/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedVendor = await Vendor.findByIdAndDelete(id);
    res.status(200).send(deletedVendor);
  } catch (error) {
    res.status(500).send({ error });
  }
});

module.exports = router;
