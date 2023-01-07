require("dotenv").config();
const express = require("express");
const router = express.Router();
const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer"); // image upload trial
const path = require("path"); // image upload trial
const authenticateUser = require("../middleware/authenticateUser");
const authenticateToken = require("../middleware/authenticateToken");

// const multerStorage = multer.memoryStorage(); // image upload trial
// const upload = multer({ storage: multerStorage }); // image upload trial

// router.use(
//   "../src/assets/uploads",
//   express.static(path.join(__dirname, "uploads"))
// );

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "../src/assets/uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       new Date().toISOString().replace(/:/g, "-") + "-" + file.fieldname
//     );
//   },
// });

// const upload = multer({ storage: storage });

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
      brandSummary: "some say best in batam",
      // portfolio: ["63331b993cbab61f618c7fe6"],
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
      brandSummary: "some say best in johor",
      // portfolio: ["url", "url", "url"],
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
      brandSummary: "some say best in korea",
      // portfolio: ["url", "url", "url"],
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
      brandSummary: "some say best in japan",
      // portfolio: ["url", "url", "url"],
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
router.get(
  "/",
  // authenticateToken,
  // authenticateUser("vendor"),
  async (req, res) => {
    try {
      const allVendors = await Vendor.find();
      res.status(200).send(allVendors);
    } catch (err) {
      res.status(500).send({ err });
    }
  }
);

//* Find by Username (Yup validate unique  vendor username, we should limit the return KIV)
router.get("/findByName/:name", async (req, res) => {
  const { name } = req.params;
  const vendor = await Vendor.find({ username: name });
  if (vendor.length === 0) {
    res.status(200).send([]);
  } else {
    res.status(200).send(vendor);
  }
});

//* Find by Registration Number (Yup validation for vendor sign up acra number)
router.get("/findByRegistrationNum/:num", async (req, res) => {
  const { num } = req.params;
  const vendor = await Vendor.find({ registrationNumber: num });
  if (vendor.length === 0) {
    res.status(200).send([]);
  } else {
    res.status(200).send(vendor);
  }
});

//* Find by Email (Yup validation for vendor sign up)
router.get("/findByEmail/:email", async (req, res) => {
  const { email } = req.params;
  const vendor = await Vendor.find({ email: email });
  if (vendor.length === 0) {
    res.status(200).send([]);
  } else {
    res.status(200).send(vendor);
  }
});

//VENDOR LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const vendor = await Vendor.findOne({ username });
  if (vendor === null) {
    res.status(400).send({ error: "Vendor Not Found" });
  } else if (bcrypt.compareSync(password, vendor.password)) {
    const userId = vendor._id; //098776665
    const username = vendor.username; // mazryu
    const userType = "vendor";
    const payload = { userId, username, userType };
    const token = jwt.sign(payload, SECRET, { expiresIn: "30m" });
    res.status(200).send({ msg: "login", token });
  } else {
    res.status(400).send({ error: "Wrong Password" });
  }
});

//VENDOR VERIFY
router.post("/verify", async (req, res) => {
  const bearer = req.header("Authorization");
  console.log(bearer);
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
router.get(
  "/id/:id",
  authenticateToken,
  async (req, res) => {
    // const { payload } = req;
    // console.log(payload);
    // if (payload.userType === "vendor") {
    const { id } = req.params;
    console.log(id);
    try {
      const vendor = await Vendor.findById(id);
      res.status(200).send(vendor);
    } catch (err) {
      res.status(500).send({ err });
    }
  }
  // else {
  //   res.status(403).send({ error: "You are not an authorized vendor" });
  // }
  // }
);

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
router.put(
  "/id/:id",
  authenticateToken,
  authenticateUser("vendor"),
  async (req, res) => {
    const { id } = req.params;
    const vendor = req.body;
    console.log("body", vendor);
    try {
      const getVendor = await Vendor.findById(id);
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
  }
);

//image update trial (only file upload with fileSchema)
// router.put("/id/:id", upload.single("uploadedFiles"), async (req, res) => {
//   const { id } = req.params;
//   const vendor = req.body; //get the file img here
//   console.log("body", vendor);

//   const file = {
//     img:
//       req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename,
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

// //image update trial
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
//     uploadedFiles: req.files,
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
router.delete(
  "/id/:id",
  authenticateToken,
  authenticateUser("vendor"),
  async (req, res) => {
    const { id } = req.params;
    try {
      const deletedVendor = await Vendor.findByIdAndDelete(id);
      res.status(200).send(deletedVendor);
    } catch (error) {
      res.status(500).send({ error });
    }
  }
);

module.exports = router;
