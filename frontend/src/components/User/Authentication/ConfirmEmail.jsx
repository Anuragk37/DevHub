import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../../utils/axiosInstance'
import axios from 'axios'

const ConfirmEmail = () => {
   const [email, setEmail] = useState('')

   const navigate = useNavigate()

   const handleSubmit = async (e) => {
      e.preventDefault()
      try {
         const response = await axios.post('http://127.0.0.1:8000/api/account/resend-otp/', {
         email: email,
         })
         navigate('/verify-otp', { state: { isSignup: false, email: email } })
      } catch (error) {
         console.log(error)
      }
   }
  return (
   <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center h-full">
      <h2 className="text-5xl font-bold mb-10 text-purple-800">Forgot Password </h2>
      <div className="w-full bg-white shadow-equel rounded-3xl shadow-purple-300 p-8">
      <form className="space-y-6" onSubmit={handleSubmit}>
         <div>
            <input
            className="shadow-equel shadow-purple-200 appearance-none  rounded-full w-full py-3 px-6 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
            id="identifier"
            type="text"
            placeholder="enter your email"
            onChange={(e) => setEmail(e.target.value)}
            />
         </div>
   
         <div className="flex items-center justify-center pt-4">
            <button
            className="bg-purple-800 hover:bg-purple-900 text-white font-bold py-2 px-8 rounded-full focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105"
            type="submit">
            Submit
            </button>
         </div>
      </form>
      </div>
   </div>
  )
}

export default ConfirmEmail
