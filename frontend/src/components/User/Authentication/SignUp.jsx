import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import toast, { Toaster } from 'react-hot-toast'
import { userSignIn } from '../../../features/authSlice'

const SignUp = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  
  const schema = yup.object().shape({
    fullname: yup.string().required("Fullname is required"),
    username: yup.string().required("Username is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone_number: yup.string().required("Phone number is required"),
    password: yup.string().required("Password is required"),
    confirm_password: yup.string().required("Confirm password is required").oneOf([yup.ref('password')],'Passwords must match')
  })

  const {register, handleSubmit, formState:{errors}, setError} = useForm({resolver:yupResolver(schema)})
  
  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const formDatatoSend = new FormData()
      formDatatoSend.append('fullname', data.fullname)
      formDatatoSend.append('username', data.username)
      formDatatoSend.append('email', data.email)
      formDatatoSend.append('phone_number', data.phone_number)
      formDatatoSend.append('password', data.password)

      const response = await axios.post('http://127.0.0.1:8000/api/account/user/', formDatatoSend)
      toast.success(response.data.message)
      navigate('/verify-otp', { state: { isSignup: true, email: data.email } })
      
    } catch (err) {
      if (err.response && err.response.data) {
        const serverErrors = err.response.data;
        for (const [field, messages] of Object.entries(serverErrors)) {
          setError(field, { type: 'server', message: messages.join(' ') });
        }
      } else {
        setError('form', { type: 'server', message: 'An unexpected error occurred' });
      }
      console.log(err);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center h-full">
      <h2 className="text-5xl font-bold mb-10 text-purple-800">Sign Up</h2>
      <div className="w-full max-w-md mx-auto  bg-white shadow-equel rounded-2xl shadow-purple-300 p-3">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-equal rounded-lg px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <input
            {...register('fullname',{required:true})}
            className="shadow shadow-purple-200 appearance-none border rounded-3xl w-full py-2 px-3 text-placeholder text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="fullname"
            type="text"
            placeholder="Name"
          />
          {errors.fullname && <p className='ps-5 pt-1 text-sm text-red-500'>{errors.fullname?.message}</p>}
        </div>
        <div className="mb-4">
          <input
            {...register('username',{required:true})}
            className="shadow shadow-purple-200 appearance-none border rounded-3xl w-full py-2 px-3 text-placeholder text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Username"
          />
          {errors.username && <p className='ps-5 pt-1 text-sm text-red-500'>{errors.username?.message}</p>}
        </div>
        <div className="mb-4">
          <input
            {...register('email',{required:true})}
            className="shadow shadow-purple-200 appearance-none border rounded-3xl w-full py-2 px-3 text-placeholder text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
          />
          {errors.email && <p className='ps-5 pt-1 text-sm text-red-500'>{errors.email?.message}</p>}
        </div>
        <div className="mb-4">
          <input
            {...register('phone_number',{required:true})}
            className="shadow shadow-purple-200 appearance-none border rounded-3xl w-full py-2 px-3 text-placeholder text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="phone_number"
            type="text"
            placeholder="Phone Number"
          />
          {errors['phone_number'] && <p className='ps-5 pt-1 text-sm text-red-500'>{errors['phone_number']?.message}</p>}
        </div>
        <div className="mb-4">
          <input 
            {...register('password',{required:true})}
            className="shadow shadow-purple-200 appearance-none border rounded-3xl w-full py-2 px-3 text-placeholder text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Password"
          />
          {errors.password && <p className='ps-5 pt-1 text-sm text-red-500'>{errors.password?.message}</p>}
        </div>
        <div className="mb-4">
          <input
            {...register('confirm_password',{required:true})}
            className="shadow shadow-purple-200 appearance-none border rounded-3xl w-full py-2 px-3 text-placeholder text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="confirm_password"
            type="password"
            placeholder="Confirm Password"
          />
          {errors['confirm_password'] && <p className=' ps-5 pt-1 text-sm text-red-500'>{errors['confirm_password']?.message}</p>}
        </div>
        <div className="flex items-center justify-center">
          <button
            className="bg-purple-800 hover:bg-purple-950 text-white font-bold py-1 px-4 rounded-3xl focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span className="ml-2">Signing Up...</span>
              </div>
            ) : (
              'Sign Up'
            )}
          </button>
        </div>
      </form>
      {errors.form && <div className="error-messages"><p>{errors.form.message}</p></div>}
    </div>
  </div>
  )
}

export default SignUp