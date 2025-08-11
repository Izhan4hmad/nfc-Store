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
import BorderColorIcon from '@mui/icons-material/BorderColor'
import localforage from 'localforage'
import env from 'config'
import './style.css'
// react-router components
import { useLocation, Link, NavLink } from 'react-router-dom'

// prop-types is a library for typechecking of props.
import PropTypes from 'prop-types'

// @material-ui core components
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import Icon from '@mui/material/Icon'
import { Grid } from '@mui/material'
import { styled, alpha } from '@mui/material/styles'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import MenuItem from '@mui/material/MenuItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItem from '@mui/material/ListItem'

// Material Dashboard 2 React components
import MDBox from 'components/MDBox'
import MDInput from 'components/MDInput'
import ThemeNavbar from './ThemeNavbar'
// Material Dashboard 2 React example components
import Breadcrumbs from 'examples/Breadcrumbs'
import NotificationItem from 'examples/Items/NotificationItem'

// Custom styles for DashboardNavbar
import { navbar, navbarContainer, navbarRow, navbarIconButton, navbarMobileMenu } from './styles'

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from 'context'
import { useLogout } from 'hook/auth'
import { Button } from '@mui/material'
// import { Switch } from '@mui/material'
// import MDTypography from 'components/MDTypography'
const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'white' : 'white',
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: 'white',
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}))
function DashboardNavbar({
  absolute,
  light,
  isMini,
  handleOpen,
  initState,
  type,
  data,
  handleChange,
  handlerange,
  handleview,
  handelrefresh,
  routes,
}) {
  const [navbarType, setNavbarType] = useState()
  const [controller, dispatch] = useMaterialUIController()
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller
  const [openMenu, setOpenMenu] = useState(false)
  const [agency_data, setagency_data] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const route = useLocation().pathname.split('/').slice(1)
  const Logout = useLogout()
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const { pathname } = useLocation()
  const collapseName = pathname.split('/').pop()
  var loc_name = 'loc_name'
  var loc_add = 'loc_add'
  var agency_id = 'agency_id'
  var loc_id = 'loc_id'
  var custom = ''
  var prefix = ''
  var path = pathname.split('/')[1]
  if (path == 'location') {
    loc_name = pathname.split('/')[3]
    loc_add = pathname.split('/')[4]
    loc_id = pathname.split('/')[2]
    agency_id = pathname.split('/')[6]
    prefix = `/location/${loc_id}/${loc_name}/${loc_add}/agency/${agency_id}`
  } else if (path == 'custom') {
    loc_name = pathname.split('/')[4]
    loc_add = pathname.split('/')[5]
    loc_id = pathname.split('/')[3]
    custom = pathname.split('/')[2]
    agency_id = pathname.split('/')[7]
    prefix = `/custom/${custom}/${loc_id}/${loc_name}/${loc_add}/agency/${agency_id}`
  } else {
    loc_name = pathname.split('/')[4]
    loc_add = pathname.split('/')[5]
    loc_id = pathname.split('/')[3]
    agency_id = pathname.split('/')[7]
    custom = pathname.split('/')[1]
    prefix = `/${custom}/location/${loc_id}/${loc_name}/${loc_add}/agency/${agency_id}`
    //  alert(prefix)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(async () => {
    // console.log(initState,'initState')
    if (fixedNavbar) {
      setNavbarType('sticky')
    } else {
      setNavbarType('static')
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar)
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener('scroll', handleTransparentNavbar)

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar()

    // Remove event listener on cleanup
    return () => window.removeEventListener('scroll', handleTransparentNavbar)
  }, [dispatch, fixedNavbar])

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav)
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator)
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget)
  const handleCloseMenu = () => setOpenMenu(false)

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem onClick={Logout} icon={<Icon>logout</Icon>} title="logout" />
    </Menu>
  )

  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main
      }

      return colorValue
    },
  })

  return (
    <AppBar
      position={absolute ? 'absolute' : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
      style={{ marginBottom: '1.6rem' }}
      className="navbar-settings"
    >
      <BorderColorIcon className="hover-icon-navbar" onClick={handleOpen} />
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          {initState.Categries == true ? (
            <Grid container ml={3}>
              <NavLink key={'#'} to={'#'} className={''}>
                <ListItem component="li" mt={1}>
                  <MDBox mt={1}>
                    <ListItemText
                      primary={<div style={{ fontSize: '0.85rem', fontWeight: '500' }}>test</div>}
                    />
                  </MDBox>
                </ListItem>
              </NavLink>

              <Button
                style={{ color: '#344767', marginLeft: 5 }}
                id="demo-customized-button"
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="text"
                disableElevation
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
              >
                Categories
              </Button>
              <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                  'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <NavLink key={'#'} to={'#'} className="">
                  <ListItem component="li" mt={1}>
                    <MDBox>
                      <MenuItem
                        disableRipple
                        sx={{ paddingTop: '10px', paddingBottom: '10px', marginBottom: 1 }}
                      >
                        menu
                      </MenuItem>
                    </MDBox>
                  </ListItem>
                </NavLink>
              </StyledMenu>
              <NavLink key={'settings'} to={'#'} className={''}>
                <ListItem component="li" mt={1}>
                  <MDBox mt={1}>
                    <ListItemText
                      primary={
                        <div style={{ fontSize: '0.85rem', fontWeight: '500' }}>{'Settings'}</div>
                      }
                    />
                  </MDBox>
                </ListItem>
              </NavLink>
            </Grid>
          ) : (
            <></>
          )}
        </MDBox>

        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox color={light ? 'white' : 'inherit'}>
              <Grid container>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'end' }}>
                  <ThemeNavbar handleChange={handleChange} initState={initState} />
                  <IconButton
                    size="small"
                    disableRipple
                    color="inherit"
                    sx={navbarMobileMenu}
                    onClick={handleMiniSidenav}
                  >
                    <Icon sx={iconsStyle} fontSize="medium">
                      {miniSidenav ? 'menu_open' : 'menu'}
                    </Icon>
                  </IconButton>
                </Grid>
              </Grid>
              {/* <IconButton
           size="small"
           disableRipple
           color="inherit"
           sx={navbarIconButton}
           aria-controls="notification-menu"
           aria-haspopup="true"
           variant="contained"
           onClick={handleOpenMenu}
         >
           <Icon sx={iconsStyle}>account_circle</Icon>
         </IconButton> */}
              {renderMenu()}
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  )
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
  isMini: '',
}

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
  type: PropTypes.string,
  data: PropTypes.array,
  routes: PropTypes.array,
  initState: PropTypes.array,
  handleChange: PropTypes.func,
  handleview: PropTypes.func,
  handlerange: PropTypes.func,
  handelrefresh: PropTypes.func,
  handleOpen: PropTypes.func,
}

export default DashboardNavbar
