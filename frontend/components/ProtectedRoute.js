import React, { useEffect } from 'react'
import { useAuth } from '../hooks/auth'
import { useRouter } from 'next/router';

function ProtectedRoute(WrappedComponent) {
    const Wrapper = (props) => {
        const { cookies } = useAuth();
        const router = useRouter();
        useEffect(() => {
            if (!cookies.token) {
                console.log("redirecting to login")
                router.replace('/login')
            }
        }, [])
        
        return <WrappedComponent {...props} />;
    };

    return Wrapper;
}

export default ProtectedRoute