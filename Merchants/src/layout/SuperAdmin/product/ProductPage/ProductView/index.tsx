// Refined ProductDetails.tsx - Cleaned and Error-Free

import React, { useState, useEffect, useMemo } from 'react';
import { useAppServices } from '../../../../../hook/services';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Loader2, Package, DollarSign, Tag } from 'lucide-react';
import VariantModal from './createModal/createVariant';

interface Variant {
    _id?: string;
    title: string;
    height: string;
    width: string;
    color: string;
    // size: string;
    shape: string;
    imageUrls: string[];
    quantity: number;
    unitPrice: number;
    // resellingPrice: number;
    agencyCreated?: boolean;
}

interface Product {
    _id: string;
    productName: string;
    productId: string;
    productDescription: string;
    status: 'active' | 'draft';
    variants: Variant[];
}

const VariantTable = React.memo(function VariantTable({
    variants,
    onEdit,
    onDelete,
}: {
    variants: Variant[];
    onEdit: (variant: Variant, index: number) => void;
    onDelete: (variantId: string, index: number) => void;
}) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        {['Title', 'Height', 'Width', 'Color', 'Shape', 'Quantity', 'Unit Price', 'Actions'].map((header) => (
                            <th key={header} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {variants.map((variant, index) => {
                        // const profitMargin = variant.resellingPrice > 0 ? (((variant.resellingPrice - variant.unitPrice) / variant.resellingPrice) * 100).toFixed(1) : '0';

                        return (
                            <tr key={variant._id || index} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">{variant.title}</td>
                                <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{variant.height}(cm)</td>
                                <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{variant.width}(cm)</td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded border border-gray-300" style={{ backgroundColor: variant.color }} />
                                        <span className="text-gray-600">{variant.color}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-gray-600 whitespace-nowrap capitalize">{variant.shape}</td>
                                <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{variant.quantity}</td>
                                <td className="px-4 py-4 text-gray-600 whitespace-nowrap">${variant.unitPrice.toFixed(2)}</td>
                                {/* <td className="px-4 py-4 text-gray-600 whitespace-nowrap">${variant.resellingPrice.toFixed(2)}</td> */}
                                {/* <td className="px-4 py-4 whitespace-nowrap">
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            parseFloat(profitMargin) > 20 ? 'bg-green-100 text-green-800' : parseFloat(profitMargin) > 10 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {profitMargin}%
                                    </span>
                                </td> */}
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => onEdit(variant, index)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => onDelete(variant._id || '', index)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
});

export default function ProductDetails() {
    const [product, setProduct] = useState<Product | null>(null);
    const [variants, setVariants] = useState<Variant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
    const [editingVariant, setEditingVariant] = useState<Variant | null>(null);

    const { productId } = useParams();
    const navigate = useNavigate();
    const AppService = useAppServices();

    const fetchProduct = async () => {
        setIsLoading(true);
        try {
            const { response } = await AppService.productsPage.GetByProductId({ query: `productId=${productId}` });
            if (response?.success && response.data) {
                setProduct(response.data);
                setVariants(response.data.variants.filter((v: any) => v.agencyCreated === false));
            } else {
                console.error('Failed to fetch product:', response);
                navigate(-1);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            navigate(-1);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (productId) {
            fetchProduct();
        }
    }, [productId]);
const handleStatusUpdate = async (productId: string, newStatus: 'active' | 'draft') => {
    try {
        const { response } = await AppService.productsPage.update({ payload: { _id: productId, status: newStatus } });
        if (response?.success) {
            setProduct(prev => prev ? { ...prev, status: newStatus } : null);
        } else {
            alert(`Failed to update status: ${response?.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error updating status:', error);
        alert('An error occurred while updating the status.');
    }
};
    const totalInventoryValue = useMemo(() => {
        return variants.reduce((total, variant) => total + variant.quantity * variant.unitPrice, 0);
    }, [variants]);

    // const totalPotentialRevenue = useMemo(() => {
    //     return variants.reduce((total, variant) => total + variant.quantity * variant.resellingPrice, 0);
    // }, [variants]);

    const handleCreateVariant = () => {
        setEditingVariant(null);
        setIsVariantModalOpen(true);
    };

    const handleEditVariant = (variant: Variant) => {
        setEditingVariant(variant);
        setIsVariantModalOpen(true);
    };

    const handleDeleteVariant = async (variantId: string, index: number) => {
        if (!product) return;
        if (window.confirm('Are you sure you want to delete this variant?')) {
            try {
                const updatedVariants = product.variants.filter((_, i) => i !== index);
                const { response } = await AppService.productsPage.update({
                    payload: { _id: product._id, variants: updatedVariants },
                });
                if (response?.success) {
                    setProduct((prev) => (prev ? { ...prev, variants: updatedVariants } : null));
                    setVariants(updatedVariants.filter((v) => v.agencyCreated === false));
                } else {
                    alert(`Failed to delete variant: ${response?.message || 'Unknown error'}`);
                }
            } catch (error) {
                console.error('Error deleting variant:', error);
                alert('An error occurred while deleting the variant.');
            }
        }
    };

    const handleSaveVariant = async (variantData: Variant, isEditing: boolean) => {
        if (!product) return;
        setIsSubmitting(true);
        try {
            const updatedVariants = isEditing ? product.variants.map((v) => (v._id === variantData._id ? variantData : v)) : [...product.variants, variantData];

            const { response } = await AppService.productsPage.update({
                payload: { _id: product._id, variants: updatedVariants },
            });

            if (response?.success) {
                await fetchProduct();
                setIsVariantModalOpen(false);
            } else {
                alert(`Failed to save variant: ${response?.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error saving variant:', error);
            alert('An error occurred while saving the variant.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-gray-500">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p>Loading Product Details...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
                    <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
                    <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-5">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate(-1)} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{product.productName}</h1>
                                <p className="text-gray-600 mt-1 text-sm">Product ID: {product.productId}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleStatusUpdate(product._id, product.status === 'active' ? 'draft' : 'active')}
                                className={`flex items-center px-3 py-1 text-sm font-semibold rounded-full capitalize cursor-pointer transition-colors ${
                                    product.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                            >
                                {product.status}
                            </button>
                            <button
                                onClick={handleCreateVariant}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                Add Variant
                            </button>
                        </div>
                    </div>
                </div>
            </div>{' '}
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Product Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <p className="text-gray-600">{product.productDescription}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Overview</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Package className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Variants</p>
                                        <p className="text-xl font-semibold text-gray-900">{variants.length}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <DollarSign className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Inventory Value</p>
                                        <p className="text-xl font-semibold text-gray-900">${totalInventoryValue.toFixed(2)}</p>
                                    </div>
                                </div>
                                {/* <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Tag className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Potential Revenue</p>
                                        <p className="text-xl font-semibold text-gray-900">${totalPotentialRevenue.toFixed(2)}</p>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Variants Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4 sm:p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-900">Product Variants</h2>
                            <div className="text-sm text-gray-600">{variants?.length} variants</div>
                        </div>
                    </div>

                    {variants?.length > 0 ? (
                        <VariantTable variants={variants} onEdit={handleEditVariant} onDelete={handleDeleteVariant} />
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-500">
                            <Package className="h-12 w-12 text-gray-300" />
                            <p className="font-semibold">No variants found</p>
                            <p className="text-sm">Create your first variant to get started.</p>
                            <button onClick={handleCreateVariant} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                                <Plus className="h-4 w-4" />
                                Add First Variant
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {/* RENDER THE MODAL COMPONENT */}
            <VariantModal isOpen={isVariantModalOpen} onClose={() => setIsVariantModalOpen(false)} onSave={handleSaveVariant} editingVariant={editingVariant} isSubmitting={isSubmitting} />
        </div>
    );
}
