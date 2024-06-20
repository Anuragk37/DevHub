import React, { useState } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {userSignIn} from '../../features/authSlice'
import toast from 'react-hot-toast'

const OtpVerify = () => {
  const [otp, setOtp] = useState('')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const location = useLocation()
  const isSignup = location.state?.isSignup || false

  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      const response = await axios.post('http://127.0.0.1:8000/api/account/verify-otp/', {
        otp,
        is_signup: isSignup
      })
      dispatch(userSignIn(response.data))
      console.log(response.data.message)
      toast.success(response.data.message)
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
         placeholder="Enter otp"
         onChange={(e) => setOtp(e.target.value)}
       />
     </div>
     <div className="flex items-center justify-center">
       <button
         className="bg-purple-800 hover:bg-purple-950 text-white font-bold py-1 px-4 rounded-3xl focus:outline-none focus:shadow-outline"
         type="submit">
         Verify
       </button>
     </div>
   </form>
 </div>
  )
}

export default OtpVerify
