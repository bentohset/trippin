import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';

const AuthContext = createContext();

// TODO: user context is lost upon reload
export const AuthProvider = ({ children }) => {
    const [cookies, setCookies, removeCookie] = useCookies();
    const router = useRouter()

	const guestLogin = async () => {
		setCookies('role', 'guest', { path: '/', sameSite: 'none', secure: true})
		setCookies('token', 'guestMode', { path: '/', sameSite: 'none', secure: true});
		setCookies('id', '1', { path: '/', sameSite: 'none', secure: true});
		
		return "Success"

	}

    const login = async ({ email, password }) => {
      	let dev = process.env.NODE_ENV !== 'production';
		const url = `${dev ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL}/auth/signin`
      	
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
		if (data.token && data.user._id) {
			setCookies('token', data.token, { path: '/', sameSite: 'none', secure: true});
			setCookies('id', data.user._id, { path: '/', sameSite: 'none', secure: true});
			setCookies('role', 'user', { path: '/', sameSite: 'none', secure: true})
			return "Success"
		}
		
    }

	const register = async ({ email, password, username }) => {
		let dev = process.env.NODE_ENV !== 'production';
		const url = `${dev ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL}/auth/signup`

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

		if (data.token && data.user._id) {
			setCookies('token', data.token, { path: '/', sameSite: 'none', secure: true});
			setCookies('id', data.user._id, { path: '/', sameSite: 'none', secure: true});
			setCookies('role', 'user', { path: '/', sameSite: 'none', secure: true})
			return "Success"
		}
	}

	const logout = () => {
		['token', 'id'].forEach(obj => removeCookie(obj));
		router.replace('/login');
	}

	const value = useMemo(
		() => ({
			cookies,
			guestLogin,
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