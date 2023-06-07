const express = require('express')
const auth = require('../middleware/auth.js')
const { getTripsByUser, createTripUser, deleteTripUser } = require('../controllers/userController.js')

const router = express.Router()

// @route /user/trip/:id
router.get('/trip/:id', getTripsByUser);

router.post('/trip/:id', createTripUser);

// @rotue /user/:trip/:id
router.delete('/:trip/:id', deleteTripUser)

module.exports = router