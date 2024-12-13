import React from 'react'

export default function ImageUpload({ setUploadedImage }) {
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.substr(0, 5) === "image") {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="mb-8">
      <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">
        Upload an image (JPEG/PNG)
      </label>
      <input
        type="file"
        id="image-upload"
        accept="image/*"
        onChange={handleImageUpload}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
    </div>
  )
}
