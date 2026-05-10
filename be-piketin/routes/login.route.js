const express = require('express')
const router = express.Router()

const loginController = require('../controllers/login.controller')
const upload = require("../middlewares/upload")

// tdk menggunakan prefix, karena nanti akan berbeda dengan /login dan /logout
router.post('/login', upload.none(), loginController.login);

module.exports = router