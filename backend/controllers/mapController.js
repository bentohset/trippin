const express = require('express')
const mongoose = require('mongoose')
const { mapboxKey } = require('../config/default.json');

exports.autoCompleteCity = async (req, res) => {
    const { text } = req.params
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?access_token=${mapboxKey}&autocomplete=true&types=country,place`
    
    try {
        const resp = await fetch(url);
        const data = await resp.json()
        console.log(data)
        if (resp.ok) {
            res.status(200).json(data)
        } else {
            res.status(401).json(resp.statusText)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }

}