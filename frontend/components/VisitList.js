import React, { useState } from 'react'
import PlacesAutocomplete from '../components/PlacesAutocomplete'
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from 'use-places-autocomplete';


function VisitList({ list, onListUpdate, isLoaded }) {
    const [place, setPlace] = useState('');

    function handleAdd() {
        const updatedList = [...list, place];
        onListUpdate(updatedList);
        setPlace('');
    }

    function handleRemove(place) {
        const updatedList = list.filter(i => i !== place);
        onListUpdate(updatedList);
    }

    const handleAddAutoSelect = (newObj) => {

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
        {isLoaded ? <PlacesAutocomplete
            onAddressSelect={(address, name) => {
                getGeocode({ address: address })
                .then((results) => {
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