import React, { useState, useEffect } from 'react';
import { FaComments, FaPlus, FaReply, FaUser, FaArrowLeft } from 'react-icons/fa';
import axiosInstance from '../../../utils/axiosInstance';

const DiscussionPanel = ({ communityId }) => {
  const [discussions, setDiscussions] = useState([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [selectedDiscussionComments, setSelectedDiscussionComments] = useState([]);
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '', community: communityId });
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchDiscussions();
  }, [communityId]);

  const fetchDiscussions = async () => {
    try {
      const response = await axiosInstance.get(`/community/discussion/${communityId}/`);
      console.log(response.data);
      
      setDiscussions(response.data);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    }
  };

  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`/community/discussion/`, newDiscussion);
      setDiscussions([response.data, ...discussions]);
      setNewDiscussion({ title: '', content: '', community: communityId });
    } catch (error) {
      console.error('Error creating discussion:', error);
    }
  };

  const handleSelectDiscussion = async (discussion) => {
    try {
      const response = await axiosInstance.get(`/community/discussion-comment/${discussion.id}/`);
      console.log(response.data);
      setSelectedDiscussion(discussion);
      setSelectedDiscussionComments(response.data);
    } catch (error) {
      console.error('Error fetching discussion details:', error);
    }
  };

  const handleCreateComment = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`/community/discussion-comment/`, { 
         discussion: selectedDiscussion.id,
         comment: newComment 
      });
      setSelectedDiscussionComments([...selectedDiscussionComments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleBackToDiscussions = () => {
    setSelectedDiscussion(null);
    setSelectedDiscussionComments([]);
  };

  return (
    <div >
      {/* <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <FaComments className="mr-3 text-purple-600" />
        Discussions
      </h2> */}

      {!selectedDiscussion ? (
        <div>
          <form onSubmit={handleCreateDiscussion} className="mb-8 bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaPlus className="mr-2 text-purple-600" />
              Start a New Discussion
            </h3>
            <input
              type="text"
              placeholder="Discussion Title"
              value={newDiscussion.title}
              onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <textarea
              placeholder="Discussion Content"
              value={newDiscussion.content}
              onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
              rows="3"
              required
            ></textarea>
            <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition duration-300">
              Create Discussion
            </button>
          </form>

          <div className="space-y-6">
            {discussions.map((discussion) => (
              <div
                key={discussion.id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition duration-300 cursor-pointer"
                onClick={() => handleSelectDiscussion(discussion)}
              >
                <div className="flex items-center mb-4">
                  <img
                    src={discussion.user.profile_pic || "/default-avatar.jpg"}
                    alt={discussion.user.username}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-lg text-purple-600">{discussion.title}</h4>
                    <p className="text-sm text-gray-600">
                      {discussion.user.username} • {new Date(discussion.created_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700">{discussion.content}</p>
                <div className="mt-4 text-sm text-gray-500 flex items-center">
                  <FaComments className="mr-2" />
                  {discussion.comment_count || 0} comments
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={handleBackToDiscussions}
            className="mb-4 flex items-center text-purple-600 hover:text-purple-800 transition duration-300"
          >
            <FaArrowLeft className="mr-2" />
            Back to Discussions
          </button>
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex items-center mb-4">
              <img
                src={selectedDiscussion.user.profile_pic || "/default-avatar.jpg"}
                alt={selectedDiscussion.user.username}
                className="w-12 h-12 rounded-full mr-4 object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold text-purple-600">{selectedDiscussion.title}</h3>
                <p className="text-sm text-gray-600">
                  {selectedDiscussion.user.username} • {new Date(selectedDiscussion.created_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{selectedDiscussion.content}</p>
          </div>

          <h4 className="font-semibold text-lg mb-4">Comments</h4>
          <div className="space-y-4 mb-6">
            {selectedDiscussionComments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <img
                    src={comment.user.profile_pic || "/default-avatar.jpg"}
                    alt={comment.user.username}
                    className="w-8 h-8 rounded-full mr-3 object-cover"
                  />
                  <p className="text-sm font-medium text-gray-800">
                    {comment.user.username} • {new Date(comment.created_date).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-gray-700">{comment.comment}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleCreateComment} className="mt-4">
            <textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
              rows="3"
              required
            ></textarea>
            <button type="submit" className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-300 flex items-center">
              <FaReply className="mr-2" />
              Post Comment
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DiscussionPanel;