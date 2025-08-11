import { useEffect, useState } from 'react'

// react-router-dom components
import { useLocation, NavLink, useNavigate } from 'react-router-dom'

// prop-types is a library for typechecking of props.
import PropTypes from 'prop-types'

// @mui material components
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import Icon from '@mui/material/Icon'
import Collapse from '@mui/material/Collapse'

// Material Dashboard 2 React components
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import MDButton from 'components/MDButton'

// Material Dashboard 2 React example components
import SidenavCollapse from 'examples/Sidenav/SidenavCollapse'

// Custom styles for the Sidenav
import SidenavRoot from 'examples/Sidenav/SidenavRoot'

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from 'context'
import { useUserInfo } from 'context/user'

function Sidenav({ color, brand, brandName, level, routes, ...rest }) {
  const [controller, dispatch] = useMaterialUIController()
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } = controller
  const location = useLocation()
  const navigate = useNavigate()
  const collapseName = location.pathname.split('/').pop()

  let textColor = 'white'
  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = 'dark'
  } else if (whiteSidenav && darkMode) {
    textColor = 'inherit'
  }

  const closeSidenav = () => setMiniSidenav(dispatch, true)

  useEffect(() => {
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200)
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav)
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav)
    }

    window.addEventListener('resize', handleMiniSidenav)
    handleMiniSidenav()
    return () => window.removeEventListener('resize', handleMiniSidenav)
  }, [dispatch, location])

  // State to handle collapsible menus
  const [openCollapse, setOpenCollapse] = useState({})

  const handleCollapseToggle = (key) => {
    setOpenCollapse((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const [user, Update, clear] = useUserInfo()

  useEffect(() => {
    // Check if user data exists and log it
    if (user && user.role) {
      console.log('User Role:', user.role) // Log user role or any other data
    }
  }, [user])

  // Recursive function to render nested routes
  // Recursive function to render nested routes
  const renderRoutes = (routes, level = 0) =>
    routes.map(({ type, name, icon, key, href, route, collapse }) => {
      if (type === 'collapse') {
        return (
          <div key={key} style={{ paddingLeft: `${level * 16}px` }}>
            {' '}
            {/* Indent based on depth */}
            {href ? (
              <Link href={href} target="_blank" rel="noreferrer" sx={{ textDecoration: 'none' }}>
                <SidenavCollapse
                  name={name}
                  icon={icon}
                  active={key === collapseName}
                  onClick={() => handleCollapseToggle(key)}
                />
              </Link>
            ) : (
              <NavLink to={`.${route.replace('/*', '')}`} onClick={() => handleCollapseToggle(key)}>
                <SidenavCollapse
                  name={name}
                  icon={icon}
                  active={key === collapseName}
                  noCollapse={!collapse}
                />
              </NavLink>
            )}
            {collapse && (
              <Collapse in={openCollapse[key]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {renderRoutes(collapse, level + 1)}{' '}
                  {/* Increase indentation level for children */}
                </List>
              </Collapse>
            )}
          </div>
        )
      }
      return null
    })

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDBox
          display={{ xs: 'block', xl: 'none' }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: 'pointer' }}
        >
          <MDTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: 'bold' }}>close</Icon>
          </MDTypography>
        </MDBox>
        <MDBox component={NavLink} to="/" display="flex" alignItems="center" />
      </MDBox>
      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />
      <List>{renderRoutes(routes)}</List>

      {level === 'agency' && (
        <MDBox p={2} pb={0} mt="auto">
          <MDButton
            onClick={() => window.open('https://university.snapshotstore.io/', '_blank')}
            variant="gradient"
            color="info"
            fullWidth
          >
            University
          </MDButton>
        </MDBox>
      )}

      <MDBox p={2} mt={level === 'agency' ? 0 : 'auto'}>
        <MDButton onClick={() => navigate(`./settings`)} variant="gradient" color="info" fullWidth>
          Settings
        </MDButton>
      </MDBox>
    </SidenavRoot>
  )
}

Sidenav.defaultProps = {
  color: 'info',
  brand: '',
}

Sidenav.propTypes = {
  color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'warning', 'error', 'dark']),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  level: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default Sidenav
