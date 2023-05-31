import React from 'react'
import { MagnifyingGlassIcon, Bars3Icon, UserCircleIcon} from '@heroicons/react/24/solid'
import Link from 'next/link';

function HeaderPlan({handleOnClick, saving}) {
  return (
    <nav className='fixed top-0 z-50 grid grid-cols-2 
    bg-white shadow-md p-2 md:px-10 w-1/2' >
        <div className='relative items-center justify-center cursor-pointer my-auto w-fit '>
            <Link href="/">
                {/* <Image 
                    src="https://github.com/twbs.png" 
                    fill
                    alt=""
                    className='object-contain object-left'

                /> */}
                <h1 className='font-bold text-2xl'>Trippin</h1>
            </Link>
        </div>

        <div className='flex items-center space-x-4 justify-end text-gray-400 font-semibold'>
            {/* <button className="text-white bg-[#FD5B61] px-6 py-2 shadow-md 
                rounded-full font-bold hover:shadow-xl"
                onClick={()=>{handleOnClick}}
            >
                Save
            </button> */}
            {
                saving ? (
                    <p>Saving...</p>
                ):(
                    <p>Saved</p>
                )
            }
            
        </div>
        {/* <div className='flex items-center space-x-4 justify-end text-gray-500'>
            <div className='flex items-center space-x-2 border-2 p-2 rounded-full'>
                <Bars3Icon className='h-6'/>
                <UserCircleIcon className='h-6'/>
            </div>
        </div> */}
    </nav>
  )
}

export default HeaderPlan