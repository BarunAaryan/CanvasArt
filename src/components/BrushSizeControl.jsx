import React from 'react';

export const BrushSizeControl = ({ brushSize, setBrushSize }) => (
  <div className="mb-4">
    <label htmlFor="brush-size" className="block text-sm font-medium text-gray-700 mb-1">
      Brush Size: {brushSize}px
    </label>
    <input
      id="brush-size"
      type="range"
      min="1"
      max="50"
      value={brushSize}
      onChange={(e) => setBrushSize(Number(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
    />
  </div>
);

