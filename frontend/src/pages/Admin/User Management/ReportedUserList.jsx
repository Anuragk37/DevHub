import React, { useState, useEffect } from 'react';
import Header from '../../../components/Admin/Header';
import SideBar from '../../../components/Admin/SideBar';
import axiosInstance from '../../../utils/axiosInstance';

const ReportedUserList = () => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const response = await axiosInstance.get('account/reorted-users/');
      console.log(response.data);
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleBlock = async (id) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/admin/block-user/${id}/`);
      getUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnblock = async (id) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/admin/unblock-user/${id}/`);
      getUsers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Header />
      <SideBar />
      <div className="flex flex-col min-h-full sm:mx-5 md:ml-64 mt-8 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">User Management</h2>
        <div className="w-full lg:w-4/5 bg-white shadow-lg rounded-lg overflow-hidden mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-admin-sideBar">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Sl No</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Profile pic</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Username</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Date Joined</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {users.map((user, index) => (
                  <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50 transition duration-150 ease-in-out">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{index + 1}</td>
                    <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover border-2 border-admin-sideBar"
                              src={user.profile_pic || 'https://via.placeholder.com/40'}
                              alt={user.username}
                            />
                          </div>
                        </div>
                      </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{user.fullname}</td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{user.username}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{user.email}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{user.phone_number}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{user.date_joined}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {user.is_active ? (
                        <a onClick={() => handleBlock(user.id)} className="font-medium text-blue-600 hover:underline cursor-pointer">Block</a>
                      ) : (
                        <a onClick={() => handleUnblock(user.id)} className="font-medium text-blue-600 hover:underline cursor-pointer">Unblock</a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportedUserList;
