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

// prop-types is a library for typechecking of props
import PropTypes from 'prop-types'

// @mui material components
import Icon from '@mui/material/Icon'

// Material Dashboard 2 React components
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import Card from '@mui/material/Card';
function Invoice({ date, id, price, pdf, noGutter }) {
  return (
    <Card sx={{ maxWidth: 600,padding:4}}>

    <MDBox
      component="li"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      py={1}
      pr={1}
      mb={noGutter ? 0 : 1}
    >
      <MDBox lineHeight={1.125}>
        <MDTypography display="block" variant="button" fontWeight="medium">
         12/10/2022
        </MDTypography>
        <MDTypography variant="caption" fontWeight="regular" color="text">
        2
        </MDTypography>
      </MDBox>
      <MDBox display="flex" alignItems="center">
        <MDTypography variant="button" fontWeight="regular" color="text">
      23$
        </MDTypography>
        <MDBox
          component="a"
          href={pdf}
          target="_blank"
          display="flex"
          alignItems="center"
          lineHeight={1}
          ml={3}
          sx={{ cursor: 'pointer' }}
        >
          <Icon fontSize="small">picture_as_pdf</Icon>
          <MDTypography variant="button" fontWeight="bold">
            &nbsp;PDF
          </MDTypography>
        </MDBox>
      </MDBox>
    </MDBox>
  </Card>
  )
}

// Setting default values for the props of Invoice
Invoice.defaultProps = {
  noGutter: false,
}

// Typechecking props for the Invoice
Invoice.propTypes = {
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  pdf: PropTypes.string.isRequired,
  noGutter: PropTypes.bool,
}

export default Invoice
