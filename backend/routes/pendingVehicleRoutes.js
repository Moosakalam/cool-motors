const express = require("express");
const vehicleController = require("../controllers/vehicleController");
const pendingVehicleController = require("../controllers/pendingVehicleController");
const authController = require("../controllers/authController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage }); // Accept up to 20 images
// const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post(
  "/list",
  upload.array("images"),
  authController.protect,
  pendingVehicleController.listVehicle
);

router.post(
  "/approve/:id",
  authController.protect,
  authController.restrictTo("admin"),
  pendingVehicleController.approveVehicle
);

router.delete(
  "/disapprove/:id",
  authController.protect,
  authController.restrictTo("admin"),
  pendingVehicleController.disapproveVehicle
);

module.exports = router;
