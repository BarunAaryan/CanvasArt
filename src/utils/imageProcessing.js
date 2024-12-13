export function processImage(canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
  
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
  
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg > 128 ? 255 : 0;     // R
      data[i + 1] = avg > 128 ? 255 : 0; // G
      data[i + 2] = avg > 128 ? 255 : 0; // B
    }
  
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  }
  
  