const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).send("Access denied. No token");
  }

  try {
    const verified = jwt.verify(token, "secretkey");
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};

module.exports = authMiddleware;
