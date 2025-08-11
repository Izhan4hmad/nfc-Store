// Example routes.js (update your existing file)
// import NfcCardView from 'layouts/superadmin/nfc/NfcCardView'
import ProductPage from './productpage'

// Add this to your routes array
const routes = [
  {
    type: 'collapse',
    key: 'home',
    route: '/',
    component: <ProductPage />,
  },
  // {
  //   type: 'collapse',
  //   key: 'home',
  //   route: '/view/:cardId',
  //   component: <NfcCardView />,
  // },
]

export default routes
