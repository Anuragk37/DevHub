import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { adminSignOut } from '../../features/authSlice';
import { Link } from 'react-router-dom';

const SideBar = () => {
  const [isEcommerceOpen, setIsEcommerceOpen] = useState(false);
  const [isArticlesOpen, setIsArticlesOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDropdown = (setter) => () => {
    setter(prev => !prev);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    dispatch(adminSignOut());
    navigate('/admin-login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-gray-800 text-white"
        onClick={toggleSidebar}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>

      <aside
        id="sidebar-multi-level-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-admin-sideBar flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-center mb-10 mt-4">
              <h1 className="text-3xl font-bold text-white">Admin</h1>
            </div>
            <ul className="space-y-2 font-medium">
              <li>
                <Link to="/admin/dashboard">
                  <p className={`flex items-center p-2 text-white rounded-lg hover:bg-blue-700 group ${isActive('/admin/dashboard') ? 'bg-blue-700' : ''}`}>
                    <span className="ml-3">Dashboard</span>
                  </p>
                </Link>
              </li>
              
              <li>
                <button
                  type="button"
                  className={`flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-blue-700 ${
                    isActive('/admin/user-management') || isActive('/admin/reported-users') ? 'bg-blue-700' : ''
                  }`}
                  aria-controls="dropdown-example"
                  onClick={toggleDropdown(setIsEcommerceOpen)}
                >
                  <span className="flex-1 ml-3 text-left whitespace-nowrap">User Management</span>
                  <svg
                    className={`w-3 h-3 transform transition-transform ${isEcommerceOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                  </svg>
                </button>
                <ul id="dropdown-example" className={`${isEcommerceOpen ? '' : 'hidden'} py-2 space-y-2`}>
                  <li>
                    <Link to="/admin/user-management">
                      <p className={`flex items-center w-full p-2 text-white transition duration-75 rounded-lg pl-11 group hover:bg-blue-700 ${
                        isActive('/admin/user-management') ? 'bg-blue-600' : ''
                      }`}>Users</p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/reported-users">
                      <p className={`flex items-center w-full p-2 text-white transition duration-75 rounded-lg pl-11 group hover:bg-blue-700 ${
                        isActive('/admin/reported-users') ? 'bg-blue-600' : ''
                      }`}>Reported Users</p>
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link to="/admin/skills">
                  <p className={`flex items-center p-2 text-white rounded-lg hover:bg-blue-700 group ${isActive('/admin/skills') ? 'bg-blue-700' : ''}`}>
                    <span className="flex-1 ml-3 whitespace-nowrap">Skills</span>
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/admin/tags">
                  <p className={`flex items-center p-2 text-white rounded-lg hover:bg-blue-700 group ${isActive('/admin/tags') ? 'bg-blue-700' : ''}`}>
                    <span className="flex-1 ml-3 whitespace-nowrap">Tags</span>
                  </p>
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className={`flex items-center w-full p-2 text-white transition duration-75 rounded-lg group hover:bg-blue-700 ${
                    isActive('/admin/articles') || isActive('/admin/reported-articles') ? 'bg-blue-700' : ''
                  }`}
                  aria-controls="dropdown-articles"
                  onClick={toggleDropdown(setIsArticlesOpen)}
                >
                  <span className="flex-1 ml-3 text-left whitespace-nowrap">Articles</span>
                  <svg
                    className={`w-3 h-3 transform transition-transform ${isArticlesOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                  </svg>
                </button>
                <ul id="dropdown-articles" className={`${isArticlesOpen ? '' : 'hidden'} py-2 space-y-2`}>
                  <li>
                    <Link to="/admin/articles/">
                      <p className={`flex items-center w-full p-2 text-white transition duration-75 rounded-lg pl-11 group hover:bg-blue-700 ${
                        isActive('/admin/articles/') ? 'bg-blue-600' : ''
                      }`}>Articles</p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/reported-articles/">
                      <p className={`flex items-center w-full p-2 text-white transition duration-75 rounded-lg pl-11 group hover:bg-blue-700 ${
                        isActive('/admin/reported-articles/') ? 'bg-blue-600' : ''
                      }`}>Reported Articles</p>
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link to="/admin/comments">
                  <p className={`flex items-center p-2 text-white rounded-lg hover:bg-blue-700 group ${isActive('/admin/comments') ? 'bg-blue-700' : ''}`}>
                    <span className="flex-1 ml-3 whitespace-nowrap">Comments</span>
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/admin/community-management">
                  <p className={`flex items-center p-2 text-white rounded-lg hover:bg-blue-700 group ${isActive('/admin/community-management') ? 'bg-blue-700' : ''}`}>
                    <span className="flex-1 ml-3 whitespace-nowrap">Community</span>
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/admin/team-management">
                  <p className={`flex items-center p-2 text-white rounded-lg hover:bg-blue-700 group ${isActive('/admin/team-management') ? 'bg-blue-700' : ''}`}>
                    <span className="flex-1 ml-3 whitespace-nowrap">Teams</span>
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/admin/help">
                  <p className={`flex items-center p-2 text-white rounded-lg hover:bg-blue-700 group ${isActive('/admin/help') ? 'bg-blue-700' : ''}`}>
                    <span className="flex-1 ml-3 whitespace-nowrap">Help</span>
                  </p>
                </Link>
              </li>
            </ul>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-2 text-white transition duration-75 rounded-lg group hover:bg-blue-700"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-12v1m0 6v6m0-12v6m0 0H3m0 0h10m0 0V7m0 10V7"></path>
            </svg>
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>
    </div>
  );
};

export default SideBar;