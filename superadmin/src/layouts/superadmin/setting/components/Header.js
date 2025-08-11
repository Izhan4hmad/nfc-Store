import { useState, useEffect } from 'react'

// prop-types is a library for typechecking of props.
import PropTypes from 'prop-types'

// @mui material components
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import AppBar from '@mui/material/AppBar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Icon from '@mui/material/Icon'

// Material Dashboard 2 React components
import MDBox from 'components/MDBox'
// import MDTypography from 'components/MDTypography'
// import MDAvatar from 'components/MDAvatar'

// Material Dashboard 2 React base styles
import breakpoints from 'assets/theme/base/breakpoints'
import MDTypography from 'components/MDTypography'

// Images
// import burceMars from 'assets/images/bruce-mars.jpg'
// import backgroundImage from 'assets/images/bg-profile.jpeg'
// import { useUserInfo } from 'context/user'

function Header({ elements }) {
  const [tabsOrientation, setTabsOrientation] = useState('horizontal')
  // const [user] = useUserInfo()
  const [tabValue, setTabValue] = useState(0)

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation('vertical')
        : setTabsOrientation('horizontal')
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener('resize', handleTabsOrientation)

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation()

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleTabsOrientation)
  }, [tabsOrientation])

  const handleSetTabValue = (event, newValue) => setTabValue(newValue)

  return (
    <MDBox position="relative" mb={5}>
      {/* <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${backgroundImage})`,
          backgroundSize     : 'cover',
          backgroundPosition : '50%',
          overflow           : 'hidden',
        }}
      /> */}
      <Card
        sx={{
          position: 'relative',
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <MDBox
          mx={2}
          mt={-3}
          py={3}
          px={2}
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
        >
          <MDTypography variant="h6" color="white">
            Settings
          </MDTypography>
        </MDBox>
        <Grid container spacing={3} alignItems="center">
          {/* <Grid item>
            <MDAvatar src={burceMars} alt="profile-image" size="xl" shadow="sm" />
          </Grid>
          <Grid item>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
                {user.username}
              </MDTypography>
              <MDTypography variant="button" color="text" fontWeight="regular">
                {user.roles?.join(', ')}
              </MDTypography>
            </MDBox>
          </Grid> */}
          <Grid item xs={12} md={8} lg={8} sx={{ ml: 'auto', mt: 2 }}>
            <AppBar position="static">
              <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                <Tab
                  label="Integration"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      cable
                    </Icon>
                  }
                />
                <Tab
                  label="App Setup"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      support_agent
                    </Icon>
                  }
                />
                <Tab
                  label="Profile"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      account_circle
                    </Icon>
                  }
                />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
        {elements[tabValue]}
      </Card>
    </MDBox>
  )
}

// Typechecking props for the Header
Header.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.node).isRequired,
}

export default Header
