import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ArticleView = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(null);
  const [date, setDate] = useState(null);

  const getArticle = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/article/3/');
      console.log(response.data);
      setTitle(response.data.title);
      setContent(response.data.content);
      setDate(response.data.created_at);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getArticle();
  }, []);

  return (
    <div className="article-container bg-gray-100 rounded-lg shadow-md px-4 py-8 md:px-24 lg:px-44 md:py-12">
      <div className="article-header bg-white rounded-t-lg px-4 py-6 flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-5xl font-bold text-gray-800">{title}</h1>
        <p className="text-gray-500 text-sm">{date}</p>
      </div>
      <img
        src=""
        alt="Thumbnail Image"
        className="article-image w-full mt-4 md:mt-8 object-cover"
      />
      <div className="article-content px-4 py-8">
        <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
};

export default ArticleView;
