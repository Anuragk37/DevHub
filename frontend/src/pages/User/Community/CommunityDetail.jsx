import React, { useEffect, useState } from 'react';
import { FaCalendar, FaUsers, FaHashtag, FaLink, FaInfoCircle, FaBook, FaComments, FaCalendarAlt } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const CommunityDetail = () => {
  const [activeTab, setActiveTab] = useState(0);
  const location = useLocation();
  const community = location.state.community;

  useEffect(() => {
    console.log(community);
  }, [community]);

  return (
    <div className="min-h-screen bg-purple-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-48 relative">
            <img src={community.banner_url || "/default-banner.jpg"} alt="Community Banner" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-black opacity-40"></div>
            <img
              src={community.profile_pic_url}
              alt={`${community.name} logo`}
              className="absolute -bottom-12 left-6 w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>
          <div className="pt-16 pb-8 px-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-gray-900">{community.name}</h1>
              <button className="bg-purple-600 text-white px-5 py-2 rounded-full text-base flex items-center hover:bg-purple-700 transition duration-300">
                Join Community
              </button>
            </div>
            <p className="text-gray-600 mt-2 text-lg">{community.description}</p>
            <div className="grid grid-cols-3 gap-6 mt-6 text-sm text-gray-600">
              <div className="flex items-center bg-purple-50 p-3 rounded-lg">
                <FaUsers className="mr-3 text-purple-600 text-xl" />
                <span><strong className="block text-gray-900">Members</strong> {community.member_count || 0}</span>
              </div>
              <div className="flex items-center bg-purple-50 p-3 rounded-lg">
                <FaCalendar className="mr-3 text-purple-600 text-xl" />
                <span><strong className="block text-gray-900">Created</strong> {new Date(community.created_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center bg-purple-50 p-3 rounded-lg">
                <FaHashtag className="mr-3 text-purple-600 text-xl" />
                <span><strong className="block text-gray-900">Category</strong> {community.category || 'Uncategorized'}</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)} className="bg-white rounded-xl shadow-lg p-6">
          <TabList className="flex border-b mb-6">
            {['About', 'Rules', 'Discussions', 'Events'].map((tabName, index) => (
              <Tab
                key={tabName}
                className={`px-6 py-3 text-base font-medium cursor-pointer transition duration-300 ${
                  activeTab === index
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {tabName}
              </Tab>
            ))}
          </TabList>

          <TabPanel>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaInfoCircle className="mr-3 text-purple-600" />
              About {community.name}
            </h2>
            <p className="text-base text-gray-700 leading-relaxed mb-6">{community.long_description || community.description}</p>
            <div className="bg-purple-50 p-4 rounded-lg">
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
          </TabPanel>

          <TabPanel>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaBook className="mr-3 text-purple-600" />
              Community Guidelines
            </h2>
            <div className="space-y-4">
              {community.rules && community.rules.split('\n').map((rule, index) => (
                <div key={index} className="flex items-start bg-purple-50 p-4 rounded-lg">
                  <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{rule}</p>
                </div>
              ))}
            </div>
          </TabPanel>

          <TabPanel>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaComments className="mr-3 text-purple-600" />
              Recent Discussions
            </h2>
            <p className="text-gray-600">Discussion forum content would go here.</p>
          </TabPanel>

          <TabPanel>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaCalendarAlt className="mr-3 text-purple-600" />
              Upcoming Events
            </h2>
            <p className="text-gray-600">Community events calendar would go here.</p>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default CommunityDetail;