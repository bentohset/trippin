import React, { useState } from 'react'
import Link from 'next/link';
import ShareModal from './ShareModal'
import { useAuth } from '../hooks/auth';

function HeaderPlan({ handleOnClick, saving }) {
    const [open, setOpen] = useState(false)
    const { cookies } = useAuth()

  return (
    <nav 
        className='fixed top-0 z-50 grid grid-cols-2 
        bg-white shadow-md p-2 md:px-10 sm:w-1/2 w-full pl-4' 
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
            {cookies.role !== "guest" && <div>
                <button className='text-white bg-[#FD5B61] px-5 py-1 shadow-md rounded-md
                                    font-bold hover:shadow-xl active:scale-90 transition duration-150 text-sm'
                    onClick={()=>setOpen(true)}
                >
                    Share
                </button>
            </div>}
            
        </div>
        <ShareModal isOpen={open} setIsOpen={setOpen}/>
    </nav>
  )
}

export default HeaderPlan