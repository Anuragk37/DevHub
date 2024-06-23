import React, { useEffect, useState } from "react";
import { FaUserCircle, FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import {jwtDecode} from "jwt-decode"; // Corrected import
import BaseUrl from "../../../utils/BaseUrls";
import moment from 'moment';

const CommentSection = ({ id }) => {
  const [comments, setComments] = useState([]);
  const accessToken = useSelector((state) => state.auth.userAccessToken);

  const [replyInputs, setReplyInputs] = useState([]);

  const getComments = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/article/comment/${id}`);
      setComments(response.data);
      setReplyInputs(new Array(response.data.length).fill(false));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  const handleAddComment = async (commentBody, parentId) => {
    const decodedToken = jwtDecode(accessToken);
    const userId = decodedToken.user_id;
    try {
      const response = await axios.post(`${BaseUrl}/article/comment/`, {
        commentBody,
        article_id: id,
        user_id: userId,
        parent_id: parentId?parentId : null,
      });
      getComments(); 
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleReplyInput = (index) => {
    const newReplyInputs = [...replyInputs];
    newReplyInputs[index] = !newReplyInputs[index];
    setReplyInputs(newReplyInputs);
  };

  return (
    <div className="w-full p-4 mt-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>

      <CommentInput handleAddComment={handleAddComment} />

      {comments.map((comment, index) => (
        <div key={comment.id} className="mb-4 border border-gray-600 p-3">
          <div className="flex items-center">
            <FaUserCircle className="text-3xl text-gray-500 mr-3" />
            <div className="flex-grow">
              <p className="text-gray-700">{comment.user.username}</p>
              <p className="text-gray-700 text-sm">
                {moment(comment.created_at).format('MMMM D, YYYY h:mm A')}
              </p>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-gray-700">{comment.comment}</p>
          </div>
          <div>
            <button
              className="border border-gray-600 px-2 p-1 text-xs"
              onClick={() => toggleReplyInput(index)}
            >
              reply
            </button>
            {replyInputs[index] && (
              <CommentInput
                handleAddComment={handleAddComment}
                parentId={comment.id} 
              />
            )}
          </div>
        </div>
      ))}

    </div>
  );
};

const CommentInput = ({ handleAddComment, parentId=null }) => {
  const [commentBody, setCommentBody] = useState('');

  const handleInput = (event) => {
    const { value } = event.target;
    setCommentBody(value);
  };

  const handleSubmit = () => {
    handleAddComment(commentBody, parentId);
    setCommentBody('');
  };

  return (
    <div className="flex items-center mb-6">
      <FaUserCircle className="text-3xl text-gray-500 mr-3" />
      <input
        type="text"
        className="flex-grow border rounded-lg p-2 mr-3"
        placeholder="Add a comment..."
        value={commentBody}
        onChange={handleInput}
      />
      <button
        className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 focus:outline-none"
        onClick={handleSubmit}
      >
        <FaPaperPlane />
      </button>
    </div>
  );
};

export default CommentSection;
