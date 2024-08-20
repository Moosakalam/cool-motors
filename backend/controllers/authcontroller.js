const { promisify } = require("util");
// const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/appError");
// const sendEmail = require("../utils/email");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsyncError(async (req, res, next) => {
  //we cant use the following line of code to create a new user because anyone an define their role as admin while defining the req.body
  // const newUser = await User.create(req.body);

  //here the user can only define the name, email, password
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    // passwordChangedAt: req.body.passwordChangedAt,
    // role: req.body.role,
  });

  createAndSendToken(newUser, 201, res);
});

exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  //check if the email and password exist
  if (!email || !password)
    return next(new AppError("Please enter email and paswword", 404));

  //check if the user exists and password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or pasword", 401));
  }

  //if everything is okay, create token and send response
  createAndSendToken(user, 200, res);
});

exports.protect = catchAsyncError(async (req, res, next) => {
  //Get token and check if it exits:
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }

  //verification of token:
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //check if the user of the token still exists:
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("The user of this token no longer exists.", 401));
  }

  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(new AppError("User has recently changed password", 401));
  // }

  //Grant access to the protected route
  req.user = currentUser;
  next();
  // res.status(200).json({
  //   status: "success",
  // });
});

// exports.restrictTo = (...roles) => {
//   return (req, res, next) => {
//     //roles = ['admin', 'lead-guide']
//     if (!roles.includes(req.user.role)) {
//       return next(
//         new AppError("You do not have permission to perform this action", 403)
//       );
//     }

//     next();
//   };
// };

// exports.forgotPassword = catchAsyncError(async (req, res, next) => {
//   //get the uer based on req.email
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) {
//     return next(new AppError("There is no user with that email", 404));
//   }

//   //Generate random reset token
//   const resetToken = user.createPasswordResetToken();
//   await user.save({ validateBeforeSave: false });

//   //send it to user's email
//   const resetURL = `${req.protocol}://${req.get(
//     "host"
//   )}/api/v1/users/resetPassword/${resetToken}`;

//   const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to ${resetURL}.\nIf you didn't forget your password, please ignore this email`;

//   try {
//     console.log("hi");
//     await sendEmail({
//       email: req.body.email,
//       //or user.email
//       subject: "Your password reset token (valid for 10 minutes)",
//       message,
//     });

//     res.status(200).json({
//       status: "success",
//       message: "Token sent to email",
//     });
//   } catch (err) {
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;
//     await user.save({ validateBeforeSave: false });

//     return next(
//       new AppError(
//         "There was an error sending the email. Please try again later",
//         500
//       )
//     );
//   }
// });

// exports.resetPassword = catchAsyncError(async (req, res, next) => {
//   // 1) Get user based on password reset token
//   const encryptedToken = crypto
//     .createHash("sha256")
//     .update(req.params.token)
//     .digest("hex");

//   const user = await User.findOne({
//     passwordResetToken: encryptedToken,
//     passwordResetExpires: { $gt: Date.now() },
//   });

//   // 2) If the user exists and the token has not yet expired, set the new password
//   if (!user) {
//     return next(new AppError("Token is invalid or has expired", 400));
//   }

//   user.password = req.body.password;
//   user.passwordConfirm = req.body.passwordConfirm;
//   user.passwordResetToken = undefined;
//   user.passwordResetExpires = undefined;
//   // 3) Change the passwordChangedAt property
//   await user.save();

//   // 4) Log the uset in(send JWT)
//   createAndSendToken(user, 200, res);
// });

// exports.updatePassword = catchAsyncError(async (req, res, next) => {
//   // 1) Get user
//   const user = await User.findById(req.user.id).select("+password");

//   // 2) Check if the POSTed current password is correct
//   if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
//     return next(
//       new AppError("Current password that you entered is wrong", 401)
//     );
//   }

//   // 3) Update the password
//   user.password = req.body.password;
//   user.passwordConfirm = req.body.passwordConfirm;
//   await user.save();

//   // 4) log the user in(send jwt)
//   createAndSendToken(user, 200, res);
// });
