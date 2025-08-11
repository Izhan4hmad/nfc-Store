// @mui icons
import Icon from '@mui/material/Icon'
// Material Dashboard 2 React layouts
import Dashboard from './dashboard'
// import Tables from './tables'
// import Billing from './billing'
// import Notifications from './notifications'

// import Roadmap from './'
import Webhooks from './Webhooks'

import AppPlans from './Apps/plans'
import Demo from './Demo/Demo'
import Auth from './integration/auth/index'

// import GhlFeatures from './GhlFeatures'

import StaffTasks from './StaffTasks'
import Tasks from './Tasks'


import { useUserInfo } from 'context/user'
import NfcBusiness from './nfc'
import NfcUsers from './nfcusers'
import NFCPackage from './nfc-package'
import Card from 'components/icons/card'
import Product from 'components/icons/product'
import ProductPage from './product/productpage'
import NFCUSERICON from 'components/icons/nfcuser'

// import RoadMap from './RoadMap'

function useRoutes() {
  const [user] = useUserInfo()
  console.log('user', user)

  const allRoutes = [
    {
      type: 'collapse',
      name: 'Dashboard',
      key: 'dashboard',
      icon: <Icon fontSize="small">dashboard</Icon>,
      route: '/dashboard',
      component: <Dashboard />,
    },
   
    {
      type: 'collapse',
      name: 'NFC Card',
      key: 'product_page',
      icon: (
        <Icon fontSize="medium" sx={{ mb: '10px' }}>
          <Card />
        </Icon>
      ),
      route: '/businessCard/*',
      component: <NfcBusiness />,
    },
    {
      type: 'collapse',
      name: 'NFC Users',
      key: 'nfc_users',
      icon: (
        <Icon fontSize="medium" sx={{ mb: '10px' }}>
          <NFCUSERICON />
        </Icon>
      ),
      route: '/nfcusers/*',
      component: <NfcUsers />,
    },
    {
      type: 'collapse',
      name: 'NFC Package',
      key: 'nfc_package',
      icon: (
        <Icon fontSize="medium" sx={{ mb: '10px' }}>
          <NFCUSERICON />
        </Icon>
      ),
      route: '/nfcPackage/*',
      component: <NFCPackage />,
    },
    {
      type: 'collapse',
      name: 'Products',
      key: 'product_page',
      icon: (
        <Icon fontSize="medium" sx={{ mb: '10px' }}>
          <Product />
        </Icon>
      ),
      route: '/products/*',
      component: <ProductPage />,
    },
   
    {
      key: 'theme',
      route: '/theme',
      component: <Demo />,
    },
    {
      key: 'auth',
      route: '/auth',
      component: <Auth />,
    },
  ]

  // Only allow "superadmin" and "manager" to see all routes
  const allowedRoles = ['superadmin', 'manager']

  if (user?.roles?.some((role) => allowedRoles.includes(role))) {
    return allRoutes // Full access for superadmin/manager
  }

  if (user?.roles?.some((role) => role === 'onboarding_admin')) {
    const allowedKeys = new Set([
      'changelogs', // Changelogs
      'newsfeeds', // News feed
      'players', // Players (+ sub-routes)
      'partner', // Partners
      'medialibrary', // Media library (+ sub-routes)
      'awardgroup', // Award Ranking (+ sub-routes)
      'banners', // Banners (unique key)
      'tooltip', // ToolTip (unique key)
      'checklist', // Check list (+ sub-routes)
      'questions', // Questions (+ sub-routes)
      'faq', // FAQs (+ sub-routes)
      'knowledgebase', // Knowledge Base (+ sub-routes)
      'onboardcategory', // Onboard list (+ sub-routes)
    ])

    return allRoutes.filter((route) => allowedKeys.has(route.key))
  }
  if (user?.roles?.some((role) => role === 'client')) {
    const allowedKeys = new Set([
      'partner', // Partners
    ])

    return allRoutes.filter((route) => allowedKeys.has(route.key))
  }
  if (user?.roles?.some((role) => role === 'bid_data')) {
    const allowedKeys = new Set([
      'partner', // Partners
      'partnersaas',
    ])

    return allRoutes.filter((route) => allowedKeys.has(route.key))
  }

  // Fallback for non-admin users (e.g., regular users)
  return [
    {
      type: 'collapse',
      name: 'Dashboard',
      key: 'dashboard',
      icon: <Icon fontSize="small">dashboard</Icon>,
      route: '/dashboard',
      component: <Dashboard />,
    },
    {
      type: 'collapse',
      name: 'Tasks',
      key: 'tasks',
      icon: <Icon fontSize="small">dashboard</Icon>,
      route: '/tasks',
      component: <Tasks />,
    },
    {
      type: 'collapse',
      name: 'Staff task',
      key: 'staff_task',
      icon: <Icon fontSize="small">Staff Task</Icon>,
      route: '/staff_task',
      component: <StaffTasks />,
    },
  ]
}

export default useRoutes
