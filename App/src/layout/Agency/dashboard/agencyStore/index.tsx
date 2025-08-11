'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, ShoppingCart, Star, Eye, Plus, Package, Loader2, SortAsc, SortDesc, Settings } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppServices } from '../../../../hook/services';

// Types
interface Product {
    _id: string;
    productName: string;
    productId: string;
    merchantId: string;
    merchantName?: string;
    companyId?: string[];
    productDescription: string;
    customizable?: boolean;
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
    unitPrice: number;
    resellingPrice: number;
    imageUrls: string[];
}

interface Bundle {
    _id: string;
    name: string;
    bundleId: string;
    description: string;
    merchantId: string;
    merchantName?: string; // Added merchantName to Bundle interface
    companyId?: string[];

    status: 'active' | 'draft';
    imageUrls: string[];
    products: Product[];
    price: number;
    discountedPrice: number;
    createdAt: string;
    updatedAt: string;
}
interface Merchant {
    _id: string;
    name: string;
    email: string;
}
export default function StorePage() {
    const navigate = useNavigate();
    const AppService = useAppServices();

    const { userId, company_id, planId } = useParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<'products' | 'bundles' | 'customizableProducts'>('products');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [merchants, setMerchants] = useState<Merchant[]>([]);
    const [selectedMerchant, setSelectedMerchant] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
    const [products, setProducts] = useState<Product[]>([]);
    const [bundles, setBundles] = useState<Bundle[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [filteredBundles, setFilteredBundles] = useState<Bundle[]>([]);
    const [removingItemId, setRemovingItemId] = useState<string | null>(null);
    const [filteredCustomizableProducts, setFilteredCustomizableProducts] = useState<Product[]>([]);

 const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch merchants first
            const { response: merchantRes } = await AppService.nfc_users.GetMerchants({});
            if (merchantRes?.success && Array.isArray(merchantRes.data)) {
                setMerchants(merchantRes.data);
            } else {
                console.error('API response for merchants is not valid:', merchantRes);
                setMerchants([]);
            }

            // Fetch products
            const { response: productRes } = await AppService.productsPage.GetProductByCompanyId({
                query: `companyId=${company_id}`,
            });
            if (productRes?.success && Array.isArray(productRes.data)) {
                // Enhance products with merchant names
                const productsWithMerchantNames = productRes.data.map((product: any) => {
                    const merchant = merchantRes.data.find((m: any) => m._id === product.merchantId);
                    return {
                        ...product,
                        merchantName: merchant?.name || 'Unknown Merchant',
                    };
                });
                setProducts(productsWithMerchantNames);
            } else {
                console.error('API response for products is not valid:', productRes);
                setProducts([]);
            }

            // Fetch bundles
            const bundleRes = await AppService.packages.GetBundleByCompanyId({
                query: `companyId=${company_id}`,
            });
            const res = bundleRes?.response;

            if (res?.success && Array.isArray(res.data)) {
                // Enhance bundles with merchant names
                const bundlesWithMerchantNames = res.data
                    .filter((item: any) => item && typeof item === 'object')
                    .map((bundle: any) => {
                        const merchant = merchantRes.data.find((m: any) => m._id === bundle.merchantId);
                        return {
                            ...bundle,
                            merchantName: merchant?.name || 'Unknown Merchant',
                        };
                    });
                setBundles(bundlesWithMerchantNames);
            } else {
                console.warn('Bundle response malformed:', res);
                setBundles([]);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setProducts([]);
            setBundles([]);
            setMerchants([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleRemoveFromAgencyStore = async (item: Product | Bundle, isBundle: boolean) => {
        if (!window.confirm(`Are you sure you want to remove this ${isBundle ? 'bundle' : 'product'} from your agency store?`)) {
            return;
        }

        try {
            setRemovingItemId(item._id);

            const payload = {
                _id: item._id,
                companyId: company_id,
            };

            let response;
            if (isBundle) {
                response = await AppService.packages.RemoveBundleFromStore({
                    payload: payload,
                });
            } else {
                response = await AppService.productsPage.RemoveProductFromStore({
                    payload: payload,
                });
            }
            if (response?.response?.success) {
                await fetchData();
                alert(`${isBundle ? 'Bundle' : 'Product'} removed from your agency store successfully!`);
            } else {
                alert(`Failed to removing from agency store: ${response?.response?.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error removing from agency store:', error);
            alert('An error occurred while adding to agency store.');
        } finally {
            setRemovingItemId(null);
        }
    };

    // Filter and sort products and bundles
    useEffect(() => {
            const filterAndSort = (items: (Product | Bundle)[], isBundle = false) => {
        if (!Array.isArray(items)) return [];

        return items
            .filter((item) => {
                if (!item) return false;

                const name = isBundle ? (item as Bundle)?.name || '' : (item as Product)?.productName || '';
                const description = isBundle ? (item as Bundle)?.description || '' : (item as Product)?.productDescription || '';

                const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                    description.toLowerCase().includes(searchQuery.toLowerCase());

                const matchesCategory =
                    selectedCategory === 'all' || 
                    name.toLowerCase().includes(selectedCategory.toLowerCase()) || 
                    description.toLowerCase().includes(selectedCategory.toLowerCase());

                const matchesMerchant = selectedMerchant === 'all' || item.merchantId === selectedMerchant;

                let itemPrice = 0;
                if (isBundle) {
                    itemPrice = (item as Bundle)?.price || 0;
                } else {
                    const variants = (item as Product)?.variants || [];
                    // Get the minimum price from all variants
                    itemPrice = variants.length > 0 ? 
                        Math.min(...variants.map(v => v.resellingPrice || v.unitPrice || 0)) : 
                        0;
                }

                const matchesPrice = itemPrice >= priceRange[0] && itemPrice <= priceRange[1];

                // For customizable products, check the customizable flag
                const isCustomizable = !isBundle && (item as Product)?.customizable === true;

                // Return different conditions based on activeTab
                if (activeTab === 'customizableProducts') {
                    return matchesSearch && matchesCategory && matchesMerchant && matchesPrice && isCustomizable;
                }
                if (activeTab === 'products') {
                    return matchesSearch && matchesCategory && matchesMerchant && matchesPrice && !isCustomizable;
                }
                return matchesSearch && matchesCategory && matchesMerchant && matchesPrice;
            })
                .sort((a, b) => {
                    let aValue: any, bValue: any;

                    switch (sortBy) {
                        case 'price':
                            if (isBundle) {
                                aValue = (a as Bundle)?.price || 0;
                                bValue = (b as Bundle)?.price || 0;
                            } 
                            else {
                                const aVariants = (a as Product)?.variants || [];
                                const bVariants = (b as Product)?.variants || [];
                                aValue = aVariants.length > 0 ? aVariants[0].resellingPrice : 0;
                                bValue = bVariants.length > 0 ? bVariants[0].resellingPrice : 0;
                            }
                            break;
                        case 'date':
                            aValue = new Date(a?.createdAt || 0).getTime();
                            bValue = new Date(b?.createdAt || 0).getTime();
                            break;
                        case 'name':
                        default:
                            aValue = isBundle ? (a as Bundle)?.name?.toLowerCase() || '' : (a as Product)?.productName?.toLowerCase() || '';
                            bValue = isBundle ? (b as Bundle)?.name?.toLowerCase() || '' : (b as Product)?.productName?.toLowerCase() || '';
                            break;
                    }

                    return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1;
                });
        };

        setFilteredProducts(filterAndSort(products).filter((p) => (p as Product).customizable == false) as Product[]);
        setFilteredBundles(filterAndSort(bundles, true) as Bundle[]);
        setFilteredCustomizableProducts(filterAndSort(products).filter((p) => (p as Product).customizable) as Product[]);
    }, [products, bundles, searchQuery, selectedCategory, selectedMerchant, sortBy, sortOrder, priceRange, activeTab]);
    const categories = ['all', 'metal card', 'lanyard', 'coaster', 'bamboo', 'plastic', 'table toper', 'wristband', 'sticker', 'key fob'];

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />);
    };

    const ProductCard = ({ product }: { product: Product }) => {
        const firstVariant = product?.variants?.[0];
        const price = firstVariant?.resellingPrice || 0;
        const variantsCount = product?.variants?.length || 0;

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                <div className="relative aspect-square">
                    <img
                        src={firstVariant?.imageUrls?.[0]}
                        alt={product?.productName || 'Product'}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-product.png';
                        }}
                    />

                    <div className="absolute top-3 left-3">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">{product?.status || 'unknown'}</span>
                    </div>
                </div>

                <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg leading-tight">{product?.productName || 'Unknown Product'}</h3>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">${price.toFixed(2)}</p>
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product?.productDescription || 'No description available'}</p>

                    <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">Variants:</span> {variantsCount}
                        </div>
                        <div className="text-sm text-gray-600">Updated: {product?.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : 'N/A'}</div>
                    </div>

                    {/* Add merchant info */}
                    {product.merchantName && (
                        <div className="mb-3 px-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">{product.merchantName}</span>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate(`/app/${company_id}/${planId}/${userId}/agency-store/product/${product?.productId}`)}
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <Eye className="h-4 w-4" />
                            View Details
                        </button>
                        {/* <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                            <ShoppingCart className="h-4 w-4" />
                        </button> */}
                    </div>
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={() => handleRemoveFromAgencyStore(product, false)}
                            disabled={removingItemId === product._id}
                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-75"
                        >
                            {removingItemId === product._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <Plus className="h-4 w-4" />
                                    Remove From Agency Store
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    const CustomizableProductCard = ({ product }: { product: Product }) => {
        const firstVariant = product?.variants?.[0];
        const price = firstVariant?.resellingPrice || 0;
        const variantsCount = product?.variants?.length || 0;

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                <div className="relative aspect-square">
                    <img
                        src={firstVariant?.imageUrls?.[0]}
                        alt={product?.productName || 'Product'}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-product.png';
                        }}
                    />


                    <div className="absolute top-3 left-3">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">{product?.status || 'unknown'}</span>
                    </div>
                </div>

                <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg leading-tight">{product?.productName || 'Unknown Product'}</h3>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">${price.toFixed(2)}</p>
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product?.productDescription || 'No description available'}</p>

                    <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">Variants:</span> {variantsCount}
                        </div>
                        <div className="text-sm text-gray-600">Updated: {product?.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : 'N/A'}</div>
                    </div>

                    {/* Add merchant info */}
                    {product.merchantName && (
                        <div className="mb-3 px-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">{product.merchantName}</span>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate(`/app/${company_id}/${planId}/${userId}/agency-store/custom-product/${product?.productId}`)}
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <Eye className="h-4 w-4" />
                            View Details
                        </button>
                        {/* <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                            <ShoppingCart className="h-4 w-4" />
                        </button> */}
                    </div>
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={() => handleRemoveFromAgencyStore(product, false)}
                            disabled={removingItemId === product._id}
                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-75"
                        >
                            {removingItemId === product._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <Plus className="h-4 w-4" />
                                    Remove From Agency Store
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    const BundleCard = ({ bundle }: { bundle: Bundle }) => {
        // const savings = (bundle?.totalPrice || 0) - (bundle?.discountedPrice || 0);
        // const savingsPercentage = bundle?.totalPrice ? Math.round((savings / bundle.totalPrice) * 100) : 0;

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                <div className="relative aspect-square">
                    <img
                        src={bundle?.imageUrls?.[0]}
                        alt={bundle?.name || 'Bundle'}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-bundle.png';
                        }}
                    />

                    <div className="absolute top-3 left-3">
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">Bundle</span>
                    </div>
                </div>

                <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg leading-tight">{bundle?.name || 'Unknown Bundle'}</h3>
                        <div className="text-right">
                            {/* <p className="text-lg text-gray-500 line-through">${bundle?.price?.toFixed(2) || '0.00'}</p> */}
                            {/* <p className="text-2xl font-bold text-gray-900">${bundle?.price?.toFixed(2) || '0.00'}</p> */}
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{bundle?.description || 'No description available'}</p>

                    <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">Products:</span> {bundle?.products?.length || 0}
                        </div>
                        {/* <div className="text-sm text-green-600 font-medium">Save ${savings.toFixed(2)}</div> */}
                    </div>
                    {bundle.merchantName && (
                        <div className="mb-3 px-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">{bundle.merchantName}</span>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate(`/app/${company_id}/${planId}/${userId}/agency-store/bundle/${bundle?.bundleId}`)}
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <Eye className="h-4 w-4" />
                            View Details
                        </button>
                        {/* <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                            <ShoppingCart className="h-4 w-4" />
                        </button> */}
                    </div>
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={() => handleRemoveFromAgencyStore(bundle, true)}
                            disabled={removingItemId === bundle._id}
                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-75"
                        >
                            {removingItemId === bundle._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <Plus className="h-4 w-4" />
                                    Remove From Agency Store
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-gray-500">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p>Loading store...</p>
                </div>
            </div>
        );
    }

    const currentItems = activeTab === 'products' ? filteredProducts : activeTab === 'customizableProducts' ? filteredCustomizableProducts : filteredBundles;
    const currentCount = currentItems.length;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Product Store</h1>
                            <p className="text-gray-600 mt-1">Discover our range of products and bundles</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(`/app/${company_id}/${planId}/${userId}/store-setting/agency-designs`)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <Settings className="h-6 w-5" />
                                Store Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sticky Filters Sidebar */}
                    <div className="lg:w-64">
                        <div className="sticky top-8 space-y-6">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Filter className="h-5 w-5" />
                                    Filters
                                </h3>

                                {/* Search */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Category Filter */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {/* Merchant Filter */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Merchant</label>
                                    <select
                                        value={selectedMerchant}
                                        onChange={(e) => setSelectedMerchant(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="all">All Merchants</option>
                                        {merchants.map((merchant) => (
                                            <option key={merchant._id} value={merchant._id}>
                                                {merchant.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {/* Price Range */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price Range: ${priceRange[0]} - ${priceRange[1]}
                                    </label>
                                    <input type="range" min="0" max="100" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} className="w-full" />
                                </div>

                                {/* Sort Options */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                                    <div className="space-y-2">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="name">Name</option>
                                            <option value="price">Price</option>
                                            <option value="date">Date Added</option>
                                        </select>
                                        <button
                                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                            className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                                            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Custom Tabs */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setActiveTab('products')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        activeTab === 'products' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Products
                                    {/* ({filteredProducts.length}) */}
                                </button>
                                <button
                                    onClick={() => setActiveTab('customizableProducts')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        activeTab === 'customizableProducts' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Customizable Products
                                    {/* ({filteredCustomizableProducts.length}) */}
                                </button>
                                <button
                                    onClick={() => setActiveTab('bundles')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        activeTab === 'bundles' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Bundles
                                    {/* ({filteredBundles.length}) */}
                                </button>
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {currentCount} {activeTab === 'products' ? 'Products' : activeTab === 'bundles' ? 'Bundles' : 'Customizable Products'} Found
                            </h2>
                        </div>

                        {/* Content */}
                        {currentCount === 0 ? (
                            <div className="text-center py-12">
                                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No {activeTab === 'products' ? 'products' : activeTab === 'bundles' ? 'bundles' : 'customizable products'} found
                                </h3>
                                <p className="text-gray-600">Try adjusting your filters or search terms.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {currentItems.map((item) =>
                                    activeTab === 'products' ? (
                                        <ProductCard key={item._id} product={item as Product} />
                                    ) : activeTab === 'customizableProducts' ? (
                                        <CustomizableProductCard key={item._id} product={item as Product} />
                                    ) : (
                                        <BundleCard key={item._id} bundle={item as Bundle} />
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
