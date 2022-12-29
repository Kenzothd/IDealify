require("dotenv").config();
const express = require("express");
const router = express.Router();
const Portfolio = require("../models/Portfolio");
const Vendor = require("../models/Vendor"); // faith changes
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer"); // image upload trial
const path = require("path"); // image upload trial
const authenticateUser = require("../middleware/authenticateUser");
const authenticateToken = require("../middleware/authenticateToken");

//config
const SECRET = process.env.SECRET ?? "KFC";

//* SEED ROUTE
router.get("/seed", async (req, res) => {
  const portfolioSeed = [
    {
      vendorId: "63a91adc3f0be9026c084ec1",
      portfolioName: "Jurong East HDB",
      housingType: "4-Room Flat (HDB)",
      images: [
        "https://images.pexels.com/photos/3797991/pexels-photo-3797991.jpeg?auto=compress&cs=tinysrgb&w=400",
        "https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=400",
        "https://images.pexels.com/photos/2079246/pexels-photo-2079246.jpeg?auto=compress&cs=tinysrgb&w=400",
      ],
      description: "Solid house",
      designTheme: "Minimalist",
    },
    {
      vendorId: "63a91adc3f0be9026c084ec1",
      portfolioName: "Bukit Merah HDB",
      housingType: "3-Room Flat (HDB)",
      images: [
        "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=400",
        "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=400",
      ],
      description: "Beautiful house",
      designTheme: "Modern",
    },
    {
      vendorId: "63a91adc3f0be9026c084ec1",
      portfolioName: "Woodland HDB",
      housingType: "5-Room Flat (HDB)",
      images: [
        "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400",
        "https://images.pexels.com/photos/1648771/pexels-photo-1648771.jpeg?auto=compress&cs=tinysrgb&w=400",
      ],
      description: "Wonderful house",
      designTheme: "Scandinavian",
    },
  ];
  try {
    await Portfolio.deleteMany();
    Portfolio.insertMany(portfolioSeed, (err, portfolio) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(portfolio);
      }
    });
  } catch (err) {
    res.send({ err: err });
  }
});

//* SHOW ALL Portfolio (Home page)
router.get("/", async (req, res) => {
  try {
    const allPortfolios = await Portfolio.find().populate(
      "vendorId",
      "username"
    );

    res.status(200).send(allPortfolios);
  } catch (err) {
    res.status(500).send({ err });
  }
});

//* Show all Portfolios by User Id(Index Route)
router.get("/findById/:vendorid", async (req, res) => {
  const { vendorid } = req.params;
  const portfolio = await Portfolio.find({ vendorId: vendorid });
  if (portfolio.length === 0) {
    res.status(200).send([]);
  } else {
    res.status(200).send(portfolio);
  }
});

//* Create Portfolio
router.post(
  "/vendor/:vendorId",
  authenticateToken,
  authenticateUser("vendor"),
  async (req, res) => {
    const newPortfolio = req.body;
    const { vendorId } = req.params;
    const { userId } = req.payload;
    if (vendorId === userId) {
      try {
        const createdPortfolio = await Portfolio.create(newPortfolio);
        // const vendor = await Vendor.findById(vendorId);
        // vendor.portfolio.push(createdPortfolio._id);
        // console.log(vendor);
        // const updatedVendor = await Vendor.findByIdAndUpdate(vendorId, vendor, {
        //   new: true,
        // });
        // console.log(updatedVendor);
        res.status(201).send(createdPortfolio);
      } catch (err) {
        console.log("error here");
        res.status(500).send({ err });
      }
    } else {
      res.status(401).send({ msg: "Invalid vendor" });
    }
  }
);

//* Show 1 portfolio by portfolio Id
router.get("/id/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const portfolio = await Portfolio.findById(id).populate(
      "vendorId",
      "brandSummary companyName contactPersonName contactNumber  email"
    );
    res.status(200).send(portfolio);
  } catch (err) {
    res.status(500).send({ err });
  }
});

//* UPDATE Portfolio
router.put(
  "/id/:id",
  authenticateToken,
  authenticateUser("vendor"),
  async (req, res) => {
    const { id } = req.params;
    const portfolio = req.body;
    const { vendorId } = portfolio;
    const { userId } = req.payload;
    if (vendorId === userId) {
      try {
        const newPortfolio = await Portfolio.findByIdAndUpdate(id, portfolio, {
          new: 1,
        });
        res.status(200).send(newPortfolio);
      } catch (err) {
        res.status(500).send({ err });
      }
    } else {
      res.status(401).send({ msg: "Invalid vendor" });
    }
  }
);

//* DELETE Portfolio

router.delete(
  "/id/:id",
  authenticateToken,
  authenticateUser("vendor"),
  async (req, res) => {
    const { id } = req.params;

    const { userId } = req.payload;

    const portfolio = await Portfolio.find({
      vendorId: userId,
      _id: id,
    });

    console.log(portfolio);
    if (portfolio === undefined) {
      res.status(401).send({ msg: "Portfolio do not belong to vendor" });
    } else {
      try {
        const deletedProject = await Portfolio.findByIdAndDelete(id);
        res.status(200).send(deletedProject);
      } catch (err) {
        res.status(500).send({ err });
      }
    }
  }
);

module.exports = router;
