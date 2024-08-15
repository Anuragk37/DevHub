import React, { useState } from 'react';
import { FaRss, FaStar, FaUsers, FaInfoCircle, FaClipboardList, FaBars, FaTimes,FaAngleRight } from 'react-icons/fa';
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
    { icon: FaClipboardList, text: 'Feedback', link: '/feedback' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button
        className="fixed top-16 left-1 p-3 bg-purple-600 text-white rounded-full shadow-lg z-50 md:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <FaTimes /> : <FaAngleRight />}
      </button>
      <div
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed  top-24 h-[85vh] w-72 bg-white text-purple-900 shadow-2xl rounded-lg p-6 transition-all duration-300 ease-in-out z-40 overflow-y-auto md:left-[23rem] flex flex-col`}
      >
        <h2 className="text-2xl font-bold mb-8 text-purple-700">DevHub Menu</h2>
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
        <div className="mt-auto pt-4 border-t border-purple-100">
          <p className="text-sm text-purple-600">© 2024 DevHub</p>
        </div>
      </div>
    </>
  );
};

export default SideBar;