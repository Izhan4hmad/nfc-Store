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

import { forwardRef } from 'react'

// prop-types is a library for typechecking of props
import PropTypes from 'prop-types'

// Material Dashboard 2 React components
import MDTypography from 'components/MDTypography'

// Custom styles for MDProgress
import MDProgressCircularRoot from './MDProgressCircularRoot'

const MDProgressCircular = forwardRef(({color, value, label, ...rest }, ref) => (
  <>
    {label && (
      <MDTypography variant="button" fontWeight="medium" color="text">
        {value}%
      </MDTypography>
    )}
    <MDProgressCircularRoot
      {...rest}
      ref={ref}
      value={value}
      ownerState={{ color, value }}
    />
  </>
))

// Setting default values for the props of MDProgress
MDProgressCircular.defaultProps = {
  color : 'info',
  value : 0,
  label : false,
}

// Typechecking props for the MDProgress
MDProgressCircular.propTypes = {
  value : PropTypes.number,
  label : PropTypes.bool,
  color : PropTypes.oneOf([
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error',
    'light',
    'dark',
  ]),
}

export default MDProgressCircular
