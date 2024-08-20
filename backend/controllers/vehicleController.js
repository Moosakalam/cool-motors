const Vehicle = require("../models/vehicleModel");
const User = require("../models/userModel");
const catchAsyncError = require("../utils/catchAsyncError");
const AppError = require("../utils/appError");

exports.listVehicle = catchAsyncError(async (req, res, next) => {
  const newVehicle = await Vehicle.create({
    make: req.body.make,
    model: req.body.model,
    year: req.body.year,
    price: req.body.price,
    fuelType: req.body.fuelType,
    transmission: req.body.transmission,
    engineDisplacement: req.body.engineDisplacement,
    engineType: req.body.engineType,
    odometer: req.body.odometer,
    ownership: req.body.ownership,
    location: req.body.location,
    listedBy: req.user._id,
  });

  //add vehicle to Owner's User document
  await User.findByIdAndUpdate(req.user._id, {
    $push: { listedVehicles: newVehicle._id },
  });

  res.status(201).json({
    status: "success",
    data: {
      newVehicle,
    },
  });
});

exports.getVehicle = catchAsyncError(async (req, res, next) => {
  // console.log("get");

  const vehicleId = req.params.vehicleId;

  const vehicle = await Vehicle.findById(vehicleId);

  if (!vehicle) {
    return next(new AppError("No vehicle found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      vehicle,
    },
  });
});

exports.getVehiclesOfUser = catchAsyncError(async (req, res, next) => {
  const userId = req.params.userId;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  const vehicles = await Vehicle.find({ listedBy: userId });

  res.status(200).json({
    status: "success",
    results: vehicles.length,
    data: {
      vehicles,
    },
  });
});

// exports.searchVehicles = catchAsyncError(async (req, res) => {
//   // Destructure query parameters
//   const {
//     make,
//     model,
//     minYear,
//     maxYear,
//     minPrice,
//     maxPrice,
//     fuelType,
//     transmission,
//     minEngineDisplacement,
//     maxEngineDisplacement,
//     engineType,
//     minOdometer,
//     maxOdometer,
//     ownership,
//     location,
//   } = req.query;

//   // Build search criteria based on the provided query parameters
//   const searchCriteria = {};

//   if (make) searchCriteria.make = make;
//   if (model) searchCriteria.model = model;

//   // Handle range queries for year
//   if (minYear || maxYear) {
//     searchCriteria.year = {};
//     if (minYear) searchCriteria.year.$gte = Number(minYear);
//     if (maxYear) searchCriteria.year.$lte = Number(maxYear);
//   }

//   // Handle range queries for price
//   if (minPrice || maxPrice) {
//     searchCriteria.price = {};
//     if (minPrice) searchCriteria.price.$gte = Number(minPrice);
//     if (maxPrice) searchCriteria.price.$lte = Number(maxPrice);
//   }

//   // Handle range queries for engine displacement
//   if (minEngineDisplacement || maxEngineDisplacement) {
//     searchCriteria.engineDisplacement = {};
//     if (minEngineDisplacement)
//       searchCriteria.engineDisplacement.$gte = Number(minEngineDisplacement);
//     if (maxEngineDisplacement)
//       searchCriteria.engineDisplacement.$lte = Number(maxEngineDisplacement);
//   }

//   // Handle range queries for odometer
//   if (minOdometer || maxOdometer) {
//     searchCriteria.odometer = {};
//     if (minOdometer) searchCriteria.odometer.$gte = Number(minOdometer);
//     if (maxOdometer) searchCriteria.odometer.$lte = Number(maxOdometer);
//   }

//   // Handle other filters
//   if (fuelType) searchCriteria.fuelType = fuelType;
//   if (transmission) searchCriteria.transmission = transmission;
//   if (engineType) searchCriteria.engineType = engineType;
//   if (ownership) searchCriteria.ownership = Number(ownership);
//   if (location) searchCriteria.location = location;

//   // Perform the search
//   const vehicles = await Vehicle.find(searchCriteria);

//   res.status(200).json({
//     status: "success",
//     results: vehicles.length,
//     data: {
//       vehicles,
//     },
//   });
// });

