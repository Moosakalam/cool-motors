const mongoose = require("mongoose");

const likeSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A like must have a user"],
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: [true, "A like must have a vehicle"],
    },
  },
  { timestamps: true }
);

// Ensure a user can only like a specific vehicle once
likeSchema.index({ user: 1, vehicle: 1 }, { unique: true });

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
