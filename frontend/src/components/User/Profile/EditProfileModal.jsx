import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import BaseUrl from "../../../utils/BaseUrls";

const EditProfileModal = ({ isOpen, onClose, initialData }) => {
  const [fullname, setName] = useState(initialData.name);
  const [username, setUsername] = useState(initialData.username);
  const [bio, setBio] = useState(initialData.bio);
  const [profilePic, setProfilePic] = useState(null);
  const accessToken = useSelector((state) => state.auth.userAccessToken);

  const handleSubmit = async () => {
    const decodedToken = jwtDecode(accessToken);
    const userId = decodedToken.user_id;

    try {
      const formData = new FormData();
      formData.append('fullname', fullname);
      formData.append('username', username);
      formData.append('bio', bio);
      if (profilePic) {
         formData.append('profile_pic', profilePic);
      }
      await axios.patch(`${BaseUrl}/account/user/${userId}/`, formData);
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleProfilePictureChange = (e) => {
   const file = e.target.files[0];
   setProfilePic(file)
  
}

  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50`}
    >
      <div className="bg-white p-8 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={fullname}
            onChange={(e) => setName(e.target.value)}
            className="shadow shadow-purple-200 appearance-none border rounded-3xl w-full py-2 px-3 text-placeholder text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow shadow-purple-200 appearance-none border rounded-3xl w-full py-2 px-3 text-placeholder text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="shadow shadow-purple-200 appearance-none border rounded-3xl w-full h-32 py-2 px-3 text-placeholder text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Picture URL
          </label>
          <input
            type="file"
            id="profilePic"
            onChange={handleProfilePictureChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex justify-end">
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded-full mr-2"
            onClick={handleSubmit}
          >
            Save
          </button>
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-full"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
