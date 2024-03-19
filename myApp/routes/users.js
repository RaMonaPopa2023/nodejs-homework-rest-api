const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const User = require("../models/User");
const dotenv = require("dotenv");
const protectRoute = require("../middleware/authMiddleware.js");
const usersController = require("../controllers/usersController.js");
const gravatar = require("gravatar");
const upload = multer({ dest: "tmp/" });

dotenv.config();
const router = express.Router();
const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET;

router.get("/", async (req, res) => {
  res.status(200).json({ message: "Auth page" });
});

// router.patch("/users/:id", usersController.updateSubscription);
router.patch(
  "/avatars/:id",
  protectRoute, // Middleware to ensure authentication
  upload.single("avatar"), // Middleware to handle file upload
  usersController.updateAvatar // Controller function to handle avatar update
);
// Signup route

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }
    const avatarURL = gravatar.url(email, { s: "200", d: "identicon" }, true);

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email,
      password: hashedPassword,
      avatarURL,
    });

    await newUser.save();

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating the user");
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "1h",
    });

    user.token = token;
    await user.save();

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Login error");
  }
});
// Logout route

router.get("/logout", protectRoute, async (req, res) => {
  try {
    console.log("Before finding user by _id");
    const user = await User.findById(req.user._id);
    console.log("After finding user by _id");

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    user.token = null;
    await user.save();

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Logout error");
  }
});
// Current route

router.get("/current", protectRoute, async (req, res) => {
  try {
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).send("Not authorized");
    }

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    res.status(500).send("Login error");
  }
});

module.exports = router;
