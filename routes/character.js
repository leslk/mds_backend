const express = require('express');
const router = express.Router();
const characterCtrl = require("../controller/character");

router.get("/:id/characters", characterCtrl.getCharacters); // filter univers by user_id req.body.univers_id")
router.post("/id/characters", characterCtrl.createCharacter); // req.body.univers_id")
router.put("/:id/characters", characterCtrl.updateCharacter); // req.body.univers_id")
router.get("/:id/characters", characterCtrl.getCharacter); // req.body.univers_id")
router.delete("/:id/characters", characterCtrl.deleteCharacter); // req.body.univers_id")


module.exports = router;