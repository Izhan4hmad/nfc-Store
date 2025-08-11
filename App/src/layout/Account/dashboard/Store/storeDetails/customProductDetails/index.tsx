import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Package, Truck, Shield, Heart, Share2, Plus, Minus, Palette } from 'lucide-react';
import { useAppServices } from '../../../../../../hook/services';

// Type Definitions
interface CustomizationData {
    colors: string;
    title: string;
    logo: string | null;
    additionalNotes: string;
    images: Array<{ preview: string; url: string }>;
    height?: string;
    width?: string;
    shape?: string;
}

interface Variant {
    _id?: string;
    title: string;
    agencyCreated: boolean;
    createdBy: string;
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

export default function CustomProductDetailPage() {
    // Hooks and State
    const { productId, company_id } = useParams();
    const navigate = useNavigate();
    const AppService = useAppServices();

    const [product, setProduct] = useState<Product | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showCustomizationModal, setShowCustomizationModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Data Fetching

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
                if (Array.isArray(response.data.variants)) {
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

    let pageLoad = true;
    useEffect(() => {
        if (pageLoad) {
            fetchProduct();
            pageLoad = false;
        }
    }, [productId]);

    // Helper Functions
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />);
    };

    // Event Handlers
    const handleQuantityChange = (change: number) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && selectedVariant && newQuantity <= selectedVariant.quantity) {
            setQuantity(newQuantity);
        }
    };

    const handleSaveCustomization = async (customizationData: CustomizationData) => {

        if (!product || !selectedVariant) {
            alert('Missing required data');
            return;
        }
        const { _id, ...variantWithoutId } = selectedVariant;

        setIsSubmitting(true);
        try {
            const customizedVariant: Variant = {
                ...variantWithoutId,
                title: customizationData.title,
                resellingPrice: selectedVariant.resellingPrice,
                createdBy: company_id || '',
                agencyCreated: true,
                colors: customizationData.colors,
                logo: customizationData.logo || null,
                imageUrls: customizationData.images.map((img) => img.url),
                additionalNotes: customizationData.additionalNotes,
                height: customizationData.height,
                width: customizationData.width,
                shape: customizationData.shape,
            };

            const updatedVariants = [...product.variants, customizedVariant];
            const { response } = await AppService.productsPage.update({
                payload: {
                    _id: product._id,
                    company_id,
                    variants: updatedVariants,
                },
            });

            if (response?.success) {
                setProduct((prev) => (prev ? { ...prev, variants: updatedVariants } : null));
                setSelectedVariant(customizedVariant);
                setShowCustomizationModal(false);
                alert('Custom design saved successfully!');

                fetchProduct();
            } else {
                throw new Error(response?.message || 'Failed to save customization');
            }
        } catch (error) {
            console.error('Error saving customization:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Error State
    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
                    <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
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

    // Main Render
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

            {/* Product Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="aspect-square rounded-lg overflow-hidden bg-white border">
                            <img src={selectedVariant?.imageUrls[selectedImageIndex] || '/placeholder.svg'} alt={product.productName} className="w-full h-full object-cover" />
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
                                    <img src={url || '/placeholder.svg'} alt={`${product.productName} ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        {/* Product Info */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {product.status}
                                </span>
                                {product.customizable && <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Customizable</span>}
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">In Stock</span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {product.productName} - {selectedVariant?.title}
                            </h1>
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
                                value={selectedVariant?._id || ''}
                                onChange={(e) => {
                                    const variant = product.variants.find((v) => v._id === e.target.value);
                                    if (variant) setSelectedVariant(variant);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {product.variants.map((variant) => (
                                    <option key={variant._id} value={variant._id}>
                                        {variant.title} - ${variant.resellingPrice.toFixed(2)} ({variant.quantity} available)
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Price */}
                        <div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-gray-900">${selectedVariant?.resellingPrice.toFixed(2)}</span>
                            </div>
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

                        {/* Customization Button */}

                        {/* Action Buttons */}
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

                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}
