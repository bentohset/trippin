//login and register page

import React, { useState } from 'react'
import { useAuth } from '../hooks/auth'
import { useRouter } from 'next/router'

function login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter()

    const submitForm = async (e) => {
        e.preventDefault();
        //handle error cases
        login({email, password});
    }

  return (
    <div className='bg-white'>
        <main className='sm:flex flex-1 flex-col items-center justify-center'>
            {error ? (
                <div className='flex items-center justify-center mt-5 text-red-500'>
                    <h3>{error}</h3>
                </div>
            ):null}
            <h1 className='font-bold text-4xl m-4 mt-8 text-center'>Login</h1>
            <div className=''>
                <form onSubmit={submitForm} className='flex flex-col'>
                    <label htmlFor='email'>Email</label>
                    <input
                        type="text"
                        id='email'
                        value={email}
                        onChange={(e)=>{setEmail(e.target.value)}}
                        placeholder='Email'
                    />
                    <label htmlFor='password'>Password</label>
                    <input
                        type="text"
                        id='password'       
                        value={password}
                        onChange={(e)=>{setPassword(e.target.value)}}
                        placeholder='Password'
                    />

                    <button 
                        type="submit"

                    >
                        Login
                    </button>         
                </form>
            </div>
            <button onClick={()=>{router.replace('/register')}}>
                Register
            </button>
        </main>
    </div>
  )
}

export default login