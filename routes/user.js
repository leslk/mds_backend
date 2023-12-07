const express =require("express");
const router = express.Router();
const userCtrl = require("../controller/user");
const auth = require("../middlewares/auth");

router.post("/", userCtrl.createUser);
router.post("/auth", userCtrl.checkAuth);
router.put("/:id", auth,  userCtrl.updateUser);
router.get("/:id", auth, userCtrl.getUser);
router.get("/", auth, userCtrl.getUsers);
router.get("/check-pseudo", userCtrl.checkPseudoAvailability);

module.exports = router;