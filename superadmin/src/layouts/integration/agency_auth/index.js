import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import QueryString from 'qs'
import MDBox from 'components/MDBox'
import MDButton from 'components/MDButton'
import { ReqMethods, ghl } from 'enums'
import env from 'config'
import { useAppServices } from 'hook/services'
import { useBrandInfo } from 'context/brand'
import { useAgencyInfo } from 'context/agency'
// import { AgencyContext } from '../../../context/Agency.context'

function GHL() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const code = new URLSearchParams(search).get('code')
  const type = new URLSearchParams(search).get('type')
  const AppServices = useAppServices()
  const [Error, setError] = useState('')
  const [agency, update] = useAgencyInfo()

  const associate = async (creds) => {
    const payload = {
      agency_ghl: {
        company_id: creds.companyId,
        access_token: creds.access_token,
        refresh_token: creds.refresh_token,
      },
    }
    // console.log(payload,'payload')

    const { response } = await AppServices.brand.superadmin({ payload })
    // console.log(response,'response')

    if (!response) return setError('Something went wrong while integration, please try latter')
    update(payload)
    return navigate(-2)
  }

  // const getLocation = async (creds) => {
  //   const payload = {
  //     method: ReqMethods.GET,
  //     path: `${ghl.APIs.v2.location(creds.locationId)}`,
  //     key: creds.access_token,
  //     refresh_token: creds.refresh_token,
  //   }
  //   // console.log(payload)
  //   const { response } = await AppServices.services.ghl.call_service({ payload })

  //   if (!response) return setError('Something went wrong while integration, please try latter')
  //   // console.log(response.data)

  //   return response && associate(response.data, creds)
  // }

  const getCreds = async () => {
    const payload = {
      method: ReqMethods.POST,
      path: ghl.APIs.oauth,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      payload: QueryString.stringify({
        client_id: env.GHL.CLIENT_ID,
        client_secret: env.GHL.CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        refresh_token: '',
      }),
    }
    // console.log(payload)
    const { response } = await AppServices.services.ghl.call_service({ payload })

    if (!response) return setError('Something went wrong while integration, please try latter')
    // if(location_id !== response.data.locationId) return setError('location ID mismatch')
    // console.log(response.data)
    return response && associate(response.data)
  }

  const onLoad = () => {
    getCreds()
  }

  useEffect(onLoad, [])

  return (
    <MDBox>
      {!Error && <MDBox>Integrating please wait...</MDBox>}
      {Error && (
        <MDBox>
          {Error}
          <MDButton onClick={() => navigate(-2)}>Go Back</MDButton>
        </MDBox>
      )}
    </MDBox>
  )
}

export default GHL
