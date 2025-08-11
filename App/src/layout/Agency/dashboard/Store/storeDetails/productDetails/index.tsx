'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Package, Eye, Truck, Shield, Heart, Share2, Plus, Minus } from 'lucide-react';
import { useAppServices } from '../../../../../../hook/services';

// import Image from "next/image"
// import Link from "next/link"

interface Product {
    _id: string;
    productName: string;
    productId: string;
    productDescription: string;
    status: 'active' | 'draft';
    imageUrls: string[];
    variants: Variant[];
    createdAt: string;
    updatedAt: string;
}

interface Variant {
    _id?: string;
    title: string;
    quantity: number;
    imageUrls: string[];
    unitPrice: number;
    resellingPrice: number;
}

export default function ProductDetailPage() {
    const params = useParams();
    const navigate = useNavigate();
    const AppService = useAppServices();

    const { productId } = useParams();

    const [product, setProduct] = useState<Product | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const { response } = await AppService.productsPage.GetByProductId({
                    query: `productId=${productId}`,
                });

                if (response?.success && response.data) {
                    setProduct(response.data);
                    if (Array.isArray(response.data.variants) && response.data.variants.length > 0) {
                        setSelectedVariant(response.data.variants[0]);
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

        if (params.productId) {
            fetchProduct();
        }
    }, [params.productId]); // <-- use the correct param

    const handleQuantityChange = (change: number) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && selectedVariant && newQuantity <= selectedVariant.quantity) {
            setQuantity(newQuantity);
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

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
                    <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>

                    <button
                        onClick={() => navigate(-1)}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
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
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-white text-blue-600 hover:text-white border border-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all duration-200 font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Store
                        </button>

                        <div className="text-center sm:text-right space-y-1">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{product.productName}</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="aspect-square rounded-lg overflow-hidden bg-white border">
                            <img
                                src={selectedVariant?.imageUrls[selectedImageIndex] || '/placeholder.svg?height=500&width=500'}
                                alt={selectedVariant?.title}
                                width={500}
                                height={500}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {selectedVariant?.imageUrls.map((url, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'}`}
                                >
                                    <img src={url || '/placeholder.svg'} alt={`${selectedVariant?.title} ${index + 1}`} width={100} height={100} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {product.status}
                                </span>
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">In Stock</span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.productName}</h1>
                            {/* <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center">{renderStars(4.5)}</div>
                                <span className="text-sm text-gray-600">4.5 (24 reviews)</span>
                            </div> */}
                            <p className="text-gray-600 text-lg leading-relaxed">{product.productDescription}</p>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Variant Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Variant</label>
                            <select
                                value={selectedVariant?._id || selectedVariant?.title}
                                onChange={(e) => {
                                    const variant = product.variants.find((v) => v._id === e.target.value || v.title === e.target.value);
                                    if (variant) setSelectedVariant(variant);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {product.variants.map((variant) => (
                                    <option key={variant._id || variant.title} value={variant._id || variant.title}>
                                        {variant.title} - ${variant.resellingPrice.toFixed(2)} ({variant.quantity} available)
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Price */}
                        <div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-gray-900">${selectedVariant?.resellingPrice.toFixed(2)}</span>
                                <span className="text-lg text-gray-500 line-through">${selectedVariant?.unitPrice.toFixed(2)}</span>
                            </div>
                            <p className="text-sm text-green-600 font-medium">You save ${selectedVariant ? (selectedVariant.resellingPrice - selectedVariant.unitPrice).toFixed(2) : '0.00'}</p>
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

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                Add to Cart - ${selectedVariant ? (selectedVariant.resellingPrice * quantity).toFixed(2) : '0.00'}
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
                                Fast Processing
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Product Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Product Information</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-gray-700">Product ID:</span>
                                    <p className="text-gray-600">{product.productId}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Status:</span>
                                    <p className="text-gray-600 capitalize">{product.status}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Created:</span>
                                    <p className="text-gray-600">{new Date(product.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Updated:</span>
                                    <p className="text-gray-600">{new Date(product.updatedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
