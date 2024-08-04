import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Header from '../../../components/User/Header';
import axiosInstance from '../../../utils/axiosInstance';
import SideBar from '../../../components/User/SideBar';
import CommunityCard from '../../../components/User/Community/CommunityCard';

const MyCommunity = () => {
   const [createdCommunities, setCreatedCommunities] = useState([])
   const [joinedCommunities, setJoinedCommunities] = useState([])

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
           
           <Tabs className="mb-6">
             <TabList className="flex space-x-1 rounded-xl bg-purple-900/20 p-1 mb-6">
               <Tab className="w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-purple-700 focus:outline-none">
                 Created Communities
               </Tab>
               <Tab className="w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-purple-700 focus:outline-none">
                 Joined Communities
               </Tab>
             </TabList>

             <TabPanel>
               {createdCommunities.length === 0 ? (
                 <p className="text-center text-gray-500">No created communities found.</p>
               ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
                   {createdCommunities.map((community) => (
                     <CommunityCard key={community.id} community={community} fromMyCommunity={true}/>
                   ))}
                 </div>
               )}
             </TabPanel>
             <TabPanel>
               {joinedCommunities.length === 0 ? (
                 <p className="text-center text-gray-500">No joined communities found.</p>
               ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
                   {joinedCommunities.map((community) => (
                     <CommunityCard key={community.id} community={community} fromMyCommunity={true}/>
                   ))}
                 </div>
               )}
             </TabPanel>
           </Tabs>
         </div>
       </div>
     </div>
   )
}

export default MyCommunity;