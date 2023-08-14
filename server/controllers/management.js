import mongoose from "mongoose";
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import {
  add,
  addDays,
  differenceInDays,
  eachDayOfInterval,
  endOfDay,
  isAfter,
  isWeekend,
  startOfDay,
} from "date-fns";
import cron from "node-cron";
import Transaction from "../models/Transaction.js";

export const getAdmins = async (req, res) => {
  try {
    const { role, status } = req.query;

    if (role !== "owner" && role !== "superadmin" && role !== "admin") {
      throw new Error("Invalid user type");
    }

    let query = { role: "admin" }; // Default query for role "admin"

    if (role === "owner") {
      if (status === "inactive") {
        query.role = { $in: ["admin", "superadmin", "owner"] };
        // Fetch admins with non-active status here
        query.status = { $ne: "active" };
      } else {
        query.role = { $in: ["admin", "superadmin", "owner"] };
        query.status = status;
      }
    }

    console.log(query);

    const admins = await User.find(query)
      .select("-password")
      .sort({ updatedAt: -1 });

    res.status(200).json(admins);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { id, user } = req.body;

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: user },
      {
        new: true,
      }
    );
    const finalUser = await updatedUser.save();

    res.status(201).json(finalUser);
  } catch (error) {
    res.status(404).json({ message: "error.message" });
  }
};

export const editAdminStatus = async (req, res) => {
  try {
    const {
      ticketId = "",
      userId = "",
      adminId = "",
      ticketStatus = "pending",
      doc = "",
      type = "",
      startDate = null,
      endDate = null,
      status = "",
    } = req.body;

    if (ticketId === "") {
      console.log("I'm inside the first case where TicketId is empty");
      const currentDate = startDate === null ? new Date() : startDate;

      const existingUser = await User.findById(userId);

      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      let parsedEndDate;
      let parsedStartDate;
      if (typeof endDate === "string") {
        parsedEndDate = endOfDay(new Date(endDate));
        console.log(parsedEndDate);
      } else {
        parsedEndDate = endOfDay(endDate); // Assuming endDate is already a Date object
        console.log(parsedEndDate);
      }

      if (typeof currentDate === "string") {
        parsedStartDate = startOfDay(new Date(currentDate));
      } else {
        parsedStartDate = startOfDay(currentDate); // Assuming endDate is already a Date object
      }

      if (status === "suspended") {
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            $set: {
              status: status,
            },
          },
          {
            new: true,
          }
        );
      }

      const newTicket = await Ticket.create({
        userId: userId,
        adminId: adminId,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        status: ticketStatus,
        type: type,
        doc: doc,
      });
      res.status(201).json({ message: "User updated successfully" });
    } else {
      console.log("I'm inside the first case where TicketId is not empty");

      const ticket = await Ticket.findById(ticketId);

      if (ticketStatus === "approved") {
        const existingUser = await User.findById(userId);
        if (!existingUser) {
          return res.status(404).json({ message: "User not found" });
        }

        // Round the start date to the beginning of the day (00:00:00)
        const roundedStartDate = ticket.startDate;
        console.log(roundedStartDate);

        // Floor the end date to the end of the day (23:59:59)
        const flooredEndDate = ticket.endDate;
        console.log(flooredEndDate);

        // Get all dates between startDate and endDate (inclusive)
        const allDates = eachDayOfInterval({
          start: roundedStartDate,
          end: flooredEndDate,
        });

        // Filter out weekend days
        const weekdays = allDates.filter((date) => !isWeekend(date));

        // Calculate the number of weekdays to reduce from vCredit
        const daysToReduce = weekdays.length;
        console.log(daysToReduce);

        // Subtract the number of days from vCredit
        if (daysToReduce >= 0 && existingUser.vCredit >= daysToReduce) {
          existingUser.vCredit -= daysToReduce;
        }
        await existingUser.save();

        cron.schedule("* * * * *", async () => {
          const latestUser = await User.findById(userId);

          if (isAfter(new Date(), roundedStartDate)) {
            if (latestUser.status === "active") {
              const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                  $set: {
                    status: status,
                  },
                },
                {
                  new: true,
                }
              );
              await updatedUser.save();

              console.log(`${updatedUser.name} should be on ${status} now`);
              return res.status(200).json(updatedUser);
            }
          }
        });
      }

      ticket.adminId = adminId;
      ticket.status = ticketStatus;
      const updatedTicket = await ticket.save();

      return res.status(200).json(updatedTicket);
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const editAdminRole = async (req, res) => {
  try {
    const { id, role } = req.body;

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          role: role,
        },
      },
      {
        new: true,
      }
    );
    const finalUser = await updatedUser.save();

    res.status(201).json(finalUser);
  } catch (error) {
    res.status(404).json({ message: "error.message" });
  }
};

