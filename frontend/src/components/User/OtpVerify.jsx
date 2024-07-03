import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { userSignIn } from '../../features/authSlice'
import toast from 'react-hot-toast'
import axiosInstance from '../../utils/axiosInstance'

const OtpVerify = () => {
  const [otp, setOtp] = useState('')
  const [timer, setTimer] = useState(120) // Set the initial timer value to 120 seconds (2 minutes)
  const [isExpired, setIsExpired] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const location = useLocation()
  const isSignup = location.state?.isSignup || false
  const email = location.state?.email || false

  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1)
      }, 1000)
      return () => clearInterval(intervalId)
    } else {
      setIsExpired(true)
    }
  }, [timer])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isExpired) {
      toast.error('OTP has expired. Please resend OTP.')
      return
    }
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/account/verify-otp/', {
        otp,
        is_signup: isSignup,
        email: email
      })
      dispatch(userSignIn(response.data))

      toast.success(response.data.message)
      navigate('/skill-selection')
    } catch (error) {
      console.log(error)
    }
  }

  const resendOtp = async () => {
    try {
      const response = await axiosInstance.post('/account/resend-otp/', {
        email: email,
        is_signup: isSignup
      })
      toast.success(response.data.message)
      setTimer(120) // Reset the timer to 120 seconds (2 minutes)
      setIsExpired(false)
    } catch (error) {
      console.log(error)
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    if (minutes > 0) {
      return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds} min`
    }
    return `${seconds} sec`
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center h-full">
      <h2 className="text-5xl font-bold mb-10 text-purple-800">Verify otp</h2>
      <div className="w-full max-w-sm mx-auto bg-white shadow-equel rounded-2xl shadow-purple-300 p-3">
        <form className="bg-white shadow-equal rounded-lg px-8 pt-6 pb-8 mb-4 mt-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              className="shadow shadow-purple-200 appearance-none border rounded-3xl w-full py-2 px-3 text-placeholder text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="identifier"
              type="text"
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-purple-800 hover:bg-purple-950 text-white font-bold py-1 px-4 rounded-3xl focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={isExpired}
            >
              Verify
            </button>
          </div>
          {isExpired && (
            <div className="flex items-center justify-center mt-4 text-gray-700">
              <button
                className="text-purple-800 hover:text-purple-900 font-bold"
                type="button"
                onClick={resendOtp}
              >
                Resend OTP
              </button>
            </div>
          )}
          <div className="flex items-center justify-center mt-4 text-gray-700">
            {isExpired ? 'OTP has expired' : `Time remaining: ${formatTime(timer)}`}
          </div>
        </form>
      </div>
    </div>
  )
}

export default OtpVerify
