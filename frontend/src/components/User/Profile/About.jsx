import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import BaseUrl from "../../../utils/BaseUrls";
import { AddAbout } from "./AddAbout";
import SkillsSelector from "../SkillSelector";
import TagModal from "./TagModal";
import TagSelector from "../TagSelector";
import { FaPen, FaPlus, FaLightbulb, FaCode } from "react-icons/fa";

const About = ({isOwnProfile,userId}) => {
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  const getUserDetails = async () => {
    try {
      
      const response = await axios.get(`${BaseUrl}/account/user/${userId}/`);
      setAbout(response.data.about);

      const skills = await axios.get(`${BaseUrl}/account/user-skill/${userId}/`);
      setSkills(skills.data);
      
      const interests = await axios.get(`${BaseUrl}/account/user-tag/${userId}/`);
      setInterests(interests.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, [userId]);

  const handleAddAboutClick = () => setIsAboutModalOpen(true);
  const handleAddSkillClick = () => setIsSkillModalOpen(true);
  const handleAddTagClick = () => setIsTagModalOpen(true);

  const handleCloseModal = () => {
    setIsAboutModalOpen(false);
    setIsSkillModalOpen(false);
    setIsTagModalOpen(false);
    getUserDetails();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const renderSection = (title, content, addAction, icon) => (
    <div className="mb-8 bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </h3>
        {isOwnProfile&&(
          <button
          onClick={addAction}
          className="text-purple-600 hover:text-purple-800 transition-colors duration-300"
        >
          {content ? <FaPen size={14} /> : <FaPlus size={14} />}
        </button>
        )}
      </div>
      {content ? (
        <div className="text-gray-700">{content}</div>
      ) : (
        <p className="text-gray-500 italic">No information available</p>
      )}
    </div>
  );

  const renderTags = (tags, bgColor) => (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span
          key={index}
          className={`${bgColor} text-white text-sm px-3 py-1 rounded-full`}
        >
          {tag.name}
        </span>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {renderSection("About Me", about, handleAddAboutClick, <FaPen className="text-purple-500" />)}
      {renderSection("Skills", skills.length > 0 && renderTags(skills, "bg-blue-500"), handleAddSkillClick, <FaCode className="text-blue-500" />)}
      {renderSection("Interests", interests.length > 0 && renderTags(interests, "bg-green-500"), handleAddTagClick, <FaLightbulb className="text-green-500" />)}

      {isAboutModalOpen && <AddAbout onClose={handleCloseModal} />}
      {isSkillModalOpen && <SkillsSelector onClose={handleCloseModal} fromProfile={true} />}
      {isTagModalOpen && (
        <TagModal onClose={handleCloseModal}>
          <TagSelector onClose={handleCloseModal} fromProfile={true} />
        </TagModal>
      )}
    </div>
  );
};

export default About;