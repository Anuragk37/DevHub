import React, { useState, useEffect } from 'react';
import { FaUsers, FaEye, FaUserPlus } from 'react-icons/fa';
import Header from '../../../components/User/Header';
import axiosInstance from '../../../utils/axiosInstance';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const CommunityCard = ({ community }) =>{

   const navigate = useNavigate();

   const handleViewClick = () => {
      navigate('/user/community-detail', { state: { community: community } });
   }

   return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="relative h-32 bg-gradient-to-r from-purple-400 to-pink-500">
          <img
            src={community.profile_pic_url}
            alt={community.name}
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-20 h-20 rounded-full border-4 border-white object-cover"
          />
        </div>
        <div className="pt-10 p-4">
          <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">{community.name}</h3>
          <p className="text-gray-600 text-center mb-4">{community.description}</p>
          <div className="flex items-center justify-center text-gray-500 mb-4">
            <FaUsers className="mr-2" />
            <span>{community.memberCount} members</span>
          </div>
          <div className="flex justify-between">
            <button className="flex items-center justify-center px-1 py-1 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-300 flex-1 mr-2">
              <FaUserPlus className="mr-1" />
              Join
            </button>
            <button className="flex items-center justify-center px-1 py-1 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition duration-300 flex-1 ml-2"
               onClick={handleViewClick}>
              <FaEye className="mr-1" />
              View
            </button>
            
          </div>
        </div>
      </div>
    );

} 

 const CommunityLists = () => {
   const [communities, setCommunities] = useState([]);
   

   const getCommunities = async () => {
     try {
       const response = await axiosInstance.get('community/');
       console.log(response.data);
       setCommunities(response.data);
     } catch (error) {
       console.error(error);
     }
   };
 
   useEffect(() => {
     getCommunities();
   }, []);
 
   return (
     <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
       <Header />
       <div className="max-w-7xl mx-auto mt-16">
         <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Discover Communities</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {communities.map((community) => (
             <CommunityCard key={community.id} community={community} />
           ))}
         </div>
       </div>
     </div>
   );
 };
 
 export default CommunityLists;