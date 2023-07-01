import React from 'react'
import { useRouter } from 'next/router'

function Banner() {
  const router = useRouter();

  return (
    <div className='flex justify-center items-center h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px] bg-gradient-to-tr from-[rgba(223,167,39,1)] to-[rgba(255,111,145,1)]'>
      <div className='w-full text-center'>
        <p className='text-lg font-bold sm:text-6xl text-white'>Create your trip!</p>
        <button className='mt-10 text-[#FD5B61] bg-white px-10 py-4 shadow-md rounded-full
        font-bold hover:shadow-xl active:scale-90 transition duration-150'
          onClick={()=>{router.push('/addtrip')}}
        >
          Plan New Trip
        </button>
      </div>
    
    </div>
  )
}

export default Banner