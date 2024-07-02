import React, { useEffect, useState } from "react";
import { FaUserCircle, FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import BaseUrl from "../../../utils/BaseUrls";
import moment from "moment";
import { BiCommentDetail } from "react-icons/bi";

const CommentSection = ({ id }) => {
  const [commentsData, setCommentsData] = useState([]);
  const accessToken = useSelector((state) => state.auth.userAccessToken);
  const [replyInputs, setReplyInputs] = useState({});

  const getComments = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/article/comment/${id}`);
      setCommentsData(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    getComments();
  }, [id]);

  const handleAddComment = async (commentBody, parentId) => {
    const decodedToken = jwtDecode(accessToken);
    const userId = decodedToken.user_id;
    try {
      await axios.post(`${BaseUrl}/article/comment/`, {
        commentBody,
        article_id: id,
        user_id: userId,
        parent_id: parentId || null,
      });
      getComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const toggleReplyInput = (commentId) => {
    setReplyInputs((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  return (
    <div className="w-full p-6 mt-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Comments</h2>
      <CommentInput handleAddComment={handleAddComment} />
      <div className="space-y-6 mt-8">
        {commentsData.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            handleAddComment={handleAddComment}
            toggleReplyInput={toggleReplyInput}
            replyInputs={replyInputs}
          />
        ))}
      </div>
    </div>
  );
};

const Comment = ({ comment, handleAddComment, toggleReplyInput, replyInputs }) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
      <div className="flex items-start space-x-3">
        <FaUserCircle className="text-3xl text-gray-400 mt-1" />
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <p className="font-semibold text-gray-800">{comment.user.username}</p>
            <span className="mx-2 text-gray-300">•</span>
            <p className="text-sm text-gray-500">
              {moment(comment.created_at).fromNow()}
            </p>
          </div>
          <p className="text-gray-700 mb-2">{comment.comment}</p>
          <button
            className="flex items-center text-sm text-purple-600 hover:text-purple-800 transition-colors duration-200"
            onClick={() => toggleReplyInput(comment.id)}
          >
            <BiCommentDetail className="mr-1" />
            Reply
          </button>
        </div>
      </div>
      {replyInputs[comment.id] && (
        <div className="mt-4 ml-10">
          <CommentInput
            handleAddComment={handleAddComment}
            parentId={comment.id}
            onCancel={() => toggleReplyInput(comment.id)}
          />
        </div>
      )}
      {comment.replies.length > 0 && (
        <div className="mt-4 ml-10">
          <button
            className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors duration-200"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies
              ? "Hide Replies"
              : `View ${comment.replies.length} ${
                  comment.replies.length === 1 ? "Reply" : "Replies"
                }`}
          </button>
          {showReplies && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <Comment
                  key={reply.id}
                  comment={reply}
                  handleAddComment={handleAddComment}
                  toggleReplyInput={toggleReplyInput}
                  replyInputs={replyInputs}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CommentInput = ({ handleAddComment, parentId = null, onCancel }) => {
  const [commentBody, setCommentBody] = useState("");

  const handleSubmit = () => {
    if (commentBody.trim()) {
      handleAddComment(commentBody, parentId);
      setCommentBody("");
      if (onCancel) onCancel();
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <input
        type="text"
        className="flex-grow border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        placeholder="Add a comment..."
        value={commentBody}
        onChange={(e) => setCommentBody(e.target.value)}
      />
      <button
        className="bg-purple-600 text-white rounded-lg py-2 px-4 hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        onClick={handleSubmit}
      >
        Comment
      </button>
      {onCancel && (
        <button
          className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
          onClick={onCancel}
        >
          Cancel
        </button>
      )}
    </div>
  );
};

export default CommentSection;