import User from "../models/User.js";

const updateCredits = async () => {
  try {
    // Update vCredit for all admin users
    await User.updateMany(
      { role: { $nin: ["user"] } },
      { $inc: { vCredit: 2 } }
    );

    console.log("Credit update successful");
  } catch (error) {
    console.error("Error updating credits:", error.message);
  }
};

export { updateCredits };