exports.searchVehicles = catchAsyncError(async (req, res) => {
  const filters = {
    make: req.query.make ? req.query.make.split(",") : undefined,
    // model: req.query.model ? req.query.model.split(",") : undefined,
    minYear: req.query.minYear,
    maxYear: req.query.maxYear,
    fuelType: req.query.fuelType ? req.query.fuelType.split(",") : undefined,
    transmission: req.query.transmission
      ? req.query.transmission.split(",")
      : undefined,
    minPrice: req.query.minPrice,
    maxPrice: req.query.maxPrice,
    minOdometer: req.query.minOdometer,
    maxOdometer: req.query.maxOdometer,
    location: req.query.location ? req.query.location.split(",") : undefined,
    sort: req.query.sort, // Sort query parameter
  };

  const searchCriteria = {};

  if (filters.make) searchCriteria.make = { $in: filters.make };
  // if (filters.model) searchCriteria.model = { $in: filters.model };
  if (filters.minYear || filters.maxYear) {
    searchCriteria.year = {};
    if (filters.minYear) searchCriteria.year.$gte = filters.minYear;
    if (filters.maxYear) searchCriteria.year.$lte = filters.maxYear;
  }
  if (filters.fuelType) searchCriteria.fuelType = { $in: filters.fuelType };
  if (filters.transmission)
    searchCriteria.transmission = { $in: filters.transmission };
  if (filters.minPrice || filters.maxPrice) {
    searchCriteria.price = {};
    if (filters.minPrice) searchCriteria.price.$gte = filters.minPrice;
    if (filters.maxPrice) searchCriteria.price.$lte = filters.maxPrice;
  }
  if (filters.minOdometer || filters.maxOdometer) {
    searchCriteria.odometer = {};
    if (filters.minOdometer) searchCriteria.odometer.$gte = filters.minOdometer;
    if (filters.maxOdometer) searchCriteria.odometer.$lte = filters.maxOdometer;
  }
  if (filters.location) searchCriteria.location = { $in: filters.location };

  //Sorting logic
  let sortBy = {};
  if (filters.sort === "priceAsc") sortBy.price = 1;
  if (filters.sort === "priceDesc") sortBy.price = -1;
  if (filters.sort === "mileageAsc") sortBy.odometer = 1;
  if (filters.sort === "mileageDesc") sortBy.odometer = -1;

  const vehicles = await Vehicle.find(searchCriteria).sort(sortBy);

  res.status(200).json({
    status: "success",
    results: vehicles.length,
    data: {
      vehicles,
    },
  });
});

exports.deleteVehicle = catchAsyncError(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.vehicleId);

  if (!vehicle) {
    return next(new AppError("No vehicle found with that ID", 404));
  }

  if (String(req.user._id) !== String(vehicle.listedBy)) {
    return next(
      new AppError("You don't have permission to delete this vehicle", 403)
    );
  }

  // Delete the vehicle
  await Vehicle.findByIdAndDelete(req.params.vehicleId);

  // Remove vehicle reference from the user's listedVehicles array
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { listedVehicles: req.params.vehicleId },
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.likeVehicle = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const vehicleId = req.params.vehicleId;

  // Check if vehicle exists
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    return next(new AppError("No vehicle found with that ID", 404));
  }

  // Add vehicle to likedVehicles array
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { likedVehicles: vehicleId } }, // $addToSet ensures no duplicates
    { new: true, runValidators: true } // Return the updated document and run validators
  );

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.unlikeVehicle = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  const vehicleId = req.params.vehicleId;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $pull: { likedVehicles: vehicleId } },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.getLikedVehicles = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  // Fetch user and populate likedVehicles
  const user = await User.findById(userId).populate("likedVehicles");

  res.status(200).json({
    status: "success",
    results: user.likedVehicles.length,
    data: {
      likedVehicles: user.likedVehicles,
    },
  });
});

exports.getRandomVehicles = catchAsyncError(async (req, res, next) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10; // Number of random vehicles to return, default to 10

  const vehicles = await Vehicle.aggregate([{ $sample: { size: limit } }]);

  res.status(200).json({
    status: "success",
    results: vehicles.length,
    data: {
      vehicles,
    },
  });
});
