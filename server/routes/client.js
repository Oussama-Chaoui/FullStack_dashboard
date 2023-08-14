import express from "express";
import {
  getProducts,
  getCustomers,
  getTransactions,
  getGeography,
} from "../controllers/client.js";

const router = express.Router();

// Get Products
router.get("/products", getProducts);

// Get Customers
router.get("/customers", getCustomers);

// Get Transactions
router.get("/transactions", getTransactions);

// Get Geography
router.get("/geography", getGeography);

export default router;