export const addAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      city,
      state,
      country,
      occupation,
      phoneNumber,
    } = req.body;

    const newAdmin = await User.create({
      name,
      email,
      password,
      city,
      state,
      country,
      occupation,
      phoneNumber,
    });

    res.status(200).json(newAdmin);
  } catch (error) {
    res.status(404).json({ message: "error.message" });
  }
};

export const getAllTickets = async (req, res) => {
  try {
    const { role, status } = req.query;

    if (role !== "owner" && role !== "superadmin") {
      throw new Error("Invalid user type");
    }

    if (role === "owner") {
      const tickets = await Ticket.find({ status: status }).sort({
        updatedAt: -1,
      });

      const detailedTickets = await Promise.all(
        tickets.map(async (ticket) => {
          const user = await User.findById(ticket.userId).select("-password");

          if (!user) {
            throw new Error("User not found");
          }

          let admin = null;
          if (ticket.status === "approved" || ticket.status === "declined") {
            admin = await User.findById(ticket.adminId).select("-password");

            if (!admin) {
              throw new Error("Admin not found");
            }
          }

          const detailedTicket = {
            ...ticket.toObject(),
            user,
            admin,
          };

          return detailedTicket;
        })
      );

      res.status(200).json(detailedTickets);
    } else {
      const normalAdminsId = await User.find({
        role: "admin",
      }).select("_id");

      const adminIds = normalAdminsId.map((admin) => admin._id);

      const tickets = await Ticket.find({
        userId: { $in: adminIds },
        status: status,
      }).sort({ updatedAt: -1 });

      const detailedTickets = await Promise.all(
        tickets.map(async (ticket) => {
          const user = await User.findById(ticket.userId).select("-password");

          if (!user) {
            throw new Error("User not found");
          }

          let admin = null;
          if (ticket.status === "approved" || ticket.status === "declined") {
            admin = await User.findById(ticket.adminId).select("-password");

            if (!admin) {
              throw new Error("Admin not found");
            }
          }

          const detailedTicket = {
            ...ticket.toObject(),
            user,
            admin,
          };

          return detailedTicket;
        })
      );

      res.status(200).json(detailedTickets);
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTicket = async (req, res) => {
  try {
    const { role, id } = req.query;

    if (role === "owner" || role === "superadmin") {
      const ticket = await Ticket.findById(id);

      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      const user = await User.findById(ticket.userId).select("-password");

      let admin = null;
      if (ticket.status === "approved" || ticket.status === "declined") {
        admin = await User.findById(ticket.adminId).select("-password");

        if (!admin) {
          throw new Error("Admin not found");
        }
      }

      const detailedTicket = {
        ...ticket.toObject(),
        user,
        admin,
      };

      return res.status(200).json(detailedTicket);
    } else {
      throw new Error("Invalid user type");
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const editTicketStatus = async (req, res) => {
  try {
    const { role, id, status } = req.body;

    if (role === "owner" || role === "superadmin") {
      const ticket = await Ticket.findById(id);

      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      ticket.status = status;

      const updatedTicket = await ticket.save();

      return res.status(200).json(updatedTicket);
    } else {
      throw new Error("Invalid user type");
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserTickets = async (req, res) => {
  try {
    const { userId } = req.query; // Assuming the user ID is passed as a route parameter

    // Query the Ticket model to find all tickets with the specified user ID
    const tickets = await Ticket.find({ userId }).sort({ updatedAt: -1 });

    const detailedTickets = [];

    // Iterate through each ticket and fetch user and admin details
    for (const ticket of tickets) {
      const user = await User.findById(ticket.userId).select("-password");

      let admin = null;
      if (ticket.status === "approved" || ticket.status === "declined") {
        admin = await User.findById(ticket.adminId).select("email name role");
      }

      const detailedTicket = {
        ...ticket.toObject(),
        user,
        admin,
      };

      detailedTickets.push(detailedTicket);
    }

    res.status(200).json(detailedTickets);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserPerformance = async (req, res) => {
  try {
    const { id } = req.params;

    const userWithStats = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "affiliatestats",
          localField: "_id",
          foreignField: "userId",
          as: "affiliatestats",
        },
      },
      {
        $unwind: "$affiliatestats",
      },
    ]);

    const salesTransactions = await Promise.all(
      userWithStats[0].affiliatestats.affiliateSales.map((id) => {
        return Transaction .findById(id);
      })
    );

    const filteredSaleTransaction = salesTransactions.filter(
      (transaction) => transaction !== null
    );

    res
      .status(200)
      .json({ user: userWithStats[0], sales: filteredSaleTransaction });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
