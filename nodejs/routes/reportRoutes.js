const express = require('express');
const { createReport } = require('../controllers/reportController');

const router = express.Router();

router.post('/report', createReport);

module.exports = router;
