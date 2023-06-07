const express = require('express')
const mongoose = require('mongoose')
const Trip = require('../models/TripModel')
const User = require('../models/UserModel')

exports.getTripsByUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).end('user does not exist')
        }
        console.log(user)
        const tripArray = user.trips
        console.log(tripArray)
        const trips = await Trip.find({ '_id': { $in: tripArray }})
        
        res.status(200).json(trips)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

exports.createTripUser = async (req, res) => {
    const { id } = req.params;
    const trip = req.body

    const newTrip = new Trip({
        location: trip.location,
        startDate: trip.startDate,
        endDate: trip.endDate,
    })

    try {
        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.status(404).end('user does not exist')
        }
        const createdTrip = await newTrip.save()
        
        user.trips.push(createdTrip._id)
        const savedUser = await user.save()
         
        res.status(200).json({ trip: createdTrip, user: savedUser });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

exports.deleteTripUser = async (req, res) => {
    const { id: userId, trip: tripId } = req.params
    //user id
    try {
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).end('user does not exist')
        }
        //check if both id are valid
        user.trips.splice(user.trips.findIndex((trip) => trip === tripId), 1)
        const savedUser = await user.save()

        const updatedTrip = await Trip.findByIdAndRemove(tripId)
        res.status(200).json(savedUser)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }

}