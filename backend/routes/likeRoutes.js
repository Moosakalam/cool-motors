const express = require("express");
const userController = require("../controllers/userController");
const vehicleController = require("../controllers/vehicleController");
const likeController = require("../controllers/likeController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

//like vehicle(coming from vehicle router)
router.post(
  "/",
  authController.protect,
  // vehicleController.likeVehicle
  likeController.likeVehicle
);

//unlike vehicle(coming from vehicle router)
router.delete(
  "/",
  authController.protect,
  // vehicleController.unlikeVehicle
  likeController.unlikeVehicle
);

//checks if the vehicle is liked by the current user(coming from vehicle router)
router.get("/is-liked", authController.protect, likeController.isVehicleLiked);

//get liked vehicles of users(coming from user router)
router.get("/", likeController.getLikedVehiclesOfUser);

module.exports = router;
