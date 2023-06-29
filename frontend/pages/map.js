import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import Map from '../components/Map'
import PlacesAutocomplete from '../components/PlacesAutocomplete'
import { useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
  } from 'use-places-autocomplete';
import VisitedMap from '../components/VisitedMap';

const index = 0

function map() {
  const libraries = useMemo(() => ['places'], []);
  const [clat, setCLat] = useState(27.672932021393862);
  const [clng, setCLng] = useState(85.31184012689732);

  const markers = [
    { address: "Address1", lat: 18.5204, lng: 73.8567 },
    { address: "Address2", lat: 18.5314, lng: 73.8446 },
    { address: "Address3", lat: 18.5642, lng: 73.7769 },
  ];

  const [places, setPlaces] = useState([])

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLEMAPS_KEY,
    libraries: libraries,
  }); 

  return (
    <div className='h-screen bg-white justify-center items-center'>
      <div className='h-1/2 w-1/2 border-black border-[1px] rounded-xl bg-gray-200'>
        <VisitedMap/>
      </div>
      
    </div>
  )
}

export default map