const User = require("../models/User");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const jimp = require("jimp");
const path = require("path");

// exports.updateSubscription = async (req, res) => {
//   const userId = req.params.id;
//   const newSubscriptionStatus = req.body.subscription;

//   console.log(
//     "Updating user:",
//     userId,
//     "with subscription status:",
//     newSubscriptionStatus
//   );

//   const filter = { _id: userId };
//   const updateSubscription = { subscription: newSubscriptionStatus };

//   try {
//     const updatedSubscription = await User.findOneAndUpdate(
//       filter,
//       updateSubscription,
//       { new: true }
//     );

//     if (updatedSubscription) {
//       console.log("Subscription updated successfully:", updatedSubscription);
//       res.status(200).json(updatedSubscription);
//     } else {
//       console.log("User not found.");
//       res.status(404).json({ message: "Not found" });
//     }
//   } catch (error) {
//     console.error("Error updating subscription:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

exports.updateAvatar = async (req, res) => {
  const userId = req.params.id;
  const tmpFolderPath = path.resolve(__dirname, "../tmp");

  try {
    if (!fs.existsSync(tmpFolderPath)) {
      fs.mkdirSync(tmpFolderPath);
    }

    const newAvatar = req.file;
    if (!newAvatar) {
      return res.status(400).json({ message: "No avatar file provided" });
    }

    const avatar = await jimp.read(newAvatar.path);
    await avatar.resize(250, 250).writeAsync(newAvatar.path);

    const filename = `${uuidv4()}${path.extname(newAvatar.originalname)}`;

    const avatarPath = path.resolve(__dirname, `../public/avatars/${filename}`);
    fs.renameSync(newAvatar.path, avatarPath);

    const user = await User.findByIdAndUpdate(
      userId,
      { avatarURL: `/avatars/${filename}` },
      { new: true }
    );

    res.status(200).json({ avatarURL: user.avatarURL });
  } catch (error) {
    console.error("Error updating avatar:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
