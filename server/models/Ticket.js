import mongoose from "mongoose";

const TicketSchema = mongoose.Schema(
  {
    userId: String,
    adminId: String,
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
    type: String,
    doc: String,
    isExpired: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Ticket = mongoose.model("Ticket", TicketSchema);

export default Ticket;
