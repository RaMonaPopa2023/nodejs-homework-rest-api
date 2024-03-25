const jwt = require("jsonwebtoken");
// "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWVjZmExZmZmZmU3NDU3M2Y3NGEzOTUiLCJpYXQiOjE3MTAwMjk0OTUsImV4cCI6MTcxMDAzMzA5NX0.VdqqEahM5Q2Vnzhuupn2VE-74BVGaJeBQy6RiZr2P-s"
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).send("Not authorized");
    }

    const decodedToken = jwt.verify(token, jwtSecret);
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(401).send("Not authorized");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send("Not authorized");
  }
};

module.exports = protectRoute;
