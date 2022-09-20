const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  name: String,
  desc: String,
  img: {
    data: Buffer,
    contentType: String,
  },
});

const File = mongoose.model("File", fileSchema);

module.exports = File;
