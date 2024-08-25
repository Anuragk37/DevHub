import React, { useState } from 'react';
import { FaRss, FaStar, FaUsers, FaInfoCircle, FaClipboardList, FaBars, FaTimes, FaAngleRight } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: FaRss, text: 'Feed', link: '/' },
    { icon: FaStar, text: 'Recommended', link: '/recommended' },
    { icon: FaUsers, text: 'Teams', link: '/user/my-team' },
    { icon: FaUsers, text: 'Community', link: '/user/your-communities' },
    { icon: FaInfoCircle, text: 'About', link: '/about' },
    { icon: FaClipboardList, text: 'Feedback', link: 'user/feedback' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {!isOpen && (
        <button
        className="fixed top-16 left-1 p-3 bg-purple-600 text-white rounded-full shadow-lg z-50 md:hidden"
        onClick={toggleSidebar}
      >
        <FaAngleRight />
      </button>
      )}
      <div
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } mt-0 lg:mt-4 fixed left-0  h-screen w-72 bg-white text-purple-900 shadow-4xl rounded-md px-5 transition-all duration-300 ease-in-out z-40 overflow-y-auto lg:translate-x-0 lg:static lg:h-[86vh] lg:shadow-none flex flex-col`}
      >
        <div className="flex justify-between items-center mb-8">
          <button
            className="text-purple-600 md:hidden"
            onClick={toggleSidebar}
          >
            <FaTimes />
          </button>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.link;
              return (
                <li key={index}>
                  <Link
                    to={item.link}
                    className={`flex items-center py-3 px-4 rounded-lg transition duration-200 ${
                      isActive
                        ? 'bg-purple-800 text-white'
                        : 'hover:bg-purple-50 text-gray-700 hover:text-purple-800'
                    }`}
                    onClick={toggleSidebar}
                  >
                    <item.icon className={`mr-3 ${isActive ? 'text-white' : 'text-purple-600'}`} />
                    <span className="font-medium">{item.text}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mt-auto mb-4 pt-4 border-t border-purple-200 ">
          <p className="text-sm text-purple-600 text-center">© 2024 DevHub</p>
        </div>
      </div>
    </>
  );
};

export default SideBar;