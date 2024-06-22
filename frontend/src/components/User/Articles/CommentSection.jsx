import React, { useState } from "react";
import { FaUserCircle, FaPaperPlane, FaReply, FaThumbsUp } from "react-icons/fa";

const CommentSection = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  

  return (
    <div className="w-full max-w-2xl mx-auto p-4 mt-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>

      {/* New Comment Input */}
      <div className="flex items-center mb-6">
        <FaUserCircle className="text-3xl text-gray-500 mr-3" />
        <input
          type="text"
          className="flex-grow border rounded-lg p-2 mr-3"
          placeholder="Add a comment..."
          value={newComment}
        />
        <button
          className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 focus:outline-none"
          onClick={handleAddComment}
        >
          <FaPaperPlane />
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
          />
        ))}
      </div>
    </div>
  );
};

const Comment = ({ comment, onReply }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-start space-x-3">
        <FaUserCircle className="text-3xl text-gray-500" />
        <div className="bg-gray-100 rounded-lg p-4 flex-grow">
          <div className="flex justify-between items-center">
            <p className="text-gray-700">{comment.text}</p>
            <div className="flex items-center space-x-2">
              <button
                className="text-gray-600 hover:text-gray-800 focus:outline-none"
                onClick={() => setShowReplyInput(!showReplyInput)}
              >
                <FaReply />
              </button>
              <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
                <FaThumbsUp />
              </button>
            </div>
          </div>
          {showReplyInput && (
            <div className="flex items-center mt-2">
              <input
                type="text"
                className="flex-grow border rounded-lg p-2 mr-3"
                placeholder="Reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 focus:outline-none"
                onClick={() => {
                  onReply(replyText);
                  setReplyText("");
                  setShowReplyInput(false);
                }}
              >
                <FaPaperPlane />
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Replies */}
      {comment.replies && (
        <div className="ml-8 mt-4 space-y-2">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="flex items-start space-x-3">
              <FaUserCircle className="text-2xl text-gray-500" />
              <div className="bg-gray-100 rounded-lg p-3 flex-grow">
                <p className="text-gray-700">{reply.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
