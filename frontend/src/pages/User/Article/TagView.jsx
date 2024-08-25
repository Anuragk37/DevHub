import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { FaTag, FaHashtag } from 'react-icons/fa';
import Articles from '../../../components/User/Articles';
import axiosInstance from '../../../utils/axiosInstance';
import Header from '../../../components/User/Header';

const TagView = () => {
  const { id } = useParams();
  const [articles, setArticles] = useState([]);
  const [relatedTags, setRelatedTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const { tagName } = location.state || {};

  useEffect(() => {

   const fetchArticles = async () => {
     try{
        const response = await axiosInstance.get(`/article/taged-articles/${id}`);         
        const data =  response.data
        console.log(data);
        
        setArticles(data);
        setIsLoading(false);

     } catch (error) {
       console.error('Error fetching articles:', error);
     }
   };

   const fetchRelatedTags = async () => {
     // const response = await fetch(`/api/tags/related/${tagName}`);
     // const data = await response.json();
     // setRelatedTags(data);
     setRelatedTags(['React', 'JavaScript', 'Web Development']); // Replace with actual data
   };

   fetchArticles();
   fetchRelatedTags();
 }, [id]);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <Header />
      <div className="container mx-auto px-4 mt-12 ">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-extrabold text-purple-900 flex items-center">
              <FaTag className="mr-4 text-purple-600" />
              <span>{tagName}</span>
            </h1>
            <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
              {articles.length} Articles
            </span>
          </div>
          <p className="text-gray-600 text-lg mb-4">
            Explore articles tagged with <strong>{tagName}</strong>
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading articles...</p>
              </div>
            ) : articles.length > 0 ? (
              articles.map((article) => (
                <Articles key={article.id} article={article} />
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <p className="text-gray-600 text-lg">No articles found for this tag.</p>
              </div>
            )}
          </div>
          
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-purple-900 mb-4 flex items-center">
                <FaHashtag className="mr-2 text-purple-600" />
                Related Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {relatedTags.map((tag, index) => (
                  <Link 
                    key={index}
                    to={`/tag/${tag}`}
                    className="bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-sm font-medium hover:bg-purple-200 transition-colors duration-200"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagView;