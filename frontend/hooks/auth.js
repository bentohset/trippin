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

		if (response.status == 401) {
			return "Invalid password"
		}
		if (response.status == 404) {
			return "User does not exist"
		}
		if (response.status == 500) {
			return "Servers are down. Please try again later"
		}

		const data = await response.json()

		console.log(data)
		if (response.ok && data.token && data.email) {
			setCookies('token', data.token);
			setCookies('email', data.email);
			return "Success"
		}
		
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

		if (response.status == 401) {
			return "Username already exists"
		}
		if (response.status == 402) {
			return "Email already exists"
		}
		if (response.status == 500) {
			return "Servers are down. Please try again later"
		}

		const data = await response.json()
		if (data.token && data.result.email) {
			setCookies('token', data.token);
			setCookies('email', data.result.email);
			return "Success"
		}
		
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