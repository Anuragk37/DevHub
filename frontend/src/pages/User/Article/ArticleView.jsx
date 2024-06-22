import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaComment, FaThumbsUp, FaBookmark } from "react-icons/fa";
import BaseUrl from "../../../utils/BaseUrls";
import CommentSection from "../../../components/User/Articles/CommentSection";
import Header from "../../../components/User/Header";

const ArticleView = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [created_at, setCreate_at] = useState("");
  const [auther, setAuther] = useState({});
  const [comment_count, setComment_count] = useState(0);
  const [thumbnail, setThumbnail] = useState(null);

  const { id } = useParams();

  const getArticle = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/article/${id}/`);
      const articleData = response.data;

      const autherResponse = await axios.get(
        `${BaseUrl}/account/user/${articleData.auther}/`
      );

      setTitle(articleData.title);
      setContent(articleData.content);
      setCreate_at(articleData.create_at);
      setAuther(autherResponse.data);
      setComment_count(articleData.comment_count);
      setThumbnail(articleData.thumbnail);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getArticle();
  }, [id]);

  return (
    <div className="w-screen h-full bg-background py-8">
      <Header />
      <div className="w-full lg:px-28 flex flex-col lg:flex-row">
        <div className="lg:w-4/6">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 px-10 mt-16">
            {/* Thumbnail Image */}
            {thumbnail && (
              <div className="mb-6">
                <img
                  src={thumbnail}
                  alt="Thumbnail Image"
                  className="rounded-lg object-cover w-full"
                />
              </div>
            )}

            {/* Article Title */}
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-4">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 focus:outline-none">
                  <FaThumbsUp className="text-gray-600 hover:text-gray-800" />
                  <span>Like</span>
                </button>
                <button className="flex items-center space-x-2 focus:outline-none">
                  <FaBookmark className="text-gray-600 hover:text-gray-800" />
                  <span>Save</span>
                </button>
                <button className="flex items-center space-x-2 focus:outline-none">
                  <FaComment className="text-gray-600 hover:text-gray-800" />
                  <span>Comment</span>
                </button>
              </div>
            </div>

            {/* Article Metadata */}
            <div className="flex items-center text-gray-500 text-sm mb-6">
              <span className="mr-4">
                Author: {auther.fullname || "Unknown"}
              </span>
              <span className="mr-4">
                Created at: {new Date(created_at).toLocaleDateString()}
              </span>
              <span>Comments: {comment_count || 0}</span>
            </div>

            {/* Article Content */}
            <div className="text-gray-800 leading-relaxed mb-6">
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>

            {/* Comment Section */}
            {/* <CommentSection /> */}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-2/6 lg:ml-8 mt-16">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Sidebar Content</h2>
            <p className="text-gray-600 mb-4">
              This is a placeholder for the sidebar content. You can add any relevant information here.
            </p>
            <ul className="list-disc list-inside text-gray-600">
              <li>Related Articles</li>
              <li>Popular Posts</li>
              <li>Author Bio</li>
              <li>Ad Space</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleView;
