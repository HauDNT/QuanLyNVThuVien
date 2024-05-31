const express = require("express");
const router = express.Router();
const CreateNewPasswordController = require("../controllers/CreateNewPasswordController");

// /newpassword/...
router.post("/verifyemail", CreateNewPasswordController.verifyEmail);

module.exports = router;
