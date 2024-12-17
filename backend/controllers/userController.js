const Vehicle = require("../models/vehicleModel");
const User = require("../models/userModel");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/appError");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

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

exports.updateMe = catchAsyncError(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError("This route is not for updating the password.", 400)
    );
  }

  //filter out fields that are not allowed to be updated like password
  const filteredBody = filterObj(req.body, "name", "email", "phoneNumber");

  //new: true returns the new updated user and not the old one
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
