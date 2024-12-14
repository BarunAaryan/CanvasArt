import React, { useState, useRef, useEffect } from 'react';

export default function ImageInpaintingWidget() {
  const [image, setImage] = useState(null);
  const [maskImage, setMaskImage] = useState(null);
  const [brushSize, setBrushSize] = useState(10);
  const [isDrawing, setIsDrawing] = useState(false);
  const [scale, setScale] = useState(1);
  const canvasRef = useRef(null);
  const maskCanvasRef = useRef(null);
  const ctxRef = useRef(null);
  const maskCtxRef = useRef(null);

  const calculateScale = (imgWidth, imgHeight) => {
    const maxWidth = Math.min(800, window.innerWidth - 40); // 40px for padding
    const maxHeight = 600; // Maximum height we want to allow
    
    const scaleX = maxWidth / imgWidth;
    const scaleY = maxHeight / imgHeight;
    return Math.min(scaleX, scaleY);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const newScale = calculateScale(img.width, img.height);
          setScale(newScale);

          const canvas = canvasRef.current;
          const maskCanvas = maskCanvasRef.current;
          
          // Set scaled dimensions
          const scaledWidth = img.width * newScale;
          const scaledHeight = img.height * newScale;
          
          canvas.width = scaledWidth;
          canvas.height = scaledHeight;
          maskCanvas.width = scaledWidth;
          maskCanvas.height = scaledHeight;
          
          const ctx = canvas.getContext('2d');
          const maskCtx = maskCanvas.getContext('2d');
          
          // Draw scaled image
          ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
          maskCtx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
          
          setImage(img);
          
          // Set drawing styles
          ctx.lineCap = 'round';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = brushSize;
          
          maskCtx.lineCap = 'round';
          maskCtx.strokeStyle = 'white';
          maskCtx.lineWidth = brushSize;
          
          ctxRef.current = ctx;
          maskCtxRef.current = maskCtx;
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const getCoordinates = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  const startDrawing = (event) => {
    const coords = getCoordinates(event);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(coords.x, coords.y);
    maskCtxRef.current.beginPath();
    maskCtxRef.current.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (event) => {
    if (!isDrawing) return;
    const coords = getCoordinates(event);
    ctxRef.current.lineTo(coords.x, coords.y);
    ctxRef.current.stroke();
    maskCtxRef.current.lineTo(coords.x, coords.y);
    maskCtxRef.current.stroke();
  };

  const stopDrawing = () => {
    ctxRef.current.closePath();
    maskCtxRef.current.closePath();
    setIsDrawing(false);
  };

  const handleExport = () => {
    const maskCanvas = maskCanvasRef.current;
    setMaskImage(maskCanvas.toDataURL());
  };

  const handleClear = () => {
    if (!image) return;

    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const maskCtx = maskCanvas.getContext('2d');
    
    const scaledWidth = canvas.width;
    const scaledHeight = canvas.height;
    
    ctx.clearRect(0, 0, scaledWidth, scaledHeight);
    maskCtx.clearRect(0, 0, scaledWidth, scaledHeight);
    
    ctx.drawImage(image, 0, 0, scaledWidth, scaledHeight);
    maskCtx.drawImage(image, 0, 0, scaledWidth, scaledHeight);
    
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = brushSize;
    
    maskCtx.lineCap = 'round';
    maskCtx.strokeStyle = 'white';
    maskCtx.lineWidth = brushSize;
  };

  useEffect(() => {
    if (ctxRef.current && maskCtxRef.current) {
      ctxRef.current.lineWidth = brushSize;
      maskCtxRef.current.lineWidth = brushSize;
    }
  }, [brushSize]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Image Inpainting Widget</h1>
      <div className="mb-4">
        <input
          type="file"
          accept="image/jpeg, image/png"
          onChange={handleImageUpload}
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
      <div className="mb-4 flex space-x-2">
        <button
          onClick={handleExport}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Export Mask
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Clear Canvas
        </button>
      </div>
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

