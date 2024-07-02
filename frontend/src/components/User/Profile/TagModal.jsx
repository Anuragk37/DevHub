import React from 'react';

const TagModal = ({ onClose, children }) => {
  console.log(children);
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-10"></div>
      <div className=" max-w-lg md:w-4/6 mx-auto p-6 z-50">
      <button
          className="mt-4 text-end text-purple-900 px-4 py-2 rounded"
          onClick={onClose}
        >
          X
        </button>
        {children}
        
      </div>
    </div>
  );
};

export default TagModal;
