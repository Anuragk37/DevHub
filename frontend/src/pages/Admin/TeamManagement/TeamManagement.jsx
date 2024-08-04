import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import Header from "../../../components/Admin/Header";
import SideBar from "../../../components/Admin/SideBar";

const TeamManagement = () => {
  const [teams, setteams] = useState([]);
  const [modalImage, setModalImage] = useState(null);

  const getTeams = async () => {
    try {
      const response = await axiosInstance.get("team/create-team");
      console.log(response.data);
      setteams(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
   getTeams();
  }, []);

  return (
    <div>
      <Header />
      <SideBar />
      <div className="flex flex-col min-h-full sm:mx-5 md:ml-64 mt-8 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Team Management</h2>
        <div className="flex justify-center w-full">
          <div className="w-full lg:w-5/6 bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-admin-sideBar">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Sl No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Profile
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Created Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Creator
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Member Count
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {teams.map((team, index) => (
                    <tr key={team.id} className="border-b border-gray-200 hover:bg-gray-50 transition duration-150 ease-in-out">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover border-2 border-admin-sideBar"
                              src={team.profile_pic_url || 'https://via.placeholder.com/40'}
                              alt={team.name}
                              onClick={() => setModalImage(team.profile_pic_url)}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        {team.name}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {new Date(team.created_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {team.creator.fullname}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {team.members_required}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setModalImage(null)}>
          <div className="max-w-xl max-h-xl p-2 bg-white rounded-lg">
            <img src={modalImage} alt="Enlarged view" className="max-w-full max-h-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
