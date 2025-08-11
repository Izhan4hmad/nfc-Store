import React, { useState, useEffect, useRef } from 'react';
import { Palette, X, Upload, Save, Loader2 } from 'lucide-react';
import { useUploadImage } from '../../../../../../../hook/services';

// Type Definitions
interface Variant {
    _id?: string;
    title: string;
    resellingPrice: number;
}

interface CustomizationData {
    colors: string;
    title: string;
    logo: string | null;
    additionalNotes: string;
    images: { preview: string; url: string }[];
    resellingPrice?: number;
    height?: string;
    width?: string;
    shape?: string;
}

interface CustomizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CustomizationData) => void;
    baseVariant: Variant | null;
    isSubmitting?: boolean;
}

// Constants
const SHAPE_OPTIONS = [
    { value: 'rounded corners', label: 'Rounded Corners' },
    { value: 'circle', label: 'Circle' },
    { value: 'oval', label: 'Oval' },
    { value: 'square', label: 'Square' },
    { value: 'rectangle', label: 'Rectangle' },
];

const POPULAR_COLORS = ['#FF0000', '#FF8C00', '#FFD700', '#32CD32', '#00CED1', '#1E90FF', '#9370DB', '#FF1493', '#000000', '#696969', '#FFFFFF', '#F5F5DC', '#8B4513', '#2F4F4F', '#800080', '#FF6347'];

