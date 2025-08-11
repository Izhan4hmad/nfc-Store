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

import { useState, useEffect } from 'react'

// react-router components
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
// useParams

// @mui material components
// import Icon from '@mui/material/Icon'

// Material Dashboard 2 React components
import MDBox from 'components/MDBox'

// Material Dashboard 2 React example components
import Sidenav from 'examples/Sidenav'
import Configurator from 'examples/Configurator'

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from 'context'

// Images
// import brandWhite from 'assets/images/logo-ct.png'
// import brandDark from 'assets/images/logo-ct-dark.png'

// Material Dashboard 2 React routes
// import RouteGuard from 'route.guard'
import { useBrandInfo } from 'context/brand'
import useRoutes from './routes'
import Settings from './setting/Settings'
import { useUserInfo } from 'context/user'

export default function App() {
  const [controller, dispatch] = useMaterialUIController()
  const [brand] = useBrandInfo()
  const [user] = useUserInfo()

  // const { state: {location_id} } = useLocation()
  const routes = useRoutes()

  const {
    miniSidenav,
    direction,
    openConfigurator,
    // sidenavColor,
    // transparentSidenav,
    // whiteSidenav,
    // darkMode,
  } = controller
  const [onMouseEnter, setOnMouseEnter] = useState(false)
  const { pathname } = useLocation()

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false)
      setOnMouseEnter(true)
    }
  }

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true)
      setOnMouseEnter(false)
    }
  }

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator)

  // Setting the dir attribute for the body element
  useEffect(() => {
    // console.log(routes)
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

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />
      }

      return null
    })
  const configsButton = (
    <MDBox
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: 'pointer' }}
      onClick={handleConfiguratorOpen}
    >
      {/* <Icon fontSize="small" color="inherit">
        settings
      </Icon> */}
    </MDBox>
  )

  return (
    <>
      <Sidenav
        // color={sidenavColor}
        // brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
        routes={routes}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      />
      <Configurator />
      {configsButton}
      <Routes>
        {/* <Route element={<RouteGuard valid={brand._id || location_id} redirect="/404" />}> */}
        {getRoutes(routes)}
        <Route exact path="/settings" element={<Settings />} />
        {user?.roles?.includes('onboarding_admin') ? (
          <Route path="*" element={<Navigate to={`/superadmin/changelogs`} />} />
        ) : user?.roles?.includes('client') ? (
          <Route path="*" element={<Navigate to={`/superadmin/partner`} />} />
        ) : (
          <Route path="*" element={<Navigate to={`/superadmin/dashboard`} />} />
        )}

        {/* // <Route path="*" element={<Navigate to={`/superadmin/dashboard`} />} /> */}
        {/* </Route> */}
      </Routes>
    </>
  )
}
