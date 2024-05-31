const express = require("express");
const router = express.Router();
const { validToken } = require("../middlewares/AuthenMiddlewares");
const EncodeTitlesController = require("../controllers/EncodeTitlesController");

router.get("/", EncodeTitlesController.getEncodeTitles);
router.post("/create", validToken, EncodeTitlesController.createEncodeTitles);
router.post("/search", validToken, EncodeTitlesController.searchEncodeTitle);
router.put("/update/", validToken, EncodeTitlesController.updateEncodeTitle);
router.delete(
  "/delete/:numberEncrypt",
  EncodeTitlesController.deleteEncodeTitle,
);

module.exports = router;
