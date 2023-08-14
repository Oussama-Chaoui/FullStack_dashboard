// Import necessary modules and models
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";

// Define the statusUpdater function
const statusUpdater = async () => {
  try {
    console.log("Running statusUpdater...");

    // Get the current date
    const currentDate = new Date();

    // Find all approved tickets with end dates in the past
    const expiredTickets = await Ticket.find({
      status: "approved",
      endDate: { $lt: currentDate }, // Filter end dates in the past
      isExpired: false,
    });

    console.log(expiredTickets);

    if (expiredTickets.length === 0) {
      console.log("No expired tickets found.");
      return; // Exit the function if there are no expired tickets to process
    }

    // Update the status of admins with expired tickets
    for (const ticket of expiredTickets) {
      const userId = ticket.userId; // Assuming you have a reference to the admin's ID in the ticket
      const user = await User.findById(userId);

      if (!user) {
        console.log(`Admin with ID ${userId} not found.`);
        continue;
      }

      // Check if the admin's status is not "active"
      if (user.status !== "active") {
        user.status = "active";
        await user.save();
        console.log(`${user.name}'s status changed back to active.`);
        ticket.isExpired = true;
        await ticket.save();
      }
    }

    console.log("statusUpdater completed successfully.");
  } catch (error) {
    console.error("Error in statusUpdater:", error.message);
  }
};

// Export the statusUpdater function
// module.exports = statusUpdater;
export { statusUpdater };
