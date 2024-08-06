import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const VideoConference = ({ teamId, userId, userName = 'Anurag', onLeave }) => {
  const conferenceContainer = useRef(null);

  useEffect(() => {
    const initConference = async () => {
      try {
        const appID = 1689373242; 
        const serverSecret = "9e64fe63a41ea5d85bfafc118d2f78e8"; 
        const userIdString = String(userId); 
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          `team-conference-${teamId}`,
          userIdString,
          userName
        );
    
        console.log('Kit Token:', kitToken);
    
        const zc = ZegoUIKitPrebuilt.create(kitToken);
        console.log('Zego instance created:', zc);
    
        await zc.joinRoom({
          container: conferenceContainer.current,
          sharedLinks: [
            {
              name: 'Conference link',
              url: window.location.href,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.GroupCall,
          },
          showScreenSharingButton: true,
          showUserList: true,
          maxUsers: 20, // Adjust as needed
          layout: 'Auto', // You can choose different layouts
          onLeave: null
        });
    
        console.log('Joined room successfully');
      } catch (error) {
        console.error('Error initializing conference:', error);
      }
    };
    
    initConference();
  }, [teamId, userId, userName, onLeave]);

  return (
    <div className="video-conference-container h-full">
      <div ref={conferenceContainer} className="h-full" />
    </div>
  );
};

export default VideoConference;
