const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth");

const messageCtrl = require("../controller/message");

router.post("/:id/messages", auth, messageCtrl.createMessage); // req.body.talk_id & req.body.user_id & req.body.content
router.get("/:id/messages", auth, messageCtrl.getMessages); // req.params.id
router.put("/:id", auth, messageCtrl.updateMessage); // req.params.id


module.exports = router;