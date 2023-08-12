const mongoose = require('mongoose');
const Trip = require('./models/TripModel');

const saveTrip = async (id, tripData) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid trip ID');
    }

    const updatedTrip = await Trip.findByIdAndUpdate(id, { ...tripData, _id: id }, { new: true });
    console.log('Trip updated!');
    return updatedTrip;
};

module.exports = {
    saveTrip,
};