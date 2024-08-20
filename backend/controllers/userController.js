const Vehicle = require("../models/vehicleModel");
const User = require("../models/userModel");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/appError");

exports.getUser = catchAsyncError(async (req, res, next) => {
  const userId = req.params.userId;

  // Find the user to ensure they exist and to get their name
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("User not found", 404)); // Assuming you have an AppError utility
  }

  // Find all vehicles listed by this user
  //   const vehicles = await Vehicle.find({ listedBy: userId });

  res.status(200).json({
    status: "success",
    data: {
      user,
      //   vehicles,
    },
  });
});
