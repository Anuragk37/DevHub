import React, { useState, useEffect } from "react";
import { FaUsers, FaBookOpen, FaShieldAlt } from "react-icons/fa";
import axiosInstance from "../../../utils/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const CreateTeam = () => {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [membersRequired, setMembersRequired] = useState("");
  const [skills, setSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axiosInstance.get("admin/skills/");
        setAvailableSkills(response.data.map(skill => ({ value: skill.id, label: skill.name })));
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []);

  const handleTeamNameChange = (e) => {
    setTeamName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleMembersRequiredChange = (e) => {
    setMembersRequired(e.target.value);
  };

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

  const handleSkillsChange = (selectedOptions) => {
    setSkills(selectedOptions || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(skills);

    const formData = new FormData();
    formData.append("name", teamName);
    formData.append("description", description);
    formData.append("members_required", membersRequired);
    skills.forEach(skill => formData.append("skills_required", skill.value))
     if (profileImage) {
      formData.append("profile_pic", profileImage);
    }
    try {
      const response = await axiosInstance.post("team/create-team/", formData);
      toast.success("Team created successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Error creating team");
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="mb-3">
                <label htmlFor="name" className="block text-sm font-medium text-purple-700 mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={teamName}
                  onChange={handleTeamNameChange}
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  placeholder="Enter team name"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="block text-sm font-medium text-purple-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={handleDescriptionChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  placeholder="Describe your team's purpose and goals"
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="membersRequired" className="block text-sm font-medium text-purple-700 mb-1">
                  Number of Members Required
                </label>
                <input
                  type="number"
                  id="membersRequired"
                  name="membersRequired"
                  value={membersRequired}
                  onChange={handleMembersRequiredChange}
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  placeholder="Enter number of members needed"
                  min="1"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="skills" className="block text-sm font-medium text-purple-700 mb-1">
                  Skills Required
                </label>
                <Select
                  isMulti
                  options={availableSkills}
                  onChange={handleSkillsChange}
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
