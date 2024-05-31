const express = require("express");
const router = express.Router();
const RoomsController = require("../controllers/RoomsController");
const { validToken } = require("../middlewares/AuthenMiddlewares");

router.get("/all", RoomsController.getAllRooms);
router.post("/addRoom", RoomsController.createRoom);
router.delete("/deleteRoom/:id", RoomsController.deleteRoom);

module.exports = router;
