import React, { useState } from 'react';
import { FaEdit, FaPlus, FaCheckCircle, FaClock, FaTrash } from 'react-icons/fa';

const TaskList = ({ tasks, members, teamId, isCreator, onAddTask, onUpdateTask, onDeleteTask }) => {
  const [newTask, setNewTask] = useState({ 
    task: '', 
    assigned_to: '', 
    deadline: '', 
    team: teamId,
    completed: false
  });
  
  const [editingTask, setEditingTask] = useState(null);

  const handleNewTaskChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleAddTask = () => {
    onAddTask(newTask);
    setNewTask({ task: '', assigned_to: '', deadline: '', team: teamId, completed: false });
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = () => {
    onUpdateTask(editingTask);
    setEditingTask(null);
  };

  const handleCompletedChange = (taskId, completed) => {
    const updatedTask = tasks.find(task => task.id === taskId);
    onUpdateTask({ ...updatedTask, completed });
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Assign New task</h2>
        {isCreator && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              name="task"
              value={newTask.task}
              onChange={handleNewTaskChange}
              placeholder="Task Description"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="assigned_to"
              value={newTask.assigned_to}
              onChange={handleNewTaskChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Assign to...</option>
              {members.map(member => (
                <option key={member.user.id} value={member.user.id}>{member.user.fullname}</option>
              ))}
            </select>
            <input
              type="datetime-local"
              name="deadline"
              value={newTask.deadline}
              onChange={handleNewTaskChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddTask}
              className="w-full bg-purple-600 text-white px-6 py-2 rounded-3xl hover:bg-purple-800 transition duration-300 flex items-center justify-center"
            >
              <FaPlus className="mr-2" /> Add Task
            </button>
          </div>
        )}
      </div>
      <ul className="divide-y divide-gray-200">
        {tasks.map(task => (
          <li key={task.id} className="p-6 hover:bg-gray-50 transition duration-150 ease-in-out">
            {editingTask && editingTask.id === task.id ? (
              <div className="space-y-4">
                <textarea
                  value={editingTask.task}
                  onChange={(e) => setEditingTask({...editingTask, task: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
                <select
                  value={editingTask.assigned_to}
                  onChange={(e) => setEditingTask({...editingTask, assigned_to: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {members.map(member => (
                    <option key={member.id} value={member.id}>{member.user.fullname}</option>
                  ))}
                </select>
                <input
                  type="datetime-local"
                  value={editingTask.deadline}
                  onChange={(e) => setEditingTask({...editingTask, deadline: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleUpdateTask}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingTask(null)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{task.task}</h3>
                  <div className="flex items-center text-sm text-gray-600 space-x-4">
                    <p>
                      <span className="font-medium">Assigned to:</span> {members.find(m => m.id === task.assigned_to)?.fullname}
                    </p>
                    <p>
                      <span className="font-medium">Due:</span> {new Date(task.deadline).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleCompletedChange(task.id, !task.completed)}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                      task.completed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {task.completed ? (
                      <>
                        <FaCheckCircle />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <FaClock />
                        <span>In Progress</span>
                      </>
                    )}
                  </button>
                  {isCreator && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="text-blue-500 hover:text-blue-700 transition duration-300"
                      >
                        <FaEdit className="text-xl" />
                      </button>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="text-red-500 hover:text-red-700 transition duration-300"
                      >
                        <FaTrash className="text-xl" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;