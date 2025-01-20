const mongoose = require("mongoose");
const Vehicle = require("./vehicleModel");

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

//calculating number of likes for a vehicle
likeSchema.statics.calcNumberOfLikes = async function (vehicleId) {
  const stats = await this.aggregate([
    {
      $match: { vehicle: vehicleId },
    },
    {
      $group: {
        _id: "$vehicle",
        nLikes: { $sum: 1 },
      },
    },
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Vehicle.findByIdAndUpdate(vehicleId, {
      numberOfLikes: stats[0].nLikes,
    });
  } else {
    await Vehicle.findByIdAndUpdate(vehicleId, {
      numberOfLikes: 0,
    });
  }
};

//updating numberOfLikes when creating a like
likeSchema.post("save", function () {
  // this points to current review
  this.constructor.calcNumberOfLikes(this.vehicle);
});

//updaing the numberOfLikes when deleting a like
likeSchema.post(/^findOneAnd/, async function (doc) {
  await doc.constructor.calcNumberOfLikes(doc.vehicle);
});

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
