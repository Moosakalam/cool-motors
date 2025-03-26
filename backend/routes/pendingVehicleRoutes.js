const express = require("express");
const pendingVehicleController = require("../controllers/pendingVehicleController");
const authController = require("../controllers/authController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage }); // Accept up to 20 images
// const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get(
  "/",
  authController.protect,
  authController.restrictTo("admin"),
  pendingVehicleController.getPendingVehicles
);

router.get(
  "/:id",
  authController.protect,
  authController.restrictTo("admin"),
  pendingVehicleController.getPendingVehicle
);

router.get(
  "/:id/next",
  authController.protect,
  authController.restrictTo("admin"),
  pendingVehicleController.getNextPendingVehicle
);

router.get(
  "/random",
  authController.protect,
  authController.restrictTo("admin"),
  pendingVehicleController.getRandomVehicle
);

router.get(
  "/oldest",
  authController.protect,
  authController.restrictTo("admin"),
  pendingVehicleController.getOldestPendingVehicle
);

router.post(
  "/list",
  upload.array("images", 20), //add an error for more than 20
  authController.protect,
  pendingVehicleController.listVehicle
);

router.post(
  "/:id/approve",
  authController.protect,
  authController.restrictTo("admin"),
  pendingVehicleController.approveVehicle
);

router.delete(
  "/:id/disapprove",
  authController.protect,
  authController.restrictTo("admin"),
  pendingVehicleController.disapproveVehicle
);

module.exports = router;
