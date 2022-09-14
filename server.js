//* dependencies
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const morgan = require("morgan");

//config
const app = express();
const PORT = process.env.PORT ?? 3000;
const MONGO_URI =
  "mongodb+srv://sei38:sei38@cluster0.gndtvgd.mongodb.net/?retryWrites=true&w=majority" ??
  "mongodb://localhost:27017/test";
const SECRET = process.env.SECRET ?? "mysecret";
mongoose.connection.once("open", () => {
  console.log("connected to mongoose...");
});
mongoose.connection.on("error", (err) =>
  console.log(err.message + " is Mongod not running?")
);
mongoose.connection.on("disconnected", () => log("mongo disconnected"));
mongoose.connect(MONGO_URI, {}, () => {
  console.log("the connection with mongodb is established");
});

//*middleware
app.use(morgan("dev"));
app.use(express.json());

//smoke test
app.get("/", (req, res) => {
  res.send({ msg: "ID PROJECT STARTED" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`express started on ${PORT}`);
});
