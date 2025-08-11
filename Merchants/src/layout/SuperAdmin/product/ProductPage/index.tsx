'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAppServices, useUploadImage } from '../../../../hook/services';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Upload, X, Download, Loader2, Inbox, ListIcon } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// --- TYPE DEFINITIONS ---
interface Variant {
    _id?: string;
    title: string;
    quantity: number;
    unitPrice: number;
    resellingPrice: number;
    agencyCreated: boolean;
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
}

interface ProductFormData {
    productName: string;
    productDescription: string;
    customizable?: boolean;
    status: 'active' | 'draft';
    images: Array<{ preview: string; url: string }>;
}

// --- SUB-COMPONENTS ---
const ProductTable = React.memo(function ProductTable({
    products,
    onEdit,
    onDelete,
    onStatusUpdate,
}: {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (productId: string) => void;
    onStatusUpdate: (productId: string, status: 'active' | 'draft') => void;
}) {
    const navigate = useNavigate();
    const { userId } = useParams();

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        {['Product', 'Description', 'Variants', 'Status', 'Actions'].map((header) => (
                            <th key={header} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{product.productName}</td>
                            <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={product.productDescription}>
                                {product.productDescription}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                    //   onClick={() => navigate(-1)}
                                    onClick={() => navigate(`/admin/${userId}/products/variants/${product.productId}`)}
                                    className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
                                >
                                    <ListIcon className="h-4 w-4" /> {product.variants.filter((v) => v.agencyCreated === false).length} Variants
                                </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                    onClick={() => onStatusUpdate(product._id, product.status === 'active' ? 'draft' : 'active')}
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize cursor-pointer transition-colors ${
                                        product.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    }`}
                                >
                                    {product.status}
                                </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => onEdit(product)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Edit">
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => onDelete(product._id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Delete">
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

// --- MAIN COMPONENT ---
export default function ProductDashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const { userId } = useParams();

    const [formData, setFormData] = useState<ProductFormData>({
        productName: '',
        productDescription: '',
        status: 'draft',
        customizable: false,
        images: [],
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const AppService = useAppServices();
    const uploadImage = useUploadImage();

    // --- DATA FETCHING ---
    const fetchProducts = async () => {
        setIsPageLoading(true);
        try {
            const { response } = await AppService.productsPage.GetProductByMerchantId({
                query: `merchantId=${userId}`,
            });
            if (response?.success && Array.isArray(response.data)) {
                setProducts(response.data);
                setIsPageLoading(false);
            } else {
                console.error('API response for products is not valid:', response);
                setProducts([]);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setProducts([]);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // --- COMPUTED VALUES ---
    const filteredProducts = useMemo(
        () =>
            products.filter(
                (product) =>
                    product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.productId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.productDescription.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        [products, searchQuery]
    );

    const isFormValid = useMemo(() => !!formData.productName && !!formData.productDescription, [formData]);

    // --- EVENT HANDLERS ---
    const resetForm = () => {
        setEditingProduct(null);
        setFormData({ productName: '', productDescription: '', status: 'draft', images: [], customizable: false });
    };

    const handleCreateProduct = () => {
        resetForm();
        setIsCreateModalOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            productName: product.productName,
            productDescription: product.productDescription,
            status: product.status,
            customizable: product.customizable || false,
            images: product.imageUrls.map((url) => ({ preview: url, url })),
        });
        setIsCreateModalOpen(true);
    };

const handleDeleteProduct = async (productId: string) => {
  // Replace window.confirm with a toast confirmation
const confirmDelete = await new Promise((resolve) => {
  toast.custom((t) => (
    <div className="bg-white w-full max-w-md mx-auto p-6 rounded-xl shadow-xl border border-gray-200 relative">
      {/* Close button */}
      <button
        onClick={() => {
          toast.dismiss(t.id);
          resolve(false);
        }}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Trash2 className="h-6 w-6 text-red-500" />
        <h2 className="text-lg font-semibold text-gray-800">Confirm Deletion</h2>
      </div>

      {/* Message */}
      <p className="text-sm text-gray-600 mb-6">
        Are you sure you want to delete this product? This action cannot be undone.
      </p>

      {/* Action buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            toast.dismiss(t.id);
            resolve(false);
          }}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            toast.dismiss(t.id);
            resolve(true);
          }}
          className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  ), {
    duration: Infinity,
    position: 'top-center', // visually overridden
    style: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 9999,
      background: 'transparent',
      boxShadow: 'none',
    },
  });
});

  if (confirmDelete) {
    try {
      const { response } = await AppService.productsPage.delete({ payload: { _id: productId } });
      if (response?.success) {
        setProducts((prev) => prev.filter((p) => p._id !== productId));
        toast.success('Product deleted successfully');
      } else {
        toast.error(`Failed to delete product: ${response?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('An error occurred while deleting the product');
    }
  }
};

    const handleStatusUpdate = async (productId: string, newStatus: 'active' | 'draft') => {
        try {
            const { response } = await AppService.productsPage.update({ payload: { _id: productId, status: newStatus } });
            if (response?.success) {
                setProducts((prev) => prev.map((p) => (p._id === productId ? { ...p, status: newStatus } : p)));
                                toast.success(`Status updated to ${newStatus}`);

            } else {
                toast.error(`Failed to update status: ${response?.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('An error occurred while updating the status');
        }
    };



    const handleSaveProduct = async () => {
        if (!isFormValid) {
            toast.error('Please fill all required fields');
            return;
        }

        setIsSubmitting(true);

        const payload = {
            ...formData,
            merchantId: userId,
            imageUrls: formData.images.map((img) => img.url),
            variants: editingProduct ? editingProduct.variants : [],
        };

        try {
            let response;
            if (editingProduct) {
                response = await AppService.productsPage.update({ payload: { ...payload, _id: editingProduct._id } });
            } else {
                response = await AppService.productsPage.create({ payload });
            }

            if (response?.response?.success) {
                const { response: listResponse } = await AppService.productsPage.GetProductByMerchantId({
                    query: `merchantId=${userId}`,
                });
                if (listResponse?.success) {
                    setProducts(listResponse.data);
                }
                if (!editingProduct) {
                    resetForm();
                }
                setIsCreateModalOpen(false);
                                                toast.success(`Product Created Successfully`);

            } else {
                toast.error(`Failed to save product: ${response?.response?.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error('An error occurred while saving the product');
        } finally {
            setIsSubmitting(false);
        }
    };

    const downloadCSV = () => {
        if (products.length === 0) {
            toast.error('No products to download');
            return;
        }
        const headers = ['productName', 'productId', 'productDescription', 'status', 'variantCount', 'imageCount'];
        const rows = products.map((p) =>
            [`"${p.productName.replace(/"/g, '""')}"`, `"${p.productId}"`, `"${p.productDescription.replace(/"/g, '""')}"`, p.status, p.variants.length, p.imageUrls.length].join(',')
        );

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'products.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
<Toaster
  position="bottom-right" // 👈 default for all normal toasts
  toastOptions={{
    style: { marginBottom: '1rem' }, // default toast spacing

    success: { style: { background: '#f0fdf4', color: '#15803d' } },
    error: { style: { background: '#fef2f2', color: '#b91c1c' } },
  }}
/>
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-5">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
                            <p className="text-gray-600 mt-1 text-sm">Create, view, and manage your products.</p>
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
                                onClick={handleCreateProduct}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                Create Product
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
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>
                            <div className="text-sm text-gray-600 hidden sm:block">{filteredProducts.length} results</div>
                        </div>
                    </div>

                    {isPageLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-500">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            <p>Loading Products...</p>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <ProductTable products={filteredProducts} onEdit={handleEditProduct} onDelete={handleDeleteProduct} onStatusUpdate={handleStatusUpdate} />
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-500">
                            <Inbox className="h-12 w-12 text-gray-300" />
                            <p className="font-semibold">No products found</p>
                            <p className="text-sm">Try adjusting your search or create a new product.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create/Edit Product Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-semibold text-gray-900">{editingProduct ? 'Edit Product' : 'Create New Product'}</h2>
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
                            <div>
                                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Name
                                </label>
                                <input
                                    id="productName"
                                    type="text"
                                    value={formData.productName}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, productName: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Description
                                </label>
                                <textarea
                                    id="productDescription"
                                    value={formData.productDescription}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, productDescription: e.target.value }))}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 resize-y"
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="customizable"
                                    type="checkbox"
                                    checked={formData.customizable}
                                    onChange={(e) => {
                                        setFormData((prev) => ({ ...prev, customizable: e.target.checked }));
                                    }}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="customizable" className="ml-2 block text-sm text-gray-700">
                                    Customizable
                                </label>
                            </div>


                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> After creating the product, you can manage variants by clicking on the Variants.
                                </p>
                            </div>
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
                                onClick={handleSaveProduct}
                                disabled={!isFormValid || isSubmitting}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                {isSubmitting ? 'Saving...' : editingProduct ? 'Update' : 'Save Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
