'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAppServices, useUploadImage } from '../../../hook/services';
import { useParams } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Loader2, Package, X, Download, Upload, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface Variant {
    variantId: string;
    title: string;
    quantity: number;
    unitPrice: number;
    resellingPrice: number;
    agencyCreated?: boolean; 
    imageUrls?: string[]; 
}

interface BundleProduct {
    productId: string;
    productName: string;
    variants: Variant[];
}

interface Bundle {
    _id: string;
    name: string;
    bundleId: string;
    description: string;
    imageUrls: string[];
    price: string | number; // API returns string, but we need to handle both
    resellingPrice?: string | number; // API returns string, but we need to handle both
    agencyOnly: boolean;
    status: 'active' | 'draft';
    products: BundleProduct[];
    couponId?: string;
    createdAt?: string; // Add MongoDB fields
    updatedAt?: string; // Add MongoDB fields
    __v?: number; // Add MongoDB version field
}

interface Product {
    _id: string;
    productName: string;
    variants: {
        _id: string;
        title: string;
        quantity: number;
        unitPrice: number;
        resellingPrice: number;
        agencyCreated?: boolean;
        imageUrls?: string[]; // Added to match the data structure

    }[];
}

interface BundleFormData {
    name: string;
    description: string;
    images: Array<{ preview: string; url: string }>;

    price: string;
    resellingPrice: string;
    agencyOnly: boolean;
    status: 'active' | 'draft';
    products: BundleProduct[];
}

