import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {jwtDecode} from 'jwt-decode';
import toast from 'react-hot-toast';
import { FiSearch, FiX } from 'react-icons/fi';

const TagSelector = ({ onClose, fromProfile = false, interests = null }) => {
  const [tags, setTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [initialInterests, setInitialInterests] = useState([]);

  const accessToken = useSelector((state) => state.auth.userAccessToken);
  const navigate = useNavigate();

  const getTags = async (page = 1) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/admin/tags/?page=${page}`);
      setTags(response.data.results);
      setCurrentPage(page);
      setTotalPages(Math.ceil(response.data.count / 10)); // Assuming 10 items per page
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch tags");
    }
  };

  useEffect(() => {
    getTags();
  }, []);

  useEffect(() => {
    if (interests) {
      setInitialInterests(interests);
      setSelectedTags([...interests]);
    }
  }, [interests]);

  useEffect(() => {
    setFilteredTags(
      tags.filter((tag) =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, tags]);

  const handleTagSelect = (tag) => {
    if (!selectedTags.some(t => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
  };

  const handleSubmit = async () => {
    try {
      const decodedToken = jwtDecode(accessToken);
      const user_id = decodedToken.user_id;

      const tagsToAdd = selectedTags.filter(tag => !initialInterests.some(i => i.id === tag.id));
      const tagsToRemove = initialInterests.filter(tag => !selectedTags.some(s => s.id === tag.id));

      await axios.post("http://127.0.0.1:8000/api/account/user-tag/", {
        user_id,
        tagsToAdd,
        tagsToRemove
      });

      if (fromProfile) {
        onClose();
        navigate('/user/my-profile');
        toast.success("Interests updated successfully");
      } else {
        toast.success("Account created successfully, you can login");
        navigate('/');
      }

    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating interests");
    }
  };

  const loadNextPage = () => {
    if (currentPage < totalPages) {
      getTags(currentPage + 1);
    }
  };

  const loadPreviousPage = () => {
    if (currentPage > 1) {
      getTags(currentPage - 1);
    }
  };

  return (
    <div className={`${fromProfile ? 'fixed inset-0 flex items-center justify-center z-50' : ''}`}>
      {fromProfile && <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={onClose}></div>}
      <div className={`${fromProfile ? 'relative z-50 bg-white p-6 rounded-xl shadow-2xl max-w-2xl w-full' : 'max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-6'}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-purple-900">Select Your Interests</h1>
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
            placeholder="Search for tags..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {selectedTags.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Selected Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <div
                  key={tag.id}
                  className="bg-purple-800 text-sm text-white p-1 px-2 m-1 rounded-full flex items-center space-x-2"
                >
                  <span>{tag.name}</span>
                  <button
                    className="text-white text-md"
                    onClick={() => handleTagRemove(tag)}
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
            {filteredTags.map(tag => (
              <div
                key={tag.id}
                className="cursor-pointer p-1 px-2 bg-purple-500 text-sm text-white rounded-full hover:bg-purple-900"
                onClick={() => handleTagSelect(tag)}
              >
                {tag.name}
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
              Load More
            </button>
          )}
        </div>

        <button
          className="bg-purple-900 text-white p-2 rounded w-full hover:bg-purple-950 transition duration-200"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default TagSelector;
