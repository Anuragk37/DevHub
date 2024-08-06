import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import VideoConference from '../../../components/Team/VideoConference';
const VideoConferencePage = () => {
  const { id } = useParams();
  const teamId = id;
  const navigate = useNavigate();
  const userAccessToken = useSelector(state => state.auth.userAccessToken);
  const decodedToken = jwtDecode(userAccessToken);
  const userId = decodedToken.user_id;
  const userName = "Anurag"

  

  const handleLeave = () => {
   console.log("leavedddddddddddddddddddddddddddddddddddddddddddddddddd");
   
    navigate(`/user/team-detail`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex-1 mt-16">
        <div className="h-[calc(100vh-4rem)]">
          <VideoConference
            teamId={teamId}
            userId={userId}
            userName={userName}
            onLeave={handleLeave}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoConferencePage;