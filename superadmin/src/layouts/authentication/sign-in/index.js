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

import { useState } from 'react'

// react-router-dom components
import {
  Link,
  useLocation,
  // useNavigate
} from 'react-router-dom'

// @mui material components
import Card from '@mui/material/Card'
// import Switch from '@mui/material/Switch'
import Grid from '@mui/material/Grid'
// import MuiLink from '@mui/material/Link'

// // @mui icons
// import FacebookIcon from '@mui/icons-material/Facebook'
// import GitHubIcon from '@mui/icons-material/GitHub'
// import GoogleIcon from '@mui/icons-material/Google'

// Material Dashboard 2 React components
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import MDInput from 'components/MDInput'
import MDButton from 'components/MDButton'

// Authentication layout components
import BasicLayout from 'layouts/authentication/components/BasicLayout'

// Images
import bgImage from 'assets/images/bg-sign-in-basic.jpeg'
import { useFormik } from 'formik'
import { AuthVld } from 'validation'
import { useAppServices } from 'hook/services'
import { useUserInfo } from 'context/user'
import localforage from 'localforage'
import { useBrandInfo } from 'context/brand'
import { useAgencyInfo } from 'context/agency'
import ForgetPassword from './components/ForgetPassword'
// import { Button } from '@mui/material'

function Basic() {
  // const [rememberMe, setRememberMe] = useState(false)

  // const handleSetRememberMe = () => setRememberMe(!rememberMe)
  const Service = useAppServices()
  const updateBrand = useBrandInfo()[1]
  const updateAgency = useAgencyInfo()[1]
  const updateUser = useUserInfo()[1]
  // const navigate     = useNavigate()
  const { state } = useLocation()

  const [processing, setProcessing] = useState(false)
  const [message, setMessage] = useState()

  const initState = {
    email: '',
    password: '',
  }

  const handleSubmit = async (form) => {
    setProcessing(true)
    // if(!state?.location_id) {
    //   setProcessing(false)
    //   return setMessage('please direct to `/{{location.id}}` first')
    // }
    const { response, error } = await Service.auth.login({
      payload: { ...form, location_id: state?.location_id, role: 'superadmin' },
    })
    setProcessing(false)
    if (error) return setMessage(error.message)

    // Set locally
    const { token, ...user } = response.data
    localforage.clear()
    localforage.setItem('token', token)
    localforage.setItem('user', user)
    response.brand && localforage.setItem('brand', response.brand)
    response.agency && localforage.setItem('agency', response.agency)

    // Update Context
    response.brand && updateBrand({ ...response.brand })
    response.agency && updateAgency({ ...response.agency })
    updateUser(response.data)
    return ''
    // return response.brand ? navigate(`/${state.location_id}/dashboard`) : navigate(`/agency/dashboard`)
  }

  const formik = useFormik({
    initialValues: { ...initState },
    onSubmit: handleSubmit,
    validationSchema: AuthVld.Login,
  })

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            {/* <Grid item xs={2}>
                <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                  <FacebookIcon color="inherit" />
                </MDTypography>
              </Grid> */}
            {/* <Grid item xs={2}>
                <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                  <GitHubIcon color="inherit" />
                </MDTypography>
              </Grid> */}
            {/* <Grid item xs={2}>
                <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                  <GoogleIcon color="inherit" />
                </MDTypography>
              </Grid> */}
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" onSubmit={formik.handleSubmit} role="form">
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                name="email"
                onChange={formik.handleChange}
                inputProps={{ onFocus: formik.handleBlur }}
                value={formik.values.email}
                error={formik.touched.email && formik.errors.email}
                helperText={formik.touched.email && formik.errors.email ? formik.errors.email : ''}
                success={formik.touched.email && !formik.errors.email}
                fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                name="password"
                onChange={formik.handleChange}
                inputProps={{ onFocus: formik.handleBlur }}
                value={formik.values.password}
                error={formik.touched.password && formik.errors.password}
                helperText={
                  formik.touched.password && formik.errors.password ? formik.errors.password : ''
                }
                success={formik.touched.password && !formik.errors.password}
                fullWidth
              />
            </MDBox>
            {/* <MDBox display="flex" alignItems="center" ml={-1}>
                <Switch checked={rememberMe} onChange={handleSetRememberMe} />
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color="text"
                  onClick={handleSetRememberMe}
                  sx={{ cursor: 'pointer', userSelect: 'none', ml: -1 }}
                >
                  &nbsp;&nbsp;Remember me
                </MDTypography>
              </MDBox> */}
            <MDBox pb={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <ForgetPassword />
            </MDBox>
            <MDBox sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <MDTypography variant="body2" sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
                <a
                  href="https://snapshotstore.io/sign_up"
                  target={'_blank'}
                  style={{ color: 'inherit' }}
                >
                  {' '}
                  sign up
                </a>
              </MDTypography>
            </MDBox>
            <MDBox>
              <MDButton
                variant="gradient"
                color="info"
                type="submit"
                loading={processing}
                disabled={processing || !formik.isValid}
                sx={{ mt: 4, mb: 1 }}
                fullWidth
              >
                sign in
              </MDButton>
              <MDTypography variant="button" color="error">
                {message}
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  )
}

export default Basic
