const express = require("express");
const userController = require("../controllers/userController");
const vehicleController = require("../controllers/vehicleController");
const likeController = require("../controllers/likeController");
const likeRouter = require("../routes/likeRoutes");
const authController = require("../controllers/authController");

const router = express.Router();

//routes for likes(like POST /vehicles/:vehicleId/likes for liking a vehicle):
router.use("/:userId/likes", likeRouter);

router.get("/isLoggedIn", authController.protect, authController.isLoggedIn);

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

//returns vehicles listed by "userId"
router.get("/:userId/vehicles", vehicleController.getVehiclesOfUser);

router.get("/:userId", userController.getUser);
router.get(
  "/",
  authController.protect,
  authController.restrictTo("admin"),
  userController.getAllUsers
);

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
