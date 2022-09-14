const express = require("express");
const router = express.Router();
const Client = require("../models/Client");




//* Show all Clients
router.get("/", async (req, res) => {
  try {
    const allClients = await Client.find({});
    res.status(200).send(allClients);
  } catch (err) {
    res.status(500).send({ err });
  }
});



// Seed Clients
router.get("/seed", async (req,res)=> {

  const clients = [
    {
      username: "petertan",
      password: "456",
      email: "petertan@hotmail.com",
      fullName: "Peter Tan",
  
    },
    {
      username: "marygoh",
      password: "123",
      email: "marygoh@hotmail.com",
      fullName: "Mary Goh",

    }
  ]

  await Client.deleteMany()
  try{
    const seedClients = await Client.create(clients)
    res.status(200).send(seedClients);    
  }catch (err) {
    res.status(500).send({ err });
  }

})






//* Create Client
router.post('/', async (req,res)=> {
  const clientData = req.body
  try {
    const client = await Client.create(clientData)
    res.status(200).send(client);
  } catch (err) {
    res.status(500).send({ err });
  }
})


//Show 1 Client
router.get('/id/:id', async (req,res)=> {
  const {id} = req.params
  try {
    const newClient = await Client.findById(id)
    if (newClient === null) {
      res.status(400).send({error: "No client found!"});
    }
    res.status(200).send(newClient);

  } catch (err) {
    res.status(500).send({ err });
  }
})


//Update Client
router.put('/id/:id', async (req,res)=> {
  const {id} = req.params
  const clientUpdates = req.body
  try {
    const updatedClient = await Client.findByIdAndUpdate(id, clientUpdates, {new: true})
    if (updatedClient === null) {
      res.status(400).send({error: "No client found!"});
    } else {
      res.status(200).send(updatedClient);
    }
  } catch (err) {
    res.status(500).send({ err });
  }
})


//Delete Client
router.delete('/id/:id', async (req,res)=> {
  const {id} = req.params
  try {
    const deleteClient = await Client.findByIdAndDelete(id)
    if (deleteClient === null) {
      res.status(400).send({error: "No client found!"});
    } else {
      res.status(200).send(deleteClient);
    }
  } catch (err) {
    res.status(500).send({ err });
  }
})



module.exports = router;
