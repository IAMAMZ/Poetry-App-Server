const express = require("express");
const router = express.Router();
const poemsController = require("../../controllers/poemsController");

router.route("/").get(poemsController.getAllPoems);

module.exports = router;
