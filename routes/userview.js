const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../util/database');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

router.get('/osr/userview', (req, res) => {
    res.render('userview', { message: "Userview Page" });
});

module.exports = router;