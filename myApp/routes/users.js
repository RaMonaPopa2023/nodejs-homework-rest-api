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
const uuid = require("uuid");
const Joi = require("joi");
const { sendVerificationEmail } = require("../nodemailer/index");

dotenv.config();
const router = express.Router();
const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET;
const schema = Joi.object({
  email: Joi.string().email().required(),
});

router.get("/", async (req, res) => {
  res.status(200).json({ message: "Auth page" });
});

// router.patch("/users/:id", usersController.updateSubscription);
router.patch(
  "/avatars/:id",
  protectRoute,
  upload.single("avatar"),
  usersController.updateAvatar
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

    // Generate verification token
    const verificationToken = uuid.v4(); // Generate a random token

    const avatarURL = gravatar.url(email, { s: "200", d: "identicon" }, true);

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email,
      password: hashedPassword,
      avatarURL,
      verificationToken, // Save verification token in the database
    });

    await newUser.save();

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

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

router.post("/verify", async (req, res) => {
  try {
    // Validate request body
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if user is already verified
    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }

    // Send verification email
    await sendVerificationEmail(email, user.verificationToken);

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    console.error("Error sending verification email:", error);
    res.status(500).json({ message: "Error sending verification email" });
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

    if (!user.verify) {
      return res.status(401).json({ message: "Email not verified" });
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

router.get("/verify/:verificationToken", async (req, res) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Update user's verified status
    user.verificationToken = null;
    user.verify = true;
    await user.save();
    console.log(`User ${user.email} verified successfully.`);

    res.status(200).send("Email verified successfully.");
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).send("Error verifying user.");
  }
});

module.exports = router;
