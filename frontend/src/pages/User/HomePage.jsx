import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from '../../components/User/Header';
import SideBar from '../../components/User/SideBar';
import axiosInstance from '../../utils/axiosInstance';
import Articles from '../../components/User/Articles';
import RightSidebar from '../../components/User/RightSidebar';

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef();
  const lastArticleElementRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  const getArticles = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/article/?page=${page}`);
      console.log("Fetched data:", response.data);
      
      if (response.data.results.length === 0) {
        setHasMore(false);
      } else {
        setArticles(prevArticles => {
          const newArticles = response.data.results.filter(
            article => !prevArticles.some(prevArticle => prevArticle.id === article.id)
          );
          return [...prevArticles, ...newArticles];
        });
        setHasMore(response.data.next !== null);
      }
      setIsLoading(false);
    } catch (error) {
      setError('Failed to load articles. Please try again later.');
      console.log(error);
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    getArticles();
  }, [getArticles]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col lg:flex-row w-screen px-6 mt-16 lg:px-20 bg-background py-6">
        <div className="hidden md:block md:w-1/5 mr-6">
          <SideBar />
        </div>
        <div className="w-full md:w-4/5 lg:w-3/5 lg:px-4">
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {articles.map((article, index) => (
            <div key={article.id} ref={index === articles.length - 1 ? lastArticleElementRef : null}>
              <Articles article={article} />
            </div>
          ))}
          {isLoading && <div className="text-center py-4">Loading more articles...</div>}
          {!hasMore && !isLoading && (
            <div className="text-center py-4 text-gray-500">
              No more articles to load.
            </div>
          )}
        </div>
        <div className="hidden lg:block lg:w-1/5">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default HomePage;