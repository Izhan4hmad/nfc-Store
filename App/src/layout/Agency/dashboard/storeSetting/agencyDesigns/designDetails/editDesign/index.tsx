"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { X, Upload, Save, Loader2, Trash2 } from "lucide-react"
import { useUploadImage } from "../../../../../../../hook/services"

interface Variant {
  _id?: string
  title: string
  resellingPrice: number
  agencyCreated: boolean
  createdBy: string | null
  quantity: number
  colors: string
  logo: string | null
  additionalNotes: string
  height?: string
  width?: string
  shape?: string
  imageUrls: string[]
}

interface EditDesignModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Variant) => Promise<void>
  onDelete?: () => void
  variant: Variant | null
  isSubmitting?: boolean
  isDeleting?: boolean
}

const SHAPE_OPTIONS = [
  { value: "rounded corners", label: "Rounded Corners" },
  { value: "circle", label: "Circle" },
  { value: "oval", label: "Oval" },
  { value: "square", label: "Square" },
  { value: "rectangle", label: "Rectangle" },
]

const POPULAR_COLORS = [
  "#FF0000",
  "#FF8C00",
  "#FFD700",
  "#32CD32",
  "#00CED1",
  "#1E90FF",
  "#9370DB",
  "#FF1493",
  "#000000",
  "#696969",
  "#FFFFFF",
  "#F5F5DC",
  "#8B4513",
  "#2F4F4F",
  "#800080",
  "#FF6347",
]

