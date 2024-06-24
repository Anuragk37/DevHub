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
      const comments = response.data;
      setCommentsData(comments);
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
        parent_id: parentId ? parentId : null,
      });
      getComments();
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleReplyInput = (commentId) => {
    setReplyInputs((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  return (
    <div className="w-full p-4 mt-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>

      <CommentInput handleAddComment={handleAddComment} />

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
  );
};

const Comment = ({
  comment,
  handleAddComment,
  toggleReplyInput,
  replyInputs,
}) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div key={comment.id} className="mb-2 p-3">
      <div className="flex items-center mb-1">
        <FaUserCircle className="text-3xl text-gray-400 mr-3" />
        <div className="flex gap-2 ">
          <p className="text-gray-800 font-semibold">{comment.user.username}</p>
          <p className="text-gray-500 text-sm ">
            {moment(comment.created_at).format("MMMM D, YYYY h:mm A")}
          </p>
        </div>
      </div>
      <p className="ml-11 mb-1">{comment.comment}</p>
      <div className="ml-12 space-x-2">
        <button
          className="flex items-center px-2 py-1 text-xs font-semibold"
          onClick={() => toggleReplyInput(comment.id)}
        >
          <BiCommentDetail className="text-lg font-bold mr-1" />
          Reply
        </button>
        {replyInputs[comment.id] && (
          <div className="flex w-full">
            <CommentInput
              handleAddComment={handleAddComment}
              parentId={comment.id}
            />
            <div className="p-1 w-1/5">
              <button
                className=" ml-2 bg-purple-200 py-1 rounded-full px-2"
                onClick={() => toggleReplyInput(comment.id)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      {comment.replies.length > 0 && (
        <div className="ml-12 ">
          <button
            className="text-xs font-semibold text-purple-700 hover:text-purple-900"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies
              ? "Hide Replies"
              : `View ${comment.replies.length} Replies`}
          </button>
          {showReplies && (
            <div className="ml-4 mt-2">
              {comment.replies.map((reply) => (
                <Comment
                  key={reply.id}
                  comment={reply}
                  handleAddComment={handleAddComment}
                  toggleReplyInput={toggleReplyInput}
                  replyInputs={replyInputs}
                  setShowReplies={setShowReplies}
                  showReplies={showReplies}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CommentInput = ({ handleAddComment, parentId = null }) => {
  const [commentBody, setCommentBody] = useState("");

  const handleInput = (event) => {
    const { value } = event.target;
    setCommentBody(value);
  };

  const handleSubmit = () => {
    handleAddComment(commentBody, parentId);
    setCommentBody("");
  };

  return (
    <div className="flex items-center mb-6 w-full">
      <input
        type="text"
        className="flex-grow border rounded-lg p-2 mr-3"
        placeholder="Add a comment..."
        value={commentBody}
        onChange={handleInput}
      />

      <button
        className="bg-purple-600 text-white rounded-full py-1 px-4 hover:bg-purple-800 focus:outline-none"
        onClick={handleSubmit}
      >
        Sumbit
      </button>
    </div>
  );
};

export default CommentSection;
