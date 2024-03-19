var express = require("express");
var router = express.Router();
const multer = require("multer");
const cors = require("cors");
const path = require("path");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/avatars"));
  },
  filename: function (req, file, cb) {
    // Use a unique filename to prevent conflicts
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage }).single("avatar");

// Configure Express to serve static files from the 'public' directory
router.post("/avatars", function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error(err);
      return res.status(500).send("An error occurred");
    } else if (err) {
      console.error(err);
      return res.status(500).send("An error occurred");
    }

    // Return the URL of the uploaded avatar
    const avatarUrl = req.file ? `/avatars/${req.file.filename}` : null;
    res.status(200).json({ avatarUrl });
    console.dir(req.file);
  });
});

module.exports = router;
