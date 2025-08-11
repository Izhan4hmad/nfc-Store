import UpdateAction from './cards/action'
import NfcCards from './cards/nfc-cards'
import NFCUSERS from './nfcuser'

// Add this to your routes array
const routes = [
  {
    type: 'collapse',
    key: 'home',
    route: '/',
    component: <NFCUSERS />,
  },
  {
    type: 'collapse',
    key: 'home',
    route: '/edit/:UserId',
    component: <NfcCards />,
    children: [
      // {
      //   type: 'collapse',
      //   key: 'update',
      //   route: '/update/:actionId',
      //   component: <UpdateAction />,
      // },
    ],
  },
  {
    type: 'collapse',
    key: 'update',
    route: '/update/:actionId',
    component: <UpdateAction />,
  },
]

export default routes
