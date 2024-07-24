import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const location = useLocation();
  const email = location.state?.email || '';

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    try {
      await axios.post('http://127.0.0.1:8000/api/account/reset-password/', {
        password: password,
        email: email,
      });
      navigate('/signin');
    } catch (error) {
      console.log(error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center h-full">
      <h2 className="text-5xl font-bold mb-10 text-purple-800">Welcome Back</h2>
      <div className="w-full bg-white shadow-equel rounded-3xl shadow-purple-300 p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              className="shadow-equel shadow-purple-200 appearance-none rounded-full w-full py-3 px-6 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <input
              className="shadow-equel shadow-purple-200 appearance-none rounded-full w-full py-3 px-6 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
              id="confirm-password"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (e.target.value !== password) {
                  setErrorMessage('Passwords do not match');
                } else {
                  setErrorMessage('');
                }
              }}
            />
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </div>
          <div className="flex items-center justify-center pt-4">
            <button
              className={`bg-purple-800 hover:bg-purple-900 text-white font-bold py-2 px-8 rounded-full focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105 ${
                password !== confirmPassword ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              type="submit"
              disabled={password !== confirmPassword}
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
