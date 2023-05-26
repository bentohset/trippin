const express = require('express')
const { getTrips, getTrip, createTrip, updateTrip, deleteTrip, getTripForm } = require('../controllers/tripController.js')

const router = express.Router()

// @route GET /trips/test
// @description tests trips route
// @access Public
router.get('/test', (req, res) => res.send('trips route testing'))


// @route /trips/
// @description 
// @access Public
router.get('/', getTrips)

router.get('/:id', getTrip)

router.post('/', createTrip)

// put vs patch:
// put - completely replace the existing document (even if fields havent been changed)
// patch - partially update existing document only with fields that need to be updated
router.patch('/:id', updateTrip)

router.delete('/:id', deleteTrip)

//@route /trips/form/:id
router.get('/form/:id', getTripForm)

module.exports = router