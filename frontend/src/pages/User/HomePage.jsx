import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from '../../components/User/Header';
import SideBar from '../../components/User/SideBar';
import Articles from '../../components/User/Articles';
import RightSidebar from '../../components/User/RightSidebar';
import axiosInstance from '../../utils/axiosInstance';

const HomePage = ({fromRecommended}) => {
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
      console.log(response.data);
      
      if (response.data.results.length === 0) {
        console.log('No more articles');
        
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
        console.log(response.data);
        setArticles(response.data);
        setIsLoading(false);
        setHasMore(false);

      }catch(error){
        console.log(error);
        
      }
    }

  useEffect(() => {
    if(fromRecommended){
      getRecommendedArticles();
    }else{
      getArticles();
    }
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex pt-16">
        <SideBar />
        <main className="flex-1 px-4 sm:px-6 lg:px-4 py-8 md:ml-80 md:mr-20">
          <div className="max-w-[60rem] mx-auto">
            <div className="lg:flex lg:space-x-8">
              <div className="lg:w-3/4">
                {error && <div className="text-red-500 mb-4 p-4 bg-red-100 rounded-lg">{error}</div>}
                {articles.map((article, index) => (
                  <div key={article.id} ref={index === articles.length - 1 ? lastArticleElementRef : null}>
                    <Articles article={article} />
                  </div>
                ))}
                {isLoading && (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                    <span className="ml-2 text-purple-700">Loading more articles...</span>
                  </div>
                )}
                {!hasMore && !isLoading && (
                  <div className="text-center py-4 text-gray-500">
                    No more articles to load.
                  </div>
                )}
              </div>
              <div className="lg:w-1/4 mt-8 lg:mt-0 hidden lg:block">
                <div className=" top-24">
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