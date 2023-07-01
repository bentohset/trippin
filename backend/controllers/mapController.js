const express = require('express')
const mongoose = require('mongoose')
const fetch = require('node-fetch');

require('dotenv').config();

const mapboxKey = process.env.MAPBOX_KEY

exports.autoCompleteCity = async (req, res) => {
    const { text } = req.params
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?access_token=${mapboxKey}&autocomplete=true&types=country,region`
    
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

exports.autoCompletePlaces = async (req, res) => {
    const { text, long, lat } = req.params
    const minLat = lat - 10
    const maxLat = lat + 10
    const minLong = long - 10
    const maxLong = long + 10
    console.log(text)
    console.log(long)
    console.log(lat)
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?proximity=${long},${lat}&bbox=${minLong},${minLat},${maxLong},${maxLat}&access_token=${mapboxKey}&autocomplete=true&types=poi`
    console.log(url)
    try {
        const resp = await fetch(url);
        const data = await resp.json()
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