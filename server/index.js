import express from "express";
import bodyParser from "body-parser";
import mongoose, { mongo } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";
import cron from "node-cron";
import { statusUpdater } from "./functions/statusUpdater.js";
import { updateCredits } from "./functions/creditUpdater.js";

// Data imports
import User from "./models/User.js";
import Product from "./models/Product.js";
import ProductStat from "./models/ProductStat.js";
import Transaction from "./models/Transaction.js";
import OverallStat from "./models/OverallStat.js";
import Ticket from "./models/Ticket.js";
import AffiliateStat from "./models/AffiliateStat.js";
import {
  dataUser,
  dataProduct,
  dataProductStat,
  dataTransaction,
  dataOverallStat,
  dataAffiliateStat,
} from "./data/index.js";

// CONFIGURATION
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// ROUTES
app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes);

// MONGOOSE SETUP
const PORT = process.env.PORT || 9000;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    app.listen(PORT, () => {
      console.log(`Server PORT : ${PORT}`);
      // User.insertMany(dataUser);
      // Product.insertMany(dataProduct);
      // ProductStat.insertMany(dataProductStat);s
      // Transaction.insertMany(dataTransaction);
      // OverallStat.insertMany(dataOverallStat);
      // Ticket.createCollection();
      // AffiliateStat.insertMany(dataAffiliateStat);
    });
    // Run the statusUpdater one time before cron
    statusUpdater();
    // Schedule statusUpdater to run once a day at 00:00:00
    cron.schedule("0 0 * * *", () => {
      statusUpdater()
        .then(() => {
          console.log("statusUpdater executed successfully");
        })
        .catch((error) => {
          console.error("statusUpdater error:", error.message);
        });
    });

    cron.schedule(
      "0 0 1 * *",
      () => {
        updateCredits();
      },
      {
        scheduled: true,
        timezone: "Africa/Casablanca", // Replace with your desired timezone
      }
    );
  })
  .catch((err) => {
    console.log(`${err} did not connect`);
  });
