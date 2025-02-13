import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Logo/logo.png';

const ErrorPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <img 
                    src={logo}
                    alt="Error Illustration"
                    className="max-w-md mx-auto w-full"
                />
                <h1 className="text-6xl font-bold text-[#FF640D] mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
                <p className="text-gray-600 mb-8">
                    Oops! Looks like you've wandered off your fitness track.
                    Let's get you back to your workout routine!
                </p>
                <Link 
                    to="/"
                    className="bg-[#FF640D] text-white px-8 py-3 rounded-lg hover:bg-[#e55a0c] transition-colors duration-300 inline-block font-semibold"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;