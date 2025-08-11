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

import { useEffect ,useState} from 'react'

// react-router-dom components
import { useLocation } from 'react-router-dom'

// prop-types is a library for typechecking of props.
import PropTypes from 'prop-types'

import BorderColorIcon from '@mui/icons-material/BorderColor';
// Material Dashboard 2 React components
import MDBox from 'components/MDBox'

// Material Dashboard 2 React context
import { useMaterialUIController, setLayout } from 'context'
function DashboardLayout({ children ,handleRightbar}) {
  const [controller, dispatch] = useMaterialUIController()
  const { miniSidenav } = controller
  const { pathname } = useLocation()
  useEffect(async() => {
    setLayout(dispatch, 'dashboard')

  }, [pathname])

  return (
        <MDBox
       
        className='superadmin-bodyColor'
      sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
        p        : 3,
        position : 'relative',

        [breakpoints.up('xl')]: {
          marginLeft : miniSidenav ? pxToRem(120) : pxToRem(274) ,
          transition : transitions.create(['margin-left', 'margin-right'], {
            easing   : transitions.easing.easeInOut,
            duration : transitions.duration.standard,
          }),
        },
      })}
    >
      <BorderColorIcon className='hover-icon'  onClick={() => handleRightbar('open', 'body')}/>
      {children}
    </MDBox>
   
  )
}

// Typechecking props for the DashboardLayout
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  handleRightbar: PropTypes.func,
}

export default DashboardLayout
