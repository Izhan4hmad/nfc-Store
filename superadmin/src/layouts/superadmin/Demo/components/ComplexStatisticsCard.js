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
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Icon from '@mui/material/Icon'
import { Grid } from '@mui/material'
import { useBrandInfo } from 'context/brand'
// Material Dashboard 2 React components
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import DefaultProjectCard from './DefaultProjectCard'
import homeDecor1 from 'assets/images/home-decor-1.jpg'
import React, { useState, useEffect } from 'react'
import localforage from 'localforage'
import Alert from '@mui/material/Alert'
import { useLocation } from 'react-router-dom'
import Stack from '@mui/material/Stack'
function ComplexStatisticsCard({
  color,
  title,
  count,
  percentage,
  icon,
  data,
  category,
  agency_data,
  cat_id,
  handelchange,
  handleMessage,
  location_data,
  handleGrid,
}) {
  const [brand] = useBrandInfo()
  const loc_data = localforage.getItem('loc_data')
  const { pathname } = useLocation()
  var loc_name = pathname.split('/')[3]
  var loc_add = pathname.split('/')[4]

  return (
    <>
      <Card style={{ marginBottom: '50px' }}>
        <MDBox display="flex" justifyContent="space-between" pt={1} px={2}>
          <MDBox
            className="superadmin-demo-theme-card"
            variant="gradient"
            bgColor={color}
            color={color === 'light' ? 'dark' : 'white'}
            coloredShadow={color}
            borderRadius="xl"
            display="flex"
            justifyContent="start"
            alignItems="center"
            width="100%"
            height="4rem"
            mt={-3}
          >
            <MDTypography variant="button" ml={3} fontWeight="bold" color="white">
              {category}
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox pb={2} mt={5} px={2}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <MDBox mb={3}>
                <DefaultProjectCard
                  image={
                    'https://www.bankrate.com/2022/08/18124901/sellers-agent-1322865791-1-scaled.jpg?auto=webp&optimize=high&crop=16:9'
                  }
                  title={'test'}
                  description={
                    (
                      <>
                        <div className="superadmin-card-body-text">
                          <b className="superadmin-card-body-heading">Description:</b> Lorem ipsum
                          dolor sit amet{' '}
                        </div>
                        <div className="superadmin-card-body-text">
                          <b className="superadmin-card-body-heading">Type:</b> snapshot
                        </div>
                        <div className="superadmin-card-body-text">
                          <b className="superadmin-card-body-heading">Price:</b> 2$
                        </div>
                      </>
                    ) || 'As Uber works through a huge amount of internal management turmoil.'
                  }
                  action={{
                    type: 'internal',
                    route: `#`,
                    color: 'info',
                    label: `view snapshot`,
                  }}
                  button_label={'Purchase'}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </Card>
    </>
  )
}

// Setting default values for the props of ComplexStatisticsCard
ComplexStatisticsCard.defaultProps = {
  color: 'info',
  percentage: {
    color: 'success',
    text: '',
    label: '',
  },
}

// Typechecking props for the ComplexStatisticsCard
ComplexStatisticsCard.propTypes = {
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error',
    'light',
    'dark',
  ]),
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  percentage: PropTypes.shape({
    color: PropTypes.oneOf([
      'primary',
      'secondary',
      'info',
      'success',
      'warning',
      'error',
      'dark',
      'white',
    ]),
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
    handleGrid: PropTypes.string,
    data: PropTypes.array,
    category: PropTypes.array,
    agency_data: PropTypes.array,
    location_data: PropTypes.array,
    cat_id: PropTypes.string,
    handelchange: PropTypes.func,
    handleMessage: PropTypes.func,
  }),
  icon: PropTypes.node.isRequired,
}

export default ComplexStatisticsCard
