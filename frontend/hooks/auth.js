import React, { createContext, useContext, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [cookies, setCookies, removeCookie] = useCookies();
    const router = useRouter()

    const login = async ({ email, password }) => {
      	let dev = process.env.NODE_ENV !== 'production';
		const url = `${dev ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL}/users/signin`
      	
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: email,
				password: password
			}),
     	})

		const data = await response.json()

		setCookies('token', data.token);
		setCookies('email', data.email);
		router.replace('/')
    }

	const register = async ({ email, password, username }) => {
		let dev = process.env.NODE_ENV !== 'production';
		const url = `${dev ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL}/users/signup`

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: email,
				password: password,
				username: username
			}),
     	})
		const data = await response.json()

		setCookies('token', data.token);
		setCookies('email', data.result.email);
		router.replace('/')
	}

	const logout = () => {
		['token', 'email'].forEach(obj => removeCookie(obj));
		router.replace('/login');
	}

	const value = useMemo(
		() => ({
			cookies,
			login,
			register,
			logout
		}), [cookies]
	)


  return (
    <AuthContext.Provider value={value}>
		{children}
	</AuthContext.Provider>
  )
}

export const useAuth = () => {
	return useContext(AuthContext)
}