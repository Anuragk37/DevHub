import React, { useState, useEffect, useRef } from 'react';
import RichTextEditor from '../../../components/User/RichTextEditor';
import Header from '../../../components/User/Header';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';
import toast from 'react-hot-toast';

const CreateArticle = () => {
  const location = useLocation();
  const { initialData, fromEdit } = location.state || {};
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState(initialData?.tags || []);
  const [displayTags, setDisplayTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const searchTagInputRef = useRef(null);
  const accessToken = useSelector((state) => state.auth.userAccessToken);
  const navigate = useNavigate();

  useEffect(() => {
    const getTags = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/admin/tags/');
        setTags(response.data);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
        setError('Failed to load tags. Please try again later.');
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
    if (!selectedTags.some(t => t.id === tag.id)) {
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

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const cleanContent = DOMPurify.sanitize(content);
    const decodedToken = jwtDecode(accessToken);
    const user_id = decodedToken.user_id;

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
        toast.success('Article updated successfully!');
        navigate('/user/my-profile');
      } else {
        await axiosInstance.post('/article/', articleData);
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to submit article:', error);
      setError('Failed to submit article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchTagInputRef.current && !searchTagInputRef.current.contains(event.target)) {
        setDisplayTags([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex felx-col">
      <Header />
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">
              {fromEdit ? 'Edit Article' : 'Create New Article'}
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                <p>{error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter the title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Tags</label>
              <div className="relative" ref={searchTagInputRef}>
                <div className="flex flex-wrap items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                  {selectedTags.map((tag) => (
                    <span key={tag.id} className="inline-flex items-center bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 text-sm font-medium mr-2 mb-2">
                      {tag.name}
                      <button
                        type="button"
                        className="ml-1 text-indigo-600 hover:text-indigo-800 focus:outline-none"
                        onClick={() => handleTagRemove(tag)}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Add tags"
                    className="flex-grow outline-none bg-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {displayTags.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    <ul className="py-1">
                      {displayTags.map((tag) => (
                        <li
                          key={tag.id}
                          className="px-3 py-2 cursor-pointer hover:bg-indigo-50 text-sm"
                          onClick={() => handleTagSelect(tag)}
                        >
                          {tag.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Thumbnail</label>
              <div className="flex items-center space-x-4">
                <label htmlFor="thumbnail-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <svg className="mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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

            <div className="space-y-2">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
              <RichTextEditor value={content} onChange={(value) => setContent(value)} />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Article'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;