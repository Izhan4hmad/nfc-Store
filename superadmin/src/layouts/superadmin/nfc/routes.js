// Example routes.js (update your existing file)
import NfcBusiness from 'layouts/superadmin/nfc/list-cards'
import NfcCardView from 'layouts/superadmin/nfc/NfcCardView'

// Add this to your routes array
const routes = [
  {
    type: 'collapse',
    key: 'home',
    route: '/',
    component: <NfcBusiness />,
  },
  {
    type: 'collapse',
    key: 'home',
    route: '/view/:cardId',
    component: <NfcCardView />,
  },
]

export default routes
