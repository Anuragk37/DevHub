import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa'; // You need to install react-icons package
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import{userSignOut} from '../../features/authSlice'

function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isUserAuthenticated);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };
  const handleLogout = () => {
    dispatch(userSignOut())
  };

  return (
    <div className='max-w-screen h-16 px-4 md:px-20 shadow-md flex items-center justify-between relative'>
      <div>
        <h1 className='text-2xl md:text-3xl font-bold text-purple-900'>DevHub</h1>
      </div>
      <div className='flex items-center'>
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
      {!isAuthenticated ? (
        <div className='flex items-center space-x-4'>
          <Link to={'/signin'}>
            <button className='hover:bg-purple-950 text-purple-900 hover:text-white font-bold py-1 px-4 rounded-3xl focus:outline-none focus:shadow-outline'>
              Sign In
            </button>
          </Link>
          <Link to={'/signup'}>
            <button className='bg-purple-900 hover:bg-purple-950 text-white font-bold py-1 px-4 rounded-3xl focus:outline-none focus:shadow-outline'>
              Sign Up
            </button>
          </Link>
        </div>
      ) : (
        <div className='relative'>
          <div className='flex items-center space-x-4'>
            <button className='bg-purple-900 hover:bg-purple-950 text-white font-bold py-1 px-4 rounded-3xl focus:outline-none focus:shadow-outline'>
              Create post
            </button>
            <img 
              src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fbeforeigosolutions.com%2Fpascale-atkinson%2Fattachment%2Fdummy-profile-pic-300x300-1%2F&psig=AOvVaw2gC72B1oJJNv-ObhcqiW_Q&ust=1718449672497000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCKj3wYP62oYDFQAAAAAdAAAAABAE" 
              className="w-7 h-7 rounded-full border border-black cursor-pointer" 
              onClick={() => setShowMenu(!showMenu)}
              alt="" 
            />
          </div>
          {showMenu && (
            <div className='absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10'>
              <div className='flex flex-col p-2'>
                <h4 className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>Profile</h4>
                <h4 className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>Settings</h4>
                <h4 className='px-4 py-2 hover:bg-gray-100 cursor-pointer' onClick={handleLogout}>Logout</h4>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Header;