export default function CustomizationModal({ isOpen, onClose, onSave, baseVariant, isSubmitting }: CustomizationModalProps) {
    // State Management
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [shapeEnabled, setShapeEnabled] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [customizationData, setCustomizationData] = useState<CustomizationData>({
        colors: '',
        title: '',
        logo: null,
        images: [],
        additionalNotes: '',
    });

    const uploadImage = useUploadImage();

    // Effects
    useEffect(() => {
        if (isOpen) {
            setCustomizationData({
                colors: '',
                title: '',
                logo: null,
                images: [],
                additionalNotes: '',
            });
            setShapeEnabled(false);
        }
    }, [isOpen]);

    // Event Handlers
    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const result = await uploadImage({ file, desiredPath: 'design/logo/image', toaster: {} as any });
            const imageUrl = result?.response?.data;

            if (typeof imageUrl === 'string') {
                setCustomizationData((prev) => ({ ...prev, logo: imageUrl }));
            }
        } finally {
            setIsUploading(false);
            if (e.target) e.target.value = '';
        }
    };
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setIsUploading(true);
        try {
            const uploadPromises = files.map((file) => uploadImage({ file, desiredPath: 'design/logo/image', toaster: {} as any }));
            const results = await Promise.all(uploadPromises);
            const validImages = results
                .map((res, index) => {
                    const imageUrl = res?.response?.data;
                    if (typeof imageUrl === 'string' && imageUrl) {
                        return { preview: URL.createObjectURL(files[index]), url: imageUrl };
                    }
                    return null;
                })
                .filter(Boolean) as { preview: string; url: string }[];

            setCustomizationData((prev) => ({ ...prev, images: [...prev.images, ...validImages] }));
        } finally {
            setIsUploading(false);
            if (e.target) e.target.value = '';
        }
    };

    const handleRemoveImage = (index: number) => {
        const imageToRemove = customizationData.images[index];
        if (imageToRemove?.preview.startsWith('blob:')) {
            URL.revokeObjectURL(imageToRemove.preview);
        }
        setCustomizationData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };
    const handleShapeToggle = () => {
        const newEnabledState = !shapeEnabled;
        setShapeEnabled(newEnabledState);
        if (!newEnabledState) {
            setCustomizationData((prev) => ({ ...prev, shape: '' }));
        } else if (SHAPE_OPTIONS.length > 0) {
            setCustomizationData((prev) => ({ ...prev, shape: SHAPE_OPTIONS[0].value }));
        }
    };

    const handleSaveClick = () => {
        onSave(customizationData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Customize Your Design</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" disabled={isUploading}>
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="space-y-6">
                        {/* Custom Text */}
                        <div>
                            <label htmlFor="customText" className="block text-sm font-medium text-gray-700 mb-2">
                                Custom Text
                            </label>
                            <input
                                type="text"
                                id="customText"
                                value={customizationData.title}
                                onChange={(e) => setCustomizationData((prev) => ({ ...prev, title: e.target.value }))}
                                placeholder="Enter your title "
                                maxLength={50}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">{customizationData.title.length}/50 characters</p>
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
                                    value={customizationData.height || ''}
                                    onChange={(e) => setCustomizationData((prev) => ({ ...prev, height: e.target.value }))}
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
                                    value={customizationData.width || ''}
                                    onChange={(e) => setCustomizationData((prev) => ({ ...prev, width: e.target.value }))}
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
                                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${shapeEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}
                                    >
                                        <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${shapeEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>

                            {shapeEnabled && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {SHAPE_OPTIONS.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setCustomizationData((prev) => ({ ...prev, shape: option.value }))}
                                            className={`w-full text-sm px-2 py-1.5 rounded-lg border transition-all ${
                                                customizationData.shape === option.value
                                                    ? 'bg-blue-100 text-blue-800 border-blue-500 font-semibold ring-1 ring-blue-500'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
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
                                            value={customizationData.colors || '#000000'}
                                            onChange={(e) => setCustomizationData((prev) => ({ ...prev, colors: e.target.value }))}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="w-full h-full rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: customizationData.colors || '#000000' }} />
                                    </div>

                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={customizationData.colors || ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value.match(/^#[0-9A-Fa-f]{0,6}$/)) {
                                                    setCustomizationData((prev) => ({ ...prev, colors: value }));
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
                                                onClick={() => setCustomizationData((prev) => ({ ...prev, colors: color }))}
                                                className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                                                    customizationData.colors === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {customizationData.colors && (
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: customizationData.colors }} />
                                        <span className="text-sm text-gray-700 font-medium">Selected: {customizationData.colors.toUpperCase()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Logo Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Logo</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                {customizationData.logo ? (
                                    <div className="text-center">
                                        <img src={customizationData.logo} alt="Uploaded logo" className="mx-auto mb-2 max-h-20 object-contain" />
                                        <button onClick={() => setCustomizationData((prev) => ({ ...prev, logo: null }))} className="text-red-600 text-sm hover:text-red-700">
                                            Remove Logo
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        {isUploading ? <Loader2 className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-spin" /> : <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />}
                                        <p className="text-gray-600 mb-2">{isUploading ? 'Uploading...' : 'Upload your logo'}</p>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            disabled={isUploading}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Image Upload */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">Product Images</label>

                            {/* Upload Button */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="w-full flex items-center justify-center gap-2 px-3 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                                {isUploading ? 'Uploading...' : 'Upload Product Images'}
                            </button>

                            {/* Image Preview Grid */}
                            {customizationData.images.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                    {customizationData.images.map((image, index) => (
                                        <div key={index} className="relative group aspect-square">
                                            <img src={image.preview || '/placeholder.svg'} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-lg border border-gray-200" />
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

                            {/* Hidden File Input */}
                            <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                        </div>
                        {/* Additional Notes */}
                        <div>
                            <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
                                Additional Notes
                            </label>
                            <textarea
                                id="additionalNotes"
                                value={customizationData.additionalNotes}
                                onChange={(e) => setCustomizationData((prev) => ({ ...prev, additionalNotes: e.target.value }))}
                                placeholder="Any special instructions or requirements..."
                                rows={3}
                                maxLength={200}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">{customizationData.additionalNotes.length}/200 characters</p>
                        </div>
                        <div>
                            <label htmlFor="resellingPrice" className="block text-sm font-medium text-gray-700 mb-1">
                                Reselling Price ($)
                            </label>
                            <input
                                id="resellingPrice"
                                type="number"
                                min="0"
                                step="0.1"
                                value={customizationData.resellingPrice}
                                onChange={(e) => setCustomizationData((prev) => ({ ...prev, resellingPrice: Number(e.target.value) }))}
                                placeholder="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex gap-3 mt-8">
                        <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" disabled={isUploading}>
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveClick}
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                            disabled={isUploading}
                        >
                            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save Custom Design
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
