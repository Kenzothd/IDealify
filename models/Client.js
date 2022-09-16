const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  fullName: { type: String, required: true },
  trackedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  // favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Portfolio" }],
  // messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
},
{timestamps: true}
);

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
