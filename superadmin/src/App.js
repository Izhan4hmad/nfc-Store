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

import { useEffect } from 'react'

// react-router components
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

// @mui material components
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

// Material Dashboard 2 React example components
import Configurator from 'examples/Configurator'

// Material Dashboard 2 React themes
import theme from 'assets/theme'

// Material Dashboard 2 React Dark Mode themes
import themeDark from 'assets/theme-dark'

// Material Dashboard 2 React routes
import useRoutes from 'routes'


// Material Dashboard 2 React contexts
import { useMaterialUIController } from 'context'
import RouteGuard from 'route.guard'
import { NotificationProvider } from 'context/notification'
import ChatWidget from 'layouts/superadmin/dashboard/components/ChatWidget'

export default function App() {
  const [controller] = useMaterialUIController()
  const { direction, layout, darkMode } = controller
  const { pathname } = useLocation()
  const routes = useRoutes()

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute('dir', direction)
  }, [direction])

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0
    document.scrollingElement.scrollTop = 0
  }, [pathname])

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse)
      }

      if (route.guard) {
        const { valid, redirect, state } = route.guard
        return (
          <Route element={<RouteGuard valid={valid} redirect={redirect} state={state} />} key={route.key}>
            <Route exact path={route.route} element={route.component} />
          </Route>
        )
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />
      }

      return null
    })

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      <NotificationProvider>
        {layout === 'vr' && <Configurator />}
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/auth/sign-in" />} />
        </Routes>
      </NotificationProvider>
      <ChatWidget />
    </ThemeProvider>
  )
}
