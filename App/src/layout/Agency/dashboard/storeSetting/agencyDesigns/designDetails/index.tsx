'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Plus, Minus, Trash2 } from 'lucide-react';
import { useAppServices } from '../../../../../../hook/services';
import { EditDesignModal } from './editDesign';

interface CustomizationData {
    colors: string;
    title: string;
    logo: string | null;
    additionalNotes: string;
    height?: string;
    width?: string;
    shape?: string;
}

interface Variant {
    _id?: string;
    title: string;
    agencyCreated: boolean;
    createdBy: string | null;
    quantity: number;
    imageUrls: string[];
    resellingPrice: number;
    customization?: CustomizationData;
    colors: string;
    logo: string | null;
    additionalNotes: string;
    height?: string;
    width?: string;
    shape?: string;
}

interface Product {
    _id: string;
    productName: string;
    productId: string;
    productDescription: string;
    customizable?: boolean;
    status: 'active' | 'draft';
    imageUrls: string[];
    variants: Variant[];
    createdAt: string;
    updatedAt: string;
}

const DesignDetails = () => {
    const { productId, company_id } = useParams<{ productId: string; company_id: string }>();
    const navigate = useNavigate();
    const AppService = useAppServices();

    const [variants, setVariants] = useState<Variant[]>([]);
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState<Product | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);

    const fetchProduct = async () => {
        if (!productId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const { response } = await AppService.productsPage.GetByProductId({
                query: `productId=${productId}`,
            });

            if (response?.success && response.data) {
                setProduct(response.data);
                const agencyVariants = response.data.variants.filter((variant: Variant) => variant.agencyCreated && variant.createdBy === company_id);
                setVariants(agencyVariants);
                setSelectedVariant(agencyVariants[0] || null);

                if (agencyVariants.length === 0) {
                    navigate(-1);
                }
            } else {
                console.error('Failed to fetch product:', response);
                navigate(-1);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteVariant = async () => {
        if (!selectedVariant?._id || !product) return;

        const confirmed = window.confirm('Are you sure you want to delete this variant?');
        if (!confirmed) return;

        try {
            const updatedVariants = product.variants.filter((v) => v._id !== selectedVariant._id);
            const { response } = await AppService.productsPage.update({
                payload: {
                    _id: product._id,
                    variants: updatedVariants,
                },
            });

            if (!response?.success) {
                throw new Error(response?.message || 'Failed to delete variant');
            }

            const filteredVariants = updatedVariants.filter((v) => v.agencyCreated && v.createdBy === company_id);
            setVariants(filteredVariants);
            setSelectedVariant(filteredVariants[0] || null);
            setQuantity(1);
            fetchProduct();
            if (filteredVariants.length === 0) {
                navigate(-1);
            }
        } catch (error) {
            console.error('Error deleting variant:', error);
            alert(error instanceof Error ? error.message : 'An error occurred while deleting the variant.');
        }
    };

    const handleEditVariant = () => {
        try {
            setModalError(null);
            setIsEditModalOpen(true);
        } catch (error) {
            console.error('Error opening edit modal:', error);
            setModalError('Failed to open edit modal. Please try again.');
        }
    };

    const handleSaveVariant = async (updatedVariant: Variant) => {
        if (!product) return;

        setIsSubmitting(true);
        try {
            const updatedVariants = product.variants.map((v) => (v._id === updatedVariant._id ? updatedVariant : v));

            const { response } = await AppService.productsPage.update({
                payload: {
                    _id: product._id,
                    variants: updatedVariants,
                },
            });

            if (response?.success) {
                setProduct((prev) => (prev ? { ...prev, variants: updatedVariants } : null));

                const agencyVariants = updatedVariants.filter((v) => v.agencyCreated && v.createdBy === company_id);
                setVariants(agencyVariants);
                setSelectedVariant(updatedVariant);

                setIsEditModalOpen(false);
                setModalError(null);
            } else {
                throw new Error(response?.message || 'Failed to update variant');
            }
        } catch (error) {
            console.error('Error updating variant:', error);
            setModalError(error instanceof Error ? error.message : 'An error occurred while updating the variant');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setModalError(null);
    };

    const handleQuantityChange = (change: number) => {
        if (!selectedVariant) return;
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= selectedVariant.quantity) {
            setQuantity(newQuantity);
        }
    };

    const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!product) return;
        const variant = variants.find((v) => v._id === e.target.value);
        if (variant) {
            setSelectedVariant(variant);
            setSelectedImageIndex(0);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (variants.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No designs found</h2>
                    <p className="text-gray-600 mb-4">This product has no agency-created variants.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 mx-auto"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Store
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-white text-blue-600 hover:text-white border border-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all duration-200 font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Go Back
                        </button>
                        <div className="text-center sm:text-right space-y-1">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{product?.productName}</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    <div className="space-y-4">
                        <div className="aspect-square rounded-lg overflow-hidden bg-white border">
                            <img src={selectedVariant?.imageUrls[selectedImageIndex] || '/placeholder.svg?height=400&width=400'} alt={product?.productName} className="w-full h-full object-cover" />
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {selectedVariant?.imageUrls.map((url, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                                        selectedImageIndex === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                                    }`}
                                >
                                    <img src={url || '/placeholder.svg?height=100&width=100'} alt={`${product?.productName} ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${product?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {product?.status}
                                </span>
                                {product?.customizable && <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Customizable</span>}
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">In Stock</span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {product?.productName} - {selectedVariant?.title}
                            </h1>
                            <p className="text-gray-600 text-lg leading-relaxed">{product?.productDescription}</p>
                        </div>

                        <hr className="border-gray-200" />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Variant</label>
                            <select
                                value={selectedVariant?._id || ''}
                                onChange={handleVariantChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {variants.map((variant) => (
                                    <option key={variant._id} value={variant._id}>
                                        {variant.title} - ${variant.resellingPrice.toFixed(2)} ({variant.quantity} available)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <span className="text-3xl font-bold text-gray-900">${selectedVariant?.resellingPrice.toFixed(2)}</span>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(1)}
                                    disabled={!selectedVariant || quantity >= selectedVariant.quantity}
                                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                                <span className="text-sm text-gray-600 ml-2">{selectedVariant?.quantity} available</span>
                            </div>
                        </div>

                        {modalError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-800 text-sm">{modalError}</p>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={handleDeleteVariant}
                                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                            >
                                <Trash2 className="h-5 w-5" />
                                Delete Design
                            </button>
                            <button onClick={handleEditVariant} className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                                <Edit className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal with Error Boundary */}
            {selectedVariant && isEditModalOpen && (
                <EditDesignModal isOpen={isEditModalOpen} onClose={handleCloseModal} onSave={handleSaveVariant} variant={selectedVariant} isSubmitting={isSubmitting} />
            )}
        </div>
    );
};

export default DesignDetails;
