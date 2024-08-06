import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserTag, FaCheck, FaTimes, FaTrash, FaEdit } from 'react-icons/fa';

const MemberList = ({ memberList, isPending, onAccept, onReject, onRemove, isCreator, onEditRole }) => {
  const [members, setMembers] = useState(memberList);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [newRole, setNewRole] = useState('');
  

  const handleRoleUpdate = () => {
    if (selectedMemberId && newRole) {
      console.log(members);
      
      onEditRole(selectedMemberId, newRole);
      members.find(member => member.id == selectedMemberId).role = newRole;
      setSelectedMemberId('');
      setNewRole('');
    }
  };

  return (
    <div className="space-y-6">
      {isCreator && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Assign Role</h3>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <select
              className="w-full sm:w-1/3 p-2 border rounded-md"
              onChange={(e) => setSelectedMemberId(e.target.value)}
              value={selectedMemberId}
            >
              <option value="">Select a member</option>
              {members.map(member => (
                <option key={member.id} value={member.id}>{member.user.fullname}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Enter role"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full sm:w-1/3 p-2 border rounded-md"
            />
            <button
              onClick={handleRoleUpdate}
              disabled={!selectedMemberId || !newRole}
              className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-3xl hover:bg-purple-700 transition duration-300 disabled:opacity-50"
            >
              Assign Role
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {members.map(member => (
          <div key={member.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={member.user.profile_pic || 'default-avatar-url.jpg'}
                alt={member.user.fullname}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <Link to={`/user/profile/${member.user.id}`} className="font-semibold hover:underline">
                  {member.user.fullname}
                </Link>
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <FaUserTag className="mr-1" />
                  {member.role || 'No role assigned'}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              {isPending ? (
                <>
                  <button
                    onClick={() => onAccept(member.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                  >
                    <FaCheck className="inline mr-1" /> Accept
                  </button>
                  <button
                    onClick={() => onReject(member.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                  >
                    <FaTimes className="inline mr-1" /> Reject
                  </button>
                </>
              ) : isCreator && (
                <button
                  onClick={() => onRemove(member.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                >
                  <FaTrash className="inline mr-1" /> Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberList;