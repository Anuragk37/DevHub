import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FaUser, FaCalendarAlt, FaUsers, FaInfoCircle, FaComment, FaEdit, FaTasks, FaTrash, FaVideo, FaCog, FaTimes, FaChevronRight } from 'react-icons/fa';
import axiosInstance from '../../../utils/axiosInstance';
import { setTeam } from '../../../features/teamSlice';
import MemberList from '../../../components/Team/MemberList';
import TaskList from '../../../components/Team/TaskList';
import TeamEditModal from '../../../components/Team/TeamEditModal';
import Header from '../../../components/User/Header';
import TeamAbout from '../../../components/Team/TeamAbout';
import TeamMeeting from '../../../components/Team/TeamMeeting';


const TeamDetails = () => {
  const [activeSection, setActiveSection] = useState('about');
  const [members, setMembers] = useState([]);
  const [pendingMembers, setPendingMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isManageTeamOpen, setIsManageTeamOpen] = useState(false);
  const [newGithubLink, setNewGithubLink] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isConferenceActive, setIsConferenceActive] = useState(false);

  const userAccessToken = useSelector(state => state.auth.userAccessToken);
  const decodedToken = jwtDecode(userAccessToken);
  const userId = decodedToken.user_id;
  const team = useSelector(state => state.team.team);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (team) {
      axiosInstance.get(`/team/team-member/${team.id}/`)
        .then(response => {
          setMembers(response.data);
        })
        .catch(error => {
          console.error(error);
        });

      axiosInstance.get(`/team/pending-request/${team.id}/`)
        .then(response => {
          const pendingRequests = response.data;
          const pendingUsers = pendingRequests.map(request => request.user);
          setPendingMembers(pendingUsers);
        })
        .catch(error => {
          console.error(error);
        });

      axiosInstance.get(`/team/tasks/${team.id}/`)
        .then(response => {
          setTasks(response.data);
        })
        .catch(error => {
          console.error(error);
        });

      setIsCreator(userId === team.creator.id);
    }
  }, [team, userId]);

  const handleRemove = async (memberId) => {
    try {
      await axiosInstance.delete(`/team/member-detail/${memberId}/`);
      setMembers(prev => prev.filter(member => member.id !== memberId));
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const handleMemberEditRole = async (memberId, role) => {
    try {
      await axiosInstance.patch(`/team/member-detail/${memberId}/`, { role });
      setMembers(prev => prev.map(member => 
        member.id === memberId ? { ...member, role: role } : member
      ));
    } catch (error) {
      console.error('Error updating member role:', error);
    }
  };

  const handleAccept = async (memberId) => {
    try {
      await axiosInstance.post(`/team/accept-request/`, {
        team_id: team.id,
        user_id: memberId
      });
      setPendingMembers(prev => prev.filter(member => member.id !== memberId));
    } catch (error) {
      console.error('Error accepting member:', error);
    }
  };

  const handleReject = async (memberId) => {
    try {
      await axiosInstance.post(`/team/reject-request/`, {
        team_id: team.id,
        user_id: memberId
      });
      setPendingMembers(prev => prev.filter(member => member.id !== memberId));
    } catch (error) {
      console.error('Error rejecting member:', error);
    }
  };

  const handleAddTask = async (newTask) => {
    try {
      const response = await axiosInstance.post(`/team/tasks/`, newTask);
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      await axiosInstance.put(`team/task/${updatedTask.id}/`, updatedTask);
      setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axiosInstance.delete(`team/task/${taskId}/`);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleDeleteTeam = async () => {
    if (window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      try {
        await axiosInstance.delete(`/team/${team.id}/`);
        navigate('/user/my-team');
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
  };

  const handleSubmitEdit = async (formData) => {
    try {
      const response = await axiosInstance.put(`/team/${team.id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch(setTeam(response.data));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating team:', error);
    }
  };

  const handleGithubLinkSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.patch(`/team/${team.id}/`, { github_link: newGithubLink });
      dispatch(setTeam({ ...team, github_link: response.data.github_link }));
      setNewGithubLink('');
    } catch (error) {
      console.error('Error updating GitHub link:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleStartConference = () => {
    navigate(`/user/team/video-conference/${team.id}`);
  };

  

  if (!team) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1 p-4 mt-16 max-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-24 relative">
        {/* Sidebar Toggle Button */}
        <button 
          onClick={toggleSidebar}
          className="fixed top-20 left-4 z-50 lg:hidden bg-purple-500 text-white p-2 rounded-full shadow-lg"
        >
          {isSidebarOpen ? <FaTimes /> : <FaChevronRight />}
        </button>

        {/* Sidebar */}
        <div className={`fixed lg:static inset-y-0 left-0 z-40 w-64 rounded-lg bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:w-2/9 overflow-hidden`}>
          <div className="h-full flex flex-col">
            <div className="p-5 text-center bg-white border-b">
              <img
                src={team.profile_pic_url}
                alt={team.name}
                className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-purple-100 shadow-md"
              />
              <h2 className="text-xl font-bold text-gray-800 truncate">{team.name}</h2>
            </div>
            <nav className="flex-grow py-4 px-4 overflow-y-auto">
              {[
                { name: 'About', icon: FaInfoCircle },
                { name: 'Tasks', icon: FaTasks },
                { name: 'Members', icon: FaUsers },
                { name: 'Meetings', icon: FaCalendarAlt },
                { name: 'Pending', icon: FaUser, creatorOnly: true },
              ].map(({ name, icon: Icon, creatorOnly }) => (
                (!creatorOnly || isCreator) && (
                  <button
                    key={name}
                    onClick={() => {
                      setActiveSection(name.toLowerCase());
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={`w-full text-left p-2 flex items-center space-x-3 rounded-lg transition-all duration-100 ${
                      activeSection === name.toLowerCase() 
                        ? 'bg-purple-500 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`text-lg ${activeSection === name.toLowerCase() ? 'text-white' : 'text-purple-500'}`} />
                    <span>{name}</span>
                  </button>
                )
              ))}
            </nav>
            <div className="p-4 border-t space-y-3">
              <div className="flex space-x-2">
                <button
                  onClick={handleStartConference}
                  className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center text-sm"
                >
                  <FaVideo className="mr-1" />
                  Video Call
                </button>
                <button
                  onClick={() => navigate('/user/chat/', { state: { team } })}
                  className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition duration-300 flex items-center justify-center text-sm"
                >
                  <FaComment className="mr-1" />
                  Chat
                </button>
              </div>
              {isCreator && (
                <div className="relative mt-2">
                  <button
                    onClick={() => setIsManageTeamOpen(!isManageTeamOpen)}
                    className="w-full bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition duration-300 flex items-center justify-center text-sm"
                  >
                    <FaCog className="mr-1" />
                    Manage Team
                  </button>
                  {isManageTeamOpen && (
                    <div className="absolute bottom-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-2 mb-1">
                      <button
                        onClick={() => {
                          setIsEditModalOpen(true);
                          setIsManageTeamOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-sm"
                      >
                        <FaEdit className="mr-2 text-purple-500" />
                        Edit Team
                      </button>
                      <button
                        onClick={handleDeleteTeam}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-sm text-red-500"
                      >
                        <FaTrash className="mr-2" />
                        Delete Team
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className={`flex-1 overflow-y-auto bg-white shadow-lg rounded-lg ml-4 transition-all duration-300 ${
          isSidebarOpen ? 'lg:ml-3 lg:w-7/9' : 'w-full'
        }`}>
          <div className="p-6">
          
                {activeSection === 'about' && (
                  <TeamAbout team={team} isCreator={isCreator} onUpdateGithub={handleGithubLinkSubmit}/>
                )}

                {activeSection === 'tasks' && (
                  <TaskList
                    tasks={tasks}
                    teamId={team.id}
                    members={members}
                    isCreator={isCreator}
                    onAddTask={handleAddTask}
                    onUpdateTask={handleUpdateTask}
                    onDeleteTask={handleDeleteTask}
                  />
                )}

                {activeSection === 'members' && (
                  <MemberList
                    memberList={members}
                    isPending={false}
                    onRemove={handleRemove}
                    isCreator={isCreator}
                    onEditRole={handleMemberEditRole}
                  />
                )}

                {activeSection === 'pending' && isCreator && (
                  <MemberList
                    members={pendingMembers}
                    isPending={true}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    isCreator={isCreator}
                  />
                )}
                {activeSection === 'meetings' && (
                  <TeamMeeting
                    teamId={team.id}
                    isCreator={isCreator}
                  />
            )}
          </div>
        </div>
      </div>

      <TeamEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleSubmitEdit}
        team={team}
      />
    </div>
  );
};

export default TeamDetails;