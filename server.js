//* dependencies
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");
const multer = require("multer");

//* controllers
const ClientController = require("./controller/ClientController");
const VendorController = require("./controller/VendorController");
const ProjectController = require("./controller/ProjectController");
const ActivityController = require("./controller/ActivityController");
const PortfolioController = require("./controller/PortfolioController");

//config
const app = express();
const PORT = process.env.PORT ?? 3000;
const MONGO_URI =
  "mongodb+srv://sei38:sei38@cluster0.gndtvgd.mongodb.net/?retryWrites=true&w=majority";
const { cloudinaryName, cloudinaryApiKey, cloudinaryApiSecret } = process.env;

mongoose.connection.once("open", () => {
  console.log("connected to mongoose...");
});

mongoose.connection.on("error", (err) =>
  console.log(err.message + " is Mongod not running?")
);

mongoose.connection.on("disconnected", () => console.log("mongo disconnected"));

mongoose.connect(MONGO_URI, {}, () => {
  console.log("the connection with mongodb is established");
});

//*middleware
app.use(cors());
app.use(morgan("dev")); // it prints out any pings done in the back end
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/clients", ClientController);
app.use("/vendors", VendorController);
app.use("/projects", ProjectController);
app.use("/activities", ActivityController);
app.use("/portfolios", PortfolioController);

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

cloudinary.v2.config({
  cloud_name: cloudinaryName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
});

const upload = multer({ storage });

//smoke test
app.get("/", (req, res) => {
  res.send({ msg: "ID PROJECT STARTED" });
});

// get project images
app.get("/getimages", async (req, res) => {
  const { resources } = await cloudinary.v2.search
    .expression("folder:projects")
    .max_results(8)
    .execute();

  const imgUrl = resources.map((file) => file.url);
  res.send(imgUrl);
});

// upload project images
app.post(
  "/upload-images",
  upload.array("uploadedFiles", 10),
  async (req, res) => {
    try {
      const imagesFiles = req.files;
      console.log(imagesFiles);
      if (!imagesFiles)
        return res.status(400).send({ msg: "No picture attached!" });

      const multiplePicturePromise = imagesFiles.map((picture) =>
        cloudinary.v2.uploader.upload(picture.path, {
          upload_preset: "Project",
        })
      );

      const imageResponses = await Promise.all(multiplePicturePromise);
      const imageLinks = imageResponses.map((image) => image.url);
      console.log(imageLinks);

      res.status(200).send({ imageLinks });
    } catch (err) {
      res.status(500).send({ msg: "Unable to upload" });
    }
  }
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`express started on ${PORT}`);
});
