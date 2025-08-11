import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import PageLayout from 'examples/LayoutContainers/PageLayout'
import { useLogout } from 'hook/auth'
import React from 'react'

function NotFound() {
  const logout = useLogout()
  return (
    <PageLayout>
        <MDBox p={2} textAlign="right">
          <MDTypography onClick={logout} variant="button" color="text" fontWeight="medium">Logout</MDTypography>
        </MDBox>
        <MDBox
          borderRadius         = "lg"
          p                    = {2}
          display              = "flex"
          flexDirectionContent = "column"
          justifyContent       = "center"
          alignItems           = "center"
          textAlign            = "center"
          sx                   = {{height: '80vh'}}
        >
          <MDTypography variant="h4" fontWeight="medium" mt={1}>
            404 Not Found
          </MDTypography>
        </MDBox>
    </PageLayout>
  )
}

export default NotFound