export const EditDesignModal = ({
  isOpen,
  onClose,
  onSave,
  variant,
  isSubmitting,
  isDeleting,
}: EditDesignModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [shapeEnabled, setShapeEnabled] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const uploadImage = useUploadImage()

  // Initialize with safe defaults
  const [editData, setEditData] = useState<Variant>({
    title: "",
    resellingPrice: 0,
    agencyCreated: true,
    createdBy: "",
    quantity: 1,
    colors: "#000000",
    logo: null,
    additionalNotes: "",
    imageUrls: [],
  })

  const [images, setImages] = useState<{ preview: string; url: string }[]>([])

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && variant) {
      try {
        setError(null)
        setEditData({
          ...variant,
          colors: variant.colors || "#000000",
          additionalNotes: variant.additionalNotes || "",
          title: variant.title || "",
        })
        setShapeEnabled(!!variant.shape)

        // Safely handle image URLs
        const imageUrls = Array.isArray(variant.imageUrls) ? variant.imageUrls : []
        setImages(imageUrls.map((url) => ({ preview: url, url })))
      } catch (initError) {
        console.error("Error initializing modal data:", initError)
        setError("Failed to load variant data. Please try again.")
      }
    }
  }, [isOpen, variant])

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !uploadImage) return

    setIsUploading(true)
    setError(null)

    try {
      const result = await uploadImage({
        file,
        desiredPath: "design/logo/image",
        toaster: {} as any,
      })

      const imageUrl = result?.response?.data
      if (typeof imageUrl === "string") {
        setEditData((prev) => ({ ...prev, logo: imageUrl }))
      } else {
        throw new Error("Invalid response from upload service")
      }
    } catch (uploadError) {
      console.error("Logo upload error:", uploadError)
      setError("Failed to upload logo. Please try again.")
    } finally {
      setIsUploading(false)
      if (e.target) e.target.value = ""
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0 || !uploadImage) return

    setIsUploading(true)
    setError(null)

    try {
      const uploadPromises = files.map((file) =>
        uploadImage({ file, desiredPath: "design/logo/image", toaster: {} as any }),
      )

      const results = await Promise.all(uploadPromises)

      const newImages = results
        .map((res, index) => ({
          preview: URL.createObjectURL(files[index]),
          url: res?.response?.data || "",
        }))
        .filter((img) => img.url)

      if (newImages.length > 0) {
        setImages((prev) => [...prev, ...newImages])
      } else {
        throw new Error("No images were successfully uploaded")
      }
    } catch (uploadError) {
      console.error("Image upload error:", uploadError)
      setError("Failed to upload images. Please try again.")
    } finally {
      setIsUploading(false)
      if (e.target) e.target.value = ""
    }
  }

  const handleRemoveImage = (index: number) => {
    try {
      const imageToRemove = images[index]
      if (imageToRemove?.preview.startsWith("blob:")) {
        URL.revokeObjectURL(imageToRemove.preview)
      }
      setImages((prev) => prev.filter((_, i) => i !== index))
    } catch (removeError) {
      console.error("Error removing image:", removeError)
    }
  }

  const handleShapeToggle = () => {
    const newEnabledState = !shapeEnabled
    setShapeEnabled(newEnabledState)
    if (!newEnabledState) {
      setEditData((prev) => ({ ...prev, shape: undefined }))
    }
  }

  const handleSaveClick = async () => {
    try {
      setError(null)

      // Validate required fields
      if (!editData.title.trim()) {
        setError("Design title is required")
        return
      }

      if (editData.resellingPrice <= 0) {
        setError("Price must be greater than 0")
        return
      }

      const dataToSave = {
        ...editData,
        imageUrls: images.map((img) => img.url).filter((url) => url),
      }

      await onSave(dataToSave)
    } catch (saveError) {
      console.error("Save error:", saveError)
      setError("Failed to save changes. Please try again.")
    }
  }

  // Don't render if not open
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Design</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isUploading || isSubmitting}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Design Title */}
            <div>
              <label htmlFor="designTitle" className="block text-sm font-medium text-gray-700 mb-2">
                Design Title *
              </label>
              <input
                type="text"
                id="designTitle"
                value={editData.title}
                onChange={(e) => setEditData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter design title"
                maxLength={50}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">{editData.title.length}/50 characters</p>
            </div>

            {/* Price */}
            <div>
              <label htmlFor="variantPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                <input
                  id="variantPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editData.resellingPrice}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      resellingPrice: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="variantHeight" className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  id="variantHeight"
                  type="number"
                  min="0"
                  step="0.1"
                  value={editData.height || ""}
                  onChange={(e) => setEditData((prev) => ({ ...prev, height: e.target.value }))}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="variantWidth" className="block text-sm font-medium text-gray-700 mb-1">
                  Width (cm)
                </label>
                <input
                  id="variantWidth"
                  type="number"
                  min="0"
                  step="0.1"
                  value={editData.width || ""}
                  onChange={(e) => setEditData((prev) => ({ ...prev, width: e.target.value }))}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Shape Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Shape</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Enable</span>
                  <button
                    type="button"
                    onClick={handleShapeToggle}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      shapeEnabled ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        shapeEnabled ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
              {shapeEnabled && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SHAPE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setEditData((prev) => ({ ...prev, shape: option.value }))}
                      className={`w-full text-sm px-2 py-1.5 rounded-lg border transition-all ${
                        editData.shape === option.value
                          ? "bg-blue-100 text-blue-800 border-blue-500 font-semibold ring-1 ring-blue-500"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Color Selection */}
            <div>
              <label htmlFor="variantColor" className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10">
                    <input
                      id="variantColor"
                      type="color"
                      value={editData.colors || "#000000"}
                      onChange={(e) => setEditData((prev) => ({ ...prev, colors: e.target.value }))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div
                      className="w-full h-full rounded-full border border-gray-300 shadow-sm"
                      style={{ backgroundColor: editData.colors || "#000000" }}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={editData.colors || ""}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value.match(/^#[0-9A-Fa-f]{0,6}$/)) {
                          setEditData((prev) => ({ ...prev, colors: value }))
                        }
                      }}
                      placeholder="#000000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-2">Popular Colors</p>
                  <div className="grid grid-cols-8 gap-2">
                    {POPULAR_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setEditData((prev) => ({ ...prev, colors: color }))}
                        className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                          editData.colors === color
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {editData.logo ? (
                  <div className="text-center">
                    <img
                      src={editData.logo || "/placeholder.svg"}
                      alt="Uploaded logo"
                      className="mx-auto mb-2 max-h-20 object-contain"
                    />
                    <button
                      onClick={() => setEditData((prev) => ({ ...prev, logo: null }))}
                      className="text-red-600 text-sm hover:text-red-700"
                    >
                      Remove Logo
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    {isUploading ? (
                      <Loader2 className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-spin" />
                    ) : (
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    )}
                    <p className="text-gray-600 mb-2">{isUploading ? "Uploading..." : "Upload your logo"}</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      disabled={isUploading || !uploadImage}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Product Images */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Product Images</label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || !uploadImage}
                className="w-full flex items-center justify-center gap-2 px-3 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                {isUploading ? "Uploading..." : "Upload Product Images"}
              </button>

              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={image.preview || "/placeholder.svg?height=100&width=100"}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                        title="Remove image"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading || !uploadImage}
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                id="additionalNotes"
                value={editData.additionalNotes}
                onChange={(e) => setEditData((prev) => ({ ...prev, additionalNotes: e.target.value }))}
                placeholder="Any special instructions or requirements..."
                rows={3}
                maxLength={200}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">{editData.additionalNotes.length}/200 characters</p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            

            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isUploading || isSubmitting}
            >
              Cancel
            </button>

            <button
              onClick={handleSaveClick}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              disabled={isUploading || isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
