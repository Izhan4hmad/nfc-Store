// @mui material components
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'

// @mui icons
// import FacebookIcon from '@mui/icons-material/Facebook'
// import TwitterIcon from '@mui/icons-material/Twitter'
// import InstagramIcon from '@mui/icons-material/Instagram'

// Material Dashboard 2 React components
import MDBox from 'components/MDBox'
import localforage from 'localforage'
// Material Dashboard 2 React example components
import ProfileInfoCard from 'examples/Cards/InfoCards/ProfileInfoCard'
// import ProfilesList from 'examples/Lists/ProfilesList'

import { useUserInfo } from 'context/user'

import burceMars from 'assets/images/bruce-mars.jpg'

// Overview page components
import MDAvatar from 'components/MDAvatar'
import MDTypography from 'components/MDTypography'
import { Icon } from '@mui/material'
import { useLogout } from 'hook/auth'
import { useEffect, useState } from 'react'
import env from 'config'
function Profile() {
  const [user_details, setuser_details] = useState('')

  const [user] = useUserInfo()
  const Logout = useLogout()
  const BASE_URL = `${env.API_URL}/v1`

  useEffect(async () => {
    const localBrand = await localforage.getItem('user')
    var axios = require('axios')

    axios
      .get(
        BASE_URL +
          '/snapshot/agency/location_settings/' +
          localBrand.agency_id +
          '/' +
          localBrand._id
      )
      .then(async function (response) {
        // console.log(response.data);
        setuser_details(response.data.data.user)
      })
      .catch(function (error) {
        // console.log(error);
      })
  }, [])
  return (
    <>
      <MDBox mb={2} />
      <Grid container spacing={3} alignItems="center">
        <Grid item ml="auto">
          <MDBox onClick={Logout} sx={{ cursor: 'pointer' }} display="flex" alignItems="center">
            <Icon>logout</Icon>
            <MDTypography
              ml={1}
              mr={5}
              variant="button"
              fontWeight="bold"
              textTransform="capitalize"
            >
              Logout
            </MDTypography>
          </MDBox>
        </Grid>
      </Grid>
      <MDBox mt={5} mb={3}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6} xl={4} sx={{ display: 'flex' }}>
            <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
            <ProfileInfoCard
              title="profile information"
              // description="Hi, I’m Alec Thompson, Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality)."
              info={{
                fullName: user_details.username,
                mobile: user_details.phone,
                email: user_details.email,
                location: user_details.location,
              }}
              social={[]}
              // social={[
              //   {
              //     link  : 'https://www.facebook.com/CreativeTim/',
              //     icon  : <FacebookIcon />,
              //     color : 'facebook',
              //   },
              //   {
              //     link  : 'https://twitter.com/creativetim',
              //     icon  : <TwitterIcon />,
              //     color : 'twitter',
              //   },
              //   {
              //     link  : 'https://www.instagram.com/creativetimofficial/',
              //     icon  : <InstagramIcon />,
              //     color : 'instagram',
              //   },
              // ]}
              // action={{ route: '', tooltip: 'Edit Profile' }}
              action={{ route: '' }}
              shadow={false}
            />
            <Divider orientation="vertical" sx={{ mx: 0 }} />
          </Grid>
        </Grid>
      </MDBox>
    </>
  )
}

export default Profile
