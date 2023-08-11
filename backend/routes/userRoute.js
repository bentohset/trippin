const express = require('express')
const auth = require('../middleware/auth.js')
const { getTripsByUser, createTripUser, deleteTripUser, getUser, updateUser, addTripUser } = require('../controllers/userController.js')

const router = express.Router()

// @route /user/trip/:id
router.get('/trip/:id', getTripsByUser);

router.post('/trip/:id', createTripUser);

// @rotue /user/:trip/:id
router.delete('/:trip/:id', deleteTripUser)

// @route /user/:id
router.get('/:id', getUser)

router.patch('/:id', updateUser)

// @route /user/trip/add/:id
router.post('/trip/add/:id', addTripUser)

module.exports = router