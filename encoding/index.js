const jwt = require("jsonwebtoken");
require("dotenv").config();

// Payload data
const user = {
  id: 1,
  username: "john_snow",
  email: "john.snow@goit.com",
};

// Secret key
const secretKey = process.env.API_SECRET_KEY;

// Sign the JWT
const token = jwt.sign(user, secretKey, { expiresIn: "1h" });

console.log(token);

const tokenGeneratedFromTasks = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJqb2huX3Nub3ciLCJlbWFpbCI6ImpvaG4uc25vd0Bnb2l0LmNvbSIsImlhdCI6MTcwOTg4MzAwNiwiZXhwIjoxNzA5ODg2NjA2fQ.dUedUMRukWjm5jhT05MRgQnrCskMO7rR4g3eSc_a-5E`;

// Verify the token
try {
  const decoded = jwt.verify(tokenGeneratedFromTasks, secretKey);
  console.log(decoded);
} catch (error) {
  console.error("Invalid or expired token:", error.message);
}
