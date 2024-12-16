import React, { useState } from 'react';
import { useCanvas } from '../hooks/useCanvas';
import { BrushSizeControl } from './BrushSizeControl';
import { ActionButtons } from './ActionButtons';

export default function ImageInpaintingWidget() {
  const [brushSize, setBrushSize] = useState(10);
  const [maskImage, setMaskImage] = useState(null);
  const {
    canvasRef,
    maskCanvasRef,
    image,
    handleImageUpload,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas
  } = useCanvas(brushSize);

  const handleExport = () => {
    const maskCanvas = maskCanvasRef.current;
    setMaskImage(maskCanvas.toDataURL());
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Image Inpainting Widget</h1>
      <div className="mb-4">
        <input
          type="file"
          accept="image/jpeg, image/png"
          onChange={(e) => handleImageUpload(e.target.files[0])}
          className="mb-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      <div className="mb-4 relative">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="border border-gray-300 bg-gray-100"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        <canvas
          ref={maskCanvasRef}
          className="hidden"
        />
        {!image && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            Upload an image to start
          </div>
        )}
      </div>
      <BrushSizeControl brushSize={brushSize} setBrushSize={setBrushSize} />
      <ActionButtons onExport={handleExport} onClear={clearCanvas} />
      {image && maskImage && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Original Image</h2>
            <img 
              src={image.src} 
              alt="Original" 
              className="max-w-full h-auto border border-gray-300" 
              style={{ maxHeight: '300px', width: 'auto' }}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Mask Image</h2>
            <img 
              src={maskImage} 
              alt="Mask" 
              className="max-w-full h-auto border border-gray-300"
              style={{ maxHeight: '300px', width: 'auto' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

