const express = require('express');
const router = express.Router();

const talkCtrl = require("../controller/talk");

router.get("/", talkCtrl.getTalks); // filter talks by user_id === req.body.users_id & character_id === req.body.character_id
router.post("/", talkCtrl.createTalk); // req.body.users_id & req.body.character_id
router.get("/:id", talkCtrl.getTalk); // req.params.id
router.delete("/:id", talkCtrl.deleteTalk); // req.params.id

module.exports = router;