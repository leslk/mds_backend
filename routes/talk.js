const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth");
const talkCtrl = require("../controller/talk");

router.get("/", auth, talkCtrl.getTalks); // filter talks by user_id === req.body.users_id & character_id === req.body.character_id
router.post("/", auth, talkCtrl.createTalk); // req.body.users_id & req.body.character_id
router.get("/:id", auth, talkCtrl.getTalk); // req.params.id
router.delete("/:id", auth, talkCtrl.deleteTalk); // req.params.id

module.exports = router;