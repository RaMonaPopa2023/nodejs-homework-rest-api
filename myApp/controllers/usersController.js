const User = require("../models/User");

exports.updateSubscription = async (req, res) => {
  const userId = req.params.id; // Change _id to id, as it is commonly used
  const newSubscriptionStatus = req.body.subscription;

  console.log(
    "Updating user:",
    userId,
    "with subscription status:",
    newSubscriptionStatus
  );

  const filter = { _id: userId };
  const updateSubscription = { subscription: newSubscriptionStatus };

  try {
    const updatedSubscription = await User.findOneAndUpdate(
      filter,
      updateSubscription,
      { new: true }
    );

    if (updatedSubscription) {
      console.log("Subscription updated successfully:", updatedSubscription);
      res.status(200).json(updatedSubscription);
    } else {
      console.log("User not found.");
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    console.error("Error updating subscription:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
