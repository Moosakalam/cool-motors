const Like = require("../models/likeModel");
const Vehicle = require("../models/vehicleModel"); // Ensure Vehicle model is imported
const User = require("../models/userModel"); // Ensure Vehicle model is imported
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/appError");

exports.likeVehicle = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const vehicleId = req.params.vehicleId;

  // Check if the vehicle exists
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    return next(new AppError("No vehicle found with that ID", 404));
  }

  // Create a new entry in the Like collection
  try {
    const like = await Like.create({ user: userId, vehicle: vehicleId });
    res.status(201).json({
      // Use 201 status for resource creation
      status: "success",
      data: { like },
    });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error (unique constraint violation)
      return next(new AppError("You have already liked this vehicle", 400));
    }
    console.error("Error creating like:", err); // Optional: log unexpected errors
    throw err; // Rethrow unexpected errors
  }
});

exports.unlikeVehicle = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const vehicleId = req.params.vehicleId;

  // Check if the vehicle exists
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    return next(new AppError("No vehicle found with that ID", 404));
  }

  // Remove the like from the Like collection
  const like = await Like.findOneAndDelete({
    user: userId,
    vehicle: vehicleId,
  });

  if (!like) {
    // If no like was found, the user hasn't liked this vehicle
    return next(new AppError("You have not liked this vehicle", 400));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getLikedVehiclesOfUser = catchAsyncError(async (req, res, next) => {
  const userId = req.params.userId;

  // Check if the user exists
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  // Fetch liked vehicle IDs from the Like collection
  const likes = await Like.find({ user: userId }).select("vehicle"); // Only fetch vehicle field
  const vehicleIds = likes.map((like) => like.vehicle);

  // Fetch the vehicles details
  const likedVehicles = await Vehicle.find({ _id: { $in: vehicleIds } });

  res.status(200).json({
    status: "success",
    results: likedVehicles.length,
    data: {
      likedVehicles,
    },
  });
});

exports.isVehicleLiked = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const vehicleId = req.params.vehicleId;

  // Check if a like document exists for this user and vehicle
  const like = await Like.findOne({ user: userId, vehicle: vehicleId });

  res.status(200).json({
    status: "success",
    data: {
      isLiked: !!like, // Converts the like document to true/false
    },
  });
});
