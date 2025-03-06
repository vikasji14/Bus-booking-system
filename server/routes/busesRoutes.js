const express = require("express");
const router = express();

const {
  AddBus,
  GetAllBuses,
  UpdateBus,
  DeleteBus,
  GetBusById,
  GetBusesByFromAndTo,
  allBusList,
} = require("../Controllers/busController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/add-bus", AddBus);
router.get("/get-all-buses", GetAllBuses);
router.put("/:id", UpdateBus);
router.delete("/:id", DeleteBus);
router.get("/:id", GetBusById);
router.post("/get", GetBusesByFromAndTo);
router.get("/1/allbuses", allBusList);

module.exports = router;
