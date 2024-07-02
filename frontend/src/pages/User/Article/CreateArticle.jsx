import React, { useState, useEffect, useRef } from 'react';
import RichTextEditor from '../../../components/User/RichTextEditor';
import Header from '../../../components/User/Header';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { useSelector } from 'react-redux';
import {jwtDecode} from 'jwt-decode';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';

const CreateArticle = () => {
  const location = useLocation();
  const { initialData, fromEdit } = location.state || {};
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState(initialData?.tags || []);
  const [displayTags, setDisplayTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const searchTagInputRef = useRef(null);
  const accessToken = useSelector((state) => state.auth.userAccessToken);
  const navigate = useNavigate();

  useEffect(() => {
    const getTags = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/admin/tags/');
        setTags(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getTags();
  }, []);

  useEffect(() => {
    setDisplayTags(
      tags.filter((tag) =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    if (searchTerm === '') {
      setDisplayTags([]);
    }
  }, [searchTerm, tags]);

  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setSearchTerm('');
    setDisplayTags([]);
  };

  const handleTagRemove = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
  };

  const handleThumbnail = (e) => {
    const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleThumbnail(e);
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
  };

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cleanContent = DOMPurify.sanitize(content);
    const decodedToken = jwtDecode(accessToken);
    const user_id = decodedToken.user_id;

    console.log("selected tagssss", typeof(selectedTags));

    const articleData = new FormData();
    articleData.append('title', title);
    articleData.append('content', cleanContent);
    if (thumbnail) {
      articleData.append('thumbnail', thumbnail);
    }
    articleData.append('tags', JSON.stringify(selectedTags));
    articleData.append('user', user_id);

    try {
      if (fromEdit) {
        await axiosInstance.patch(`/article/${initialData.id}/`, articleData);
        navigate('/user/profile');
      } else {
        await axiosInstance.post('/article/', articleData);
        navigate('/');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickOutside = (event) => {
    if (searchTagInputRef.current && !searchTagInputRef.current.contains(event.target)) {
      setDisplayTags([]);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen font-serif">
      <Header />
      <div className="min-h-screen mt-0 bg-background">
        <div className="max-w-4xl mx-auto mt-20 p-8 bg-white rounded-lg shadow-md relative">
          <form onSubmit={handleSubmit}>
            <div className="space-y-2 mb-3">
              <label htmlFor="thumbnail-upload" className="block text-sm font-medium text-gray-700">
                Thumbnail
              </label>
              <div className="flex items-center space-x-2">
                <label htmlFor="thumbnail-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  Upload Image
                </label>
                <input
                  id="thumbnail-upload"
                  name="thumbnail"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleThumbnail}
                />
                {thumbnail && (
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
              {thumbnailPreview && (
                <div className="mt-2">
                  <img src={thumbnailPreview} alt="Thumbnail Preview" className="max-w-xs h-auto rounded-lg shadow-sm" />
                </div>
              )}
            </div>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Enter the title"
                className="text-4xl w-full border-b-2 border-gray-300 focus:border-gray-500 outline-none pb-2"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-6 relative" ref={searchTagInputRef}>
              <div className="flex flex-wrap items-center border-b-2 border-gray-300 focus-within:border-gray-500 pb-2">
                {selectedTags.map((tag) => (
                  <div key={tag.id} className="inline-flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    <span>{tag.name}</span>
                    <span
                      className="text-lg text-purple-950 cursor-pointer ml-2"
                      onClick={() => handleTagRemove(tag)}
                    >
                      &times;
                    </span>
                  </div>
                ))}
                <input
                  type="text"
                  placeholder="Add tags"
                  className="flex-grow outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {displayTags.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1">
                  <ul>
                    {displayTags.map((tag) => (
                      <li
                        key={tag.id}
                        className="px-3 py-1 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleTagSelect(tag)}
                      >
                        {tag.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="mb-6">
              <p className="text-lg font-semibold mb-2">Enter the content</p>
              <RichTextEditor value={content} onChange={handleContentChange} />
            </div>
            <div className="text-right">
              <button
                type="submit"
                className="bg-gray-800 text-white px-6 py-2 rounded-lg shadow hover:bg-gray-700 focus:outline-none"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;
