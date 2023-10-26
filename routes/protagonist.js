const express = require('express');
const router = express.Router();
const protagonistCtrl = require("../controller/protagonist");

router.get("/:id/protagonists", protagonistCtrl.getProtagonists); // filter univers by user_id req.body.univers_id")
router.post("/:id/protagonists", protagonistCtrl.createProtagonist); // req.body.univers_id")
router.put("/:id/protagonists/:protagonistId", protagonistCtrl.updateProtagonist); // req.body.univers_id")
router.get("/:id/protagonists/:protagonistId", protagonistCtrl.getProtagonist); // req.body.univers_id")
router.delete("/:id/protagonists/:protagonistId", protagonistCtrl.deleteProtagonist); // req.body.univers_id")


module.exports = router;