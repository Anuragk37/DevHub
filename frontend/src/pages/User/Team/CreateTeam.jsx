import React, { useState, useCallback } from "react";
import { FaUsers, FaBookOpen, FaShieldAlt } from "react-icons/fa";
import { useForm, Controller } from "react-hook-form";
import axiosInstance from "../../../utils/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AsyncSelect from 'react-select/async';
import useDebounce from "../../../CustomHooks/useDebounce";

const CreateTeam = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const loadOptions = useCallback(async (inputValue, callback) => {
    try {
      const response = await axiosInstance.get(`admin/skills/?search=${inputValue}`);
      const options = response.data.results.map(skill => ({
        value: skill.id,
        label: skill.name
      }));
      callback(options);
    } catch (error) {
      console.error("Error fetching skills:", error);
      callback([]);
    }
  }, []);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setProfileImage(selectedImage);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(selectedImage);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.teamName);
    formData.append("description", data.description);
    formData.append("members_required", data.membersRequired);
    data.skills.forEach(skill => formData.append("skills_required", skill.value));
    if (profileImage) {
      formData.append("profile_pic", profileImage);
    }

    try {
      const response = await axiosInstance.post("team/create-team/", formData);
      toast.success("Team created successfully");
      navigate("/");
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while creating the team");
      }
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl overflow-hidden">
        <div className="md:flex">
          <div className="md:w-5/12 bg-purple-700 p-8 text-white flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6">Create Your Team</h2>
            <p className="mb-8 text-purple-100">
              Build a team of talented individuals to achieve your goals.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <FaUsers className="mr-4 text-2xl text-purple-200" />
                <span>Assemble a group of skilled professionals</span>
              </div>
              <div className="flex items-center">
                <FaBookOpen className="mr-4 text-2xl text-purple-200" />
                <span>Define your team's objectives</span>
              </div>
              <div className="flex items-center">
                <FaShieldAlt className="mr-4 text-2xl text-purple-200" />
                <span>Create a collaborative environment</span>
              </div>
            </div>
          </div>
          <div className="md:w-7/12 p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="mb-3">
                <label htmlFor="teamName" className="block text-sm font-medium text-purple-700 mb-1">
                  Team Name
                </label>
                <Controller
                  name="teamName"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Team name is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      id="teamName"
                      className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                      placeholder="Enter team name"
                    />
                  )}
                />
                {errors.teamName && <p className="text-red-500 text-sm mt-1">{errors.teamName.message}</p>}
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="block text-sm font-medium text-purple-700 mb-1">
                  Description
                </label>
                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      id="description"
                      rows="3"
                      className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                      placeholder="Describe your team's purpose and goals"
                    ></textarea>
                  )}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>
              <div className="mb-3">
                <label htmlFor="membersRequired" className="block text-sm font-medium text-purple-700 mb-1">
                  Number of Members Required
                </label>
                <Controller
                  name="membersRequired"
                  control={control}
                  defaultValue=""
                  rules={{ 
                    required: "Number of members is required",
                    min: { value: 1, message: "Minimum 1 member required" }
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      id="membersRequired"
                      className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                      placeholder="Enter number of members needed"
                      min="1"
                    />
                  )}
                />
                {errors.membersRequired && <p className="text-red-500 text-sm mt-1">{errors.membersRequired.message}</p>}
              </div>
              <div className="mb-3">
                <label htmlFor="skills" className="block text-sm font-medium text-purple-700 mb-1">
                  Skills Required
                </label>
                <Controller
                  name="skills"
                  control={control}
                  defaultValue={[]}
                  rules={{ required: "At least one skill is required" }}
                  render={({ field }) => (
                    <AsyncSelect
                      {...field}
                      isMulti
                      cacheOptions
                      defaultOptions
                      loadOptions={loadOptions}
                      placeholder="Search and select skills..."
                      className="basic-multi-select"
                      classNamePrefix="select"
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary: '#8B5CF6',
                          primary25: '#EDE9FE',
                          primary50: '#DDD6FE',
                          primary75: '#C4B5FD',
                        },
                      })}
                    />
                  )}
                />
                {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills.message}</p>}
              </div>
              <div className="mb-3">
                <label htmlFor="profileImage" className="block text-sm font-medium text-purple-700 mb-1">
                  Team Logo
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
                  className="cursor-pointer bg-purple-100 text-purple-700 px-4 py-2 border border-purple-300 rounded-lg hover:bg-purple-200 focus:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                >
                  Select Logo
                </label>
                {imagePreview && (
                  <div className="mt-4">
                    <p className="block text-sm font-medium text-purple-700 mb-1">Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Logo Preview"
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
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;