import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import { FiSearch, FiX } from 'react-icons/fi';
import axiosInstance from '../../utils/axiosInstance';

const SkillsSelector = ({ fromProfile = false, onClose }) => {
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const accessToken = useSelector((state) => state.auth.userAccessToken);
  const navigate = useNavigate();

  const getSkills = async (page = 1) => {
    try {
      const response = await axiosInstance.get(`/admin/skills/?page=${page}`);
      setSkills(response.data.results);
      setCurrentPage(page);
      setTotalPages(Math.ceil(response.data.count / 10)); // Assuming 10 items per page
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch skills");
    }
  };

  useEffect(() => {
    getSkills();
  }, []);

  useEffect(() => {
    setFilteredSkills(
      skills.filter((skill) =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, skills]);

  const handleSkillSelect = (skill) => {
    if (!selectedSkills.some(s => s.id === skill.id)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSkillRemove = (skill) => {
    setSelectedSkills(selectedSkills.filter((s) => s.id !== skill.id));
  };

  const handleSubmit = async () => {
    try {
      const decodedToken = jwtDecode(accessToken);
      const user_id = decodedToken.user_id;
      await axiosInstance.post('/account/user-skill/', {
        user_id,
        selectedSkills,
      });
      if (fromProfile) {
        onClose();
        toast.success("Skills updated successfully");
      } else {
        toast.success("Skills saved successfully");
        navigate('/tag-selection');
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating skills");
    }
  };

  const loadNextPage = () => {
    if (currentPage < totalPages) {
      getSkills(currentPage + 1);
    }
  };

  const loadPreviousPage = () => {
    if (currentPage > 1) {
      getSkills(currentPage - 1);
    }
  };

  return (
    <div className={`${fromProfile ? 'fixed inset-0 flex items-center justify-center z-50' : ''}`}>
      {fromProfile && <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={onClose}></div>}
      <div className={`${fromProfile ? 'relative z-50 bg-white p-6 rounded-xl shadow-2xl max-w-2xl w-full' : 'max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-6'}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-purple-900">Select Your Skills</h1>
          {fromProfile ? (
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FiX size={24} />
            </button>
          ) : (
            <Link to="/tag-selection" className="text-purple-600 hover:text-purple-800 font-medium">
              Skip Now
            </Link>
          )}
        </div>

        <div className="mb-6 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for skills..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {selectedSkills.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Selected Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="bg-purple-800 text-sm text-white p-1 px-2 m-1 rounded-full flex items-center space-x-2"
                >
                  <span>{skill.name}</span>
                  <button
                    className="text-white text-md"
                    onClick={() => handleSkillRemove(skill)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4 max-h-60 overflow-y-auto rounded">
          <div className="p-2 flex flex-wrap gap-2">
            {filteredSkills.map(skill => (
              <div
                key={skill.id}
                className="cursor-pointer p-1 px-2 bg-purple-500 text-sm text-white rounded-full hover:bg-purple-900"
                onClick={() => handleSkillSelect(skill)}
              >
                {skill.name}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between mb-4">
          {currentPage > 1 && (
            <button
              className="bg-purple-500 text-white p-2 rounded hover:bg-purple-700 transition duration-200"
              onClick={loadPreviousPage}
            >
              Previous
            </button>
          )}
          {currentPage < totalPages && (
            <button
              className="bg-purple-500 text-white p-2 rounded hover:bg-purple-700 transition duration-200"
              onClick={loadNextPage}
            >
              Next
            </button>
          )}
        </div>

        <button
          className="w-full bg-purple-900 text-white p-2 rounded hover:bg-purple-950 transition duration-200"
          onClick={handleSubmit}
        >
          Save Skills
        </button>
      </div>
    </div>
  );
};

export default SkillsSelector;