const express = require("express");
const router = express.Router();
const StatusdocController = require("../controllers/StatusdocController");
const { validToken } = require("../middlewares/AuthenMiddlewares");

router.get("/", StatusdocController.getStatusDoc);
router.post("/addStatusDoc", validToken, StatusdocController.createStatusDoc);
router.delete(
  "/deleteStatusDoc/:id",
  validToken,
  StatusdocController.deleteStatusDoc,
);

module.exports = router;
