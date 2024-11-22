const express = require("express");
const { createLog, getLogs } = require("../controllers/logController");
const router = express.Router();

router.post("/logs", createLog);
router.get("/logs", getLogs);

module.exports = router;
