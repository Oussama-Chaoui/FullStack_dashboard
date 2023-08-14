import express from "express";
import { getUser, getDashboardStats } from "../controllers/general.js";

const router = express.Router();

// Get the user that is Loggged in
router.get("/user/:id", getUser);

// Get the Dashboard Stats
router.get("/dashboard", getDashboardStats);

export default router;
