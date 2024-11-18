const express = require("express");
const morgan = require("morgan");
const vehicleRoutes = require("./routes/vehicleRoutes");
const pendingVehicleRoutes = require("./routes/pendingVehicleRoutes");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError");
const errorHandler = require("./controllers/errorController");
const cors = require("cors");
const multer = require("multer");
const { S3Client } = require("@aws-sdk/client-s3");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/pending-vehicles", pendingVehicleRoutes);

//for undefined url:
//'all' means (get, post, patch, delete, ..)
//'*' means all urls
app.all("*", (req, res, next) => {
  const err = new AppError(`Cannot find ${req.method} ${req.originalUrl}`, 404);

  //if any next() middleware is called with any parameter, it is automatically assumed to be an error
  //the error handling middleware is directly called skipping all the other middleware in the middleware stack
  next(err);
});

//any middleware function with four parameters is assumed to be the error handing middleware and the first parameter to be the error
app.use(errorHandler);

module.exports = app;
