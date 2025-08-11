import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Define interface for coupon data
interface Coupon {
  couponId: string;
  bundleId: string;
  agencyId?: string;
  customerName?: string;
  customerEmail?: string;
}

// Orders Component with Static Data
const Orders: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [coupon, setCoupon] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const { company_id } = useParams();

  useEffect(() => {
    // Static sample coupons data
    const staticCoupons: Coupon[] = [
      {
        couponId: 'COUPON001',
        bundleId: 'BUNDLE-A',
        agencyId: 'AGENCY01',
        customerName: 'John Doe',
        customerEmail: 'john@example.com'
      },
      {
        couponId: 'COUPON002',
        bundleId: 'BUNDLE-B',
        agencyId: 'AGENCY02',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com'
      },
      {
        couponId: 'COUPON003',
        bundleId: 'BUNDLE-A',
        customerName: 'Ali Khan',
        customerEmail: 'ali.khan@example.com'
      },
      {
        couponId: 'COUPON004',
        bundleId: 'BUNDLE-C'
      }
    ];

    setCoupons(staticCoupons);
  }, [company_id]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Orders</h2>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        Redeem Coupon
      </button>

      {/* Coupons Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Coupon ID</th>
              <th className="py-2 px-4 border-b text-left">Bundle ID</th>
              <th className="py-2 px-4 border-b text-left">Agency ID</th>
              <th className="py-2 px-4 border-b text-left">Customer Name</th>
              <th className="py-2 px-4 border-b text-left">Customer Email</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length > 0 ? (
              coupons.map((coupon) => (
                <tr key={coupon.couponId} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{coupon.couponId}</td>
                  <td className="py-2 px-4 border-b">{coupon.bundleId}</td>
                  <td className="py-2 px-4 border-b">{coupon.agencyId || '-'}</td>
                  <td className="py-2 px-4 border-b">{coupon.customerName || '-'}</td>
                  <td className="py-2 px-4 border-b">{coupon.customerEmail || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-2 px-4 border-b text-center">
                  No coupons found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Redeem Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Redeem Coupon</h3>
            <input
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Enter coupon code"
              className="w-full p-2 border rounded mb-4"
            />
            {message && <p className="text-red-500 mb-4">{message}</p>}
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => {
                  setIsModalOpen(false);
                  setMessage('');
                  setCoupon('');
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
