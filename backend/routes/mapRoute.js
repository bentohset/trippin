const express = require('express')
const auth = require('../middleware/auth.js')
const { autoCompleteCity } = require('../controllers/mapController.js')

const router = express.Router()

router.get('/cities/:text', autoCompleteCity)

module.exports = router