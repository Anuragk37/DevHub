import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {jwtDecode} from "jwt-decode";
import BaseUrl from "../../../utils/BaseUrls";
import { AddAbout } from "./AddAbout";
import SkillsSelector from "../SkillSelector";
import TagModal from "./TagModal";
import TagSelector from "../TagSelector";

const About = () => {
  const [about, setAbout] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newAbout, setNewAbout] = useState("");
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const accessToken = useSelector((state) => state.auth.userAccessToken);

  const getUserDetails = async () => {
    try {
      const decodedToken = jwtDecode(accessToken);
      const userId = decodedToken.user_id;
      const response = await axios.get(`${BaseUrl}/account/user/${userId}/`);
      setAbout(response.data.about);
      setEmail(response.data.email);

      const skills = await axios.get(`${BaseUrl}/account/user-skill/${userId}/`);
      console.log(skills.data);
       setSkills(skills.data)
      
       const interests = await axios.get(`${BaseUrl}/account/user-tag/${userId}/`);
       console.log("nooooooooooo",interests.data)
       setInterests(interests.data)
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setIsLoading(false); // Set loading to false once data is fetched
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
    setNewAbout(about);
  };

  const handleSaveClick = async () => {
    try {
      const decodedToken = jwtDecode(accessToken);
      const userId = decodedToken.user_id;
      await axios.put(`${BaseUrl}/account/user/${userId}/`, { about: newAbout });
      setAbout(newAbout);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving about info:", error);
    }
  };

  const handleAddAboutClick = () => {
    setIsAboutModalOpen(true);
  };

  const handleAddSkillClick = () => {
    setIsSkillModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsAboutModalOpen(false);
  };

  const handleCloseSkillModal = () => {
    setIsSkillModalOpen(false);
  };

  const handleCloseTagModal = () => {
    setIsTagModalOpen(false);
  };

  const handleAddTagClick = () => {
    setIsTagModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="px-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="px-8">
      <div className="mb-6">
        <h3 className="text-lg font-medium">About Me</h3>
        {about ? (
          <p className="text-gray-700">{about}</p>
        ) : (
          <div className="text-center">
            <p className="text-gray-700 italic">
              No about info. Click below to add.
            </p>
            <button
              onClick={handleAddAboutClick}
              className="bg-purple-800 text-white px-4 py-1 rounded-xl mt-2"
            >
              Add
            </button>
          </div>
        )}
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-medium">Email</h3>
        <p className="text-gray-700">{email}</p>
      </div>
      <hr />
      <div className="mb-6 mt-2">
         <h3 className="text-lg font-medium">Skills</h3>
         {skills?.length > 0 ? (
            <div className="flex flex-wrap">
               {skills.map((skill, index) => (
               <p
                  key={index}
                  className="bg-purple-700 text-sm text-white p-1 px-6 m-1 rounded-full space-x-2"
                  style={{ whiteSpace: 'nowrap' }}
               >
                  {skill.name}
               </p>
               ))}
            </div>
         ) : (
            <div className="text-center">
               <p className="text-gray-700 italic">No skills. Click below to add.</p>
               <button className="bg-purple-800 text-white px-4 py-1 rounded-xl mt-2" onClick={handleAddSkillClick}>Add</button>
            </div>
         )}
         </div>

      <div>
        <h3 className="text-lg font-medium">Interests</h3>
        {interests?.length > 0 ? (
            <div className="flex flex-wrap">
               {interests.map((interest, index) => (
               <p
                  key={index}
                  className="bg-purple-700 text-sm text-white p-1 px-6 m-1 rounded-full space-x-2"
                  style={{ whiteSpace: 'nowrap' }}
               >
                  {interest.name}
               </p>
               ))}
            </div>
         ) : (
            <div className="text-center">
               <p className="text-gray-700 italic">No interests. Click below to add.</p>
               <button className="bg-purple-800 text-white px-4 py-1 rounded-xl mt-2" onClick={handleAddTagClick}>Add</button>
            </div>
         )}
      </div>
      {isAboutModalOpen && <AddAbout onClose={handleCloseModal} />}
      {isSkillModalOpen && <SkillsSelector onClose={handleCloseSkillModal} fromProfile={true} />}
      {isTagModalOpen && <TagModal onClose={handleCloseTagModal}><TagSelector onClose={handleCloseTagModal} fromProfile={true}/></TagModal> }
    </div>
  );
};

export default About;
