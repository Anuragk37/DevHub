import axios from 'axios'
import React, { useState } from 'react'

const Add = ({add,tag,error}) => {
   const[name ,setName ] = useState('')

   const handleSubmit = async (e) => {
      e.preventDefault()
      await add(name)
      setName('')
   }
   
  return (
    <div className='w-full h-full '>
      <div className='w-full h-full bg-white p-10 rounded-xl shadow-equel'>
         <h1 className='text-2xl text-center text-sky-950 font-bold mb-7'>Add New {tag?'tag':'skill'}</h1>
         <form className='w-full flex flex-col justify-center items-center space-y-4' onSubmit={handleSubmit}>
            <div className="w-full">
            <input
               className="appearance-none border rounded-3xl w-full py-2 px-3 mb-4 text-gray-700 shadow-equel leading-tight focus:outline-none focus:shadow-outline"
               id="identifier"
               type="text"
               value={name}
               placeholder="enter "
               onChange={(e) => setName(e.target.value)}
            />
            {error&&<p className='text-red-800 text-center'>{error}</p>}
            </div>
            
            
            <button className='w-1/4 bg-sky-950 text-white 50 font-bold py-2 px-1 bg-blue-900  rounded-3xl focus:outline-none focus:shadow-outline' type="submit">
            Add
            </button>
         </form>

      </div>      
    </div>
  )
}

export default Add
