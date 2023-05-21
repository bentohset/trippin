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
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = Trip = mongoose.model('trip', TripSchema);