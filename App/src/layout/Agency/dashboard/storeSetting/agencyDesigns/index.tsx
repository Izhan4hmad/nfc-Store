'use client';

import { useState, useEffect } from 'react';
import {
  Eye,
  Loader2,
  Package,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppServices } from '../../../../../hook/services';

interface Variant {
  _id?: string;
  title: string;
  quantity: number;
  unitPrice: number;
  imageUrls: string[];
  resellingPrice: number;
  agencyCreated: boolean;
  createdBy: string | null; 
}

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

interface Merchant {
  _id: string;
  name: string;
  email: string;
}

export default function AgencyDesigns() {
  const navigate = useNavigate();
  const AppService = useAppServices();
  const { userId, company_id, planId } = useParams();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { response: merchantRes } = await AppService.nfc_users.GetMerchants({});
      const merchants = merchantRes?.success ? merchantRes.data : [];

      const { response: productRes } = await AppService.productsPage.GetByAgencyCreatedVariants({
        query:`company_id=${company_id}`,
      });
      if (productRes?.success && Array.isArray(productRes.data)) {
        const productsWithMerchantNames = productRes.data.map((product: any) => {
          const merchant = merchants.find((m: any) => m._id === product.merchantId);
          return {
            ...product,
            merchantName: merchant?.name || 'Unknown Merchant',
          };
        });
        setProducts(productsWithMerchantNames);
        setFilteredProducts(productsWithMerchantNames);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const ProductCard = ({ product }: { product: Product }) => {
    const variants = product.variants.filter(v=>v.agencyCreated == true && v.createdBy == company_id) || [];
    const firstVariant = variants?.[0];
    const price = firstVariant?.resellingPrice || 0;
    const isAddedToAgency = product.companyId?.includes(company_id || '');

    return (
      <div className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition overflow-hidden group">
        <div className="relative aspect-square">
          <img
            src={firstVariant?.imageUrls?.[0] || '/placeholder-product.png'}
            alt={product?.productName || 'Product'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            onError={(e) => ((e.target as HTMLImageElement).src = '/placeholder-product.png')}
          />
         
          <div className="absolute top-3 left-3">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {product?.status || 'unknown'}
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 text-lg leading-tight">
              {product?.productName || 'Unknown Product'}
            </h3>
            <p className="text-2xl font-bold text-gray-900">${price.toFixed(2)}</p>
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product?.productDescription || 'No description available'}
          </p>

          <div className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Your Designs:</span> {variants?.length || 0}
          </div>

          {product.merchantName && (
            <div className="mb-3 px-4">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {product.merchantName}
              </span>
            </div>
          )}

          <button
            onClick={() => navigate(`/app/${company_id}/${planId}/${userId}/store-setting/agency-designs/${product?.productId}`)}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View Details
          </button>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          {products.length} Products Found
        </h2>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
