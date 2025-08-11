import AgencyAuth from './agency_auth';
import SuperAdminAuth from './super_admin_auth';
const routes = [
    {
        type: 'collapse',
        key: 'auth_agency',
        route: '/auth/agency',
        component: <AgencyAuth />,
    },
    {
        type: 'collapse',
        key: 'super_admin_auth',
        route: '/auth/super_admin',
        component: <SuperAdminAuth />,
    },
];

export default routes;
