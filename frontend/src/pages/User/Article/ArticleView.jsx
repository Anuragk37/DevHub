import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { FaComment, FaThumbsUp, FaBookmark, FaTag, FaCalendarAlt, FaUser, FaEllipsisV } from "react-icons/fa";
import BaseUrl from "../../../utils/BaseUrls";
import CommentSection from "../../../components/User/Articles/CommentSection";
import Header from "../../../components/User/Header";
import axiosInstance from "../../../utils/axiosInstance";
import UserTooltip from "../../../components/User/Profile/UserTooltip";
import ReportModal from "../../../components/User/Articles/ReportModal";
const ArticleView = () => {
  const [articleData, setArticleData] = useState({
    title: "",
    content: "",
    created_at: "",
    auther: "",
    comment_count: 0,
    thumbnail: null,
    tags: [],
    like_count: 0,
    liked: false,
    saved: false
  });

  const [relatedArticles, setRelatedArticles] = useState([]);
  const [showReportMenu, setShowReportMenu] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const { id } = useParams();
  const commentSectionRef = useRef(null);

  const getArticle = async () => {
    try {
      const response = await axiosInstance.get(`article/${id}/`);
      const data = response.data;
      setArticleData({
        title: data.title,
        content: data.content,
        created_at: data.create_at,
        auther: data.auther,
        comment_count: data.comment_count,
        thumbnail: data.thumbnail,
        tags: data.tags,
        like_count: data.like_count,
        liked: data.liked,
        saved: data.is_saved
      });

      const relatedArticles = await axiosInstance.get(
        `article/related-article/${id}/`
      )
      setRelatedArticles(relatedArticles.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getArticle();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showReportMenu && !event.target.closest('.report-menu-container')) {
        setShowReportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReportMenu]);

  const handleCommentButtonClick = () => {
    commentSectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLike = async () => {
    try {
      const response = await axiosInstance.post(`article/like-article/${id}/`);
      setArticleData(prevData => ({
        ...prevData,
        liked: response.data.liked,
        like_count: response.data.like_count
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveArticle = async () => {
    try {
      const response = await axiosInstance.post(`article/save-article/${id}/`);
      setArticleData(prevData => ({
        ...prevData,
        saved: !articleData.saved
      }));
    } catch (error) {
      console.log(error);
    }
  };

  

  return (
    <div className="w-screen h-full bg-background py-8">
      <Header />
      <div className="w-full lg:px-28 flex flex-col lg:flex-row">
        <div className="lg:w-4/6">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 px-10 mt-16">
            {articleData.thumbnail && (
              <div className="mb-6">
                <img
                  src={articleData.thumbnail}
                  alt="Thumbnail Image"
                  className="rounded-lg object-cover w-full"
                />
              </div>
            )}

            <h1 className="text-3xl font-bold text-gray-800 mb-4">{articleData.title}</h1>

            <div className="flex flex-wrap items-center text-gray-600 text-sm mb-6">
              <UserTooltip user={articleData.auther}>
              <Link to={`/user/profile/${articleData.auther.id}`}>
                <div className="flex items-center mr-6 mb-2 cursor-pointer">
                  {articleData.auther.profile_pic ? (
                    <img className="w-8 h-8 rounded-full" src={articleData.auther.profile_pic} alt="" />
                  ) : (<FaUser className="w-8 h-8 mr-2 text-gray-400" />)}
                  <span className="ml-2">{articleData.auther.fullname || "Unknown"}</span>
                </div>
                </Link>
              </UserTooltip>
              <div className="flex items-center mr-6 mb-2">
                <FaCalendarAlt className="mr-2" />
                <span>{new Date(articleData.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6 border-t border-b border-gray-200 py-4">
              <div className="flex items-center space-x-8">
                <div className="relative group">
                  <button 
                    className="flex items-center space-x-2 focus:outline-none text-gray-600 hover:text-blue-600 transition duration-300" 
                    onClick={handleLike}
                  >
                    <FaThumbsUp color={articleData.liked ? "blue" : "gray"} />
                    <span>{articleData.like_count}</span>
                  </button>
                  <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 left-0 bottom-full mb-2">
                    {articleData.liked ? "Unlike this article" : "Like this article"}
                  </div>
                </div>
                <div className="relative group">
                  <button 
                    className="flex items-center space-x-2 focus:outline-none text-gray-600 hover:text-blue-600 transition duration-300" 
                    onClick={handleSaveArticle}
                  >
                    <FaBookmark color={articleData.saved ? "blue" : "gray"} />
                    <span>{articleData.saved ? "Saved" : "Save"}</span>
                  </button>
                  <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 left-0 bottom-full mb-2">
                    {articleData.saved ? "Remove from saved articles" : "Save this article"}
                  </div>
                </div>
                <div className="relative group">
                  <button 
                    className="flex items-center space-x-2 focus:outline-none text-gray-600 hover:text-blue-600 transition duration-300" 
                    onClick={handleCommentButtonClick}
                  >
                    <FaComment />
                    <span>{articleData.comment_count || 0}</span>
                  </button>
                  <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 left-0 bottom-full mb-2">
                    Go to comments
                  </div>
                </div>
              </div>
              <div className="relative report-menu-container">
                <button 
                  className="focus:outline-none text-gray-600 hover:text-blue-600 transition duration-300"
                  onClick={() => setShowReportMenu(!showReportMenu)}
                >
                  <FaEllipsisV />
                </button>
                {showReportMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setIsReportModalOpen(true);
                        setShowReportMenu(false);
                      }}
                    >
                      Report Article
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="text-gray-800 leading-relaxed mb-6">
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: articleData.content }}
              />
            </div>

            <hr />
            <div className="flex items-center flex-wrap mt-4">
              <FaTag className="mr-2 mb-2" />
              {articleData.tags.map((tag, index) => (
                <span
                  key={tag.id || index}
                  className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold mr-2 mb-2 hover:bg-purple-800 transition duration-300"
                >
                  {tag.name || tag}
                </span>
              ))}
            </div>
          </div>

          <div ref={commentSectionRef}>
            <CommentSection id={id} />
          </div>
        </div>

        <div className="lg:w-2/6 lg:ml-8 mt-16">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Related Articles</h2>
            {relatedArticles.length > 0 ? (
              <ul className="space-y-4">
                {relatedArticles.map((article) => (
                  <li key={article.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <Link to={`/user/view-article/${article.id}`} className="block hover:bg-gray-50 transition duration-300 rounded-lg p-2">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{article.title}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <FaUser className="mr-2" />
                        <span>{article.auther.fullname || "Unknown"}</span>
                        <span className="mx-2">•</span>
                        <FaCalendarAlt className="mr-2" />
                        <span>{new Date(article.create_at).toLocaleDateString()}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No related articles found.</p>
            )}
          </div>
        </div>
      </div>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        id={id}
      />
    </div>
  );
};

export default ArticleView;