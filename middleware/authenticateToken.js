const Vendor = require("../models/Vendor");
const Client = require("../models/Client");

const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET ?? "KFC";


// VERIFICATION MIDDLEWARE
const authenticateToken = (req, res, next) => {
  const bearer = req.get("Authorization");
  const token = bearer && bearer.split(" ")[1];


  if (token === undefined) {
    res.status(401).send({ error: "Token not found" });
  } else {
    jwt.verify(token, SECRET, async (err, payload) => {
      if (err) {
        return res.status(403).send({ error: "Token is invalid" });

      } else if (payload.userType === 'vendor') {
        const vendor = await Vendor.findById(payload.userId)
        req.payload = payload
        next()

      } else if (payload.userType === 'client') {
        const client = await Client.findById(payload.userId)
        req.payload = payload
        next()

      }
    });
  }
};

module.exports = authenticateToken;
