import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { adminSignIn } from '../../features/authSlice'
import axios from 'axios'

const AdminLogin = () => {
  const[identifier,setIdentifier] = useState('')
  const[password,setPassword] = useState('')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try{
      const response = await axios.post("http://127.0.0.1:8000/api/admin/admin-login/",{
        identifier:identifier,
        password:password
      })
      dispatch(adminSignIn(response.data))
      navigate('/dashboard')
    }catch(error){
      console.log(error)
    }
    
    
  }

  return (
   <div className='w-screen h-screen bg-blue-100 flex justify-center items-center'>
  <div className='w-full max-w-md bg-blue-950 rounded-lg shadow-lg shadow-blue-600 p-12'>
    <form className='w-full flex flex-col justify-center items-center space-y-4' onSubmit={handleSubmit}>
      <div className="w-full">
        <input
          className="appearance-none border rounded-3xl w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="identifier"
          type="text"
          placeholder="Email or username"
          onChange={(e) => setIdentifier(e.target.value)}
        />
      </div>
      <div className="w-full">
        <input
          className="appearance-none border rounded-3xl w-full py-2 px-3 mb-5 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className='w-1/4 bg-white hover:bg-blue-300 text-blue-950 font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline' type="submit">
        Sign In
      </button>
    </form>
  </div>
</div>

  )
}

export default AdminLogin
