import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

const SkillsSelector = ({ fromProfile = false, onClose }) => {
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  const accessToken = useSelector((state) => state.auth.userAccessToken);
  const navigate = useNavigate();

  const getSkills = async (url = 'http://127.0.0.1:8000/api/admin/skills/') => {
    try {
      const response = await axios.get(url);
      setSkills(prevSkills => [...prevSkills, ...response.data.results]);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
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
      await axios.post('http://127.0.0.1:8000/api/account/user-skill/', {
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

  const loadMore = () => {
    if (nextPage) {
      getSkills(nextPage);
    }
  };

  const loadPrevious = () => {
    if (prevPage) {
      setSkills([]);
      getSkills(prevPage);
    }
  };

  return (
    <div className={`${fromProfile ? 'fixed inset-0 flex items-center justify-center z-50' : ''}`}>
      {fromProfile && <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={onClose}></div>}
      <div className={`${fromProfile ? 'relative z-50 bg-white p-4 rounded-xl' :  ' max-w-lg mx-auto bg-white shadow-equel rounded-2xl p-3'}`}>
        {fromProfile && (
          <h1 className="text-end cursor-pointer" onClick={onClose}>Close</h1>
        )}
        {!fromProfile && (
          <Link to="/tag-selection">
            <h1 className="text-right cursor-pointer mb-4">Skip Now</h1>
          </Link>
        )}
        <div className="container mx-auto p-4 max-w-xl">
          <h1 className="text-2xl text-center font-bold text-purple-900 mb-4">
            Select Your Skills
          </h1>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search for skills..."
              className="shadow shadow-purple-200 min-w-96 appearance-none border rounded-3xl w-full py-2 px-3 text-placeholder text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            {prevPage && (
              <button
                className="bg-purple-500 text-white p-1 rounded hover:bg-purple-700 transition duration-200"
                onClick={loadPrevious}
              >
                Previous
              </button>
            )}
            {nextPage && (
              <button
                className="bg-purple-500 text-white p-1 rounded hover:bg-purple-700 transition duration-200"
                onClick={loadMore}
              >
                Load More
              </button>
            )}
          </div>
          <button
            className="bg-purple-900 text-white p-1 rounded w-1/4 hover:bg-purple-950 transition duration-200"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillsSelector;