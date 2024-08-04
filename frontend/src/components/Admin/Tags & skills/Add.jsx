import axios from 'axios'
import React, { useState } from 'react'

const Add = ({add, error}) => {
   const[name, setName] = useState('')

   const handleSubmit = async (e) => {
      e.preventDefault()
      await add(name)
      setName('')
   }
   
  return (
    <div className='w-full bg-white rounded-lg shadow-lg p-6'>
      <h1 className='text-2xl text-center text-sky-950 font-bold mb-6'>Add New Skill</h1>
      <form className='w-full space-y-4' onSubmit={handleSubmit}>
        <div className="w-full">
          <input
            className="appearance-none border rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="identifier"
            type="text"
            value={name}
            placeholder="Enter skill name"
            onChange={(e) => setName(e.target.value)}
          />
          {error && <p className='text-red-600 text-sm mt-1'>{error}</p>}
        </div>
        
        <div className="flex justify-center">
          <button className='w-full bg-blue-900 sm:w-1/2 bg-sky-950 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline hover:bg-sky-900 transition duration-300' type="submit">
            Add
          </button>
        </div>
      </form>
    </div>
  )
}

export default Add
