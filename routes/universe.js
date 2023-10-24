const express =require("express");
const router = express.Router();

const universCtrl = require("../controller/universe");

router.get("/", universCtrl.getUniverses); // filter univers by user_id req.body.user_id
router.post("/", universCtrl.createUniverse); // req.body.user_id
router.get("/:id", universCtrl.getUniverse); // req.params.id
router.put("/:id", universCtrl.updateUniverse); // req.params.id
router.delete("/:id", universCtrl.deleteUniverse); // req.params.id

module.exports = router;