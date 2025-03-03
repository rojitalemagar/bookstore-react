import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;

        try {
            await axios.post('http://localhost:5000/api/signup', { email, password });
            navigate('/login');
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <form onSubmit={handleSignup} className="bg-white p-8 shadow-md rounded">
                <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
                <input name="email" type="email" placeholder="Email" required className="border p-2 w-full mb-2" />
                <input name="password" type="password" placeholder="Password" required className="border p-2 w-full mb-2" />
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                <button type="submit" className="bg-blue-500 text-white p-2 w-full">Sign Up</button>
                <p className="mt-2">Already have an account? <Link to='/login' className='text-blue-500'>Login</Link></p>
            </form>
        </div>
    );
};

export default Signup;
