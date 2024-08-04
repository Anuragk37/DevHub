import React from 'react';
import { FaUsers, FaEye, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const CommunityCard = ({ community , fromMyCommunity }) => {
   const navigate = useNavigate();
 
   const handleViewClick = () => {
     navigate(`/user/community-detail/${community.id}`);
   };
 
   return (
     <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
       <div className="relative h-28 bg-purple-700">
         <img
           src={community.profile_pic_url}
           alt={community.name}
           className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-24 h-24 rounded-full border-4 border-white object-cover"
         />
       </div>
       <div className="pt-12 p-4">
         <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">{community.name}</h3>
         <p className="text-md text-gray-600 text-center mb-3 line-clamp-2">{community.description}</p>
         <div className="flex items-center justify-center text-gray-500 mb-3 text-md">
           <FaUsers className="mr-2" />
           <span>{community.member_count} members</span>
         </div>
         <div className="flex justify-between">
            {fromMyCommunity?(
               <button className="flex items-center justify-center px-1.5 py-1.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-300 flex-1  text-sm">
               <Link to={`/community/chat`} state={{ community }}>
                  <FaUserPlus className="mr-1" />
                  chat
                  </Link>
            </button>   
               
            ):(
               <button className="flex items-center justify-center px-1.5 py-1.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-300 flex-1 mr-2 text-sm">
                  <FaUserPlus className="mr-1" />
                  Join
               </button>       
            )}
           
           <button
             className="flex items-center justify-center px-1.5 py-1.5 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition duration-300 flex-1 ml-2 text-sm"
             onClick={handleViewClick}
           >
             <FaEye className="mr-1" />
             View
           </button>
         </div>
       </div>
     </div>
   );
 };

export default CommunityCard
