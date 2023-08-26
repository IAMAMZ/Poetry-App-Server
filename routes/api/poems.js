const express = require("express");
const router = express.Router();
const poemsController = require("../../controllers/poemsController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/:username")
  .get(poemsController.getAllPoems)
  .post(poemsController.postPoem);

router
  .route("/:username/:poemId")
  .get(poemsController.getPoemById)
  .delete(poemsController.deletePoem);

module.exports = router;
