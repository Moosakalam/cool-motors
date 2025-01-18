const express = require("express");
const userController = require("../controllers/userController");
const vehicleController = require("../controllers/vehicleController");
const likeController = require("../controllers/likeController");
const authController = require("../controllers/authController");

const router = express.Router();

//returns vehicles liked by "userId"
router.get(
  "/:userId/liked-vehicles",
  // vehicleController.getLikedVehiclesOfUser
  likeController.getLikedVehiclesOfUser
);

//like vehicle
router.post(
  "/like/:vehicleId",
  authController.protect,
  // vehicleController.likeVehicle
  likeController.likeVehicle
);

//unlike vehicle
router.delete(
  "/unlike/:vehicleId",
  authController.protect,
  // vehicleController.unlikeVehicle
  likeController.unlikeVehicle
);

//checks if the vehicle is liked by the current user
router.get(
  "/is-liked/:vehicleId",
  authController.protect,
  likeController.isVehicleLiked
);

module.exports = router;
