// Example routes.js (update your existing file)
import ProductDashboard from './ProductPage'
import ProductDetails from './ProductPage/ProductView'

// Add this to your routes array
const routes = [
  {
    type: 'collapse',
    key: 'home',
    route: '/',
    component: <ProductDashboard />,
  },
  {
    type: 'collapse',
    key: 'home',
    route: '/variants/:productId',
    component: <ProductDetails />,
  },
]

export default routes
