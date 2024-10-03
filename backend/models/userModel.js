// const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      //THIS ONLY WORKS ON SAVE() AND CREATE()
      validator: function (ele) {
        return ele === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  phoneNumber: {
    type: String,
    required: [true, "Please provide your phone number"],
    validate: {
      validator: function (value) {
        // Ensure phone number has exactly 10 digits
        return /^\d{10}$/.test(value);
      },
      message: "Please provide a valid 10-digit phone number",
    },
  },
  listedVehicles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },
  ],
  likedVehicles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },
  ],
  //   passwordChangedAt: {
  //     type: Date,
  //   },
  //   passwordResetToken: String,
  //   passwordResetExpires: Date,
});

//ENCRYPT PASSWORD:
userSchema.pre("save", async function (next) {
  //only run this function if the password is modified
  if (!this.isModified("password")) return next();

  //hash the password with cost 12(refer bycrypt)
  this.password = await bcrypt.hash(this.password, 12);

  //delete passwordConfirm
  this.passwordConfirm = undefined;
  next();
});

// //UPDATING PASSWORD CHANGED AT FIELD
// userSchema.pre("save", function (next) {
//   // do not perform any actions if the password is not changed in this save or the user is new
//   if (!this.isModified("password") || this.isnew) return next();

//   this.passwordChangedAt = Date.now() - 1000;
//   next();
// });

//the following is an instance methods that is available to all the user documents
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
//   // console.log(this.passwordChangedAt);
//   if (this.passwordChangedAt) {
//     const changedTimestamp = parseInt(
//       this.passwordChangedAt.getTime() / 1000,
//       10
//     );

//     return JWTTimestamp < changedTimestamp;
//   }

//   //false means password is not changed
//   return false;
// };

// userSchema.methods.createPasswordResetToken = function () {
//   //Genral token(not encrypted)
//   const resetToken = crypto.randomBytes(32).toString("hex");

//   //Encrypted token to be saved in the database
//   this.passwordResetToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");

//   console.log({ resetToken }, this.passwordResetToken);

//   this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

//   return resetToken;
// };

const User = mongoose.model("User", userSchema);

module.exports = User;
