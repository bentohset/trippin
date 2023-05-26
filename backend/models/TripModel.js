const mongoose = require('mongoose')

const TripSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        requried: true
    },
    endDate: {
        type: Date,
        required: true
    },
    title: {
        type: String,
        default: function() {
            return "Trip to " + this.location
        }
    },
    notes: {
        type: String
    },
    places: {
        type: Array
    },
    itinerary: [
        {
            date: {type: Date},
            locations: {type: Array},
        }
    ],
    totalBudget: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})

module.exports = Trip = mongoose.model('trip', TripSchema);