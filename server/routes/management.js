import express from "express";
import {
  editAdminStatus,
  getAdmins,
  getUserTickets,
  updateAdmin,
  editAdminRole,
  addAdmin,
  getAllTickets,
  getTicket,
  editTicketStatus,
  getUserPerformance,
} from "../controllers/management.js";

const router = express.Router();

// Get Admins
router.get("/admins/", getAdmins);

// Update Role
router.put("/admins/", updateAdmin);

// Edit Admin Status
router.put("/admins/status/", editAdminStatus);

// Add admin from already existing users
router.put("/admins/addbyuser", editAdminRole);

// Add admin manually
router.post("/admins/addmanualy", addAdmin);

// Get all tickets
router.get("/admins/tickets", getAllTickets);

// Get one ticket by Id
router.get("/admins/ticket", getTicket);

// Edit Ticket status
router.put("/admins/ticket", editTicketStatus);

// Get a user's tickets
router.get("/admins/admin/tickets", getUserTickets);

// Get a user's performance
router.get("/performance/:id", getUserPerformance);

export default router;
