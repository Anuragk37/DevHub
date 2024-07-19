import React, { useEffect, useState } from 'react';
import { FaCalendar, FaUsers, FaHashtag, FaLink, FaRegBell } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const CommunityDetail = () => {
  const [activeTab, setActiveTab] = useState('about');
  const location = useLocation();
  const community = location.state.community;

  useEffect(() => {
    console.log(community);
  }, [community]);

  return (
    <div className="min-h-screen w-screen bg-gray-100 font-sans">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-700 h-48 relative">
        {/* <img src={community.banner_url || "/default-banner.jpg"} alt="Community Banner" className="w-full h-full object-cover opacity-70" /> */}
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">{community.name}</h1>
        </div>
      </div>

      {/* Profile and buttons */}
      <div className="w-11/12 lg:w-9/12 mx-auto px-4 relative">
        <div className="flex justify-end space-x-2 mt-4">
      
          <button className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300">
            Join
          </button>
        </div>
        <div className="absolute top-0 left-4 -mt-16">
          <div className="bg-white rounded-full p-1 shadow-lg">
            <div className="bg-green-700 rounded-full w-32 h-32 flex items-center justify-center overflow-hidden">
              <img src={community.profile_pic_url} alt="" className='w-full h-full object-cover'/>
            </div>
          </div>
        </div>
      </div>

      {/* Community info */}
      <div className="w-11/12 lg:w-9/12 mx-auto mt-8 px-8">
        <h1 className="text-3xl font-bold text-gray-800 mt-2">{community.name}</h1>
        <p className="text-gray-600 mt-2 text-lg">{community.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-gray-600">
          <div className="flex items-center">
            <FaUsers className="mr-2" />
            <span>{community.member_count || 0} members</span>
          </div>
          <div className="flex items-center">
            <FaCalendar className="mr-2" />
            <span>Created on {new Date(community.created_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <FaHashtag className="mr-2" />
            <span>{community.category || 'Uncategorized'}</span>
          </div>
        </div>
      </div>

      {/* Content wrapper */}
      <div className="w-11/12 lg:w-8/12 mx-auto mt-8 bg-white rounded-lg shadow-md overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b">
          {['about', 'rules', 'discussions', 'events'].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-3 px-4 font-semibold transition duration-300 ${
                activeTab === tab ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-purple-100'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'about' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">About {community.name}</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">{community.long_description || community.description}</p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Quick Info</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <FaUsers className="mr-2 text-purple-600" />
                    <span><strong>{community.member_count || 0}</strong> active members</span>
                  </li>
                  <li className="flex items-center">
                    <FaCalendar className="mr-2 text-purple-600" />
                    <span>Founded on <strong>{new Date(community.created_date).toLocaleDateString()}</strong></span>
                  </li>
                  <li className="flex items-center">
                    <FaLink className="mr-2 text-purple-600" />
                    <a href={community.website} className="text-blue-600 hover:underline">{community.website}</a>
                  </li>
                </ul>
              </div>
            </div>
          )}
          {activeTab === 'rules' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Community Guidelines</h2>
              <div className="space-y-4">
                {community.rules && community.rules.split('\n').map((rule, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'discussions' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Recent Discussions</h2>
              <p className="text-gray-600">Discussion forum content would go here.</p>
            </div>
          )}
          {activeTab === 'events' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
              <p className="text-gray-600">Community events calendar would go here.</p>
            </div>
          )}
        </div>
      </div>
   
    </div>
  );
};

export default CommunityDetail;