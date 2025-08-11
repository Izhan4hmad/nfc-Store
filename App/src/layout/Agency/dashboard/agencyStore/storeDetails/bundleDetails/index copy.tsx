'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Package, Truck, X, Shield, Heart, DollarSign, Share2, Plus, Minus, Eye } from 'lucide-react';
import { useAppServices } from '../../../../../../hook/services';
import { use } from 'i18next';

interface Product {
    _id: string;
    productName: string;
    productId: string;
    productDescription: string;
    status: 'active' | 'draft';
    imageUrl: string[];
    variants: Variant[];
    createdAt: string;
    updatedAt: string;
}

interface Variant {
    _id?: string;
    title: string;
    quantity: number;
    unitPrice: number;
    resellingPrice: number;
    imageUrls?: string[];
}

interface Bundle {
    _id: string;
    name: string;
    bundleId: string;
    description: string;
    price: number;
    resellingPrice: number;
    agencyOnly: boolean;
    status: 'active' | 'draft';
    products: Product[];
    imageUrls: string[];

    createdAt: string;
    updatedAt: string;
    __v: number;
}

export default function BundleDetailPage() {
    const params = useParams();
    const navigate = useNavigate();
    const { company_id, userId, planId, bundleId } = useParams();

    const AppService = useAppServices();

    const [bundle, setBundle] = useState<Bundle | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [resellPrice, setResellPrice] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState('');

    const fetchBundle = async () => {
        setLoading(true);
        try {
            const { response } = await AppService.packages.GetByBundleId({
                query: `bundleId=${bundleId}`,
            });

            console.log('Full API Response:', response); // Debug log

            if (response?.success) {
                // Take the first item from the array
                const bundleData = response.data;

                console.log('Bundle Data:', bundleData); // Debug log

                // Transform the data to match your component's expectations
                const transformedBundle = {
                    ...bundleData,
                    imageUrl: bundleData.imageUrl || ['/default-bundle-image.jpg'], // Ensure imageUrl exists
                    price: parseFloat(bundleData.price) || 0,
                    resellingPrice: parseFloat(bundleData.resellingPrice) || 0,
                    products: bundleData.products.map((product: any) => ({
                        ...product,
                        imageUrl: product.imageUrl || ['/default-product-image.jpg'],
                    })),
                };

                setBundle(transformedBundle);
            } else {
                console.error('Failed to fetch bundle:', response);
                setBundle(null);
            }
        } catch (error) {
            console.error('Error fetching bundle:', error);
            setBundle(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBundle();
    }, [bundleId]);
    const handleQuantityChange = (change: number) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };
    const handleOpenModal = () => {
        setResellPrice(bundle?.resellingPrice.toString() || '');
        setIsModalOpen(true);
        setUpdateError('');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setResellPrice('');
        setUpdateError('');
    };
    const handleUpdateResellPrice = async () => {
        if (!bundle || !resellPrice) {
            alert('Missing required data');
            return;
        }

        const price = Number.parseFloat(resellPrice);
        if (isNaN(price)) {
            setUpdateError('Please enter a valid number');
            return;
        }

        if (price <= 0) {
            setUpdateError('Price must be greater than 0');
            return;
        }

        if (price <= bundle.price) {
            setUpdateError('Resell price must be higher than unit price');
            return;
        }

        setIsUpdating(true);
        setUpdateError('');

        try {
            const { response } = await AppService.packages.update({
                payload: {
                    _id: bundle._id,
                    resellingPrice: price,
                    ...(company_id && { company_id }),
                },
            });

            if (!response?.success) {
                throw new Error(response?.message || 'Failed to update price');
            }

            setBundle((prev) => (prev ? { ...prev, resellingPrice: price } : null));

            alert('Price updated successfully!');
            handleCloseModal();
        } catch (error) {
            console.error('Update failed:', error);
            alert(error instanceof Error ? error.message : 'Failed to update price');
        } finally {
            setIsUpdating(false);
        }
    };
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!bundle) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Bundle not found</h2>
                    <p className="text-gray-600 mb-4">The bundle you're looking for doesn't exist.</p>
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

    const savings = bundle.resellingPrice - bundle.price;
    const savingsPercentage = Math.round((savings / bundle.price) * 100);

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between py-4">
                            <button onClick={() => navigate(-1)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Store
                            </button>
                            <div className="text-right">
                                <h1 className="text-2xl font-bold text-gray-900">{bundle.name}</h1>
                                <p className="text-gray-600">Bundle ID: {bundle.bundleId}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Bundle Images */}
                        <div className="space-y-4">
                            <div className="aspect-square rounded-lg overflow-hidden bg-white border">
                                <img src={bundle.imageUrls[selectedImageIndex]} alt={bundle.name} width={500} height={500} className="w-full h-full object-cover" />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {bundle.imageUrls.map((url: any, index: any) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'}`}
                                    >
                                        <img src={url} alt={`${bundle.name} ${index + 1}`} width={100} height={100} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bundle Details */}
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Bundle Deal</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${bundle.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {bundle.status}
                                    </span>
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">In Stock</span>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{bundle.name}</h1>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex items-center">{renderStars(4.8)}</div>
                                    <span className="text-sm text-gray-600">4.8 (12 reviews)</span>
                                </div>
                                <p className="text-gray-600 text-lg leading-relaxed">{bundle.description}</p>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Price */}
                            <div>
                                <div className="flex items-baseline gap-2 mb-2">
                                    {/* <span className="text-3xl font-bold text-gray-900">${bundle.discountedPrice.toFixed(2)}</span> */}
                                    <span className="text-xl text-gray-500 line-through">${bundle.price.toFixed(2)}</span>
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 ml-2">{savingsPercentage}% OFF</span>
                                </div>
                                {/* <p className="text-lg text-green-600 font-medium">You save ${savings.toFixed(2)} with this bundle!</p> */}
                            </div>

                            {/* Quantity */}
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
                                    <button onClick={() => handleQuantityChange(1)} className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleOpenModal}
                                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    <DollarSign className="h-5 w-5" />
                                    Add Your Resell Price
                                </button>
                                <button className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                                    <Heart className="h-5 w-5" />
                                </button>
                                <button className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                                    <Share2 className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Truck className="h-4 w-4" />
                                    Free Shipping
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Shield className="h-4 w-4" />
                                    Quality Guarantee
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Package className="h-4 w-4" />
                                    Bundle Discount
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Bundle Info */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Bundle Information</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-700">Bundle ID:</span>
                                        <p className="text-gray-600">{bundle.bundleId}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Products:</span>
                                        <p className="text-gray-600">{bundle.products.length} items</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Created:</span>
                                        <p className="text-gray-600">{new Date(bundle.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products in Bundle */}
                    <div className="mt-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Products in this Bundle</h2>
                            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{bundle.products.length} Products</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bundle.products.map((product) => {
                                const firstVariant = product.variants?.[0];
                                const price = firstVariant?.resellingPrice || 0;

                                return (
                                    <div key={product._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group">
                                        <div className="relative">
                                            <img
                                                src={firstVariant.imageUrls?.[0]}
                                                alt={product.productName}
                                                width={200}
                                                height={200}
                                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-3 right-3">
                                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">In Bundle</span>
                                            </div>
                                            {/* <div className="absolute top-3 left-3">
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">{product.status}</span>
                                        </div> */}
                                        </div>

                                        <div className="p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-semibold text-gray-900 text-lg leading-tight">{product.productName}</h3>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-gray-900">${price.toFixed(2)}</p>
                                                    <p className="text-xs text-gray-500">Individual price</p>
                                                </div>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.productDescription}</p>

                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                        {product.variants?.length || 0} variants
                                                    </span>
                                                    <span className="text-xs text-gray-500">ID: {product.productId}</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => navigate(`/app/${company_id}/${planId}/${userId}/store/product/${product?.productId}`)}
                                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    View Details
                                                </button>
                                                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                                                    <ShoppingCart className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                <div className="text-xs text-gray-500">Updated: {new Date(product.updatedAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Bundle Summary */}
                        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Bundle Value Breakdown</h3>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Individual products total:</span>
                                            <span className="font-medium">${bundle.price.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Bundle discount:</span>
                                            {/* <span className="font-medium text-red-600">-${savings.toFixed(2)}</span> */}
                                        </div>
                                        <div className="flex justify-between text-lg font-bold border-t pt-1">
                                            <span>Bundle price:</span>
                                            {/* <span className="text-green-600">${bundle.discountedPrice.toFixed(2)}</span> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {/* <div className="text-2xl font-bold text-green-600">{savingsPercentage}%</div> */}
                                    <div className="text-sm text-gray-600">Savings</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Resell Price Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/50" onClick={handleCloseModal} />

                    {/* Modal */}
                    <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-xl">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900">Set Bundle Resell Price</h3>
                                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <p className="text-sm text-gray-600 mb-4">
                                Set your resell price for the entire bundle: <span className="font-medium">{bundle?.name}</span>
                            </p>

                            {/* Current Price Info */}
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Bundle Price:</span>
                                    <span className="font-medium">${bundle?.price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Current Resell Price:</span>
                                    <span className="font-medium text-blue-600">${bundle?.resellingPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Price Input */}
                            <div className="mb-4">
                                <label htmlFor="resell-price" className="block text-sm font-medium text-gray-700 mb-2">
                                    New Resell Price
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        id="resell-price"
                                        type="number"
                                        step="0.01"
                                        min={0.01}
                                        value={resellPrice}
                                        onChange={(e) => setResellPrice(e.target.value)}
                                        placeholder="Enter resell price"
                                        className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Profit Calculation */}
                            {resellPrice && !isNaN(Number.parseFloat(resellPrice)) && bundle && (
                                <div className="bg-green-50 rounded-lg p-4 mb-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-green-800">Estimated Profit:</span>
                                        <span className="text-lg font-bold text-green-600">${Math.max(0, Number.parseFloat(resellPrice) - bundle.price).toFixed(2)}</span>
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {updateError && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                    <p className="text-sm text-red-600">{updateError}</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleCloseModal}
                                    disabled={isUpdating}
                                    className="flex-1 bg-white text-blue-600 hover:text-white border border-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateResellPrice}
                                    disabled={isUpdating || !resellPrice}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    {isUpdating ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Price'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
