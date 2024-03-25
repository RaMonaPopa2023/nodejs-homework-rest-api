const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();

// Configure Multer to store uploaded files in the 'public/avatars' directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public/avatars"));
  },
  filename: function (req, file, cb) {
    // Use a unique filename to prevent conflicts
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage }).single("avatar");

// Configure Express to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index", { title: "Express" });
});

app.post("/avatars", function (req, res) {
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

console.log("Listening on port 3000...");
app.listen(3000);

// const express = require("express");
// const multer = require("multer");
// const cors = require("cors");
// const path = require("path");

// const app = express();

// const upload = multer({ dest: path.join(__dirname, "public/avatars") }).single(
//   "avatar"
// );

// app.use(cors());
// app.set("view engine", "pug");
// app.set("views", path.join(__dirname, "views"));

// app.get("/", (req, res) => {
//   res.render("index", { title: "Express" });
// });

// app.post("/avatars", function (req, res) {
//   upload(req, res, function (err) {
//     if (err instanceof multer.MulterError) {
//       console.error(err);
//       res.status(500).send("A aparut o eroare");
//     } else if (err) {
//       console.error(err);
//       res.status(500).send("A aparut o eroare");
//     }

//     res.status(303).send("Fisierul a fost incarcat");
//     console.dir(req.file);
//   });
// });

// console.log("Listening on port 3000...");
// app.listen(3000);
