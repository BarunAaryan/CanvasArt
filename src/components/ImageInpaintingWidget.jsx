import React, { useState, useRef, useEffect } from 'react';

export default function ImageInpaintingWidget() {
  const [image, setImage] = useState(null);
  const [maskImage, setMaskImage] = useState(null);
  const [brushSize, setBrushSize] = useState(10);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const maskCanvasRef = useRef(null);
  const ctxRef = useRef(null);
  const maskCtxRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (canvas && maskCanvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;
      
      const ctx = canvas.getContext('2d');
      const maskCtx = maskCanvas.getContext('2d');
      
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = brushSize;
      
      maskCtx.lineCap = 'round';
      maskCtx.strokeStyle = 'white';
      maskCtx.lineWidth = brushSize;
      
      ctxRef.current = ctx;
      maskCtxRef.current = maskCtx;
    }
  }, []);

  useEffect(() => {
    if (ctxRef.current && maskCtxRef.current) {
      ctxRef.current.lineWidth = brushSize;
      maskCtxRef.current.lineWidth = brushSize;
    }
  }, [brushSize]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          const maskCanvas = maskCanvasRef.current;
          canvas.width = img.width;
          canvas.height = img.height;
          maskCanvas.width = img.width;
          maskCanvas.height = img.height;
          
          const ctx = canvas.getContext('2d');
          const maskCtx = maskCanvas.getContext('2d');
          
          ctx.drawImage(img, 0, 0);
          maskCtx.drawImage(img, 0, 0);
          
          setImage(img);
          
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

  const startDrawing = ({ nativeEvent }) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (nativeEvent.clientX - rect.left) * scaleX;
    const y = (nativeEvent.clientY - rect.top) * scaleY;

    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    maskCtxRef.current.beginPath();
    maskCtxRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (nativeEvent.clientX - rect.left) * scaleX;
    const y = (nativeEvent.clientY - rect.top) * scaleY;

    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
    maskCtxRef.current.lineTo(x, y);
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
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const maskCtx = maskCanvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    
    if (image) {
      ctx.drawImage(image, 0, 0);
      maskCtx.drawImage(image, 0, 0);
    }
    
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = brushSize;
    
    maskCtx.lineCap = 'round';
    maskCtx.strokeStyle = 'white';
    maskCtx.lineWidth = brushSize;
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
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
          className="border border-gray-300 w-full h-auto object-contain bg-gray-100"
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
            <img src={image.src} alt="Original" className="max-w-full h-auto border border-gray-300" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Mask Image</h2>
            <img src={maskImage} alt="Mask" className="max-w-full h-auto border border-gray-300" />
          </div>
        </div>
      )}
    </div>
  );
}

