const mongoose = require("mongoose");
const gravatar = require("gravatar");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: { type: String, default: null },
  avatarURL: { type: String },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: function () {
      // Required only during signup
      return this.isNew;
    },
    default: null, // Provide default value to prevent validator error on updates
  },
});

userSchema.pre("save", function (next) {
  if (!this.avatarURL) {
    this.avatarURL = gravatar.url(
      this.email,
      { s: "200", d: "identicon" },
      true
    );
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
