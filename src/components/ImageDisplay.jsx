import React from 'react'

export default function ImageDisplay({ originalImage, maskImage }) {
  if (!originalImage || !maskImage) return null

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h2 className="text-lg font-semibold mb-2">Original Image</h2>
        <img src={originalImage} alt="Original" className="w-full rounded-lg" />
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Mask Image</h2>
        <img src={maskImage} alt="Mask" className="w-full rounded-lg" />
      </div>
    </div>
  )
}
