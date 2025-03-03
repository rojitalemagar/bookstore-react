import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const Login = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;

        try {
            const response = await axios.post('http://localhost:5000/api/login', { email, password });
            localStorage.setItem('auth-token', response.data.token);
            navigate('/');
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <form onSubmit={handleLogin} className="bg-white p-8 shadow-md rounded">
                <h1 className="text-2xl font-bold mb-4">Login</h1>
                <input name="email" type="email" placeholder="Email" required className="border p-2 w-full mb-2" />
                <input name="password" type="password" placeholder="Password" required className="border p-2 w-full mb-2" />
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                <button type="submit" className="bg-blue-500 text-white p-2 w-full">Login</button>
                <p className="mt-2">Don't have an account? <Link to='/signup' className='text-blue-500'>Sign Up</Link></p>
            </form>
        </div>
    );
};

export default Login;