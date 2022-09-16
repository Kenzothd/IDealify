require("dotenv").config();
const express = require("express");
const router = express.Router();
const Client = require("../models/Client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//config
const SECRET = process.env.SECRET ?? "KFC";

//* Show all Clients
router.get("/", async (req, res) => {
  try {
    const allClients = await Client.find({});
    res.status(200).send(allClients);
  } catch (err) {
    res.status(500).send({ err });
  }
});

//* Find by Name
router.get("/name", async (req, res) => {
  const clientName = req.body
  console.log(clientName)

  const client = await Client.find(clientName)

  if (client.length === 0) {
    res.status(400).send({ error: "No client found!" });
  } else {
    res.status(200).send(client);
  }


})


//Client Login 
router.post('/login', async (req, res) => {
  const { username, password } = req.body

  const client = await Client.findOne({ username })

  if (client === null) {
    res.status(400).send({ error: "Client Not Found" });

  } else if (bcrypt.compareSync(password, client.password)) {
    const userId = client._id
    const username = client.username
    const payload = { userId, username }
    const token = jwt.sign(payload, SECRET, { expiresIn: "30m" })
    res.status(200).send({ msg: "login", token });

  } else {
    res.status(400).send({ error: "wrong password" });
  }
})



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

    }
  ]

  await Client.deleteMany()
  try {
    const seedClients = await Client.create(clients)
    res.status(200).send(seedClients);
  } catch (err) {
    res.status(500).send({ err });
  }

})






//* Create Client
router.post('/', async (req, res) => {
  const newClient = req.body
  newClient.password = bcrypt.hashSync(newClient.password, 10)
  // console.log(clientData)
  const findUsername = await Client.find({ username: newClient.username })
  const findEmail = await Client.find({ email: newClient.email })
  console.log(findEmail)
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
        res.status(500).send({ error: "Missing fields, please try again" })
      } else {
        res.status(200).send(client)
      }

    })
  }

})


//Show 1 Client
router.get('/id/:id', async (req, res) => {
  const { id } = req.params
  try {
    const newClient = await Client.findById(id)
    res.status(200).send(newClient);
  } catch (err) {
    res.status(400).send({ error: "No client found!" });
  }
})


//Update Client
router.put('/id/:id', async (req, res) => {
  const { id } = req.params
  const clientUpdates = req.body
  try {
    const updatedClient = await Client.findByIdAndUpdate(id, clientUpdates, { new: true })
    if (updatedClient === null) {
      res.status(400).send({ error: "No client found!" });
    } else {
      res.status(200).send(updatedClient);
    }
  } catch (err) {
    res.status(500).send({ err });
  }
})


//Delete Client
router.delete('/id/:id', async (req, res) => {
  const { id } = req.params
  try {
    const deleteClient = await Client.findByIdAndDelete(id)
    if (deleteClient === null) {
      res.status(400).send({ error: "No client found!" });
    } else {
      res.status(200).send(deleteClient);
    }
  } catch (err) {
    res.status(500).send({ err });
  }
})



module.exports = router;
