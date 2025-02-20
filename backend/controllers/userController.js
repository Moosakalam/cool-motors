const Vehicle = require("../models/vehicleModel");
const PendingVehicle = require("../models/pendingVehicleModel");
const User = require("../models/userModel");
const Like = require("../models/likeModel");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/appError");

const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getUser = catchAsyncError(async (req, res, next) => {
  // console.log("iiihdi");

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

exports.getAllUsers = catchAsyncError(async (req, res) => {
  const users = await User.find();

  //SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
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

exports.deleteMe = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Delete all vehicles listed by the user
  for (const vehicleId of user.listedVehicles) {
    await Vehicle.findByIdAndDelete(vehicleId); // This will trigger the query middleware for cleanup
  }

  // // Check for any pending vehicles listed by the user and delete them
  // const pendingVehicles = await PendingVehicle.find({ listedBy: req.user._id });
  // for (const pendingVehicle of pendingVehicles) {
  //   await PendingVehicle.findByIdAndDelete(pendingVehicle._id); // Delete pending vehicles listed by the user
  // }

  // Check for any pending vehicles listed by the user and delete them
  const pendingVehicles = await PendingVehicle.find({ listedBy: req.user._id });
  for (const pendingVehicle of pendingVehicles) {
    // Delete images from S3
    for (const image of pendingVehicle.images) {
      const key = image.split("amazonaws.com/")[1];
      const deleteParams = {
        Bucket: bucketName,
        Key: key,
      };
      await s3Client.send(new DeleteObjectCommand(deleteParams));
    }

    await PendingVehicle.findByIdAndDelete(pendingVehicle._id); // Delete pending vehicles listed by the user
  }

  //check for any likes and delete them
  const likes = await Like.find({ user: req.user._id });
  for (const like of likes) {
    await Like.findByIdAndDelete(like._id);
  }

  // Deactivate the user
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
