import React from 'react';

const Table = ({ list, onDelete }) => {
  return (
    <div className="w-full overflow-x-auto bg-white rounded-lg shadow-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            <th scope="col" className="px-4 py-3">Sl No</th>
            <th scope="col" className="px-4 py-3">Skills</th>
            <th scope="col" className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {list.map((skill, index) => (
            <tr className="bg-white border-b hover:bg-gray-100" key={skill.id}>
              <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                {index + 1}
              </th>
              <td className="px-4 py-3">{skill.name}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onDelete(skill.id)}
                  className="font-medium text-blue-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
