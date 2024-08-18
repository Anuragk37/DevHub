import React, { useState } from "react";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../../../utils/axiosInstance";

const EditProfileModal = ({ isOpen, onClose, initialData }) => {
  const [fullname, setName] = useState(initialData.name);
  const [username, setUsername] = useState(initialData.username);
  const [bio, setBio] = useState(initialData.bio);
  const [profilePic, setProfilePic] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const accessToken = useSelector((state) => state.auth.userAccessToken);

  const handleSubmit = async () => {
    const decodedToken = jwtDecode(accessToken);
    const userId = decodedToken.user_id;

    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append('fullname', fullname);
      formData.append('username', username);
      formData.append('bio', bio);
      if (profilePic) {
         formData.append('profile_pic', profilePic);
      }
      await axiosInstance.patch(`/account/user/${userId}/`, formData);
      setIsSaving(false);
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      setIsSaving(false);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50 ${
        isOpen ? "" : "hidden"
      }`}
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
            Profile Picture
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
            className={`bg-purple-600 text-white px-4 py-2 rounded-full mr-2 ${
              isSaving ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-full"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;