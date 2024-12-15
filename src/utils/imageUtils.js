export const calculateScale = (imgWidth, imgHeight) => {
    const maxWidth = Math.min(800, window.innerWidth - 40);
    const maxHeight = 600;
    const scaleX = maxWidth / imgWidth;
    const scaleY = maxHeight / imgHeight;
    return Math.min(scaleX, scaleY);
  };
  
  export const getCoordinates = (event, canvas) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };
  
  