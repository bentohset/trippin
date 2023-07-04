import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/auth'
import { useRouter } from 'next/router'
import FormInput from '../components/FormInput'

function register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmationPassword, setConfirmationPassword] = useState('')
    const [username, setUsername] = useState('')
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)

    const { register } = useAuth();
    const router = useRouter()

    const submitForm = async (e) => {
        e.preventDefault();
        function validateEmail(email) {
            var re = /\S+@\S+\.\S+/;
            return re.test(email);
        }
        if (!email || !password || !confirmationPassword || !username) {
            return setError('Fields are required')
        }
        if (!validateEmail(email.toLowerCase())) {
            return setError('Email is not valid')
        }
        if (password.length <= 6) {
            return setError('Password must be longer than 6 characters')
        }
        if (password !== confirmationPassword) {
            return setError('Passwords do not match')
        }
        
        //handle error cases
        setLoading(true)
        const res = await register({email, password, username});
        if (res === "Success") {
            router.replace('/')
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
        <main className='flex flex-col items-center justify-center h-screen'>
            <div className='relative bg-white flex flex-col px-20 py-12 rounded-3xl shadow-xl'>
            {error ? (
                <div className='absolute top-0 flex items-center place-self-center justify-center mt-4 text-red-500'>
                    <h3>{error}</h3>
                </div>
            ):null}
            <h1 className='font-bold text-2xl mb-6 text-center'>Sign up for Trippin</h1>
            <div className='flex self-center w-[110%] '>
                <form onSubmit={submitForm} className='flex flex-col gap-1 w-full'>
                    <FormInput
                        placeholder="Email"
                        label="Email"
                        onChange={(e)=>{setEmail(e.target.value)}}
                        value={email}
                        id="email"
                        type="text"
                    />
                    <FormInput
                        placeholder="Username"
                        label="Username"
                        onChange={(e)=>{setUsername(e.target.value)}}
                        value={username}
                        id="username"
                        type="text"
                    />
                    <FormInput
                        placeholder="Password"
                        label="Password"
                        onChange={(e)=>{setPassword(e.target.value)}}
                        value={password}
                        id="password"
                        type="password"
                    />
                    <FormInput
                        placeholder="Confirm password"
                        label="Confirm password"
                        onChange={(e)=>{setConfirmationPassword(e.target.value)}}
                        value={confirmationPassword}
                        id="passwoconfirmationpasswordrd"
                        type="password"
                    />
                    <button 
                        type='submit' 
                        className={`text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FD5B61] hover:shadow-xl'} px-9 py-3 shadow-md rounded-full 
                            font-bold mt-6 mb-2 `}
                        disabled={loading}
                    >
                        Register
                    </button> 
                </form>   
            </div>

            <button className="hover:text-black text-gray-600" onClick={()=>{router.replace('/login')}}>
                Already have an account? <span className='font-semibold'>Log in here</span>
            </button>
            
            </div>
        </main>
    </div>
  )
}

export default register