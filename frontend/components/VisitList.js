import React, { useState } from 'react'
import PlacesAutocomplete from '../components/PlacesAutocomplete'
import { useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from 'use-places-autocomplete';


function VisitList({ list, onListUpdate, isLoaded }) {
    const [place, setPlace] = useState('');
    const [autocompletePlaces, setAutocompletePlaces] = useState([]);
    const [openAutocomplete, setOpenAutocomplete] = useState(false)

    function handleAdd() {
        const updatedList = [...list, place];
        onListUpdate(updatedList);
        setPlace('');
    }

    function handleRemove(place) {
        const updatedList = list.filter(i => i !== place);
        onListUpdate(updatedList);
    }

    // const handleInputChange = async (e) => {
    //     const val = e.target.value
    //     setPlace(val)
    //     let dev = process.env.NODE_ENV !== 'production';
    //     const url = `${dev ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL}/map/cities/${val}`

    //     if (val.length >= 5) {
    //         try {
    //             console.log("fetch place")
    //             const response = await fetch(url, {
    //                 method: 'GET',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 }
    //             })
    //             const data = await response.json()
    //             !autocompleteLocations.includes(value) &&
    //             data.features &&
    //             setAutocompletePlaces(
    //                 data.features.map(place => {
    //                     return {
    //                         name: place.place_name,

    //                     }
    //                 })
    //             )
    //             setOpenAutocomplete(true)
    //             if (data.error) console.log(data.error)

    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }

    // }

    // const selectAutocomplete = (option) => {
    //     setPlace(option)
    //     setOpenAutocomplete(false)
    // }
    const handleAddAutoSelect = (newObj) => {
        console.log(newObj)

        const updatedList = [...list, newObj];
        onListUpdate(updatedList);
    }

  return (
    <div className='flex-1 my-4 mt-2'>
        <ul className='space-y-4 font-semibold'>
            {list.map((place, index) => (
                <li 
                    key={index}
                    className="rounded-xl p-4 outline-none bg-gray-100 flex flex-row justify-between"
                >
                    {place.name}{' '}
                    <button onClick={()=>handleRemove(place)} className="font-semibold text-gray-400 self-end hover:text-gray-600">Remove</button>
                </li>
            ))}
        </ul>
        {/* <div className='relative flex justify-between items-center'>
            <input
                type="text"
                onChange={(e)=>{setPlace(e.target.value)}}
                value={place}
                placeholder='Add a location'
                className="w-11/12 my-4 rounded-xl p-4 outline-none bg-gray-100"
                required
            />
            <button onClick={handleAdd} disabled={!place} className={`ml-2 bg-gray-100 rounded-xl p-4 px-6 text-gray-500 ${!place ? ``:`hover:bg-gray-200`} `}>+</button>
            
        </div> */}
        {isLoaded ? <PlacesAutocomplete
            onAddressSelect={(address, name) => {
                getGeocode({ address: address })
                .then((results) => {
                    console.log(address)
                    console.log(name)
                    const { lat, lng } = getLatLng(results[0]);
                    const newObj = {
                        lat: lat,
                        lng: lng,
                        address: address,
                        name: name,
                        day: 0
                    }
                    handleAddAutoSelect(newObj)

                });
            
            }}
        /> : null}
    </div>
  )
}

const DUMMY = [

]
export default VisitList