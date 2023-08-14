import mongoose from "mongoose";

const SuspendSchema = mongoose.Schema(
  {
    userId: String,
    reason: String,
    duration: String,
  },
  {
    timestamps: true,
  }
);

const Suspend = mongoose.model("Suspend", SuspendSchema);

export default Suspend;
