// Example routes.js (update your existing file)
import NfcBusiness from './listCard'
import CardView from './listCard/cardView'

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
    component: <CardView />,
  },
]

export default routes
