//* dependencies
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//* controllers
const ClientController = require("./controller/ClientController");
const VendorController = require("./controller/VendorController");
const ProjectController = require("./controller/ProjectController");
const ActivityController = require("./controller/ActivityController");

//config
const app = express();
const PORT = process.env.PORT ?? 3000;
const MONGO_URI = "mongodb://localhost:27017/test";


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
app.use(morgan("dev"));
app.use(express.json());

app.use("/clients", ClientController);
app.use("/vendors", VendorController);
app.use("/projects", ProjectController);
app.use("/activities", ActivityController);

//smoke test
app.get("/", (req, res) => {
  res.send({ msg: "ID PROJECT STARTED" });
});

app.listen(PORT, () => {
  console.log(`express started on ${PORT}`);
});
