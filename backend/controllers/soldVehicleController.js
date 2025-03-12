const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const SoldVehicle = require("../models/soldVehicleModel");

exports.getSoldVehiclesOfUser = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  const soldVehicles = await SoldVehicle.find({ listedBy: userId });

  res.status(200).json({
    status: "success",
    results: soldVehicles.length,
    data: {
      soldVehicles,
    },
  });
});

exports.deleteSoldVehicle = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;

  // Check if the sold vehicle exists
  const soldVehicle = await SoldVehicle.findById(id);

  if (!soldVehicle) {
    return next(new AppError("No sold vehicle found with that ID", 404));
  }

  // Check if the logged-in user is authorized to delete the vehicle
  if (soldVehicle.listedBy.toString() !== userId) {
    return next(
      new AppError("You are not authorized to delete this vehicle", 403)
    );
  }

  // Delete the sold vehicle
  await SoldVehicle.findByIdAndDelete(id);

  res.status(200).json({
    status: "success",
    message: "Sold vehicle deleted successfully",
  });
});
