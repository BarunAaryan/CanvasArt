import React from 'react';

export const ActionButtons = ({ onExport, onClear }) => (
  <div className="mb-4 flex space-x-2">
    <button
      onClick={onExport}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Export Mask
    </button>
    <button
      onClick={onClear}
      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
    >
      Clear Canvas
    </button>
  </div>
);

