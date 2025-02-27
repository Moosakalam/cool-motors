const crypto = require("crypto");
const Vehicle = require("../models/vehicleModel");
const PendingVehicle = require("../models/pendingVehicleModel");
const User = require("../models/userModel");
const Like = require("../models/likeModel");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/appError");
const Email = require("../utils/email");

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

  if (req.body.email) {
    return next(
      new AppError("This route is not for updating your email.", 400)
    );
  }

  //filter out fields that are not allowed to be updated like password
  const filteredBody = filterObj(req.body, "name", "phoneNumber");

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

exports.requestEmailUpdate = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Please provide a new email.", 400));
  }

  // Check if the email is already in use
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("This email is already in use.", 400));
  }

  const user = await User.findById(req.user.id);
  user.pendingEmail = email;
  const verificationToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  try {
    // Verification URL
    let verificationURL = "";
    if (process.env.NODE_ENV === "development") {
      verificationURL = `${process.env.FRONTEND_URL_DEV}/verify-email-update/${verificationToken}`;
    } else {
      verificationURL = `${process.env.FRONTEND_URL_PROD}/verify-email-update/${verificationToken}`;
    }

    // Send verification email
    await new Email(user, verificationURL).sendEmailUpdateVerification(email);
  } catch (err) {
    user.pendingEmail = undefined;
    user.emailVerificationToken = undefined;
    user.emailVerificationToken = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("Error sending email. Please try again", 500));
  }

  res.status(200).json({
    status: "success",
    message: "Verification email sent. Please check your inbox.",
  });
});

exports.verifyEmailUpdate = catchAsyncError(async (req, res, next) => {
  // Hash token to match stored hash
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // console.log(hashedToken);
  // console.log(req.params.token);

  // Find user with matching token and check if it’s still valid
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Invalid or expired verification token", 400));
  }

  // Update email and clear verification fields
  user.email = user.pendingEmail;
  user.pendingEmail = undefined;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "Email updated successfully.",
  });
});

exports.deleteMe = catchAsyncError(async (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return next(
      new AppError("Please provide your password to delete your account", 400)
    );
  }

  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (!(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect Password.", 401));
  }

  // Delete all vehicles listed by the user
  for (const vehicleId of user.listedVehicles) {
    await Vehicle.findByIdAndDelete(vehicleId); // This will trigger the query middleware for cleanup
  }

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

  // // Deactivate the user
  // await User.findByIdAndUpdate(req.user._id, { active: false });

  //delete user
  await User.findByIdAndDelete(req.user._id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
