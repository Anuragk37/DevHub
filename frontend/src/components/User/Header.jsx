import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Add useLocation
import { useSelector, useDispatch } from 'react-redux';
import { userSignOut } from '../../features/authSlice';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import defaultPic from '../../assets/default.jpg';
import toast, { Toaster } from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [profilePic, setProfilePic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const location = useLocation(); // Add useLocation

  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isUserAuthenticated);
  const accessToken = useSelector((state) => state.auth.userAccessToken);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.get(`/article/search/`, {
        params: {
          keyword: searchQuery
        }
      });
      console.log(response.data);
      navigate('/user/search-results', { state: { results: response.data } }); // Change to absolute path
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleLogout = () => {
    dispatch(userSignOut());
  };

  const getUser = async () => {
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      const userId = decodedToken.user_id;
      const response = await axios.get(`http://127.0.0.1:8000/api/account/user/${userId}/`);
      
      setProfilePic(`http://127.0.0.1:8000${response.data.profile_pic}`);
    }
  };

  useEffect(() => {
    getUser();
  }, [accessToken]);

  return (
    <div className='fixed top-0 left-0 right-0 z-50 bg-white shadow-md'>
      <div className='max-w-screen h-16 px-4 md:px-20 flex items-center justify-between relative'>
        <div>
          <Link to={'/'}><h1 className='text-2xl md:text-3xl font-bold text-purple-900'>DevHub</h1></Link>
        </div>
        <form onSubmit={handleSearch} className='flex-grow mx-4 max-w-2xl'>
          <div className='relative'>
            <input 
              type="text" 
              className='w-full py-2 px-4 pr-10 text-sm bg-gray-100 border border-transparent rounded-full focus:outline-none focus:bg-white focus:border-purple-500 transition-colors duration-300'
              placeholder='Search DevHub...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit"
              className='absolute right-0 top-0 mt-2 mr-3 text-purple-900 hover:text-purple-700 focus:outline-none'
            >
              <FaSearch className='text-xl' />
            </button>
          </div>
        </form>
        {!isAuthenticated ? (
          <div className='flex items-center space-x-4'>
            <Link to={'/signin'}>
              <button className='hover:bg-purple-900 text-purple-900 hover:text-white font-bold py-1 px-4 rounded-3xl focus:outline-none focus:shadow-outline transition-colors duration-300'>
                Sign In
              </button>
            </Link>
            <Link to={'/signup'}>
              <button className='bg-purple-800 hover:bg-purple-900 text-white font-bold py-1 px-4 rounded-3xl focus:outline-none focus:shadow-outline transition-colors duration-300'>
                Sign Up
              </button>
            </Link>
          </div>
        ) : (
          <div className='relative'>
            <div className='flex items-center space-x-4'>
              <Link to={'/user/create-article/'}>
                <button className='bg-purple-900 hover:bg-purple-950 text-white font-bold py-1 px-4 rounded-3xl focus:outline-none focus:shadow-outline transition-colors duration-300'>
                  Create post
                </button>
              </Link>
              <img
                src={profilePic ? profilePic : defaultPic}
                className="w-8 h-8 rounded-full border-2 border-purple-500 cursor-pointer object-cover"
                onClick={() => setShowMenu(!showMenu)}
                alt="Profile"
              />
            </div>
            {showMenu && (
              <div className='absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10'>
                <div className='flex flex-col p-2'>
                  <Link to={'/user/profile'}><h4 className='px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200'>Profile</h4></Link>
                  <h4 className='px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200'>Settings</h4>
                  <h4 className='px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200' onClick={handleLogout}>Logout</h4>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}

export default Header;
