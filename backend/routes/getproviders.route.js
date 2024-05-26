const express = require("express");
const { getProviders } = require("../controllers/getproviders.controller");
const router = express.Router();

router.get('/data', getProviders); // Pass dataAdmin as the route handler

module.exports = router;
