import React, { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { useRouter } from 'next/router';
import { AddressAutofill, SearchBox } from '@mapbox/search-js-react';
import { intlFormatDistance } from 'date-fns/esm';

function Addtrip() {
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [location,setLocation] = useState('')
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [searchvalue, setSearchValue] = React.useState('');

    const router = useRouter()

    const selectionRange ={
        startDate: startDate,
        endDate: endDate,
        key: 'selection'
    }

    const handleSelect =(ranges)=>{
        setStartDate(ranges.selection.startDate)
        setEndDate(ranges.selection.endDate)
        
    }
    // const handleGeocode = async (searchText) => {
    //     await fetch(`https://api.mapbox.com/search/v1/forward/${searchText}?language=en&limit=1&proximity=-121.90662,37.42827&country=US&access_token=${process.env.mapbox_key}`)
    //     .then(response => response.json())
    //     .then(data => console.log("test",data));
    // }
    // handleGeocode("india");
    
    const submitForm = async (e) => {
        e.preventDefault();
        if (!location || !startDate || !endDate) return setError('All fields are required');
        const trip = {
            location,
            startDate,
            endDate,
        };
        let dev = process.env.NODE_ENV !== 'production';
    
        const url = `${dev ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL}/trips`
        console.log(url)

        let response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(trip),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        console.log(response)
        let data = await response.json()
        .then(data =>{
            if (response.status == 201){
                router.replace(`/plan/${data._id}`)
                return setMessage(data.message);
            }
            else {
                // set the error
                return setError(data.message);
            }
        })
    }

  return (
    <div className='bg-white'>
        <Header/>
        <main className='mt-16 flex-1 flex-col items-center justify-center m-5 sm:flex'>
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
                <form className='flex flex-col' onSubmit={submitForm}>
                    <label htmlFor="location" className='my-2 font-semibold'>Where to?</label>
                    <input 
                        type="text" 
                        id="location" 
                        value={location}
                        onChange={(e)=>{setLocation(e.target.value)}}
                        className='rounded-xl p-2 px-4 mb-2 border-2 border-gray-200' 
                        placeholder='Eg. Singapore, Stockholm, Rome'
                    />
                    {/* <AddressAutofill accessToken={process.env.mapbox_key}>
                        <input
                        name="address" placeholder="Address" type="text"
                        // autoComplete=""
                        />
                    </AddressAutofill> */}
                    {/* <SearchBox accessToken={process.env.mapbox_key}
                        onChange={(e)=>{setSearchValue(e.target.value)}}
                        value={searchvalue}
                        className='rounded-xl p-2 px-4 mb-2 border-2 border-gray-200' 
                    /> */}

                    <label htmlFor='dates' className='font-semibold my-2'>Dates</label>
                    <DateRangePicker
                        id="dates"
                        ranges={[selectionRange]}
                        minDate={new Date()}
                        rangeColors={["#FD5B61"]}
                        onChange={handleSelect}
                        sidebar={false}
                        className="border-gray-200 border-2 rounded-md"
                    />
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

export default Addtrip