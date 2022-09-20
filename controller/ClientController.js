require("dotenv").config();
const express = require("express");
const router = express.Router();
const Client = require("../models/Client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authenticateToken = require("../middleware/authenticateToken");
const authenticateUser = require("../middleware/authenticateUser");

//config
const SECRET = process.env.SECRET ?? "KFC";

// Seed Clients
router.get("/seed", async (req, res) => {
  const clients = [
    {
      username: "petertan",
      password: bcrypt.hashSync("456", 10),
      email: "petertan@hotmail.com",
      fullName: "Peter Tan",
    },
    {
      username: "marygoh",
      password: bcrypt.hashSync("123", 10),
      email: "marygoh@hotmail.com",
      fullName: "Mary Goh",
    },
  ];

  await Client.deleteMany();
  try {
    const seedClients = await Client.create(clients);
    res.status(200).send(seedClients);
  } catch (err) {
    res.status(500).send({ err });
  }
});

//* Show all Clients
// router.get(
//   "/",
//   authenticateToken,
//   authenticateUser("vendor"),
//   async (req, res) => {
//     try {
//       const allClients = await Client.find({});
//       res.status(200).send(allClients);
//     } catch (err) {
//       res.status(500).send({ err });
//     }
//   }
// );

//* Find by Username(Yup validate unique client username)
router.get("/findByName/:name", authenticateToken, async (req, res) => {
  const { name } = req.params;
  const client = await Client.find({ username: name });
  if (client.length === 0) {
    res.status(200).send([]);
  } else {
    res.status(200).send(client);
  }
});

//Client Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const client = await Client.findOne({ username });
  console.log(client);

  if (client === null) {
    res.status(400).send({ error: "Client Not Found" });
  } else if (bcrypt.compareSync(password, client.password)) {
    const userId = client._id;
    const username = client.username;
    const userType = "client";
    const payload = { userId, username, userType };
    const token = jwt.sign(payload, SECRET, { expiresIn: "30m" });
    res.status(200).send({ msg: "login", token });
  } else {
    res.status(400).send({ error: "wrong password" });
  }
});

//* Create Client
router.post("/", async (req, res) => {
  const newClient = req.body;
  newClient.password = bcrypt.hashSync(newClient.password, 10);
  // console.log(clientData)
  const findUsername = await Client.find({ username: newClient.username });
  const findEmail = await Client.find({ email: newClient.email });
  console.log(findEmail);
  // res.status(400).send(findEmail);

  if (findUsername.length !== 0 && findEmail.length !== 0) {
    res.status(400).send({ error: "Username and Email existed" });
  } else if (findUsername.length !== 0) {
    res.status(400).send({ error: "Username existed" });
  } else if (findEmail.length !== 0) {
    res.status(400).send({ error: "Email existed" });
  } else {
    await Client.create(newClient, (error, client) => {
      if (error) {
        res.status(500).send({ error: "Missing fields, please try again" });
      } else {
        res.status(200).send(client);
      }
    });
  }
});

//Show 1 Client
router.get(
  "/id/:id",
  authenticateToken,
  authenticateUser("client"),
  async (req, res) => {
    const { id } = req.params;
    try {
      const newClient = await Client.findById(id);
      res.status(200).send(newClient);
    } catch (err) {
      res.status(400).send({ error: "No client found!" });
    }
  }
);

//Update Client
router.put(
  "/id/:id",
  authenticateToken,
  authenticateUser("client"),
  async (req, res) => {
    const { id } = req.params;
    const clientUpdates = req.body;
    try {
      const updatedClient = await Client.findByIdAndUpdate(id, clientUpdates, {
        new: true,
      });
      if (updatedClient === null) {
        res.status(400).send({ error: "No client found!" });
      } else {
        res.status(200).send(updatedClient);
      }
    } catch (err) {
      res.status(500).send({ err });
    }
  }
);

//Delete Client
router.delete(
  "/id/:id",
  authenticateToken,
  authenticateUser("client"),
  async (req, res) => {
    const { id } = req.params;
    try {
      const deleteClient = await Client.findByIdAndDelete(id);
      if (deleteClient === null) {
        res.status(400).send({ error: "No client found!" });
      } else {
        res.status(200).send(deleteClient);
      }
    } catch (err) {
      res.status(500).send({ err });
    }
  }
);

module.exports = router;
