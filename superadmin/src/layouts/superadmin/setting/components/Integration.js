import MDBox from 'components/MDBox'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import localforage from 'localforage'
import Card from '@mui/material/Card'
import MDButton from 'components/MDButton'
import { Grid } from '@mui/material'
import MDTypography from 'components/MDTypography'
import Alert from '@mui/material/Alert'
import env from 'config'
import { useBrandInfo } from 'context/brand'
import Stack from '@mui/material/Stack'
import ghlLogo from '../../../../assets/images/ghl-logo.avif'
import { useAppServices } from 'hook/services'
import Singleselect from './inputs/Singleselect'
function Integration() {
  const [brand] = useBrandInfo()
  const [saved_data, setsaved_data] = React.useState('')
  const [user_id, setuser_id] = React.useState('')
  const [users, setusers] = React.useState([])
  const [processing, setProcessing] = React.useState(false)
  const [errormsg, seterrormsg] = React.useState('')
  const [response, setresponse] = React.useState('')
  const [strpe_api_key, setstrpe_api_key] = React.useState('')
  const [strpe_public_key, setstrpe_public_key] = React.useState('')
  const BASE_URL = `${env.API_URL}/v1`
  const AppService = useAppServices()

  var axios = require('axios')
  const color = 'info'
  const getAppSetup = async () => {
    const { response } = await AppService.app_setup.get()
    if (response) {
      setsaved_data(response.data)
    }
  }
  React.useEffect(async () => {
    const localBrand = await localforage.getItem('user')
    setuser_id(localBrand._id)
    // alert(localBrand.stripe.customer_id)
    const { response } = await AppService.user.GetTeam()
    // console.log(response, 'request_app')
    if (response) {
      setusers(response.data)
      var prices = []
      for (let index = 0; index < response.data.length; index++) {
        const element = response.data[index]
        var temp = {
          name: element?.username,
          id: element._id,
        }
        // console.log(temp, 'temp')

        prices.push(temp)
      }
      setusers(prices)
    } else {
      setusers([])
    }
    getAppSetup()
    // axios
    //   .get(BASE_URL + '/superadmin/settings/filter')
    //   .then((response) => {
    //     setsaved_data(response.data.data)
    //     localforage.setItem('settings', response.data.data)
    //     setstrpe_api_key(response.data.data.stripe_api_key)
    //     setstrpe_public_key(response.data.data.strpe_public_key)
    //   })
    //   .catch(function (error) {
    //     console.log(error)
    //   })
  }, [])

  var payload = ''
  const handleapi = async (e) => {
    e.preventDefault()
    setProcessing(true)

    payload = {
      webhook: e.target.webhook.value,
      comment_webhook: e.target.comment_webhook.value,
      receive_comment_webhook: e.target.receive_comment_webhook.value,
      stripe_api_key: e.target.stripe_api_key.value,
      default_agent: e.target.agent.value,
    }
    // console.log(payload)
    // console.log(saved_data)

    // 4848 7150 5203 7927
    if (saved_data === '') {
      const { response } = await AppService.app_setup.create({ payload })
      if (response) {
        setProcessing(false)
        setresponse(response.message)
        setTimeout(() => {
          setresponse('')
        }, 2000)
        setsaved_data(response.data)
      } else {
        setProcessing(false)
        seterrormsg(error.response.data.message)
        setTimeout(() => {
          seterrormsg('')
        }, 2000)
      }
    } else {
      payload._id = saved_data._id
      const { response } = await AppService.app_setup.update({ payload })
      if (response) {
        setProcessing(false)
        setresponse(response.message)
        setTimeout(() => {
          setresponse('')
        }, 2000)
        setsaved_data(response.data)
      } else {
        setProcessing(false)
        seterrormsg(error.response.data.message)
        setTimeout(() => {
          seterrormsg('')
        }, 2000)
      }
    }
  }
  return (
    <MDBox pb={3}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Grid container mt={5} mb={2} justifyContent="center">
            {errormsg != '' ? (
              <Stack sx={{ width: '90%' }} spacing={2}>
                <Alert severity="error">{errormsg}</Alert>
              </Stack>
            ) : (
              <></>
            )}
            {response != '' ? (
              <Stack sx={{ width: '90%' }} spacing={2}>
                <Alert severity="success">{response}</Alert>
              </Stack>
            ) : (
              <></>
            )}

            <Grid item xs={11}>
              <MDBox pt={4} px={3}>
                <form onSubmit={handleapi}>
                  <MDBox display="flex">
                    {/* <MDBox sx={{ display: 'flex', flexDirection: 'column' }}>
                      <img src={ghlLogo} alt="logo" width={100} />

                      {saved_data?.agency_ghl != undefined ? (
                        <MDButton
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{ width: '100px' }}
                        >

                          <a
                            href={`https://marketplace.gohighlevel.com/oauth/chooselocation?response_type=code&redirect_uri=${env.GHL.REDIRECT.AGENCY}&client_id=${env.GHL.CLIENT_ID}&scope=${env.GHL.SCOPE}`}
                            style={{ color: 'white' }}
                          >
                            Agency Refresh
                          </a>
                        </MDButton>
                      ) : (
                        <MDButton
                          variant="contained"
                          color="info"
                          size="small"
                          sx={{ width: '100px' }}
                        >
                          <a
                            href={`https://marketplace.gohighlevel.com/oauth/chooselocation?response_type=code&redirect_uri=${env.GHL.REDIRECT.AGENCY}&client_id=${env.GHL.CLIENT_ID}&scope=${env.GHL.SCOPE}`}
                            style={{ color: 'white' }}
                          >
                            Agency connect
                          </a>
                        </MDButton>
                      )}
                    </MDBox> */}
                    <MDBox sx={{ display: 'flex', flexDirection: 'column', marginLeft: '3rem' }}>
                      <img src={ghlLogo} alt="logo" width={100} />

                      {saved_data?.ghl ? (
                        <MDButton
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{ width: '100px' }}
                        >
                          <a
                            href={`https://marketplace.gohighlevel.com/oauth/chooselocation?response_type=code&redirect_uri=${env.GHL.REDIRECT.ASSOCIATE}&client_id=${env.GHL.Location_CLIENT_ID}&scope=${env.GHL.Location_SCOPE}&state=`}
                            style={{ color: 'white' }}
                          >
                            Location Refresh
                          </a>
                        </MDButton>
                      ) : (
                        <MDButton
                          variant="contained"
                          color="info"
                          size="small"
                          sx={{ width: '100px' }}
                        >
                          <a
                            href={`https://marketplace.gohighlevel.com/oauth/chooselocation?response_type=code&redirect_uri=${env.GHL.REDIRECT.ASSOCIATE}&client_id=${env.GHL.Location_CLIENT_ID}&scope=${env.GHL.Location_SCOPE}&state=${brand.ghl?.location_id}`}
                            style={{ color: 'white' }}
                          >
                            Location connect
                          </a>
                        </MDButton>
                      )}
                    </MDBox>
                    <MDBox sx={{ display: 'flex', flexDirection: 'column', marginLeft: '3rem' }}>
                      <img src={ghlLogo} alt="logo" width={100} />

                      {saved_data?.levelup_marketplace ? (
                        <MDButton
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{ width: '100px' }}
                        >
                          <a
                            href={`https://marketplace.gohighlevel.com/oauth/chooselocation?response_type=code&redirect_uri=${env.GHL.REDIRECT.LEVELUP_MARKETPLACE}&client_id=${env.GHL.Levelup_Marketplace_CLIENT_ID}&scope=${env.GHL.Levelup_Marketplace_SCOPE}&state=`}
                            style={{ color: 'white' }}
                          >
                            Levelup Marketplace Refresh
                          </a>
                        </MDButton>
                      ) : (
                        <MDButton
                          variant="contained"
                          color="info"
                          size="small"
                          sx={{ width: '100px' }}
                        >
                          <a
                            href={`https://marketplace.gohighlevel.com/oauth/chooselocation?response_type=code&redirect_uri=${env.GHL.REDIRECT.LEVELUP_MARKETPLACE}&client_id=${env.GHL.Levelup_Marketplace_CLIENT_ID}&scope=${env.GHL.Levelup_Marketplace_SCOPE}`}
                            style={{ color: 'white' }}
                          >
                            Levelup Marketplace connect
                          </a>
                        </MDButton>
                      )}
                    </MDBox>
                  </MDBox>

                  <Grid mt={2} mb={2} justifyContent="center">
                    <Grid item xs={12}>
                      <MDTypography
                        id="modal-modal-title"
                        sx={{ mb: 1 }}
                        variant="h6"
                        component="h2"
                      >
                        Select Default Agent
                      </MDTypography>
                      <Singleselect
                        edit_data={saved_data.default_agent}
                        data={users}
                        name="agent"
                      />
                    </Grid>
                  </Grid>
                  <MDTypography id="modal-modal-title" variant="h6" component="h2" mt={3}>
                    Webhook
                  </MDTypography>
                  <div className="row">
                    <div className="col-sm-12">
                      <input
                        type="text"
                        defaultValue={saved_data.webhook}
                        className=" form-control"
                        name="webhook"
                        placeholder="Enter Webhook"
                      />
                    </div>
                  </div>
                  <MDTypography id="modal-modal-title" variant="h6" component="h2" mt={3}>
                    Send Comment Webhook
                  </MDTypography>
                  <div className="row">
                    <div className="col-sm-12">
                      <input
                        type="text"
                        defaultValue={saved_data.comment_webhook}
                        className=" form-control"
                        name="comment_webhook"
                        placeholder="Enter Commennt Webhook"
                      />
                    </div>
                  </div>
                  <MDTypography id="modal-modal-title" variant="h6" component="h2" mt={3}>
                    Receive Comment Webhook
                  </MDTypography>
                  <div className="row">
                    <div className="col-sm-12">
                      <input
                        type="text"
                        defaultValue={saved_data.receive_comment_webhook}
                        className=" form-control"
                        name="receive_comment_webhook"
                        placeholder="Enter Commennt Webhook"
                      />
                    </div>
                  </div>
                  <MDTypography id="modal-modal-title" variant="h6" component="h2" mt={3}>
                    Enter Stripe API KEY
                  </MDTypography>
                  <div className="row">
                    <div className="col-sm-12">
                      <input
                        type="text"
                        defaultValue={saved_data.stripe_api_key}
                        className=" form-control"
                        name="stripe_api_key"
                        placeholder="Enter Stripe APIKEY"
                      />
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="col-sm-12 d-flex justify-content-end ">
                      {saved_data === '' ? (
                        <>
                          <MDButton
                            variant="gradient"
                            color="info"
                            type="submit"
                            loading={processing}
                            disabled={processing}
                          >
                            Save
                          </MDButton>
                        </>
                      ) : (
                        <>
                          <MDButton
                            variant="gradient"
                            color="info"
                            type="submit"
                            loading={processing}
                            disabled={processing}
                          >
                            Update
                          </MDButton>
                        </>
                      )}
                    </div>
                  </div>
                </form>
              </MDBox>

              {/* <MDBox sx={{ display: 'flex', flexDirection: 'column' }}>
                <img src={ghlLogo} alt="logo" width={100} />

                {saved_data?.agency_ghl != undefined ? (
                  <MDButton
                    variant="contained"
                    color="success"
                    size="small"
                    sx={{ width: '100px' }}
                  >
                    <a
                      href={`https://marketplace.gohighlevel.com/oauth/chooselocation?response_type=code&redirect_uri=${env.GHL.REDIRECT.AGENCY}&client_id=${env.GHL.CLIENT_ID}&scope=${env.GHL.APPSCOPE}`}
                      style={{ color: 'white' }}
                    >
                      Agency Refresh
                    </a>
                  </MDButton>
                ) : (
                  <MDButton variant="contained" color="info" size="small" sx={{ width: '100px' }}>
                    <a
                      href={`https://marketplace.gohighlevel.com/oauth/chooselocation?response_type=code&redirect_uri=${env.GHL.REDIRECT.AGENCY}&client_id=${env.GHL.CLIENT_ID}&scope=${env.GHL.APPSCOPE}`}
                      style={{ color: 'white' }}
                    >
                      Agency connect
                    </a>
                  </MDButton>
                )}
              </MDBox> */}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MDBox>
  )
}

export default Integration
