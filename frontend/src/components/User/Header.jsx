import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa'; // You need to install react-icons package
import { Link } from 'react-router-dom';

function Header() {
  const [showSearch, setShowSearch] = useState(false);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <div className='max-w-screen h-16 px-4 md:px-20 shadow-md flex items-center justify-between'>
      <div>
        <h1 className='text-2xl md:text-3xl font-bold text-purple-900'>DevHub</h1>
      </div>
      <div className='flex items-center  '>
        <div className={`${showSearch ? 'block' : 'hidden'} md:block`}>
          <input 
            type="text" 
            className='shadow shadow-purple-200 appearance-none border rounded-3xl w-full py-2 px-7 text-placeholder text-gray-700 leading-tight focus:outline-none focus:shadow-outline' 
            placeholder='Search'
          />
        </div>
        <button 
          className='md:hidden ml-4 p-2' 
          onClick={toggleSearch}
        >
          <FaSearch className='text-purple-900 text-2xl'/>
        </button>
      </div>
      <div className='flex items-center space-x-4'>
        <Link to={'/signin'}>
        <button className='hover:bg-purple-950 text-purple-900 hover:text-white font-bold py-1 px-4 rounded-3xl focus:outline-none focus:shadow-outline'>
          Sign In
        </button></Link>
        <Link to={'/signup'}>
        <button className='bg-purple-900 hover:bg-purple-950 text-white font-bold py-1 px-4 rounded-3xl focus:outline-none focus:shadow-outline'>
          Sign Up
        </button></Link>
      </div>
    </div>
  );
}

export default Header;
