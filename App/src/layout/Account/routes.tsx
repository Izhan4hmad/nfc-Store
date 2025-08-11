import Store from './dashboard/Store';
import ProductDetailPage from './dashboard/Store/storeDetails/productDetails';
import BundleDetailPage from './dashboard/Store/storeDetails/bundleDetails';
import CustomProductDetailPage from './dashboard/Store/storeDetails/customProductDetails';
import CartPage from './dashboard/Cart';
import CheckoutPage from './dashboard/checkout';
import Orders from './dashboard/Orders';
export default function useRoutes() {
    return [

        {
            title: 'Store',
            path: '/store',
            element: <Store />,
        },
        {
            path: '/store/product/:productId',
            element: <ProductDetailPage />,
        },
        {
            path: '/store/bundle/:bundleId',
            element: <BundleDetailPage />,
        },
        {
            path: '/store/custom-product/:productId',
            element: <CustomProductDetailPage />,
        },
        

        // {
        //     // title: 'Store Settings',
        //     path: '/store-setting/*',
        //     element: <StoreSetting />,
        // },

        {
            title: 'Your Cart',
            path: '/cart',
            element: <CartPage />,
        },
        {
            // title: 'Your Checkout',
            path: '/checkout',
            element: <CheckoutPage />,
        },
        {
            title: 'Your Orders',
            path: '/orders',
            element: <Orders />,
        },
    ];
}
