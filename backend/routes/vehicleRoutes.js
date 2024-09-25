const express = require("express");
const vehicleController = require("../controllers/vehicleController");
const authController = require("../controllers/authController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post(
  "/list",
  upload.single("image"),
  authController.protect,
  vehicleController.listVehicle
);

//search
router.get("/search", vehicleController.searchVehicles);

router.get("/random-vehicles", vehicleController.getRandomVehicles);

router
  .route("/:vehicleId")
  .get(vehicleController.getVehicle)
  .delete(authController.protect, vehicleController.deleteVehicle);

// router.patch(
//   "/updatePassword",
//   authController.protect,
//   authController.updatePassword
// );

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
