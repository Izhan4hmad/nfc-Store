import { Routes, Route, Navigate } from 'react-router-dom'
import routes from './routes'

export default function RewardRoutes() {
  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse)
      }
      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />
      }
      return null
    })

  return (
    <Routes>
      {getRoutes(routes)}
      <Route path="*" element={<Navigate to="." />} />
    </Routes>
  )
}
