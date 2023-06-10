const express = require('express')
const mongoose = require('mongoose')
const Trip = require('../models/TripModel')

exports.getTrip = async (req, res) => {
    const { id } = req.params;

    try {
        const trip = await Trip.findById(id);

        res.status(200).json(trip);
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: error.message })
    }
}


// TODO implement pagination
exports.getTrips = async (req, res) => {
    const { id } = req.params;

    try {
        const trips = await Trip.find();

        res.status(200).json(trips);
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: error.message })
    }
}


exports.createTrip = async (req, res) => {
    const trip = req.body

    const newTrip = new Trip({
        location: trip.location,
        center: trip.center,
        startDate: trip.startDate,
        endDate: trip.endDate,
    })

    try {
        const createdTrip = await newTrip.save()
        console.log(createdTrip)
        //add createdTrip._id to user
        res.status(201).json(createdTrip);
    } catch (error) {
        console.log(error)
        res.status(409).json({ message: error.message })
    }
}

exports.updateTrip = async (req, res) => {
    const { id: _id } = req.params
    const trip = req.body

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).end('id does not exist')
    }

    const updatedTrip = await Trip.findByIdAndUpdate(_id, {...trip, _id}, { new: true})

    res.status(200).json(updatedTrip)
}

exports.deleteTrip = async (req, res) => {
    const { id: id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).end('id does not exist')
    }

    const updatedTrip = await Trip.findByIdAndRemove(id)

    res.status(200).json({ message: 'trip deleted successfully'})
}

exports.getTripForm = async (req, res) => {
    const { id: id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).end('id does not exist')
    }

    try {
        const tripForm = await Trip.findById(id).select('title startDate endDate notes places itinerary totalBudget currency center');

        if (!tripForm) {
            return res.status(404).json({ error: 'Form data not found' });
        }
        // console.log(tripForm.itinerary[0].locations)
        res.status(200).json(tripForm)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'error retrieving from db' })
    }
}

exports.updateItinerary = async (req, res) => {
    const { id: id, date: date } = req.params
    const { notes, location, cost } = req.body
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).end('id does not exist')
    }

    try {
        const trip = await Trip.findById(id)

        if (!trip.itinerary[date].notes) trip.itinerary[date].notes = []
        if (!trip.itinerary[date].locations) trip.itinerary[date].locations = []
        if (!trip.itinerary[date].cost) trip.itinerary[date].cost = []

        trip.itinerary[date].cost = cost
        trip.itinerary[date].notes = notes
        trip.itinerary[date].locations = location

        await trip.save();
        res.status(200).json(trip)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'error occured'})
    }
}

exports.getItinerary = async (req, res) => {
    const { id: id, date: date } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).end('id does not exist')
    }

    try {
        const trip = await Trip.findById(id)

        const tripItinerary = trip.itinerary[date]

        return res.status(200).json(tripItinerary)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'error occured'})
    }
}