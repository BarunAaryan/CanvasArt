import React, { useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'

export default function Canvas({ uploadedImage, setMaskImage }) {
  const canvasRef = useRef(null)
  const [canvas, setCanvas] = useState(null)
  const [brushSize, setBrushSize] = useState(20)

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
      width: 500,
      height: 500,
    })
    setCanvas(canvas)

    return () => {
      canvas.dispose()
    }
  }, [])

  useEffect(() => {
    if (canvas && uploadedImage) {
      fabric.Image.fromURL(uploadedImage, (img) => {
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          scaleX: canvas.width / img.width,
          scaleY: canvas.height / img.height,
        })
      })
    }
  }, [canvas, uploadedImage])

  useEffect(() => {
    if (canvas) {
      canvas.freeDrawingBrush.width = brushSize
      canvas.freeDrawingBrush.color = 'white'
    }
  }, [canvas, brushSize])

  const handleExport = () => {
    const dataURL = canvas.toDataURL({
      format: 'png',
      multiplier: 1,
      width: canvas.width,
      height: canvas.height,
    })
    setMaskImage(dataURL)
  }

  const handleClear = () => {
    canvas.clear()
    canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas))
    fabric.Image.fromURL(uploadedImage, (img) => {
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        scaleX: canvas.width / img.width,
        scaleY: canvas.height / img.height,
      })
    })
  }

  return (
    <div className="mb-8">
      <div className="mb-4">
        <label htmlFor="brush-size" className="block text-sm font-medium text-gray-700 mb-2">
          Brush Size: {brushSize}px
        </label>
        <input
          type="range"
          id="brush-size"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      <canvas ref={canvasRef} className="border border-gray-300 rounded-lg" />
      <div className="mt-4 flex justify-between">
        <button
          onClick={handleExport}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Export Mask
        </button>
        <button
          onClick={handleClear}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Clear Canvas
        </button>
      </div>
    </div>
  )
}
