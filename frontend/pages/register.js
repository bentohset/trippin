import React, { useState } from 'react'
import { useAuth } from '../hooks/auth'
import { useRouter } from 'next/router'

function register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmationPassword, setConfirmationPassword] = useState('')
    const [username, setUsername] = useState('')
    const [error, setError] = useState('');
    const { register } = useAuth();
    const router = useRouter()

    const submitForm = async (e) => {
        e.preventDefault();
        //handle error cases
        register({email, password, username});
    }

  return (
    <div className='bg-white'>
        <main className='flex-1 flex-col items-center justify-center'>
        {error ? (
            <div className='flex items-center justify-center mt-5 text-red-500'>
                <h3>{error}</h3>
            </div>
        ):null}
        <h1 className='font-bold text-4xl m-4 mt-8 text-center'>Register</h1>
        <div>
            <form onSubmit={submitForm} className='flex flex-col'>
                <label htmlFor='email'>Email</label>
                <input
                    type="text"
                    id='email'
                    value={email}
                    onChange={(e)=>{setEmail(e.target.value)}}
                    placeholder='Email'
                />
                <label htmlFor='username'>Username</label>
                <input
                    type="text"
                    id='username'
                    value={username}
                    onChange={(e)=>{setUsername(e.target.value)}}
                    placeholder='Username'
                />
                <label htmlFor='password'>Password</label>
                <input
                    type="text"
                    id='password'
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}}
                    placeholder='Password'
                />
                <label htmlFor='confirmationpassword'>Confirmation Password</label>
                <input
                    type="text"
                    id='confirmationpassword'
                    value={confirmationPassword}
                    onChange={(e)=>{setConfirmationPassword(e.target.value)}}
                    placeholder='Confirmation Password'
                />
                <button type='submit'>Register</button>
                
            </form>
            <button onClick={()=>{router.replace('/login')}}>Back</button>
        </div>
        </main>
    </div>
  )
}

export default register