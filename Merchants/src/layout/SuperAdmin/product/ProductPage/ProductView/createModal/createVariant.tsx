// src/components/VariantModal.tsx

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useUploadImage } from '../../../../../../hook/services'; // Adjust path
import { X, Loader2, Upload } from 'lucide-react';

// --- TYPE DEFINITIONS (passed as props or defined here) ---
interface Variant {
    _id?: string;
    title: string;
    height: string;
    width: string;
    color: string;
    shape: string;
    imageUrls: string[];
    quantity: number;
    unitPrice: number;
    // resellingPrice: number;
}

interface formData {
    _id?: string;
    title: string;
    height: string;
    width: string;
    color: string;
    shape: string;
    images: Array<{ preview: string; url: string }>;
    quantity: string;
    unitPrice: string;
    // resellingPrice: string;
}

// --- CONSTANTS ---
const SHAPE_OPTIONS = [
    { value: 'rounded corners', label: 'Rounded Corners' },
    { value: 'circle', label: 'Circle' },
    { value: 'oval', label: 'Oval' },
    { value: 'square', label: 'Square' },
    { value: 'rectangle', label: 'Rectangle' },
];

// --- COMPONENT PROPS ---
interface VariantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (variant: Variant, isEditing: boolean) => void;
    editingVariant: Variant | null;
    isSubmitting: boolean;
}

