import IconMenuApps from '../../components/Icon/Menu/IconMenuApps';
import IconMenuDashboard from '../../components/Icon/Menu/IconMenuDashboard';
import IconCreditCard from '../../components/Icon/IconCreditCard';
import IconMenuScrumboard from '../../components/Icon/Menu/IconMenuScrumboard';
import IconBox from '../../components/Icon/IconBox';
import Dashboard from './Dashboard';
import NfcBusiness from './Nfc';
import Product from './product';
import Bundles from './bundles';
export default function useRoutes() {
    return [
        {
            title: 'Dashboard',
            icon: <IconMenuDashboard />,
            path: '/dashboard',
            element: <Dashboard />,
        },
        {
            title: 'NFC Tags',
            icon: <IconCreditCard />,
            path: '/nfc-tags/*',
            element: <NfcBusiness />,
        },
        {
            title: 'Products',
            icon: <IconMenuScrumboard />,
            path: '/products/*',
            element: <Product />,
        },
        {
            title: 'Bundles',
            icon: <IconBox />,
            path: '/bundles',
            element: <Bundles />,
        },
        // {
        //     title: 'Pages',
        //     icon: <IconMenuDashboard />,
        //     items: [
        //         {
        //             title: 'Page 1',
        //             icon: <IconMenuDashboard />,
        //             path: '/page_1',
        //             element: <Dashboard />,
        //         },
        //     ],
        // },

    ];
}
