const express = require("express");
const router = express.Router();
const poemsController = require("../../controllers/poemsController");

router
  .route("/")
  .get(poemsController.getAllPoems)
  .post(poemsController.postPoem);

router
  .route("/:id")
  .get(poemsController.getPoemById)
  .delete(poemsController.deletePoem);

module.exports = router;
