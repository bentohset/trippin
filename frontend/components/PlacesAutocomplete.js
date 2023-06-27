import React, { useEffect } from 'react'
import Script from "next/script"
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
  } from 'use-places-autocomplete';


function PlacesAutocomplete({onAddressSelect}) {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {},
        debounce: 300,
        cache: 86400,
    });


    const renderSuggestions = () => {
        return data.map((suggestion) => {
            const {
              place_id,
              structured_formatting: { main_text, secondary_text },
              description,
            } = suggestion;
            console.log(suggestion)
            return (
                <li
                  className='hover:bg-gray-200 w-full cursor-pointer p-1 rounded-md'
                  key={place_id}
                  onClick={() => {
                    setValue(description, false);
                    clearSuggestions();
                    onAddressSelect && onAddressSelect(description, main_text);
                    onAddressSelect && setValue("")
                  }}
                >
                  <div className='flex flex-row justify-between items-center'>
                    <p className='font-semibold'>{main_text}</p>
                    <p className='text-xs'>{secondary_text}</p>
                  </div>
                </li>
            );
        });
    };

  return (
    <div className="h-full w-full relative">
      {/* <Script
        defer
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLEMAPS_KEY}&libraries=places`}
      /> */}
      <input
        value={value}
        className="w-full my-4 rounded-xl p-4 outline-none bg-gray-100"
        disabled={!ready}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add a location"
      />

      {status === 'OK' && (
        <div className='absolute bg-white z-50 border-2 rounded-xl p-2 w-full'>
          <ul className="w-full h-full">{renderSuggestions()}</ul>
        </div>
      )}

    </div>
    
  );
};

export default PlacesAutocomplete