const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;

  //400 error code stands for bad request
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = Object.values(err.keyValue)[0];
  const message = `Duplicate Value : (${value}) for field : ${field}. Please enter another value.`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  let message = Object.values(err.errors).map((el) => el.message);
  message = message.join(". ");
  console.log(message);

  return new AppError(message, 400);
};

const handleJWTError = () => {
  new AppError("Invalid token. Please log in again", 401);
  //   console.log("jijwttkonerror");
};

const handleJWTExpiredError = () =>
  new AppError("Your token has expired. Please login again", 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //if the error is of expected kind(like seacherching for wrong ID tour)(operational error)
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    //if the error is unexpected(like programming error)
  } else {
    console.error("ERROR : ", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

//any middleware function with four parameters is assumed to be the error handing middleware and the first parameter to be the error
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  // console.log('hi from error controller');
  //   console.log(err.name);

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    // let error = JSON.parse(JSON.stringify(err));
    let error = Object.create(err);

    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);
    if (err.name === "JsonWebTokenError") {
      error = handleJWTError();
    }
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