export default function VariantModal({ isOpen, onClose, onSave, editingVariant, isSubmitting }: VariantModalProps) {
    const [formData, setFormData] = useState<formData>({
        title: '',
        height: '', 
        width: '', 
        color: '',  
        shape: '', 
        images: [],
     quantity: '', 
     unitPrice: '', 
    //  resellingPrice: ''
    });
    const [shapeEnabled, setShapeEnabled] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadImage = useUploadImage();

    // --- EFFECT TO POPULATE FORM WHEN EDITING ---
    useEffect(() => {
        if (editingVariant) {
            setShapeEnabled(!!editingVariant.shape);
            setFormData({
                _id: editingVariant._id,
                title: editingVariant.title,
                height: editingVariant.height,
                width: editingVariant.width,
                color: editingVariant.color,
                shape: editingVariant.shape,
                images: editingVariant.imageUrls.map(url => ({ preview: url, url })),
                quantity: String(editingVariant.quantity),
                unitPrice: String(editingVariant.unitPrice),
                // resellingPrice: String(editingVariant.resellingPrice),
            });
        } else {
            // Reset form when creating a new variant
            setShapeEnabled(false);
            setFormData({ 
                title: '', 
                height: '', 
                width: '', 
                color: '#000000', 
                shape: '', 
                images: [], 
                quantity: '', 
                unitPrice: '', 
                // resellingPrice: '' 
            });
        }
    }, [editingVariant, isOpen]);

    // --- FORM VALIDATION ---
    const isFormValid = useMemo(() =>
        !!formData.title && 
        !!formData.height && 
        !!formData.width && 
        !!formData.color && 
        !!formData.quantity &&
        !!formData.unitPrice && 
        // !!formData.resellingPrice &&
        !isNaN(Number(formData.quantity)) && 
        !isNaN(Number(formData.unitPrice)),
        // !isNaN(Number(formData.resellingPrice)),
        [formData]
    );

    // --- IMAGE HANDLING ---
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setIsUploading(true);
        try {
            const uploadPromises = files.map(file => uploadImage({ file, desiredPath: 'design/logo/image', toaster: {} as any }));
            const results = await Promise.all(uploadPromises);
            const validImages = results.map((res, index) => {
                const imageUrl = res?.response?.data;
                if (typeof imageUrl === 'string' && imageUrl) {
                    return { preview: URL.createObjectURL(files[index]), url: imageUrl };
                }
                return null;
            }).filter(Boolean) as { preview: string; url: string }[];

            setFormData(prev => ({ ...prev, images: [...prev.images, ...validImages] }));
        } finally {
            setIsUploading(false);
            if (e.target) e.target.value = '';
        }
    };

    const handleRemoveImage = (index: number) => {
        const imageToRemove = formData.images[index];
        if (imageToRemove?.preview.startsWith('blob:')) {
            URL.revokeObjectURL(imageToRemove.preview);
        }
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    // --- CLEANUP BLOB URLS ---
    useEffect(() => {
        return () => {
            formData.images.forEach(image => {
                if (image.preview.startsWith('blob:')) {
                    URL.revokeObjectURL(image.preview);
                }
            });
        };
    }, [formData.images]);

    // --- SAVE HANDLER ---
    const handleSave = () => {
        const variantToSave: Variant = {
            _id: formData._id,
            title: formData.title,
            height: formData.height,
            width: formData.width,
            color: formData.color,
            shape: formData.shape,
            imageUrls: formData.images.map(img => img.url),
            quantity: Number.parseInt(formData.quantity),
            unitPrice: Number.parseFloat(formData.unitPrice),
            // // resellingPrice: Number.parseFloat(formData.resellingPrice),
        };
        onSave(variantToSave, !!editingVariant);
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-5 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">{editingVariant ? 'Edit Variant' : 'Create New Variant'}</h2>
                    <button onClick={onClose} disabled={isSubmitting || isUploading} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-5">
                    {/* Title */}
                    <div>
                        <label htmlFor="variantTitle" className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            id="variantTitle"
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g., Small Red Circle"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Dimensions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Height */}
                        <div>
                            <label htmlFor="variantHeight" className="block text-sm font-medium text-gray-700 mb-1">
                                Height (cm)
                            </label>
                            <input
                                id="variantHeight"
                                type="number"
                                min="0"
                                step="0.1"
                                value={formData.height}
                                onChange={(e) => setFormData((prev) => ({ ...prev, height: e.target.value }))}
                                placeholder="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        {/* Width */}
                        <div>
                            <label htmlFor="variantWidth" className="block text-sm font-medium text-gray-700 mb-1">
                                Width (cm)
                            </label>
                            <input
                                id="variantWidth"
                                type="number"
                                min="0"
                                step="0.1"
                                value={formData.width}
                                onChange={(e) => setFormData((prev) => ({ ...prev, width: e.target.value }))}
                                placeholder="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                 

                    {/* Shape Section with Toggle */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">Shape</label>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Enable</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newEnabledState = !shapeEnabled;
                                        setShapeEnabled(newEnabledState);
                                        if (!newEnabledState) {
                                            setFormData((prev) => ({ ...prev, shape: '' }));
                                        } else if (SHAPE_OPTIONS.length > 0) {
                                            setFormData((prev) => ({ ...prev, shape: SHAPE_OPTIONS[0].value }));
                                        }
                                    }}
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
                                        onClick={() => setFormData((prev) => ({ ...prev, shape: option.value }))}
                                        className={`w-full text-sm px-2 py-1.5 rounded-lg border transition-all ${
                                            formData.shape === option.value
                                                ? 'bg-blue-100 text-blue-800 border-blue-500 font-semibold ring-1 ring-blue-500'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                                        }`}
                                        title={option.label}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Image Upload Section */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Images</label>

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="w-full flex items-center justify-center gap-2 px-3 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                            {isUploading ? 'Uploading...' : 'Upload Images'}
                        </button>
                        {formData.images.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                {formData.images.map((image, index) => (
                                    <div key={index} className="relative group aspect-square">
                                        <img src={image.preview || '/placeholder.svg'} alt={`preview ${index}`} className="w-full h-full object-cover rounded-lg border border-gray-200" />
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
                        <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                    </div>

                    {/* Color Picker */}
                    <div>
                        <label htmlFor="variantColor" className="block text-sm font-medium text-gray-700 mb-2">
                            Color
                        </label>
                        <div className="space-y-3">
                            {/* Color Input and Preview */}
                            <div className="flex items-center gap-3">
                                {/* Circular Color Picker */}
                                <div className="relative w-10 h-10">
                                    <input
                                        id="variantColor"
                                        type="color"
                                        value={formData.color || '#000000'}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="w-full h-full rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: formData.color || '#000000' }}></div>
                                </div>

                                {/* Hex Text Input */}
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={formData.color || ''}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.match(/^#[0-9A-Fa-f]{0,6}$/)) {
                                                setFormData((prev) => ({ ...prev, color: value }));
                                            }
                                        }}
                                        placeholder="#000000"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 font-mono text-sm"
                                    />
                                </div>
                            </div>

                            {/* Popular Colors */}
                            <div>
                                <p className="text-xs text-gray-500 mb-2">Popular Colors</p>
                                <div className="grid grid-cols-8 gap-2">
                                    {[
                                        '#FF0000',
                                        '#FF8C00',
                                        '#FFD700',
                                        '#32CD32',
                                        '#00CED1',
                                        '#1E90FF',
                                        '#9370DB',
                                        '#FF1493',
                                        '#000000',
                                        '#696969',
                                        '#FFFFFF',
                                        '#F5F5DC',
                                        '#8B4513',
                                        '#2F4F4F',
                                        '#800080',
                                        '#FF6347',
                                    ].map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setFormData((prev) => ({ ...prev, color }))}
                                            className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                                                formData.color === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Color Preview */}
                            {formData.color && (
                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: formData.color }} />
                                    <span className="text-sm text-gray-700 font-medium">Selected: {formData.color.toUpperCase()}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label htmlFor="variantQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity
                        </label>
                        <input
                            id="variantQuantity"
                            type="number"
                            min="0"
                            value={formData.quantity}
                            onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
                            placeholder="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Pricing */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
                        {/* Unit Price */}
                        <div>
                            <label htmlFor="variantUnitPrice" className="block text-sm font-medium text-gray-700 mb-1">
                                Unit Price ($)
                            </label>
                            <input
                                id="variantUnitPrice"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.unitPrice}
                                onChange={(e) => setFormData((prev) => ({ ...prev, unitPrice: e.target.value }))}
                                placeholder="0.00"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        {/* Reselling Price */}
                        {/* <div>
                            // <label htmlFor="variantResellingPrice" className="block text-sm font-medium text-gray-700 mb-1">
                                Reselling Price ($)
                            </label>
                            <input
                                // id="variantResellingPrice"
                                type="number"
                                step="0.01"
                                min="0"
                                // value={formData.resellingPrice}
                                // onChange={(e) => setFormData((prev) => ({ ...prev, resellingPrice: e.target.value }))}
                                placeholder="0.00"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                            />
                        </div> */}
                    {/* </div> */}

                    {/* Profit Margin Preview */}
                    {/* {formData.unitPrice && formData.resellingPrice && Number(formData.resellingPrice) > 0 && (
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <p className="text-sm text-gray-600">
                                Estimated Profit Margin:{' '}
                                <span className="font-semibold text-gray-800">
                                    {(((Number(formData.resellingPrice) - Number(formData.unitPrice)) / Number(formData.resellingPrice)) * 100).toFixed(1)}%
                                </span>
                            </p>
                        </div>
                    )} */}
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 p-5 border-t bg-gray-50 rounded-b-lg">
                    <button type="button" onClick={onClose} disabled={isSubmitting || isUploading} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                        Cancel
                    </button>
                    <button type="button" onClick={handleSave} disabled={!isFormValid || isSubmitting || isUploading} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        {isSubmitting ? 'Saving...' : editingVariant ? 'Update' : 'Create Variant'}
                    </button>
                </div>
            </div>
        </div>
    );
}