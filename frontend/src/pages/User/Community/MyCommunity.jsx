import React, { useState, useEffect } from 'react';
import Header from '../../../components/User/Header';
import axiosInstance from '../../../utils/axiosInstance';
import SideBar from '../../../components/User/SideBar';
import CommunityCard from '../../../components/User/Community/CommunityCard';

const MyCommunity = () => {
   const [activeTab, setActiveTab] = useState('created');
   const [createdCommunities, setCreatedCommunities] = useState([]);
   const [joinedCommunities, setJoinedCommunities] = useState([]);

   const getCommunities = async () => {
      try {
         const response = await axiosInstance.get('community/user-community');
         setCreatedCommunities(response.data.created_communities);
         setJoinedCommunities(response.data.joined_communities);
      } catch (error) {
         console.error(error);
      }
   };

   useEffect(() => { 
      getCommunities(); 
   }, []);

   const handleTabClick = (tab) => {
      setActiveTab(tab);
   };

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
               My Communities
             </span>
             <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
           </h2>
           
           <div className="mb-6">
             <div className="flex border-b border-gray-200">
               <button
                 className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                   activeTab === 'created'
                     ? 'border-b-2 border-purple-500 text-purple-600'
                     : 'text-gray-500 hover:text-gray-700'
                 }`}
                 onClick={() => handleTabClick('created')}
               >
                 Created Communities
               </button>
               <button
                 className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                   activeTab === 'joined'
                     ? 'border-b-2 border-purple-500 text-purple-600'
                     : 'text-gray-500 hover:text-gray-700'
                 }`}
                 onClick={() => handleTabClick('joined')}
               >
                 Joined Communities
               </button>
             </div>
           </div>

           <div className="mt-6">
             {activeTab === 'created' && (
               <>
                 {createdCommunities.length === 0 ? (
                   <p className="text-center text-gray-500">No created communities found.</p>
                 ) : (
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
                     {createdCommunities.map((community) => (
                       <CommunityCard key={community.id} community={community} fromMyCommunity={true}/>
                     ))}
                   </div>
                 )}
               </>
             )}
             {activeTab === 'joined' && (
               <>
                 {joinedCommunities.length === 0 ? (
                   <p className="text-center text-gray-500">No joined communities found.</p>
                 ) : (
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
                     {joinedCommunities.map((community) => (
                       <CommunityCard key={community.id} community={community} fromMyCommunity={true}/>
                     ))}
                   </div>
                 )}
               </>
             )}
           </div>
         </div>
       </div>
     </div>
   );
};

export default MyCommunity;