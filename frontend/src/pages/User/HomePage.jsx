import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from '../../components/User/Header';
import SideBar from '../../components/User/SideBar';
import Articles from '../../components/User/Articles';
import RightSidebar from '../../components/User/RightSidebar';
import axiosInstance from '../../utils/axiosInstance';

const HomePage = ({ fromRecommended }) => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const observer = useRef();

  const lastArticleElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const getArticles = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/article/?page=${page}`);
      if (response.data.results.length === 0) {
        setHasMore(false);
      } else {
        setArticles((prevArticles) => {
          const newArticles = response.data.results.filter(
            (article) => !prevArticles.some((prevArticle) => prevArticle.id === article.id)
          );
          return [...prevArticles, ...newArticles];
        });
        setHasMore(response.data.next !== null);
      }
    } catch (error) {
      setError('Failed to load articles. Please try again later.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  const getRecommendedArticles = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/recommendations/');
      setArticles(response.data);
      setHasMore(false);
    } catch (error) {
      setError('Failed to load recommended articles. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (fromRecommended) {
      getRecommendedArticles();
    } else {
      getArticles();
    }
  }, [page, fromRecommended, getArticles]);

  const ArticleSkeleton = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 animate-pulse">
      <div className="flex flex-col-reverse md:flex-row p-6">
        <div className="flex-grow pr-0 md:pr-6">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <hr className="border-t border-purple-100 mb-4" />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
              <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
              <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="md:flex-shrink-0 mb-4 md:mb-0 md:ml-6">
          <div className="h-32 w-full md:w-48 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex pt-16 px-4 md:px-10 lg:px-16">
        <div className=" mt-0 lg:mt-0 lg:block">
                <div className="sticky top-20">
                <SideBar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
                </div>
              </div>
        <main className="flex-1 px-2 sm:px-6 py-4 transition-all duration-300 ease-in-out">
          <div className="max-w-7xl mx-auto">
            <div className="lg:flex lg:space-x-8">
              <div className="lg:w-3/4">
                {error && <div className="text-red-500 mb-4 p-4 bg-red-100 rounded-lg">{error}</div>}
                {isLoading && articles.length === 0 ? (
                  <>
                    <ArticleSkeleton />
                    <ArticleSkeleton />
                    <ArticleSkeleton />
                  </>
                ) : (
                  articles.map((article, index) => (
                    <div key={article.id} ref={index === articles.length - 1 ? lastArticleElementRef : null}>
                      <Articles article={article} />
                    </div>
                  ))
                )}
                {isLoading && articles.length > 0 && (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                    <span className="ml-2 text-purple-700">Loading more articles...</span>
                  </div>
                )}
                {!hasMore && !isLoading && articles.length > 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No more articles to load.
                  </div>
                )}
              </div>
              <div className="lg:w-1/4 mt-8 lg:mt-0 hidden lg:block">
                <div className="top-24">
                  <RightSidebar />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;