import Package from './package/package'

// Add this to your routes array
const routes = [
  {
    type: 'collapse',
    key: 'home',
    route: '/',
    component: <Package />,
  },

]

export default routes
