import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa'; // You need to install react-icons package
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userSignOut } from '../../features/authSlice';
import {jwtDecode} from 'jwt-decode'; // Import without destructuring
import axios from 'axios';
import defaultPic from '../../assets/default.jpg';
import toast ,{Toaster} from 'react-hot-toast';

function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isUserAuthenticated);
  const accessToken = useSelector((state) => state.auth.userAccessToken);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const handleLogout = () => {
    dispatch(userSignOut());
  };

  const getUser = async () => {
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      const userId = decodedToken.user_id;
      const response = await axios.get(`http://127.0.0.1:8000/api/account/user/${userId}/`);
      setProfilePic(response.data.profile_pic);
    }
  };

  useEffect(() => {
    getUser();
  }, [accessToken]);

  return (
    <div className='fixed top-0 left-0 right-0 z-50 bg-white shadow-md'>
      <div className='max-w-screen h-16 px-4 md:px-20 flex items-center justify-between relative'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-purple-900'>DevHub</h1>
        </div>
        <div className='flex items-center'>
          <div className={`${showSearch ? 'block' : 'hidden'} md:block relative`}>
            <input 
              type="text" 
              className='shadow shadow-purple-200 appearance-none border rounded-3xl w-full py-2 px-7 text-placeholder text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:w-96' 
              placeholder='Search'
            />
            {showSearch && (
              <button 
                className='absolute right-0 top-0 mt-2 mr-2' 
                onClick={toggleSearch}
              >
                <FaSearch className='text-purple-900 text-2xl' />
              </button>
            )}
          </div>
          <button 
            className='md:hidden ml-4 p-2' 
            onClick={toggleSearch}
          >
            <FaSearch className='text-purple-900 text-2xl' />
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
              <Link to={'/user/create-article/'}>
                <button className='bg-purple-900 hover:bg-purple-950 text-white font-bold py-1 px-4 rounded-3xl focus:outline-none focus:shadow-outline'>
                  Create post
                </button>
              </Link>
              <img
                src={profilePic ? profilePic : defaultPic}
                className="w-7 h-7 rounded-full border cursor-pointer"
                onClick={() => setShowMenu(!showMenu)}
                alt=""
              />
            </div>
            {showMenu && (
              <div className='absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10'>
                <div className='flex flex-col p-2'>
                  <Link to={'/user/profile'}><h4 className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>Profile</h4></Link>
                  <h4 className='px-4 py-2 hover:bg-gray-100 cursor-pointer'>Settings</h4>
                  <h4 className='px-4 py-2 hover:bg-gray-100 cursor-pointer' onClick={handleLogout}>Logout</h4>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
    </div>
    
  );
}

export default Header;
