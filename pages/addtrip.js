import React, { useState } from 'react'
import Header from '../components/Header'
import Link from 'next/link'
import Footer from '../components/Footer'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import clientPromise from '../lib/mongodb';

function Addtrip() {
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [location,setLocation] = useState('')

    const selectionRange ={
        startDate: startDate,
        endDate: endDate,
        key: 'selection'
    }

    const handleSelect =(ranges)=>{
        setStartDate(ranges.selection.startDate)
        setEndDate(ranges.selection.endDate)
        
    }
    
    const submitForm = async () => {
        const client = await clientPromise;
        const db = client.db("tripplanner");
        const trip = {
            createdAt: Date.now(),
            location: location,
            startDate: startDate,
            endDate: endDate
        };
        const upload = await db.collection("trips").insertOne(trip)
        res.json(upload)


    }

  return (
    <div className='bg-white'>
        <Header/>
        <main className='flex-1 flex-col items-center justify-center m-5 sm:flex'>
            <h1 className='font-bold text-4xl m-4 text-center'>New trip</h1>
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
        <Footer/>
    </div>
  )
}

export default Addtrip