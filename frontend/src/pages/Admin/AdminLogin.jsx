import React from 'react'

const AdminLogin = () => {
  return (
   <div className='w-screen h-screen bg-blue-100 flex justify-center items-center'>
  <div className='w-full max-w-md bg-blue-950 rounded-lg shadow-lg shadow-blue-600 p-12'>
    <form className='w-full flex flex-col justify-center items-center space-y-4'>
      <div className="w-full">
        <input
          className="appearance-none border rounded-3xl w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          type="email"
          placeholder="Email"
        />
      </div>
      <div className="w-full">
        <input
          className="appearance-none border rounded-3xl w-full py-2 px-3 mb-5 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          placeholder="Password"
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
