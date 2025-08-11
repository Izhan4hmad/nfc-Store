import { Link } from 'react-router-dom'

// prop-types is a library for typechecking of props
import PropTypes from 'prop-types'

// @mui material components
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Tooltip from '@mui/material/Tooltip'
import { Grid } from '@mui/material'
// Material Dashboard 2 React components
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import MDButton from 'components/MDButton'
import MDAvatar from 'components/MDAvatar'
import React, { useState, useEffect } from 'react'
import localforage from 'localforage'
import env from 'config'
function DefaultProjectCard({ image, label, title, description, action, authors, button_label, button_url, handleChange, data, agency_data, handleMessage, handelchange, location_data, handleGrid }) {
  var axios = require('axios');
  const BASE_URL = `${env.API_URL}/v1`

  useEffect(async () => {

  }, [])
  const renderAuthors = authors.map(({ image: media, name }) => (


    <Tooltip key={name} title={name} placement="bottom">

      {/* {
        message !='' ?
        ( */}
      {/* )
        :
        (<></>)
      } */}

      <MDAvatar
        src={media}
        alt={name}
        size="xs"
        sx={({ borders: { borderWidth }, palette: { white } }) => ({
          border: `${borderWidth[2]} solid ${white.main}`,
          cursor: 'pointer',
          position: 'relative',
          ml: -1.25,

          '&:hover, &:focus': {
            zIndex: '10',
          },
        })}

      />
    </Tooltip>

  ))

  return (
    <Card
    className="superadmin-cards-body"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'transparent',
        boxShadow: 'none',
        overflow: 'visible',
      }}
    >
      
          
      <MDBox position="relative" width="100.25%" shadow="xl" borderRadius="xl" >
        <CardMedia
          src={image}
          component="img"
          title={title}
          sx={{
            maxWidth: '100%',
            margin: 0,
            boxShadow: ({ boxShadows: { md } }) => md,
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </MDBox>
      <MDBox mt={1} mx={0.5}>
        <MDTypography variant="button" fontWeight="regular" color="text" textTransform="capitalize" >
          {label}
        </MDTypography>
        <MDBox mb={1}>
          {action.type === 'internal' ? (
            <MDTypography
              component={Link}
              to={action.route}
              variant="h5"
              textTransform="capitalize"
              className='superadmin-card-title'
            >
              {title}
            </MDTypography>
          ) : (
            <MDTypography
              component="a"
              href={action.route}
              target="_blank"
              rel="noreferrer"
              variant="h5"
              textTransform="capitalize"
              className='superadmin-card-title'
            >
              {title}
            </MDTypography>
          )}
        </MDBox>
        <MDBox mb={3} lineHeight={0}>
          <MDTypography variant="button" fontWeight="light" color="text" >
            {description}
          </MDTypography>
        </MDBox>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          {action.type === 'internal' ? (
            <>
              <MDButton
                  variant="outlined"
                  size="small"
                  className='superadmin-snapshot-btn'
                  color='primary'
               
                  disabled>
                  {'purchase'}
                </MDButton>
              <MDButton
                  variant="outlined"
                  size="small"
                  className='superadmin-purchase-btn'
                  color='primary'
               
                  disabled>
                  {'purchase'}
                </MDButton>
            </>


          ) : (
            <MDButton
              component="a"
              href={action.route}
              target="_blank"
              rel="noreferrer"
              variant="outlined"
              size="small"
              color={action.color}
              className='superadmin-card-text'
            >
              {action.label}
            </MDButton>
          )}
          <MDBox display="flex">{renderAuthors}</MDBox>
        </MDBox>
      </MDBox>
    </Card>
  )
}

// Setting default values for the props of DefaultProjectCard
DefaultProjectCard.defaultProps = {
  authors: [],
}

// Typechecking props for the DefaultProjectCard
DefaultProjectCard.propTypes = {
  image: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  action: PropTypes.shape({
    type: PropTypes.oneOf(['external', 'internal']),
    route: PropTypes.string.isRequired,
    color: PropTypes.oneOf([
      'primary',
      'secondary',
      'info',
      'success',
      'warning',
      'error',
      'light',
      'dark',
      'white',
    ]).isRequired,
    button_label: PropTypes.string.isRequired,
    button_url: PropTypes.string.isRequired,
    handleGrid: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    data: PropTypes.string.isRequired,
    agency_data: PropTypes.array,
    location_data: PropTypes.array,
    handleChange: PropTypes.func,
    handleMessage: PropTypes.func,
    handelchange: PropTypes.func,


  }).isRequired,
  authors: PropTypes.arrayOf(PropTypes.object),
}

export default DefaultProjectCard