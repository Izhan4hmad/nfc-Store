/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
// react-router components
import { Routes, Route, Navigate } from 'react-router-dom'

// Material Dashboard 2 React routes
import routes from './routes'

export default function Authentication() {
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
      <Route path="*" element={<Navigate to="/auth/sign-in" />} />
    </Routes>
  )
}
