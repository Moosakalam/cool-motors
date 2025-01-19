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

//returns vehicles liked by "userId"
router.get(
  "/:userId/liked-vehicles",
  // vehicleController.getLikedVehiclesOfUser
  likeController.getLikedVehiclesOfUser
);

//checks if the vehicle is liked by the current user
router.get(
  "/is-liked/:vehicleId",
  authController.protect,
  likeController.isVehicleLiked
);

module.exports = router;
