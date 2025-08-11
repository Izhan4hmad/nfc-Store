import AgencyDesigns from './agencyDesigns';
import DesignDetails from './agencyDesigns/designDetails';
import StoreConfiguration from './storeConfiguration';
import { Children } from 'react';

export const settingsRoutes = [
    {
        name: 'Agency Designs',
        path: 'agency-designs',
        description: 'Add new products to your store',
        component: <AgencyDesigns />,

    },
    {
      path: "agency-designs/:productId",
      component: <DesignDetails/>,
    },
    {
        name: 'Store Configuration',
        path: 'configuration',
        description: 'Configure store settings and preferences',
        component: <StoreConfiguration />,
    },
];
