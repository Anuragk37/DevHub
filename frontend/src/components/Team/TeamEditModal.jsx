import React, { useState, useEffect } from 'react';
import { FaImage, FaTimes } from 'react-icons/fa';

const TeamEditModal = ({ isOpen, onClose, team, onSubmit }) => {
   const [name, setName] = useState(team.name);
   const [description, setDescription] = useState(team.description);
   const [profilePic, setProfilePic] = useState(null);

   useEffect(() => {
      setName(team.name);
      setDescription(team.description);
      setProfilePic(null);
   }, [team, isOpen]);

   const handleFileChange = (e) => {
      setProfilePic(e.target.files[0]);
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      if (profilePic) {
         formData.append('profile_pic', profilePic);
      }

      onSubmit(formData);
   }

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
         <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-3xl font-bold text-gray-900">Edit Team</h2>
               <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                  <FaTimes className="text-xl" />
               </button>
            </div>
            <form onSubmit={handleSubmit}>
               <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                     Team Name
                  </label>
                  <input
                     type="text"
                     id="name"
                     name="name"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                     required
                  />
               </div>
               <div className="mb-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                     Description
                  </label>
                  <textarea
                     id="description"
                     name="description"
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     rows="4"
                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                     required
                  ></textarea>
               </div>
               <div className="mb-6">
                  <label htmlFor="profile_pic" className="block text-sm font-medium text-gray-700 mb-2">
                     Profile Picture
                  </label>
                  <div className="flex items-center space-x-4">
                     <img
                        src={profilePic ? URL.createObjectURL(profilePic) : team.profile_pic_url}
                        alt="Team profile"
                        className="w-16 h-16 rounded-full object-cover"
                     />
                     <label className="cursor-pointer bg-purple-100 text-purple-600 px-4 py-2 rounded-full hover:bg-purple-200 transition duration-300">
                        <FaImage className="inline-block mr-2" />
                        Choose New Image
                        <input
                           type="file"
                           id="profile_pic"
                           name="profile_pic"
                           onChange={handleFileChange}
                           className="hidden"
                           accept="image/*"
                        />
                     </label>
                  </div>
               </div>
               <div className="flex justify-end space-x-4">
                  <button
                     type="button"
                     onClick={onClose}
                     className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                     Cancel
                  </button>
                  <button
                     type="submit"
                     className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                     Save Changes
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default TeamEditModal;