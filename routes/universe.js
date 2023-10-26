const express =require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const universCtrl = require("../controller/universe");

router.get("/",auth, universCtrl.getUniverses); // filter univers by user_id req.body.user_id
router.post("/",auth, universCtrl.createUniverse); // req.body.user_id
router.get("/:id",auth, universCtrl.getUniverse); // req.params.id
router.put("/:id",auth, universCtrl.updateUniverse); // req.params.id
router.delete("/:id",auth, universCtrl.deleteUniverse); // req.params.id

module.exports = router;