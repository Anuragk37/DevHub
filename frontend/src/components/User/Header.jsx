import React, { useEffect, useState, useRef } from 'react';
import { FaSearch, FaBell, FaPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userSignOut } from '../../features/authSlice';
import { jwtDecode } from 'jwt-decode';
import defaultPic from '../../assets/default.jpg';
import toast, { Toaster } from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import Notification from './Notification/Notification';
import useWebSocket from 'react-use-websocket';
import WS_URL from '../../utils/BaseUrls';
import { incrementNotificationCount, resetNotificationCount } from '../../features/notificationSlice';
import useDebounce from '../../CustomHooks/useDebounce';

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profilePic, setProfilePic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchRef = useRef(null);

  const isAuthenticated = useSelector((state) => state.auth.isUserAuthenticated);
  const accessToken = useSelector((state) => state.auth.userAccessToken);
  const notificationCount = useSelector((state) => state.notification.count);

  const decodedToken = accessToken ? jwtDecode(accessToken) : null;
  const userId = decodedToken ? decodedToken.user_id : null;

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { lastMessage } = useWebSocket(
    userId ? `${WS_URL}/notifications/${userId}/?token=${accessToken}` : null,
    {
      shouldReconnect: (closeEvent) => true,
    }
  );

  useEffect(() => {
    if (lastMessage !== null) {
      console.log(lastMessage.data);
      setMessage(lastMessage.data);
      dispatch(incrementNotificationCount());
    }
  }, [lastMessage, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (debouncedSearchQuery) {
      searchArticles(debouncedSearchQuery);
    } else {
      setSearchResults(null);
      setShowSuggestions(false);
    }
  }, [debouncedSearchQuery]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate('/user/search-results', { state: { results: searchResults } });
      setShowSuggestions(false);
    }
  };

  const searchArticles = async (query) => {
    try {
      const response = await axiosInstance.get(`/article/search/`, {
        params: { keyword: query }
      });
      setSearchResults(response.data);
      setShowSuggestions(true);
    } catch (error) {
      toast.error('Error searching articles:', error);
    }
  };

  const handleLogout = () => {
    dispatch(userSignOut());
  };

  const getUser = async () => {
    if (accessToken && userId) {
      try {
        const response = await axiosInstance.get(`/account/user/${userId}/`);
        setProfilePic(response.data.profile_pic);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
  };

  useEffect(() => {
    getUser();
  }, [accessToken, userId]);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    dispatch(resetNotificationCount());
  };

  return (
    <div className='fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-4 sm:px-6 md:px-10'>
      <div className='max-w-screen h-16 md:px-20 flex items-center justify-between relative'>
        <div>
          <Link to={'/'}>
            <h1 className='text-2xl md:text-3xl font-bold text-purple-900'>
              <span className='sm:hidden'>DH</span>
              <span className='hidden sm:inline'>DevHub</span>
            </h1>
          </Link>
        </div>

        <div ref={searchRef} className='flex-grow mx-4 max-w-2xl relative'>
          <form onSubmit={handleSearch}>
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
          {showSuggestions && searchResults && (
            <div className='absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg'>
              {searchResults.articles && searchResults.articles.length > 0 && (
                <div className='p-2'>
                  <h3 className='font-semibold text-gray-700'>Articles</h3>
                  {searchResults.articles.slice(0, 3).map((article) => (
                    <Link key={article.id} to={`/user/view-article/${article.id}`}>
                      <div className='py-1 px-2 hover:bg-gray-100 cursor-pointer'>
                        {article.title}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {searchResults.users && searchResults.users.length > 0 && (
                <div className='p-2'>
                  <h3 className='font-semibold text-gray-700'>Users</h3>
                  {searchResults.users.slice(0, 3).map((user) => (
                    <Link key={user.id} to={`/user/profile/${user.id}`}>
                      <div className='py-1 px-2 hover:bg-gray-100 cursor-pointer'>
                        {user.username}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {searchResults.communities && searchResults.communities.length > 0 && (
                <div className='p-2'>
                  <h3 className='font-semibold text-gray-700'>Communities</h3>
                  {searchResults.communities.slice(0, 3).map((community) => (
                    <div key={community.id} className='py-1 px-2 hover:bg-gray-100 cursor-pointer'>
                      {community.name}
                    </div>
                  ))}
                </div>
              )}
              <div className='p-2 text-center'>
                <button 
                  className='text-purple-600 hover:text-purple-800'
                  onClick={handleSearch}
                >
                  See all results
                </button>
              </div>
            </div>
          )}
        </div>
        {!isAuthenticated ? (
          <div className='flex items-center space-x-2 sm:space-x-4'>
            <Link to={'/signin'}>
              <button className='hover:bg-purple-900 text-purple-900 hover:text-white font-bold py-1 px-2 sm:px-4 rounded-3xl focus:outline-none focus:shadow-outline transition-colors duration-300 text-sm sm:text-base'>
                Sign In
              </button>
            </Link>
            <Link to={'/signup'}>
              <button className='bg-purple-800 hover:bg-purple-900 text-white font-bold py-1 px-2 sm:px-4 rounded-3xl focus:outline-none focus:shadow-outline transition-colors duration-300 text-sm sm:text-base'>
                Sign Up
              </button>
            </Link>
          </div>
        ) : (
          <div className='relative flex items-center space-x-2 sm:space-x-4'>
            <Link className='hidden md:block' to={'/user/create-article/'}>
              <button className='bg-purple-900 hover:bg-purple-950 text-white font-bold py-1 px-4 rounded-3xl focus:outline-none focus:shadow-outline transition-colors duration-300'>
                Create post
              </button>
            </Link>
            <Link className='md:hidden'  to={'/user/create-article'}>
              <FaPlus className='text-xl text-purple-900 hover:text-purple-700' />
            </Link>
            <div className='relative'>
              <FaBell
                className='text-2xl text-purple-900 cursor-pointer'
                onClick={handleNotificationClick}
              />
              {notificationCount > 0 && (
                <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
                  {notificationCount}
                </span>
              )}
              {showNotifications && <Notification lastMessage={message} />}
            </div>
            <img
              src={profilePic ? profilePic : defaultPic}
              className="w-8 h-8 rounded-full border-2 border-purple-500 cursor-pointer object-cover"
              onClick={() => setShowMenu(!showMenu)}
              alt="Profile"
            />
            {showMenu && (
              <div className='absolute right-0 top-full mt-3 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10'>
                <div className='flex flex-col p-2'>
                  <Link to={'/user/my-profile'}><h4 className='px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200'>Profile</h4></Link>
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