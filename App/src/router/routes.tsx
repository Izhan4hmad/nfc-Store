import { lazy } from 'react';
import IconHome from '../components/Icon/IconHome';

const Agency = lazy(() => import('../layout/Agency'));
const Account = lazy(() => import('../layout/Account'));

export default function useRoutes() {
    return [
        {
            path: '/app/:company_id/:planId/:userId/*',
            layout: 'blank',
            element: <Agency />,
        },
        {
            path: '/account/:company_id/:planId/:locationId/:userId/*',
            layout: 'blank',
            element: <Account />,
        },

    ];
}
