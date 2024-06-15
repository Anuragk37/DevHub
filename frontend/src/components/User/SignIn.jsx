import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {userSignIn} from '../../features/authSlice'

const SignIn = () => {

  const [identifer,setIdentifier] = useState('')
  const [password,setPassword] = useState('')

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      const response = await axios.post('http://127.0.0.1:8000/api/account/signin/',{
        identifier:identifer,
        password:password
      })
      dispatch(userSignIn(response.data))
      navigate('/')
    }catch(error){
      console.log(error)
    }
    
  }
  return (
      <div className="w-full max-w-sm mx-auto  bg-white shadow-equel rounded-2xl shadow-purple-300 p-3">
        <form className="bg-white shadow-equal rounded-lg px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
          
          <div className="mb-4">
            <input
              className="shadow shadow-purple-200 appearance-none border rounded-3xl w-full py-2 px-3 text-placeholder text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="identifier"
              type="text"
              placeholder="Username,email or phone number"
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              className="shadow shadow-purple-200 appearance-none border rounded-3xl w-full py-2 px-3 text-placeholder text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-purple-800 hover:bg-purple-950 text-white font-bold py-1 px-4 rounded-3xl focus:outline-none focus:shadow-outline"
              type="submit">
              Sign In
            </button>
          </div>
        </form>
      </div>
  );
};

export default SignIn;
