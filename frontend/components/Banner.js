import React from 'react'
import Image from 'next/image'
import pic from '../public/banner.jpg'
import { useRouter } from 'next/router'

function Banner() {
  const router = useRouter();

  return (
    <div className='relative h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px]'>
      <Image 
        src={pic}
        alt=""
        fill
        className='object-cover'
      />
      <div className='absolute top-1/2 w-full text-center'>
        <p className='text-lg font-bold sm:text-6xl text-white'>Create your trip!</p>
        <button className='mt-6 text-[#FD5B61] bg-white px-10 py-4 shadow-md rounded-full
        font-bold my-3 hover:shadow-xl active:scale-90 transition duration-150'
          onClick={()=>{router.push('/addtrip')}}
        >
          Plan New Trip
        </button>
      </div>
    
    </div>
  )
}

export default Banner