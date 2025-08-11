/**
=========================================================
* MD UI Dashboard PRO React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/MD-ui-dashboard-pro-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the MDware.
*/

// @mui material components
import { Card } from '@mui/material'
import Grid from '@mui/material/Grid'
import Icon from '@mui/material/Icon'

// MD UI Dashboard PRO React components
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'

// MD UI Dashboard PRO React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import DataTable from 'examples/Tables/DataTable'
import AppData from './components/data-tables/data/dataTableData'
import MDButton from 'components/MDButton'
import CreateModal from './components/CreateModal'
import { useEffect, useState } from 'react'
import { useAppServices } from 'hook/services'
import { useAgencyInfo } from 'context/agency'
import Loader from 'examples/Loader'

function Default() {
  const AppService = useAppServices()
  const [agency] = useAgencyInfo()
  const { dataTableData, handleRefresh, products, apps, loader } = AppData()

  const onLoad = () => {}

  useEffect(onLoad, [])
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center  "
              >
                <MDTypography variant="h6" color="white">
                  packages
                </MDTypography>
                <CreateModal products={products} apps={apps} handleRefresh={handleRefresh} />
              </MDBox>
              <MDBox pt={3} px={3}>
                <DataTable table={dataTableData} canSearch entriesPerPage={20} />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  )
}

export default Default