// --- SUB-COMPONENTS ---
const BundleTable = React.memo(function BundleTable({
    bundles,
    onEdit,
    onDelete,
    onView,
    currentPage,
    itemsPerPage,
}: {
    bundles: Bundle[];
    onEdit: (bundle: Bundle) => void;
    onDelete: (bundleId: string) => void;
    onView: (bundle: Bundle) => void;
    currentPage: number;
    itemsPerPage: number;
}) {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedBundles = bundles.slice(startIndex, endIndex);

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        {['Name', 'Bundle ID', 'Description', 'Price', 'Status', 'Products Count', 'Sold', 'Actions'].map((header) => (
                            <th key={header} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedBundles.map((bundle) => (
                        <tr key={bundle._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">{bundle.name}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-gray-600 font-mono text-xs">{bundle.bundleId}</td>
                            <td className="px-4 py-4 text-gray-600 max-w-xs truncate" title={bundle.description}>
                                {bundle.description}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-gray-600">{bundle.price != null ? `$${Number(bundle.price).toFixed(2)}` : '-'}</td>
                            {/* <td className="px-4 py-4 whitespace-nowrap text-gray-600">{bundle.resellingPrice != null ? `$${Number(bundle.resellingPrice).toFixed(2)}` : '-'}</td> */}
                            {/* <td className="px-4 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${bundle.agencyOnly ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {bundle.agencyOnly ? 'Yes' : 'No'}
                                </span>
                            </td> */}
                            <td className="px-4 py-4 whitespace-nowrap">
                                <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                                        bundle.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {bundle.status}
                                </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{bundle.products?.length || 0} products</span>
                                    <span className="text-xs text-gray-500">({bundle.products?.reduce((total, product) => total + (product.variants?.length || 0), 0) || 0} variants)</span>
                                </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${bundle.couponId ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                    {bundle.couponId ? 'Sold' : 'Available'}
                                </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => onView(bundle)} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors" title="View Details">
                                        <Eye className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => onEdit(bundle)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Edit">
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => onDelete(bundle._id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Delete">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});

const Pagination = React.memo(function Pagination({
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    onPageChange,
    onItemsPerPageChange,
}: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (items: number) => void;
}) {
    const startItem = currentPage * itemsPerPage + 1;
    const endItem = Math.min((currentPage + 1) * itemsPerPage, totalItems);

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Rows per page:</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                </div>
                <span className="text-sm text-gray-700">
                    {startItem}-{endItem} of {totalItems}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0} className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-700">
                    Page {currentPage + 1} of {totalPages}
                </span>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
});

// --- MAIN COMPONENT ---
export default function BundlesDashboard() {
    const { userId } = useParams();
    const AppService = useAppServices();
    const uploadImage = useUploadImage();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [bundles, setBundles] = useState<Bundle[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [viewingBundle, setViewingBundle] = useState<Bundle | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const [formData, setFormData] = useState<BundleFormData>({
        name: '',
        description: '',
        price: '',
        images: [],

        resellingPrice: '',
        agencyOnly: false,
        status: 'draft',
        products: [],
    });

    // --- DATA FETCHING ---
    const fetchBundles = async () => {
        try {
            const response = await AppService.packages.GetBundleByMerchantId({
                query: `merchantId=${userId}`,
            });
            if (response?.response?.success && Array.isArray(response.response.data)) {
                const validBundles = response.response.data.filter((item: any) => typeof item === 'object' && item !== null);
                setBundles(validBundles);
            } else {
                setBundles([]);
                console.warn('Bundles response was not successful or data is not an array:', response);
            }
        } catch (error) {
            console.error('Error fetching bundles:', error);
            setBundles([]);
        }
    };

    const fetchProducts = async () => {
        try {
            const { response } = await AppService.productsPage.GetProductByMerchantId({
                query: `merchantId=${userId}`,
            });
            if (response?.success && Array.isArray(response.data)) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setIsPageLoading(true);
            await Promise.all([fetchBundles(), fetchProducts()]);
            setIsPageLoading(false);
        };
        loadData();
    }, [userId]);

    // --- COMPUTED VALUES ---
    const filteredBundles = useMemo(
        () =>
            bundles.filter(
                (bundle) =>
                    bundle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    bundle.bundleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    bundle.description.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        [bundles, searchQuery]
    );

    const totalPages = Math.ceil(filteredBundles.length / itemsPerPage);

    const isFormValid = useMemo(() => {
        return (
            !!formData.name &&
            !!formData.description &&
            !!formData.price &&
            !isNaN(Number(formData.price)) &&
            Number(formData.price) > 0 &&
            formData.products.length > 0 &&
            formData.products.every((product) => product.variants.length > 0)
        );
    }, [formData]);

    // --- VALIDATION ---
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Bundle name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.price) newErrors.price = 'Price is required';
        else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) newErrors.price = 'Price must be a positive number';
        if (formData.resellingPrice && (isNaN(Number(formData.resellingPrice)) || Number(formData.resellingPrice) < 0)) newErrors.resellingPrice = 'Reselling price must be a non-negative number';
        if (formData.products.length === 0) newErrors.products = 'At least one product is required';

        formData.products.forEach((product) => {
            if (!product.variants || product.variants.length === 0) {
                newErrors[`variant_${product.productId}`] = `At least one variant must be selected for ${product.productName}`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --- EVENT HANDLERS ---
    const resetForm = () => {
        setEditingBundle(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            images: [],

            resellingPrice: '',
            agencyOnly: false,
            status: 'draft',
            products: [],
        });
        setErrors({});
    };

    const handleCreateBundle = () => {
        resetForm();
        setIsCreateModalOpen(true);
    };

    const handleEditBundle = (bundle: Bundle) => {
        setEditingBundle(bundle);
        setFormData({
            name: bundle.name || '',
            description: bundle.description || '',
            price: bundle.price != null ? String(bundle.price) : '',
            images: bundle.imageUrls ? bundle.imageUrls.map((url) => ({ preview: url, url })) : [],

            resellingPrice: bundle.resellingPrice != null ? String(bundle.resellingPrice) : '',
            agencyOnly: bundle.agencyOnly || false,
            status: bundle.status || 'draft',
            products: bundle.products || [],
        });
        setIsCreateModalOpen(true);
    };

    const handleDeleteBundle = async (bundleId: string) => {
        if (window.confirm('Are you sure you want to delete this bundle?')) {
            try {
                const response = await AppService.packages.delete({ query: `package_id=${bundleId}` });
                if (response?.response?.success) {
                    setBundles((prev) => prev.filter((b) => b._id !== bundleId));
                } else {
                    alert(`Failed to delete bundle: ${response?.response?.message || 'Unknown error'}`);
                }
            } catch (error) {
                console.error('Error deleting bundle:', error);
                alert('An error occurred while deleting the bundle.');
            }
        }
    };

    const handleProductSelection = (productId: string, selected: boolean) => {
        if (selected) {
            const product = products.find((p) => p._id === productId);
            if (product) {
                setFormData((prev) => ({
                    ...prev,
                    products: [
                        ...prev.products,
                        {
                            productId: product._id,
                            productName: product.productName,
                            variants: [],
                        },
                    ],
                }));
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                products: prev.products.filter((p) => p.productId !== productId),
            }));
        }
        // Clear related errors
        if (errors.products) {
            setErrors((prev) => ({ ...prev, products: '' }));
        }
    };

    const handleVariantSelection = (productId: string, variantId: string, selected: boolean) => {
        const product = products.find((p) => p._id === productId);
        const variant = product?.variants.find((v) => v._id === variantId);

        if (!variant) return;

        setFormData((prev) => ({
            ...prev,
            products: prev.products.map((p) =>
                p.productId === productId
                    ? {
                          ...p,
                          variants: selected
                              ? [
                                    ...p.variants,
                                    {
                                        variantId: variant._id,
                                        title: variant.title,
                                        quantity: variant.quantity,
                                        unitPrice: variant.unitPrice,
                                        resellingPrice: variant.resellingPrice,
                                        imageUrls: variant.imageUrls || [], 

                                    },
                                ]
                              : p.variants.filter((v) => v.variantId !== variantId),
                      }
                    : p
            ),
        }));

        // Clear related errors
        if (errors[`variant_${productId}`]) {
            setErrors((prev) => ({ ...prev, [`variant_${productId}`]: '' }));
        }
    };

    const handleDeleteChip = (productId: string, variantId?: string) => {
        if (variantId) {
            // Remove specific variant
            setFormData((prev) => ({
                ...prev,
                products: prev.products.map((p) => (p.productId === productId ? { ...p, variants: p.variants.filter((v) => v.variantId !== variantId) } : p)),
            }));
        } else {
            // Remove entire product
            setFormData((prev) => ({
                ...prev,
                products: prev.products.filter((p) => p.productId !== productId),
            }));
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const uploaded = await Promise.all(
            files.map(async (file) => {
                try {
                    const res = await uploadImage({
                        file,
                        desiredPath: `design/logo/image`,
                        toaster: {} as any,
                    });
                    return {
                        file,
                        preview: URL.createObjectURL(file),
                        url: res?.response?.data,
                    };
                } catch {
                    return null;
                }
            })
        );

        const valid = uploaded.filter((img) => img !== null);
        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...valid],
        }));
    };

    const handleRemoveImage = (index: number) => {
        const imageToRemove = formData.images[index];
        if (imageToRemove?.preview.startsWith('blob:')) {
            URL.revokeObjectURL(imageToRemove.preview);
        }
        setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    const handleSaveBundle = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        const imageUrls = formData.images.map((img) => img.url).filter(Boolean);

        const payload = {
            merchantId: userId,
            name: formData.name,
            description: formData.description,
            imageUrls: imageUrls,

            price: Number(formData.price),
            resellingPrice: formData.resellingPrice ? Number(formData.resellingPrice) : undefined,
            agencyOnly: formData.agencyOnly,
            status: formData.status,
            products: formData.products,
        };

        try {
            let response;
            if (editingBundle) {
                response = await AppService.packages.update({
                    payload: { ...payload, _id: editingBundle._id },
                });
            } else {
                response = await AppService.packages.create({ payload });
            }

            if (response?.response?.success) {
                await fetchBundles();
                setIsCreateModalOpen(false);
                resetForm();
            } else {
                setErrors({ submit: response?.response?.message || 'Failed to save bundle' });
            }
        } catch (error) {
            console.error('Error saving bundle:', error);
            setErrors({ submit: 'An error occurred while saving the bundle.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const downloadCSV = () => {
        if (bundles.length === 0) {
            alert('No bundles to download.');
            return;
        }

        const headers = ['name', 'bundleId', 'description', 'price', 'resellingPrice', 'agencyOnly', 'status', 'productCount'];
        const rows = bundles.map((bundle) =>
            [
                `"${bundle.name.replace(/"/g, '""')}"`,
                `"${bundle.bundleId}"`,
                `"${bundle.description.replace(/"/g, '""')}"`,
                bundle.price,
                bundle.resellingPrice || '',
                bundle.agencyOnly,
                bundle.status,
                bundle.products?.length || 0,
            ].join(',')
        );

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'bundles.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleViewBundle = (bundle: Bundle) => {
        setViewingBundle(bundle);
        setIsViewModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-5">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Bundle Management</h1>
                            <p className="text-gray-600 mt-1 text-sm">Create, view, and manage your product bundles.</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={downloadCSV}
                                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                                <Download className="h-4 w-4" />
                                Download CSV
                            </button>
                            <button
                                onClick={handleCreateBundle}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                Create Bundle
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4 sm:p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <div className="relative max-w-sm w-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search bundles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>
                            <div className="text-sm text-gray-600 hidden sm:block">{filteredBundles.length} results</div>
                        </div>
                    </div>

                    {isPageLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-500">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            <p>Loading Bundles...</p>
                        </div>
                    ) : filteredBundles.length > 0 ? (
                        <>
                            <BundleTable
                                bundles={filteredBundles}
                                onEdit={handleEditBundle}
                                onDelete={handleDeleteBundle}
                                onView={handleViewBundle}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                            />
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                itemsPerPage={itemsPerPage}
                                totalItems={filteredBundles.length}
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={(items) => {
                                    setItemsPerPage(items);
                                    setCurrentPage(0);
                                }}
                            />
                        </>
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-500">
                            <Package className="h-12 w-12 text-gray-300" />
                            <p className="font-semibold">No bundles found</p>
                            <p className="text-sm">Try adjusting your search or create a new bundle.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create/Edit Bundle Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-semibold text-gray-900">{editingBundle ? 'Edit Bundle' : 'Create New Bundle'}</h2>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                disabled={isSubmitting}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="bundleName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Bundle Name *
                                    </label>
                                    <input
                                        id="bundleName"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => {
                                            setFormData((prev) => ({ ...prev, name: e.target.value }));
                                            if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                                        }}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                                        placeholder="Enter bundle name"
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>
                                <div>
                                    <label htmlFor="bundleStatus" className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        id="bundleStatus"
                                        value={formData.status}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as 'active' | 'draft' }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="active">Active</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="bundleDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description *
                                </label>
                                <textarea
                                    id="bundleDescription"
                                    value={formData.description}
                                    onChange={(e) => {
                                        setFormData((prev) => ({ ...prev, description: e.target.value }));
                                        if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
                                    }}
                                    rows={3}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 resize-y ${errors.description ? 'border-red-300' : 'border-gray-300'}`}
                                    placeholder="Enter bundle description"
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                            </div>

                            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
                            <div>
                                <label htmlFor="bundlePrice" className="block text-sm font-medium text-gray-700 mb-1">
                                    Price * ($)
                                </label>
                                <input
                                    id="bundlePrice"
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => {
                                        setFormData((prev) => ({ ...prev, price: e.target.value }));
                                        if (errors.price) setErrors((prev) => ({ ...prev, price: '' }));
                                    }}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 ${errors.price ? 'border-red-300' : 'border-gray-300'}`}
                                    placeholder="0.00"
                                />
                                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                            </div>
                            {/* <div>
                                    <label htmlFor="bundleResellingPrice" className="block text-sm font-medium text-gray-700 mb-1">
                                        Reselling Price ($)
                                    </label>
                                    <input
                                        id="bundleResellingPrice"
                                        type="number"
                                        step="0.01"
                                        value={formData.resellingPrice}
                                        onChange={(e) => {
                                            setFormData((prev) => ({ ...prev, resellingPrice: e.target.value }));
                                            if (errors.resellingPrice) setErrors((prev) => ({ ...prev, resellingPrice: '' }));
                                        }}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 ${errors.resellingPrice ? 'border-red-300' : 'border-gray-300'}`}
                                        placeholder="0.00"
                                    />
                                    {errors.resellingPrice && <p className="mt-1 text-sm text-red-600">{errors.resellingPrice}</p>}
                                </div> */}
                            {/* </div> */}

                            {/* <div className="flex items-center">
                                <input
                                    id="agencyOnly"
                                    type="checkbox"
                                    checked={formData.agencyOnly}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, agencyOnly: e.target.checked }))}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="agencyOnly" className="ml-2 block text-sm text-gray-700">
                                    Agency Only
                                </label>
                            </div> */}

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <Upload className="h-4 w-4" />
                                    Upload Images
                                </button>
                                <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                                {formData.images.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-2">
                                        {formData.images.map((image, index) => (
                                            <div key={index} className="relative group">
                                                <img src={image.preview || '/placeholder.svg'} alt={`preview ${index}`} className="w-full h-24 object-cover rounded-lg border" />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Product Selection */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Select Products & Variants *</h3>
                                {errors.products && <p className="mb-2 text-sm text-red-600">{errors.products}</p>}
                                <div className="space-y-4">
                                    {products.map((product) => {
                                        const isProductSelected = formData.products.some((p) => p.productId === product._id);
                                        const selectedProduct = formData.products.find((p) => p.productId === product._id);

                                        return (
                                            <div key={product._id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-center mb-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={isProductSelected}
                                                        onChange={(e) => handleProductSelection(product._id, e.target.checked)}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label className="ml-2 text-sm font-medium text-gray-900">{product.productName}</label>
                                                </div>

                                                {isProductSelected && (
                                                    <div className="ml-6 space-y-2">
                                                        <p className="text-sm text-gray-600 mb-2">Select variants:</p>
                                                        {errors[`variant_${product._id}`] && <p className="text-sm text-red-600 mb-2">{errors[`variant_${product._id}`]}</p>}
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                                            {product.variants
                                                                .filter((v) => v.agencyCreated == false)
                                                                .map((variant) => {
                                                                    const isVariantSelected = selectedProduct?.variants.some((v) => v.variantId === variant._id);

                                                                    return (
                                                                        <div key={variant._id} className="flex items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={isVariantSelected}
                                                                                onChange={(e) => handleVariantSelection(product._id, variant._id, e.target.checked)}
                                                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                                            />
                                                                            <label className="ml-2 text-sm text-gray-700">
                                                                                {variant.title} (${variant.unitPrice.toFixed(2)})
                                                                            </label>
                                                                        </div>
                                                                    );
                                                                })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Selected Products and Variants Display with Chips */}
                            {formData.products.length > 0 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-blue-900 mb-3">Selected Products & Variants:</h4>
                                    <div className="space-y-3">
                                        {formData.products.map((product) => (
                                            <div key={product.productId} className="space-y-2">
                                                {/* Product Chip */}
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-300">
                                                        {product.productName}
                                                        <button onClick={() => handleDeleteChip(product.productId)} className="ml-1 p-0.5 hover:bg-blue-200 rounded-full transition-colors">
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </span>
                                                    <span className="text-xs text-blue-600">({product.variants.length} variants)</span>
                                                </div>

                                                {/* Variant Chips */}
                                                <div className="flex flex-wrap gap-1 ml-4">
                                                    {product.variants.map((variant) => (
                                                        <span
                                                            key={variant.variantId}
                                                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                                                        >
                                                            {variant.title} (${variant.unitPrice.toFixed(2)})
                                                            <button
                                                                onClick={() => handleDeleteChip(product.productId, variant.variantId)}
                                                                className="ml-1 p-0.5 hover:bg-blue-100 rounded-full transition-colors"
                                                            >
                                                                <X className="h-2.5 w-2.5" />
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {errors.submit && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-sm text-red-600">{errors.submit}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 p-5 border-t sticky bottom-0 bg-white z-10">
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                disabled={isSubmitting}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveBundle}
                                disabled={!isFormValid || isSubmitting}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                {isSubmitting ? 'Saving...' : editingBundle ? 'Update Bundle' : 'Create Bundle'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* View Bundle Modal */}
            {isViewModalOpen && viewingBundle && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-semibold text-gray-900">Bundle Details</h2>
                            <button onClick={() => setIsViewModalOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Bundle Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Bundle Information</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Bundle Name</label>
                                                <p className="text-gray-900 font-medium">{viewingBundle.name}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Bundle ID</label>
                                                <p className="text-gray-900 font-mono text-sm">{viewingBundle.bundleId}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Description</label>
                                                <p className="text-gray-900">{viewingBundle.description}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Status</label>
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ml-2 ${
                                                            viewingBundle.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                    >
                                                        {viewingBundle.status}
                                                    </span>
                                                </div>
                                                {/* <div>
                                                    <label className="text-sm font-medium text-gray-500">Agency Only</label>
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${
                                                            viewingBundle.agencyOnly ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                    >
                                                        {viewingBundle.agencyOnly ? 'Yes' : 'No'}
                                                    </span>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Pricing & Status</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Price</label>
                                                <p className="text-2xl font-bold text-gray-900">${viewingBundle.price != null ? Number(viewingBundle.price).toFixed(2) : '0.00'}</p>
                                            </div>
                                            {viewingBundle.resellingPrice && (
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Reselling Price</label>
                                                    <p className="text-xl font-semibold text-gray-700">${Number(viewingBundle.resellingPrice).toFixed(2)}</p>
                                                </div>
                                            )}
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Availability</label>
                                                <span
                                                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ml-2 ${
                                                        viewingBundle.couponId ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                    }`}
                                                >
                                                    {viewingBundle.couponId ? 'Sold' : 'Available'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Products & Variants */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Included Products & Variants</h3>
                                <div className="space-y-4">
                                    {viewingBundle.products?.map((product, index) => (
                                        <div key={product.productId} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-medium text-gray-900">{product.productName}</h4>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {product.variants?.length || 0} variants
                                                </span>
                                            </div>

                                            {product.variants && product.variants.filter((v) => v.agencyCreated === false).length > 0 && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {product.variants
                                                        .filter((v) => v.agencyCreated === false)
                                                        .map((variant) => (
                                                            <div key={variant.variantId} className="bg-gray-50 rounded-lg p-3">
                                                                <div className="space-y-1">
                                                                    <p className="font-medium text-sm text-gray-900">{variant.title}</p>
                                                                    <div className="flex justify-between text-xs text-gray-600">
                                                                        <span>Qty: {variant.quantity}</span>
                                                                        <span>Price: ${Number(variant.unitPrice).toFixed(2)}</span>
                                                                    </div>
                                                                    {variant.resellingPrice && <div className="text-xs text-gray-600">Resell: ${Number(variant.resellingPrice).toFixed(2)}</div>}
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Summary Statistics */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Bundle Summary</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-600">{viewingBundle.products?.length || 0}</p>
                                        <p className="text-sm text-gray-600">Products</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-600">{viewingBundle.products?.reduce((total, product) => total + (product.variants?.length || 0), 0) || 0}</p>
                                        <p className="text-sm text-gray-600">Total Variants</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-purple-600">
                                            {viewingBundle.products?.reduce((total, product) => total + (product.variants?.reduce((sum, variant) => sum + variant.quantity, 0) || 0), 0) || 0}
                                        </p>
                                        <p className="text-sm text-gray-600">Total Quantity</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-orange-600">
                                            $
                                            {viewingBundle.products
                                                ?.reduce((total, product) => total + (product.variants?.reduce((sum, variant) => sum + variant.quantity * Number(variant.unitPrice), 0) || 0), 0)
                                                .toFixed(2) || '0.00'}
                                        </p>
                                        <p className="text-sm text-gray-600">Total Value</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 p-5 border-t sticky bottom-0 bg-white z-10">
                            <button onClick={() => setIsViewModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    setIsViewModalOpen(false);
                                    handleEditBundle(viewingBundle);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                            >
                                Edit Bundle
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
