const express = require('express')
const auth = require('../middleware/auth.js')
const { autoCompleteCity, autoCompletePlaces } = require('../controllers/mapController.js')

const router = express.Router()

// @route /map/cities/:text
router.get('/cities/:text', autoCompleteCity)

// @route /map/places/:text/:long/:lat
router.get('/places/:text/:long/:lat', autoCompletePlaces)

module.exports = router