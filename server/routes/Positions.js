const express = require("express");
const router = express.Router();
const PositionsController = require("../controllers/PositionsController");
const { validToken } = require("../middlewares/AuthenMiddlewares");

router.get("/all", PositionsController.getAllPositions);
router.post("/addPosition", validToken, PositionsController.createPosition);
router.delete(
  "/deletePosition/:id",
  validToken,
  PositionsController.deletePosition,
);

module.exports = router;
