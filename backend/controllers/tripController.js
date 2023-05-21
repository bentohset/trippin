const express = require('express')
const mongoose = require('mongoose')
const Trip = require('../models/TripModel')

exports.getTrip = async (req, res) => {
    const { id } = req.params;

    try {
        const trip = await Trip.findById(id);

        res.status(200).json(trip);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


// TODO implement pagination
exports.getTrips = async (req, res) => {
    const { id } = req.params;

    try {
        const trips = await Trip.find();
        console.log(trips)

        res.status(200).json(trips);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


exports.createTrip = async (req, res) => {
    const trip = req.body

    const newTrip = new Trip({ ...trip })

    try {
        await Trip.create(newTrip)

        res.status(201).json(newTrip);
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

exports.updateTrip = async (req, res) => {
    const { id: _id } = req.params
    const trip = req.body

    if (!mongoose.Types.ObjectId.isvalid(_id)) {
        return res.status(404).end('id does not exist')
    }

    const updatedTrip = await Trip.findByIdAndUpdate(_id, {...trip, _id}, { new: true})

    res.json(updatedTrip)
}

exports.deleteTrip = async (req, res) => {
    const { id: _id } = req.params

    if (!mongoose.Types.ObjectId.isvalid(_id)) {
        return res.status(404).end('id does not exist')
    }

    const updatedTrip = await Trip.findByIdAndRemove(id)

    res.json({ message: 'trip deleted successfully'})
}