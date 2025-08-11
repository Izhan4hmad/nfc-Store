import { Card, Grid } from '@mui/material'
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React from 'react'

const UserIntegration = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container>
        <Grid item xs={12}>
          <Card
            sx={{
              padding: '1.5rem',
            }}
          >
            <MDBox mb={4}>
              <MDTypography variant="h5" component="h2">
                Integration
              </MDTypography>
            </MDBox>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  )
}

export default UserIntegration
