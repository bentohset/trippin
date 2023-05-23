const mongoose = require('mongoose')

const TripSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,
    },
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
        default: new Date()
    }
})

module.exports = Trip = mongoose.model('trip', TripSchema);