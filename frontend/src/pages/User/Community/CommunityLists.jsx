import React, { useState, useEffect } from 'react';
import Header from '../../../components/User/Header';
import axiosInstance from '../../../utils/axiosInstance';
import SideBar from '../../../components/User/SideBar';
import CommunityCard from '../../../components/User/Community/CommunityCard';

const CommunityLists = () => {
  const [communities, setCommunities] = useState([]);

  const getCommunities = async () => {
    try {
      const response = await axiosInstance.get('community/');
      setCommunities(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCommunities();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="flex flex-col lg:flex-row w-full px-5 sm:px-7 lg:px-14 mt-16 py-6">
        <div className="hidden lg:block lg:w-1/5 mr-8">
          <SideBar />
        </div>
        <div className="w-full lg:w-4/5 lg:pl-4">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10 relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Discover Communities
            </span>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            {communities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityLists;