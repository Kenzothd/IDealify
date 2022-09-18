const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET ?? "KFC";
// VERIFICATION MIDDLEWARE
const authenticateToken = (req, res, next) => {
  const bearer = req.get("Authorization");
  const token = bearer && bearer.split(" ")[1];
  console.log(token);
  if (token === null) {
    res.status(401).send({ error: "Token not found" });
  }
  jwt.verify(token, SECRET, (err, data) => {
    if (err) {
      return res.status(403).send({ error: "Token is no longer valid" });
    } else {
      // data returned here is payload stored in token!
      req.data = data;
      next();
    }
  });
};

module.exports = authenticateToken;
