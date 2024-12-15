import { useState, useRef, useEffect } from 'react';
import { calculateScale, getCoordinates } from '../utils/imageUtils';

export const useCanvas = (brushSize) => {
  const [image, setImage] = useState(null);
  //const [scale, setScale] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const maskCanvasRef = useRef(null);
  const ctxRef = useRef(null);
  const maskCtxRef = useRef(null);

  useEffect(() => {
    if (ctxRef.current && maskCtxRef.current) {
      ctxRef.current.lineWidth = brushSize;
      maskCtxRef.current.lineWidth = brushSize;
    }
  }, [brushSize]);

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const newScale = calculateScale(img.width, img.height);
        //setScale(newScale);

        const canvas = canvasRef.current;
        const maskCanvas = maskCanvasRef.current;
        
        const scaledWidth = img.width * newScale;
        const scaledHeight = img.height * newScale;
        
        canvas.width = scaledWidth;
        canvas.height = scaledHeight;
        maskCanvas.width = scaledWidth;
        maskCanvas.height = scaledHeight;
        
        const ctx = canvas.getContext('2d');
        const maskCtx = maskCanvas.getContext('2d');
        
        ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
        maskCtx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
        
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
  };

  const startDrawing = (event) => {
    const coords = getCoordinates(event, canvasRef.current);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(coords.x, coords.y);
    maskCtxRef.current.beginPath();
    maskCtxRef.current.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (event) => {
    if (!isDrawing) return;
    const coords = getCoordinates(event, canvasRef.current);
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

  const clearCanvas = () => {
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

  return {
    canvasRef,
    maskCanvasRef,
    image,
    handleImageUpload,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas
  };
};

