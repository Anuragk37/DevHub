import React, { useEffect, useState, useRef } from 'react';
import { FaSearch, FaBell, FaPlus, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userSignOut } from '../../features/authSlice';
import {jwtDecode} from 'jwt-decode'; // Remove the curly braces for jwtDecode
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
  const [showMobileSearch, setShowMobileSearch] = useState(false);
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
      setShowMobileSearch(false);
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
      console.error('Error fetching search results:', error);
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

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const SearchBar = ({ isMobile = false }) => {
    // Ensure the input field stays focused after typing
    useEffect(() => {
      if (searchRef.current) {
        searchRef.current.focus();
      }
    }, [searchQuery]);

    return (
      <div>
      <form onSubmit={handleSearch} className='w-full'>
        <div className='relative'>
          <input 
            type="text" 
            className='w-full py-2 px-4 pr-10 text-sm bg-gray-100 border border-transparent rounded-full focus:outline-none focus:bg-white focus:border-purple-500 transition-colors duration-300'
            placeholder='Search DevHub...'
            value={searchQuery}
            onChange={handleSearchInputChange}
            ref={searchRef} // Attach the ref here
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
    );
  };

  return (
    <div className='fixed top-0 left-0 right-0 z-50 bg-white shadow-md'>
      <div className='max-w-7xl mx-auto h-16 px-4 md:px-8 flex items-center justify-between relative'>
        <div className='flex items-center'>
          <Link to={'/'}>
            <h1 className='text-2xl md:text-3xl font-bold text-purple-900'>DevHub</h1>
          </Link>
        </div>
        <div ref={searchRef} className='flex-grow mx-4 max-w-2xl relative hidden md:block'>
          <SearchBar />
        </div>
        {!isAuthenticated ? (
          <div className='flex items-center space-x-2 md:space-x-4'>
            <button 
              onClick={toggleMobileSearch}
              className='text-purple-900 hover:text-purple-700 focus:outline-none md:hidden'
            >
              <FaSearch className='text-xl' />
            </button>
            <Link to={'/signin'}>
              <button className='hover:bg-purple-900 text-purple-900 hover:text-white font-bold py-1 px-2 md:px-4 rounded-3xl focus:outline-none focus:shadow-outline transition-colors duration-300 text-sm md:text-base'>
                Sign In
              </button>
            </Link>
            <Link to={'/signup'}>
              <button className='bg-purple-800 hover:bg-purple-900 text-white font-bold py-1 px-2 md:px-4 rounded-3xl focus:outline-none focus:shadow-outline transition-colors duration-300 text-sm md:text-base'>
                Sign Up
              </button>
            </Link>
          </div>
        ) : (
          <div className='flex items-center space-x-4'>
            <button 
              onClick={toggleMobileSearch}
              className='text-purple-900 hover:text-purple-700 focus:outline-none md:hidden'
            >
              <FaSearch className='text-xl' />
            </button>
            <Link  to={'/user/create-article'}>
              <FaPlus className='text-xl text-purple-900 hover:text-purple-700' />
            </Link>
            <div className='relative'>
              <button 
                className='relative text-xl text-purple-900 hover:text-purple-700 focus:outline-none'
                onClick={handleNotificationClick}
              >
                <FaBell />
                {notificationCount > 0 && (
                  <span className='absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full'>
                    {notificationCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className='absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10'>
                  <Notification userId={userId} />
                </div>
              )}
            </div>
            <div className='relative'>
              <button 
                className='relative z-10 block rounded-full focus:outline-none'
                onClick={() => setShowMenu(!showMenu)}
              >
                <img 
                  className='h-8 w-8 rounded-full object-cover'
                  src={profilePic ? profilePic : defaultPic} 
                  alt='User avatar'
                />
              </button>
              {showMenu && (
                <div className='absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10'>
                  <Link 
                    to={`/user/profile/${userId}`} 
                    className='block px-4 py-2 text-gray-700 hover:bg-gray-100'
                  >
                    Profile
                  </Link>
                  <Link 
                    to={'/user/saved-articles'} 
                    className='block px-4 py-2 text-gray-700 hover:bg-gray-100'
                  >
                    Saved Articles
                  </Link>
                  <Link 
                    to={'/user/my-articles'} 
                    className='block px-4 py-2 text-gray-700 hover:bg-gray-100'
                  >
                    My Articles
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className='w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none'
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Toaster position='top-right' reverseOrder={false} />
      {showMobileSearch && (
        <div className='bg-white p-2 shadow-md md:hidden'>
          <SearchBar isMobile />
          <button 
            className='text-purple-900 hover:text-purple-700 mt-2 focus:outline-none'
            onClick={toggleMobileSearch}
          >
            <FaTimes className='text-2xl' />
          </button>
        </div>
      )}
    </div>
  );
}

export default Header;
