import React, { useState, useEffect, useRef } from 'react';
import RichTextEditor from '../../../components/User/RichTextEditor';
import Header from '../../../components/User/Header';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

const CreateArticle = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [displayTags, setDisplayTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [thumbnail,setThumbnail] = useState(null)
  const searchTagInputRef = useRef(null);

  const accessToken = useSelector((state) => state.auth.userAccessToken);
  

  const getTags = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/admin/tags/');
      setTags(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
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
    const file = e.target.files[0]
    console.log(file)
    setThumbnail(file)
  }

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const cleanContent = DOMPurify.sanitize(content);
    const decodedToken = jwtDecode(accessToken);
    const user_id = decodedToken.user_id;

    const articleData = new FormData();
    articleData.append('title', title);
    articleData.append('content', cleanContent);  
    articleData.append('thumbnail', thumbnail);
    articleData.append('tags', selectedTags);
    articleData.append('user', user_id);
    try{
      const response = await axios.post('http://127.0.0.1:8000/api/article/', articleData);
      console.log(response);

    }catch(error){
      console.log(error)
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
    <div className="min-h-screen bg-gray-100 font-serif">
      <Header />
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-md relative">
        <form onSubmit={handleSubmit}>
          <div className='mb-6'>
            <input type="file" name="" id="" onChange={handleThumbnail} />
          </div>
          <div className="mb-6">
            <input 
              type="text" 
              placeholder="Enter the title" 
              className="text-4xl w-full border-b-2 border-gray-300 focus:border-gray-500 outline-none pb-2"
              required 
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-6 relative" ref={searchTagInputRef}>
            <div className="flex flex-wrap items-center border-b-2 border-gray-300 focus-within:border-gray-500 pb-2">
              {selectedTags.map((tag) => (
                <div className="inline-flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                <span key={tag.id}>
                  {tag.name}
                </span>
                <span
                  className='text-lg text-purple-950 cursor-pointer ml-2'
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
  );
}

export default CreateArticle;
