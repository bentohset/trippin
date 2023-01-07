import React, { useState } from 'react'
import Header from '../components/Header'
import Link from 'next/link'
import Footer from '../components/Footer'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { useRouter } from 'next/router';

function Addtrip() {
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [location,setLocation] = useState('')
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

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
    
    const submitForm = async (e) => {
        e.preventDefault();
        if (!location || !startDate || !endDate) return setError('All fields are required');
        let trip = {
            location,
            startDate,
            endDate,
            createdAt: new Date().toISOString(),
        };
        let response = await fetch('/api/trips', {
            method: 'POST',
            body: JSON.stringify(trip),
        })
        let data = await response.json()
        .then(data =>{
            if (data.success){
                data.id
                router.push('/plan/plan')
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
        <main className='flex-1 flex-col items-center justify-center m-5 sm:flex'>
            {error ? (
                <div className='flex items-center justify-center'>
                    <h3>{error}</h3>
                </div>
            ):null}
            {message ? (
                <div className='flex items-center justify-center'>
                    <h3>{message}</h3>
                </div>
            ):null}
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
                <button 
                        className='text-white bg-[#FD5B61] px-9 py-3 shadow-md rounded-full 
                        font-bold my-5 hover:shadow-xl'
                        onClick={()=>{router.push('/plan/plan')}}
                    >
                        Start trip
                </button>
            </div>
        </main>
        <Footer/>
    </div>
  )
}

export default Addtrip