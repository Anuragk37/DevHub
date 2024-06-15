import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { adminSignOut } from '../../features/authSlice';

const SideBar = () => {
  const [isEcommerceOpen, setIsEcommerceOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsEcommerceOpen(!isEcommerceOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    dispatch(adminSignOut())
    navigate('/admin-login')
  };

  return (
    <div>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-gray-800 text-white"
        onClick={toggleSidebar}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>

      <aside id="sidebar-multi-level-sidebar" className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`} aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 flex flex-col justify-between">
          <div>
            <div className='flex items-center justify-center mb-10 mt-4'>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin</h1>
            </div>
            <ul className="space-y-2 font-medium">
              <li>
                <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <span className="ml-3">Dashboard</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <span className="flex-1 ml-3 whitespace-nowrap">User Management</span>         
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <span className="flex-1 ml-3 whitespace-nowrap">Skills</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <span className="flex-1 ml-3 whitespace-nowrap">Tags</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">        
                  <span className="flex-1 ml-3 whitespace-nowrap">Articles</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">        
                  <span className="flex-1 ml-3 whitespace-nowrap">Comments</span>
                </a>
              </li>
              <li>
                <button 
                  type="button" 
                  className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" 
                  aria-controls="dropdown-example" 
                  onClick={toggleDropdown}
                >
                  <span className="flex-1 ml-3 text-left whitespace-nowrap">Community</span>
                  <svg className={`w-3 h-3 transform transition-transform ${isEcommerceOpen ? 'rotate-180' : ''}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
                </button>
                <ul id="dropdown-example" className={`${isEcommerceOpen ? '' : 'hidden'} py-2 space-y-2`}>
                  <li>
                    <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Products</a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Billing</a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Invoice</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <span className="flex-1 ml-3 whitespace-nowrap">Teams</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <span className="flex-1 ml-3 whitespace-nowrap">Help</span>
                </a>
              </li>
            </ul>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
          >
            <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-12v1m0 6v6m0-12v6m0 0H3m0 0h10m0 0V7m0 10V7"></path>
            </svg>
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>
    </div>
  );
}

export default SideBar;
