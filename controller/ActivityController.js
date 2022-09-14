const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");

//* Show all Activities
router.get("/", async (req, res) => {
  try {
    const allActivities = await Activity.find({});
    res.status(200).send(allActivities);
  } catch (err) {
    res.status(500).send({ err });
  }
});




// Seed Activities
router.get("/seed", async (req,res)=> {

const activities = [
	{
		activityTitle: "Hacking of walls",
		activityDescription: "Hackers will reach around 10am to start hacking and clear tiles until 4pm. There will be lots of noise and dust.",
		activityStartDate: "2022-09-14T13:31:08.355Z",
		activityEndDate: "2022-09-14T13:31:08.355Z",
		personInCharge: "Mr Ye",
		status: "Ongoing",

	},
	{

		activityTitle: "Hacking of toilet",
		activityDescription: "Hackers will reach around 11am to start hacking and toilet.",
		activityStartDate: "2022-09-14T13:31:08.355Z",
		activityEndDate: "2022-09-14T13:31:08.355Z",
		personInCharge: "Mr Ye",
		status: "Ongoing",
	
	},
	{
		activityTitle: "Install toilet piping",
		activityDescription: "Worker will reach around 11am to install piping.",
		activityStartDate: "2022-09-14T13:31:08.355Z",
		activityEndDate: "2022-09-14T13:31:08.355Z",
		personInCharge: "Mr Ye",
		status: "Ongoing",

	}
]

  await Activity.deleteMany()
  try{
    const seedActivities = await Activity.create(activities)
    res.status(200).send(seedActivities);    
  }catch (err) {
    res.status(500).send({ err });
  }

})




//* Create Activity
router.post('/', async (req,res)=> {
  const activityData = req.body
  try {
    const activity = await Activity.create(activityData)
    res.status(200).send(activity);
  } catch (err) {
    res.status(500).send({ err });
  }
})


//Show 1 Activity
router.get('/id/:id', async (req,res)=> {
  const {id} = req.params
  try {
    const newActivity = await Activity.findById(id)
    if (newActivity === null) {
      res.status(400).send({error: "No activity found!"});
    }
    res.status(200).send(newActivity);

  } catch (err) {
    res.status(500).send({ err });
  }
})


//Update Client
router.put('/id/:id', async (req,res)=> {
  const {id} = req.params
  const activityUpdates = req.body
  try {
    const updatedActivity = await Activity.findByIdAndUpdate(id, activityUpdates, {new: true})
    if (updatedActivity === null) {
      res.status(400).send({error: "No activity found!"});
    } else {
      res.status(200).send(updatedActivity);
    }
  } catch (err) {
    res.status(500).send({ err });
  }
})


//Delete Client
router.delete('/id/:id', async (req,res)=> {
  const {id} = req.params
  try {
    const deleteActivity = await Activity.findByIdAndDelete(id)
    if (deleteActivity === null) {
      res.status(400).send({error: "No activity found!"});
    } else {
      res.status(200).send(deleteActivity);
    }
  } catch (err) {
    res.status(500).send({ err });
  }
})


module.exports = router;
