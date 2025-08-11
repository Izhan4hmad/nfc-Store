import { Card, Divider, Grid, IconButton, Switch } from '@mui/material'
import Header from './components/Header'
import Integration from './components/Integration'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import Profile from './components/Profile'
import AppSetup from './components/AppSetup'
import AllAppSetup from './components/AllAppSetup'
function Settings() {
  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <Grid container mt={10}>
          <Grid item xs={12}>
            <Header elements={[<Integration />, <AppSetup />, <Profile />]} />
          </Grid>
        </Grid>
      </DashboardLayout>
    </>
  )
}

export default Settings
