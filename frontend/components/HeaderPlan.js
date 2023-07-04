import React from 'react'
import Link from 'next/link';

function HeaderPlan({ handleOnClick, saving }) {
  return (
    <nav 
        className='fixed top-0 z-50 grid grid-cols-2 
        bg-white shadow-md p-2 md:px-10 sm:w-1/2 w-full px-4' 
    >
        <div className='relative items-center justify-center cursor-pointer my-auto w-fit '>
            <Link href="/">
                <h1 className='font-bold text-2xl'>Trippin</h1>
            </Link>
        </div>

        <div className='flex items-center space-x-4 justify-end text-gray-400 font-semibold'>
            {
                saving ? (
                    <p>Saving...</p>
                ):(
                    <p>Saved</p>
                )
            }
            
        </div>
    </nav>
  )
}

export default HeaderPlan