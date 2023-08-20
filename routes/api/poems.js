const express = require("express");
const router = express.Router();
const poemsController = require("../../controllers/poemsController");

router
  .route("/:username")
  .get(poemsController.getAllPoems)
  .post(poemsController.postPoem);

router
  .route("/:username/:poemId")
  .get(poemsController.getPoemById)
  .delete(poemsController.deletePoem);

module.exports = router;
