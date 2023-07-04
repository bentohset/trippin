import React, { useState } from 'react'
import Header from '../components/Header'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';
import { useRouter } from 'next/router';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../hooks/auth';
import { useMediaQuery } from '@mui/material';

function Addtrip() {
    const isMobile = useMediaQuery('(max-width:992px)');
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [location,setLocation] = useState({
        name: '',
        text: '',
        center: [],
        countryCode: ''
    })
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [autocompleteLocations, setAutocompleteLocations] = useState([]);
    const [openAutocomplete, setOpenAutocomplete] = useState(false)
    const { cookies } = useAuth()
    const router = useRouter()
    // const autoRef = useRef(null);

    const selectionRange = {
        startDate: startDate,
        endDate: endDate,
        key: 'selection'
    }

    

    const handleLocationChange = async (e) => {
        const value = e.target.value
        setLocation((prev) => ({
            ...prev,
            text: e.target.value
        }))
        let dev = process.env.NODE_ENV !== 'production';
        const url = `${dev ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL}/map/cities/${value}`
        
        if (value.length >= 4) {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                const data = await response.json()
                !autocompleteLocations.includes(value) &&
                data.features &&
                setAutocompleteLocations(
                    data.features.map(place => {
                        let code = ''
                        if (place.place_type.includes("country")) {
                            code = place.properties.short_code
                        } else if (place.place_type.includes("region") || place.place_type.includes("place")) {
                            code = place.context[0].short_code
                        }

                        return {
                            name: place.place_name,
                            text: place.text,
                            center: place.center,
                            countryCode: code
                        }
                    })
                );
                setOpenAutocomplete(true)
                if (data.error) console.log(data.error)
            } catch (error) {
                console.log(error)
            }
            
        }
    }

    const selectAutocomplete = (option) => {
        setLocation(option)
        setOpenAutocomplete(false)
    }

    const handleSelect =(ranges)=>{
        setStartDate(ranges.selection.startDate)
        setEndDate(ranges.selection.endDate)
        
    }

    
    const submitForm = async (e) => {
        e.preventDefault();
        if (!location.text || !location.center || !startDate || !endDate) return setError('All fields are required');
        const trip = {
            location: location.text,
            center: location.center,
            countryCode: location.countryCode,
            startDate,
            endDate,
        };
        let dev = process.env.NODE_ENV !== 'production';
    
        const url = `${dev ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL}/user/trip/${cookies.id}`
        
        let response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(trip),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        let data = await response.json()
        .then(data => {
            if (response.status == 200){
                router.replace(`/plan/${data.trip._id}`)
                return setMessage(data.message);
            }
            else {
                return setError(data.message);
            }
        })
    }

  return (
    <div className='bg-white'>
        <Header/>
        <main className='pt-16 md:pb-0 pb-4 flex-1 flex-col items-center justify-center m-5 sm:flex'>
            {error ? (
                <div className='flex items-center justify-center mt-5 text-red-500'>
                    <h3>{error}</h3>
                </div>
            ):null}
            {message ? (
                <div className='flex items-center justify-center'>
                    <h3>{message}</h3>
                </div>
            ):null}
            <h1 className='font-bold text-4xl m-4 mt-8 text-center'>New trip</h1>
            <div className=''>
                <form className='flex flex-col relative' onSubmit={submitForm}>
                    <label htmlFor="location" className='my-2 font-semibold'>Place</label>
                    <input 
                        type="text" 
                        id="location" 
                        value={location.text}
                        required
                        onChange={handleLocationChange}
                        className='relative rounded-xl p-2 px-4 mb-2 border-2 border-gray-200' 
                        placeholder='Eg. Singapore, Stockholm, Rome'
                        autoComplete='off'
                    />
                    {
                        openAutocomplete ? 
                        (
                            <div id="places" className='absolute top-24 bg-white z-50 w-full border-2 rounded-xl p-2'>
                                <ul className='w-full h-full'>
                                    {autocompleteLocations.map((city, i) => (
                                    <li key={i} 
                                        className='text-gray-600 cursor-pointer p-1 hover:bg-gray-200 w-full rounded-md' 
                                        onClick={(event)=>{
                                            selectAutocomplete(city)
                                        }}
                                    >
                                        <div className='flex flex-row justify-between items-center'>
                                            <p className='font-semibold'>{city.text}</p>
                                            <p className='text-xs'>{city.name}</p>

                                        </div>
                                        
                                    </li>
                                    ))}
                                </ul>
                            </div>
                        ):(
                            <></>
                        )
                    }
                    <div className='flex flex-col w-full h-auto'>
                            <label htmlFor='dates' className='font-semibold my-2'>Dates</label>
                            <DateRange
                                id="dates"
                                ranges={[selectionRange]}
                                minDate={new Date()}
                                rangeColors={["#FD5B61"]}
                                onChange={handleSelect}
                                months={isMobile? 1:2}
                                direction='horizontal'
                                className="border-gray-200 border-2 rounded-md"
                            />
                        </div>
                    <button 
                        className='text-white bg-[#FD5B61] px-9 py-3 shadow-md rounded-full 
                        font-bold my-5 hover:shadow-xl'
                        type="submit"
                    >
                        Start trip
                    </button>
                    
                </form>
            </div>
        </main>
    </div>
  )
}

const DUMMYDATA = [
    {
        "name": "India",
        "text": "India",
        "center": [
            78.476681027237,
            22.1991660760527
        ],
    },
    {
        "name": "Indianapolis, Indiana, United States",
        "text": "Indianapolis",
        "center": [
            -86.15835,
            39.768333
        ],
    },
    {
        "name": "Indiana, Pennsylvania, United States",
        "text": "Indiana",
        "center": [
            -79.152535,
            40.621455
        ],
    },
    {
        "name": "Indian Trail, North Carolina, United States",
        "text": "Indian Trail",
        "center": [
            -80.669235,
                35.076814
        ],
    },
    {
        "name": "Indialantic, Florida, United States",
        "text": "Indialantic",
        "center": [
            -80.566247,
            28.091493
        ],
    },
]

export default ProtectedRoute(Addtrip)