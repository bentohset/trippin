const mongoose = require('mongoose')

const locationSubSchema = mongoose.Schema({
    label: {
        type: String
    },
    value: {
        type: String
    }
}, { _id: false })

const itinerarySubSchema = mongoose.Schema({
    dateIndex: {type: Number},
    locations: [locationSubSchema],
    notes: {
        type: Array,
        default: new Array()
    }
}, { _id: false });

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
    itinerary: {
        type: [itinerarySubSchema],
        default: function() {
            const start = new Date(this.startDate)
            const end = new Date(this.endDate)
            const size = Math.ceil((end-start)/(1000*60*60*24))
            console.log(size)
            return new Array(size+1).fill().map((_, index) => ({
                dateIndex: index,
                locations: []
            }))
        }
    },
    totalBudget: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})

module.exports = Trip = mongoose.model('trip', TripSchema);