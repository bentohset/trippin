//login and register page

import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/auth'
import { useRouter } from 'next/router'

function login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)
    const { login } = useAuth();
    const router = useRouter()

    const submitForm = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            return setError('All fields are required')
        }
        //handle error cases
        const res = await login({email, password});
        setLoading(true)
        if (res === "Success") {
            router.replace('/')
            console.log(loading)
        } else {
            setError(res)
            setLoading(false)
        }
        
    }

    useEffect(() => {
        router.prefetch('/')
    },[router])

  return (
    <div className='bg-gradient-to-tr from-[rgba(223,167,39,1)] to-[rgba(255,111,145,1)] h-full'>
        <main className='sm:flex flex-1 flex-col items-center justify-center h-screen'>
            <div className='relative bg-white flex flex-col px-20 py-12 rounded-3xl shadow-xl'>
            {error ? (
                <div className='absolute top-0 flex items-center place-self-center justify-center mt-4 text-red-500'>
                    <h3>{error}</h3>
                </div>
            ):null}
            <h1 className='font-bold text-3xl mb-10 text-center'>Welcome to Trippin</h1>
            <div className='flex-1 justify-center self-center w-[110%]'>
                <form onSubmit={submitForm} className='flex flex-col gap-1'>
                    <label htmlFor='email' className='text-sm block text-gray-700'>Email</label>
                    <input
                        className='p-2 rounded-xl mb-4 appearance-none border-2 border-gray-200 !outline-none'
                        type="text"
                        id='email'
                        autoComplete='off'
                        value={email}
                        onChange={(e)=>{setEmail(e.target.value)}}
                        placeholder='Email'
                    />
                    <label htmlFor='password' className='text-sm block text-gray-700'>Password</label>
                    <input
                        className='p-2 rounded-xl mb-4 appearance-none border-2 border-gray-200 !outline-none'
                        type="password"
                        id='password'       
                        value={password}
                        onChange={(e)=>{setPassword(e.target.value)}}
                        placeholder='Password'
                    />

                    <button 
                        type="submit"
                        className={`text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FD5B61] hover:shadow-xl'} px-9 py-3 shadow-md rounded-full 
                        font-bold mt-6 mb-2 `}
                        disabled={loading}
                    >
                        Login
                    </button>         
                </form>
            </div>
            <button className="hover:text-black text-gray-600" onClick={()=>{router.replace('/register')}}>
                Don't have an account yet? <span className='font-semibold'>Sign up here</span>
            </button>
            </div>
        </main>
    </div>
  )
}

export default login