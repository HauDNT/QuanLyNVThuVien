const express = require("express");
const router = express.Router();
const BillsController = require("../controllers/BillsController");
const { validToken } = require("../middlewares/AuthenMiddlewares");

router.get("/all", BillsController.getAllBills);
router.get("/maxNumber", BillsController.getMaxNumberBill);
router.get("/amount", BillsController.countAmountOfBills);
router.get("/gettypes", BillsController.getTypes);
router.get("/getAllBillTypes", BillsController.getAllBillTypes);
router.get("/info/:billId", BillsController.getInfoBill);
router.get("/detail/:billId", BillsController.getBillDetail);
router.get("/trash/:type", BillsController.getBillSoftDeleted);
router.get("/:type", BillsController.getBillOfType);
router.post("/searchBills", validToken, BillsController.searchBills);
router.post(
  "/searchBooksOfBill",
  validToken,
  BillsController.searchBooksOfBill,
);
router.post("/createbill", validToken, BillsController.createBill);
router.post("/addBillType", validToken, BillsController.creatBillType);
router.put("/update/:billId", BillsController.updateBill);
router.patch("/trash/restore/:id", BillsController.restoreReachBill);
router.delete("/deletebill/:id", validToken, BillsController.deleteBill);
router.delete("/deleteType/:typeId", validToken, BillsController.deleteType);
router.delete("/trash/delete/:id", validToken, BillsController.forceDeleteBill);

module.exports = router;
