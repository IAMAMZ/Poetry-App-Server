const express = require("express");
const router = express.Router();
const wordsController = require("../../controllers/wordsController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/:username")
  .get(wordsController.getAllWords)
  .post(wordsController.postWord);

router.route("/:username/:poemId").delete(wordsController.deleteWord);

module.exports = router;
