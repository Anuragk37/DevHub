import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserTag, FaCheck, FaTimes, FaTrash, FaEdit } from 'react-icons/fa';
import defaultPic from '../../assets/default.jpg';
import 'react-tabs/style/react-tabs.css';

const MemberList = ({ members, isPending, onAccept, onReject, onRemove, isCreator, onEditRole }) => {
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [newRole, setNewRole] = useState('');

  const handleRoleUpdate = (memberId) => {
    onEditRole(memberId, newRole);
    setEditingMemberId(null);
    setNewRole('');
  };

  return (
    <ul className="space-y-4">
      {members.map(member => (
        <li key={member.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center mb-2 sm:mb-0">
              <Link to={`/user/profile/${member.user.id}`} className="flex items-center">
                <img
                  src={member.user.profile_pic || defaultPic}
                  alt={member.user.fullname}
                  className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-purple-200"
                />
                <span className="text-lg font-medium text-gray-800">{member.user.fullname}</span>
              </Link>
            </div>
            
            {!isPending && (
              <div className="flex items-center mt-2 sm:mt-0">
                <FaUserTag className="text-purple-500 mr-2" />
                {editingMemberId === member.id ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="border border-purple-300 rounded-md focus:outline-none focus:border-purple-500 text-sm p-1 mr-2"
                      placeholder="Enter role"
                    />
                    <button
                      onClick={() => handleRoleUpdate(member.id)}
                      className="bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600 transition duration-300"
                      title="Save Role"
                    >
                      <FaCheck />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">{member.role || 'No role assigned'}</span>
                    {isCreator && (
                      <button
                        onClick={() => {
                          setEditingMemberId(member.id);
                          setNewRole(member.role || '');
                        }}
                        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-300"
                        title="Edit Role"
                      >
                        <FaEdit />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
            
            <div className="flex items-center mt-2 sm:mt-0">
              {isPending ? (
                <>
                  <button
                    onClick={() => onAccept(member.id)}
                    className="bg-green-500 text-white p-2 rounded-full mr-2 hover:bg-green-600 transition duration-300"
                    title="Accept"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={() => onReject(member.id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition duration-300"
                    title="Reject"
                  >
                    <FaTimes />
                  </button>
                </>
              ) : isCreator && (
                <button
                  onClick={() => onRemove(member.id)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition duration-300"
                  title="Remove Member"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default MemberList;