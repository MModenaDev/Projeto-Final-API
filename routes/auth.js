const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();


router.get('/', (req, res, next) => {
  res.json({'oi': 'oi'})
})


module.exports = router;