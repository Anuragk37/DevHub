import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userSignIn } from "../../../features/authSlice";

const SignIn = () => {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/account/signin/', {
        identifier: identifier,
        password: password
      })
      dispatch(userSignIn(response.data))
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center h-full">
      <h2 className="text-5xl font-bold mb-10 text-purple-800">Welcome Back</h2>
      <div className="w-full bg-white shadow-equel rounded-3xl shadow-purple-300 p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              className="shadow-equel shadow-purple-200 appearance-none  rounded-full w-full py-3 px-6 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
              id="identifier"
              type="text"
              placeholder="Username, email or phone number"
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>
          <div>
            <input
              className="shadow-equel shadow-purple-200 appearance-none rounded-full w-full py-3 px-6 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
              id="password"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <Link to="/forgot-password" className="text-purple-600 hover:text-purple-800 transition duration-300">
              Forgot Password?
            </Link>
          </div>
          <div className="flex items-center justify-center pt-4">
            <button
              className="bg-purple-800 hover:bg-purple-900 text-white font-bold py-2 px-8 rounded-full focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105"
              type="submit">
              Sign In
            </button>
          </div>
        </form>
      </div>
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-purple-600 hover:text-purple-800 font-semibold transition duration-300">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;