const express = require("express");
const authController = require("../controllers/authController");
const soldVehicleController = require("../controllers/soldVehicleController");

const router = express.Router({ mergeParams: true });

router.get(
  "/:id",
  authController.protect,
  soldVehicleController.getSoldVehicle
);

router.delete(
  "/:id",
  authController.protect,
  soldVehicleController.deleteSoldVehicle
);

module.exports = router;
