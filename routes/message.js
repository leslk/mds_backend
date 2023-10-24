const express = require('express');
const router = express.Router();

const messageCtrl = require("../controller/message");

router.post("/:id/messages", messageCtrl.createMessage); // req.body.talk_id & req.body.user_id & req.body.content
router.get("/:id/messages", messageCtrl.getMessages); // req.params.id
router.put("/:id", messageCtrl.updateMessage); // req.params.id


module.exports = router;