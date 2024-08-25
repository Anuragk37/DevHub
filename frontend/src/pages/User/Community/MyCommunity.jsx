import React, { useState, useEffect } from 'react';
import Header from '../../../components/User/Header';
import axiosInstance from '../../../utils/axiosInstance';
import SideBar from '../../../components/User/SideBar';
import CommunityCard from '../../../components/User/Community/CommunityCard';
import { Link } from 'react-router-dom';

const MyCommunity = () => {
  const [activeTab, setActiveTab] = useState('created');
  const [createdCommunities, setCreatedCommunities] = useState([]);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [allCommunities, setAllCommunities] = useState([]);

  const getCommunities = async () => {
    try {
      const response = await axiosInstance.get('community/user-community');
      setCreatedCommunities(response.data.created_communities);
      setJoinedCommunities(response.data.joined_communities);
    } catch (error) {
      console.error(error);
    }
  };

  const getAllCommunities = async () => {
    try {
      const response = await axiosInstance.get('community/');
      console.log("all communities", response.data);
      setAllCommunities(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCommunities();
    getAllCommunities();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="flex flex-col lg:flex-row w-full px-4 sm:px-6 lg:px-16 mt-16 py-6">
        <div className="w-full lg:w-1/5 mb-6 lg:mb-0">
          <SideBar />
        </div>
        <div className="w-full lg:w-4/5 lg:pl-8">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex flex-wrap border-b border-gray-200 mb-4 sm:mb-0">
              {['created', 'joined', 'all'].map((tab) => (
                <button
                  key={tab}
                  className={`py-2 px-3 sm:px-4 font-semibold text-sm sm:text-md focus:outline-none whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-b-2 border-purple-500 text-purple-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} 
                </button>
              ))}
            </div>
            <Link to="/user/create-community" className="w-full sm:w-auto">
              <button
                className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-3xl w-full sm:w-auto"
              >
                Create Community
              </button>
            </Link>
          </div>

          <div className="mt-6">
            {activeTab === 'created' && (
              <CommunityGrid communities={createdCommunities} />
            )}
            {activeTab === 'joined' && (
              <CommunityGrid communities={joinedCommunities} />
            )}
            {activeTab === 'all' && (
              <CommunityGrid communities={allCommunities} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CommunityGrid = ({ communities }) => {
  if (communities.length === 0) {
    return <p className="text-center text-gray-500">No communities found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {communities.map((community) => (
        <CommunityCard key={community.id} community={community} fromMyCommunity={true} />
      ))}
    </div>
  );
};

export default MyCommunity;