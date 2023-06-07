import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { MagnifyingGlassIcon, Bars3Icon, UserCircleIcon, } from '@heroicons/react/24/solid'
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../hooks/auth';

function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef(null);
    const router = useRouter()
    const { logout } = useAuth()

    const toggleModal = () => {
        setIsOpen((current) => !current);
    };
    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };
    
    useEffect(() => {
        console.log(isOpen)
        if (isOpen) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }
        
    
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen]);

  return (
    <header className='fixed top-0 z-50 grid grid-cols-3 
    bg-white shadow-md p-2 md:px-10 w-full'>
        <div className='items-center justify-center w-fit cursor-pointer my-auto'>
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


        <div className='flex items-center md:border-2 rounded-full py-2 md:shadow-sm'>
            <input className="flex-grow pl-5 bg-transparent outline-none 
            text-sm text-gray-600 placeholder-gray-400" 
            type="text" 
            placeholder='Start your search'/>
            <MagnifyingGlassIcon className="hidden md:inline-flex h-8 
            bg-red-400 text-white rounded-full p-2 cursor-pointer md:mx-2"/>
        </div>


        <div className='flex items-center space-x-4 justify-end text-gray-500 '>
            <div className='cursor-pointer flex items-center space-x-2 border-2 p-2 rounded-full hover:shadow-xl focus:shadow-xl'
                onClick={(event)=>{
                    event.stopPropagation()
                    toggleModal()
                }}
                
                
            >
                <Bars3Icon className='h-6'/>
                <UserCircleIcon className='h-6'/>
                {isOpen && (
                <div ref={modalRef} className="absolute flex flex-col top-16 right-10 w-36 z-50 bg-white rounded-xl shadow-xl border-[1px]">
                    <button className="text-gray-600 py-1 w-full mt-3 hover:bg-gray-100" onClick={()=>{router.replace('/profile')}}>Profile</button>
                    <button className="text-gray-600 py-1 w-full mb-3 hover:bg-gray-100" onClick={()=>{logout()}}>Logout</button>
                </div>
            )}
            </div>
            
        </div>
    </header>
  )
}

export default Header