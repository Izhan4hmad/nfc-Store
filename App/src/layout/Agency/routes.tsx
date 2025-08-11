import IconAirplay from '../../components/Icon/IconAirplay';
import Tags from './dashboard/Tags';
import Store from './dashboard/Store';
import ProductDetailPage from './dashboard/Store/storeDetails/productDetails';
import BundleDetailPage from './dashboard/Store/storeDetails/bundleDetails';
import AgencyStore from './dashboard/agencyStore';
import AgencyProductDetailPage from './dashboard/agencyStore/storeDetails/productDetails';
import CustomProductDetailPage from './dashboard/Store/storeDetails/customProductDetails';
import AgencyCustomProductDetailPage from './dashboard/agencyStore/storeDetails/customProductDetails';
import AgencyBundleDetailPage from './dashboard/agencyStore/storeDetails/bundleDetails';
import StoreSetting from './dashboard/storeSetting';
import Orders from './dashboard/Orders';
export default function useRoutes() {
    return [
        {
            title: 'Tags',
            path: '/',
            element: <Tags />,
        },
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
        {
            title: 'Agency Store',
            path: '/agency-store',
            element: <AgencyStore />,
        },
        {
            path: '/agency-store/product/:productId',
            element: <AgencyProductDetailPage />,
        },
        {
            path: '/agency-store/custom-product/:productId',
            element: <AgencyCustomProductDetailPage />,
        },
        {
            path: '/agency-store/bundle/:bundleId',
            element: <AgencyBundleDetailPage />,
        },

        {
            // title: 'Store Settings',
            path: '/store-setting/*',
            element: <StoreSetting />,
        },

        {
            title: 'Orders',
            path: '/orders',
            element: <Orders />,
        },
    ];
}
