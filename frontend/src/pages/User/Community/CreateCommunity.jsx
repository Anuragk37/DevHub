import React, { useState } from "react";
import { FaUsers, FaBookOpen, FaShieldAlt } from "react-icons/fa";
import axiosInstance from "../../../utils/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateCommunity = () => {
  const [communityName, setCommunityName] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();

  // Handle community name input change
  const handleCommunityNameChange = (e) => {
    setCommunityName(e.target.value);
  };

  // Handle description input change
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // Handle rules input change
  const handleRulesChange = (e) => {
    setRules(e.target.value);
  };

  // Handle profile image selection
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setProfileImage(selectedImage);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", communityName);
    formData.append("description", description);
    formData.append("rules", rules);
    if (profileImage) {
      formData.append("profile_pic", profileImage);
    }
    try {
      const response = await axiosInstance.post("/community/", formData);
      toast.success("Community created successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-equel shadow-purple-200 w-full max-w-5xl overflow-hidden">
        <div className="md:flex">
          <div className="md:w-5/9 bg-purple-800 p-8 text-white flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6">Create Your Community</h2>
            <p className="mb-8 text-purple-100">
              Build a space where ideas flourish and connections thrive.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <FaUsers className="mr-4 text-2xl text-purple-200" />
                <span>Connect with like-minded individuals</span>
              </div>
              <div className="flex items-center">
                <FaBookOpen className="mr-4 text-2xl text-purple-200" />
                <span>Share knowledge and experiences</span>
              </div>
              <div className="flex items-center">
                <FaShieldAlt className="mr-4 text-2xl text-purple-200" />
                <span>Create a safe and inclusive space</span>
              </div>
            </div>
          </div>
          <div className="md:w-3/5 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="mb-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Community Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={communityName}
                  onChange={handleCommunityNameChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  placeholder="Enter community name"
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={handleDescriptionChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  placeholder="Describe your community"
                ></textarea>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="rules"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Community Rules
                </label>
                <textarea
                  id="rules"
                  name="rules"
                  value={rules}
                  onChange={handleRulesChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  placeholder="Enter community rules "
                ></textarea>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="profileImage"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Profile Image
                </label>
                <input
                  type="file"
                  id="profileImage"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="profileImage"
                  className="cursor-pointer bg-gray-200 text-gray-700 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-300 focus:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                >
                  Select Image
                </label>
                {imagePreview && (
                  <div className="mt-4">
                    <p className="block text-sm font-medium text-gray-700 mb-1">
                      Preview:
                    </p>
                    <img
                      src={imagePreview}
                      alt="Profile Preview"
                      className="rounded-lg shadow-md"
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full md:w-1/2 bg-purple-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200"
                >
                  Launch Community
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunity;
