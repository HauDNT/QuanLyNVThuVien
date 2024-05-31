const express = require("express");
const router = express.Router();
const BarcodeController = require("../controllers/BarcodeController");
const { validToken } = require("../middlewares/AuthenMiddlewares");

router.post("/generate", validToken, BarcodeController.generateBarcode);

module.exports = router;
