import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {jwtDecode} from 'jwt-decode';

const SkillsSelector = () => {
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const accessToken = useSelector((state) => state.auth.userAccessToken);
  const navigate = useNavigate();

  const getSkills = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/admin/skills/');
      setSkills(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSkills();
  }, []);

  useEffect(() => {
    setFilteredSkills(
      skills.filter(skill => 
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, skills]);

  const handleSkillSelect = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSkillRemove = (skill) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  const handleSubmit = async () => {
    const decodedToken = jwtDecode(accessToken);
    const user_id = decodedToken.user_id;
    await axios.post('http://127.0.0.1:8000/api/account/user-skill/', {
      user_id,
      selectedSkills,
    });
    navigate('/tag-selection');
  };

  return (
    <div className="w-4/6 max-w-lg mx-auto bg-white shadow-equel rounded-2xl shadow-purple-300 p-3">
      <Link to={"/tag-selection"}>
      <h1 className='text-end'>Skip Now</h1></Link>
      <div className="container mx-auto p-4 max-w-xl">
        <h1 className="text-2xl text-center font-bold text-purple-900 mb-4">Select Your Skills</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search for skills..."
            className="shadow shadow-purple-200 appearance-none border rounded-3xl w-full py-2 px-3 text-placeholder text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        {selectedSkills.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Selected Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map(skill => (
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
        <button
          className="bg-purple-900 text-white p-1 rounded w-1/4 hover:bg-purple-950 transition duration-200"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default SkillsSelector;
