import React, { useState, useRef } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { processImage } from '../utils/imageProcessing';

export default function ImageInpaintingWidget() {
  const [image, setImage] = useState(null);
  const [maskImage, setMaskImage] = useState(null);
  const [brushRadius, setBrushRadius] = useState(10);
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const handleExport = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current.canvas.drawing;
      const mask = processImage(canvas);
      setMaskImage(mask);
    }
  };

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Image Inpainting Widget</h1>
      <div className="mb-4">
        <input
          type="file"
          accept="image/jpeg, image/png"
          onChange={handleImageUpload}
          className="mb-2"
        />
      </div>
      {image && (
        <div className="mb-4">
          <CanvasDraw
            ref={canvasRef}
            imgSrc={image}
            brushRadius={brushRadius}
            brushColor="white"
            backgroundColor="black"
            className="border border-gray-300"
          />
          <div className="mt-2">
            <label htmlFor="brush-size" className="mr-2">
              Brush Size:
            </label>
            <input
              id="brush-size"
              type="range"
              min="1"
              max="50"
              value={brushRadius}
              onChange={(e) => setBrushRadius(Number(e.target.value))}
              className="mr-2"
            />
            <span>{brushRadius}px</span>
          </div>
          <div className="mt-2">
            <button
              onClick={handleExport}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Export Mask
            </button>
            <button
              onClick={handleClear}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Clear Canvas
            </button>
          </div>
        </div>
      )}
      {image && maskImage && (
        <div className="flex justify-between mt-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Original Image</h2>
            <img src={image} alt="Original" className="max-w-xs" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Mask Image</h2>
            <img src={maskImage} alt="Mask" className="max-w-xs" />
          </div>
        </div>
      )}
    </div>
  );
}

