const Vendor = require("../models/Vendor");
const Client = require("../models/Client");

const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET ?? "KFC";



// VERIFICATION MIDDLEWARE
const authenticateUser = (user) => (req, res, next) => {

  const { payload } = req
  if (payload.userType === user) {
    next()
  } else {
    res.status(403).send({ error: `You are not an authorized ${user}` });
  }
};

module.exports = authenticateUser;
