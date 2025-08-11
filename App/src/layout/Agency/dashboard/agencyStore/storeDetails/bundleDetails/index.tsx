'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Package, Truck, X, Shield, Heart, DollarSign, Share2, Plus, Minus, Eye, AlertCircle, Loader2 } from 'lucide-react';
import { useAppServices } from '../../../../../../hook/services';
import { toast } from 'react-toastify';

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
    const navigate = useNavigate();
    const { company_id, userId, planId, bundleId } = useParams();
    const AppService = useAppServices();

    // State management
    const [bundle, setBundle] = useState<Bundle | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [resellPrice, setResellPrice] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    // Fixed: Removed useCallback to prevent infinite loop
    const fetchBundle = async () => {
        if (!bundleId) {
            setError('Bundle ID is missing');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { response } = await AppService.packages.GetByBundleId({
                query: `bundleId=${bundleId}`,
            });

            if (!response?.success) {
                throw new Error(response?.message || 'Failed to fetch bundle');
            }

            const bundleData = response.data;

            if (!bundleData) {
                throw new Error('Bundle data not found');
            }

            // Safe transformation with proper validation
            const transformedBundle: Bundle = {
                _id: bundleData._id || '',
                name: bundleData.name || 'Unnamed Bundle',
                bundleId: bundleData.bundleId || '',
                description: bundleData.description || 'No description available',
                price: Number.parseFloat(bundleData.price) || 0,
                resellingPrice: Number.parseFloat(bundleData.resellingPrice) || 0,
                agencyOnly: Boolean(bundleData.agencyOnly),
                status: bundleData.status === 'active' || bundleData.status === 'draft' ? bundleData.status : 'draft',
                imageUrls: Array.isArray(bundleData.imageUrls) && bundleData.imageUrls.length > 0 ? bundleData.imageUrls : ['/placeholder.svg?height=500&width=500'],
                products: Array.isArray(bundleData.products)
                    ? bundleData.products.map((product: any) => ({
                          _id: product._id || '',
                          productName: product.productName || 'Unnamed Product',
                          productId: product.productId || '',
                          productDescription: product.productDescription || 'No description available',
                          status: product.status === 'active' || product.status === 'draft' ? product.status : 'draft',
                          imageUrl: Array.isArray(product.imageUrl) && product.imageUrl.length > 0 ? product.imageUrl : ['/placeholder.svg?height=200&width=200'],
                          variants: Array.isArray(product.variants)
                              ? product.variants.map((variant: any) => ({
                                    _id: variant._id,
                                    title: variant.title || 'Default',
                                    quantity: Number(variant.quantity) || 0,
                                    unitPrice: Number.parseFloat(variant.unitPrice) || 0,
                                    resellingPrice: Number.parseFloat(variant.resellingPrice) || 0,
                                    imageUrls: Array.isArray(variant.imageUrls) && variant.imageUrls.length > 0 ? variant.imageUrls : ['/placeholder.svg?height=200&width=200'],
                                }))
                              : [],
                          createdAt: product.createdAt || new Date().toISOString(),
                          updatedAt: product.updatedAt || new Date().toISOString(),
                      }))
                    : [],
                createdAt: bundleData.createdAt || new Date().toISOString(),
                updatedAt: bundleData.updatedAt || new Date().toISOString(),
                __v: bundleData.__v || 0,
            };

            setBundle(transformedBundle);
        } catch (err) {
            console.error('Error fetching bundle:', err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(errorMessage);
            setBundle(null);
        } finally {
            setLoading(false);
        }
    };

    // Fixed: Only depend on bundleId to prevent infinite loop
    useEffect(() => {
        fetchBundle();
    }, [bundleId]); // Only bundleId as dependency

    const handleQuantityChange = (change: number) => {
        setQuantity((prev) => Math.max(1, prev + change));
    };

    const handleOpenModal = () => {
        if (!bundle) return;
        setResellPrice(bundle.resellingPrice.toString());
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setResellPrice('');
    };

    const validatePrice = (price: number): string | null => {
        if (isNaN(price)) return 'Please enter a valid number';
        if (price <= 0) return 'Price must be greater than 0';
        if (bundle && price <= bundle.price) return 'Resell price must be higher than bundle price';
        return null;
    };

    const handleUpdateResellPrice = async () => {
        if (!bundle) return;

        const price = Number.parseFloat(resellPrice);
        const validationError = validatePrice(price);

        if (validationError) {
            toast.error(validationError);
            return;
        }

        setIsUpdating(true);

        try {
            const payload: any = {
                _id: bundle._id,
                resellingPrice: price,
            };

            if (company_id) {
                payload.company_id = company_id;
            }

            const { response } = await AppService.packages.update({
                payload,
            });

            if (!response?.success) {
                throw new Error(response?.message || 'Failed to update price');
            }

            setBundle((prev) => (prev ? { ...prev, resellingPrice: price } : null));
            toast.success('Price updated successfully!');
            handleCloseModal();
        } catch (err) {
            console.error('Update failed:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to update price';
            toast.error(errorMessage);
        } finally {
            setIsUpdating(false);
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />);
    };

    const calculatePricing = () => {
        if (!bundle || !Array.isArray(bundle.products)) {
            return {
                totalProductsPrice: 0,
                profit: 0,
                profitPercentage: 0,
                bundleDiscount: 0,
                savingsPercentage: 0,
            };
        }

        const totalProductsPrice = bundle.products.reduce((sum, product) => {
            const variantPrice = product.variants?.[0]?.resellingPrice || 0;
            return sum + variantPrice;
        }, 0);

        const bundleDiscount = Math.max(0, totalProductsPrice - bundle.price);
        const profit = bundle.resellingPrice - bundle.price;
        const profitPercentage = bundle.price > 0 ? Math.round((profit / bundle.price) * 100) : 0;
        const savingsPercentage = bundle.price > 0 ? Math.round((bundleDiscount / totalProductsPrice) * 100) : 0;

        return {
            totalProductsPrice,
            profit,
            profitPercentage,
            bundleDiscount,
            savingsPercentage,
        };
    };

    const { totalProductsPrice, profit, profitPercentage, bundleDiscount, savingsPercentage } = calculatePricing();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Loading bundle details...</p>
                </div>
            </div>
        );
    }

    if (error || !bundle) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-sm mx-4">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{error ? 'Error loading bundle' : 'Bundle not found'}</h2>
                    <p className="text-gray-600 mb-4">{error || "The bundle you're looking for doesn't exist."}</p>
                    <div className="flex gap-3 justify-center">
                        <button onClick={() => navigate(-1)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Go Back
                        </button>
                        <button onClick={fetchBundle} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between py-4">
                            <button onClick={() => navigate(-1)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Store
                            </button>
                            <div className="text-right">
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{bundle.name}</h1>
                                <p className="text-gray-600">Bundle ID: {bundle.bundleId}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Bundle Images */}
                        <div className="space-y-4">
                            <div className="aspect-square rounded-lg overflow-hidden bg-white border shadow-sm relative">
                                <img
                                    src={bundle.imageUrls[selectedImageIndex] || '/placeholder.svg?height=500&width=500'}
                                    alt={bundle.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/placeholder.svg?height=500&width=500';
                                    }}
                                />
                            </div>

                            {bundle.imageUrls.length > 1 && (
                                <div className="grid grid-cols-3 gap-2">
                                    {bundle.imageUrls.map((url, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImageIndex(index)}
                                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                                selectedImageIndex === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <img
                                                src={url || '/placeholder.svg?height=100&width=100'}
                                                alt={`${bundle.name} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/placeholder.svg?height=100&width=100';
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Bundle Details */}
                        <div className="space-y-6">
                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Bundle Deal</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${bundle.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {bundle.status}
                                    </span>
                                    {bundle.agencyOnly && <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Agency Only</span>}
                                </div>

                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{bundle.name}</h1>

                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex items-center">{renderStars(4.8)}</div>
                                    <span className="text-sm text-gray-600">4.8 (12 reviews)</span>
                                </div>

                                <p className="text-gray-600 text-base leading-relaxed">{bundle.description}</p>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Price */}
                            <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-2xl font-bold text-gray-900">Your Price: ${bundle.resellingPrice.toFixed(2)}</span>
                                    {profitPercentage > 0 && <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">{profitPercentage}% Profit</span>}
                                </div>

                                <div className="flex items-baseline gap-3">
                                    <span className="text-lg text-gray-600">Unit Price: ${bundle.price.toFixed(2)}</span>
                                    {savingsPercentage > 0 && <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{savingsPercentage}% Discount</span>}
                                </div>

                                {bundleDiscount > 0 && <div className="text-sm text-gray-600">Bundle saves you ${bundleDiscount.toFixed(2)} off individual prices</div>}
                            </div>

                            {/* Profit Breakdown */}
                            {profit > 0 && (
                                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-green-800">Your Profit:</span>
                                        <span className="text-lg font-bold text-green-600">${profit.toFixed(2)}</span>
                                    </div>
                                    <div className="text-sm text-green-700 mt-1">{profitPercentage}% profit margin</div>
                                    {bundleDiscount > 0 && <div className="text-xs text-green-600 mt-2">Includes ${bundleDiscount.toFixed(2)} bundle discount from supplier</div>}
                                </div>
                            )}

                            {/* Quantity */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                    >
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
                                    Set Resell Price
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
                                    <Truck className="h-4 w-4 text-blue-600" />
                                    Free Shipping
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Shield className="h-4 w-4 text-green-600" />
                                    Quality Guarantee
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Package className="h-4 w-4 text-purple-600" />
                                    Bundle Discount
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Bundle Info */}
                            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
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
                                    <div>
                                        <span className="font-medium text-gray-700">Updated:</span>
                                        <p className="text-gray-600">{new Date(bundle.updatedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products in Bundle */}
                    {bundle.products.length > 0 && (
                        <div className="mt-12">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Products in this Bundle</h2>
                                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                    {bundle.products.length} Product{bundle.products.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {bundle.products.map((product) => {
                                    const firstVariant = product.variants?.[0];
                                    const price = firstVariant?.resellingPrice || 0;
                                    const imageUrl = firstVariant?.imageUrls?.[0] || product.imageUrl?.[0] || '/placeholder.svg?height=200&width=200';

                                    return (
                                        <div key={product._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group">
                                            <div className="relative">
                                                <img
                                                    src={imageUrl || '/placeholder.svg'}
                                                    alt={product.productName}
                                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = '/placeholder.svg?height=200&width=200';
                                                    }}
                                                />
                                                <div className="absolute top-3 right-3">
                                                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">In Bundle</span>
                                                </div>
                                                {product.status === 'draft' && (
                                                    <div className="absolute top-3 left-3">
                                                        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">Draft</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="font-semibold text-gray-900 text-lg leading-tight flex-1 mr-2">{product.productName}</h3>
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-gray-900">${price.toFixed(2)}</p>
                                                        <p className="text-xs text-gray-500">Individual price</p>
                                                    </div>
                                                </div>

                                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.productDescription}</p>

                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                            {product.variants?.length || 0} variant{product.variants?.length !== 1 ? 's' : ''}
                                                        </span>
                                                        <span className="text-xs text-gray-500">ID: {product.productId}</span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            if (company_id && planId && userId && product.productId) {
                                                                navigate(`/app/${company_id}/${planId}/${userId}/store/product/${product.productId}`);
                                                            }
                                                        }}
                                                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Bundle Summary */}
                            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Bundle Value Breakdown</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Individual products total:</span>
                                                <span className="font-medium">${totalProductsPrice.toFixed(2)}</span>
                                            </div>
                                            {bundleDiscount > 0 && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Bundle discount:</span>
                                                    <span className="font-medium text-red-600">-${bundleDiscount.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between text-lg font-bold border-t pt-2">
                                                <span>Bundle price:</span>
                                                <span className="text-green-600">${bundle.price.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-lg font-bold">
                                                <span>Your resell price:</span>
                                                <span className="text-blue-600">${bundle.resellingPrice.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {savingsPercentage > 0 && (
                                        <div className="text-right ml-6">
                                            <div className="text-3xl font-bold text-green-600">{savingsPercentage}%</div>
                                            <div className="text-sm text-gray-600">Savings</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Resell Price Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={handleCloseModal} />

                    <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900">Set Bundle Resell Price</h3>
                                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500" disabled={isUpdating}>
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <p className="text-sm text-gray-600 mb-4">
                                Set your resell price for: <span className="font-medium">{bundle.name}</span>
                            </p>

                            {/* Current Price Info */}
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Bundle Price:</span>
                                    <span className="font-medium">${bundle.price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Current Resell Price:</span>
                                    <span className="font-medium text-blue-600">${bundle.resellingPrice.toFixed(2)}</span>
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
                                        min="0.01"
                                        value={resellPrice}
                                        onChange={(e) => setResellPrice(e.target.value)}
                                        placeholder="Enter resell price"
                                        className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        disabled={isUpdating}
                                    />
                                </div>
                            </div>

                            {/* Profit Calculation */}
                            {resellPrice && !isNaN(Number.parseFloat(resellPrice)) && (
                                <div className="bg-green-50 rounded-lg p-4 mb-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-green-800">Estimated Profit:</span>
                                        <span className="text-lg font-bold text-green-600">${Math.max(0, Number.parseFloat(resellPrice) - bundle.price).toFixed(2)}</span>
                                    </div>
                                    <div className="text-xs text-green-600 mt-1">Profit margin: {Math.round(((Number.parseFloat(resellPrice) - bundle.price) / bundle.price) * 100)}%</div>
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
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {isUpdating ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
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
