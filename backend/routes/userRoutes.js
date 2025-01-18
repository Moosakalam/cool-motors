const express = require("express");
const userController = require("../controllers/userController");
const vehicleController = require("../controllers/vehicleController");
const likeController = require("../controllers/likeController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

//returns vehicles listed by "userId"
router.get("/:userId/vehicles", vehicleController.getVehiclesOfUser);

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
router.patch(
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

router.get("/:userId", userController.getUser);
router.get("/", userController.getAllUsers);

// //get liked vehicles
// router.get(
//   "/liked-vehicles",
//   authController.protect,
//   vehicleController.getLikedVehicles
// );

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.patch(
  "/updatePassword",
  authController.protect,
  authController.updatePassword
);

router.patch("/updateMe", authController.protect, userController.updateMe);
router.delete("/deleteMe", authController.protect, userController.deleteMe);

// router
//   .route("/")
//   .get(userController.getAllUsers)
//   .post(userController.createUser);

// router
//   .route("/:id")
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

module.exports = router;
