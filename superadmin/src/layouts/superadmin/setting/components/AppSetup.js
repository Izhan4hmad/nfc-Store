import MDBox from 'components/MDBox'
import Button from '@mui/material/Button'
import { Grid } from '@mui/material'
import MDTypography from 'components/MDTypography'
import Typography from '@mui/material/Typography'
import localforage from 'localforage'
import React from 'react'
import MDButton from 'components/MDButton'
import Singleselect from './inputs/Singleselect'
import Multiselect from './inputs/Multiselect'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import env from 'config'
import { useAppServices } from 'hook/services'
const AppSetup = () => {
  const AppService = useAppServices()
  const [workflows_data, setworkflows_data] = React.useState([])
  const [stripe_data, setstripe_data] = React.useState([])
  const [app_setup, setapp_setup] = React.useState({})
  const [customFields_data, setcustomFields_data] = React.useState([])
  const [saved_data, setsaved_data] = React.useState('')
  const [processing, setProcessing] = React.useState(false)
  const [errormsg, seterrormsg] = React.useState('')
  const [response, setresponse] = React.useState('')
  const [user_id, setuser_id] = React.useState('')
  const [defeult_password, setdefeult_password] = React.useState('')
  const [stripe, setstripe] = React.useState('')
  const [workflows, setworkflows] = React.useState('')
  const [premium_workflows, setpremium_workflows] = React.useState('')
  const [forgot_password, setforgot_password] = React.useState('')
  const [handlerefresh, sethandlerefresh] = React.useState(false)

  const BASE_URL = `${env.API_URL}/v1`

  var axios = require('axios')
  React.useEffect(async () => {
    const localBrand = await localforage.getItem('user')
    setuser_id(localBrand._id)

    axios
      .get(BASE_URL + '/superadmin/settings/workflows')
      .then((response) => {
        // console.log(response.data, 'responseresponse')
        var sripe = response.data.data.products.data
        // console.log(sripe, 'sripe')
        var prices = []
        for (let index = 0; index < sripe.length; index++) {
          const element = sripe[index]
          var temp = {
            name:
              element?.product +
              '-($' +
              element?.unit_amount / 100 +
              '/' +
              element?.recurring?.interval +
              ')',
            id: element.id,
          }
          // console.log(temp, 'temp')

          prices.push(temp)
        }
        setstripe_data(prices)
        // console.log(response.data.data.workflows.workflows,'workflowsworkflowsworkflows')
        // console.log(response.data.data.customFields.customFields,'customFieldscustomFieldscustomFields')
        setworkflows_data(response.data.data.workflows.workflows)
        setcustomFields_data(response.data.data.customFields.customFields)
        if (response.data.data.workflows.status == 401) {
          seterrormsg('please check your Api key')
          setTimeout(() => {
            seterrormsg('')
          }, 5000)
        }
      })
      .catch(function (error) {
        // console.log(error)
      })
    axios
      .get(BASE_URL + '/superadmin/settings')
      .then(async (response) => {
        setsaved_data(response.data)
        setstripe(response.data.data.stripe)
        //   alert(response.data.data.stripe)
        setapp_setup(response.data.data)
        setworkflows(response.data.data.workflows)
        setpremium_workflows(response.data.data.workflows_p)
        setdefeult_password(response.data.data.defeult_password)
        setforgot_password(response.data.data.forgot_password)
        // console.log(response.data.data,'saved_data')
      })
      .catch(function (error) {
        // console.log(error)
      })
  }, [handlerefresh])
  var data = ''
  const handleSubmit = (e) => {
    e.preventDefault()
    setProcessing(true)

    data = {
      stripe: e.target.stripe.value,
      workflows: e.target.workflows.value,
      workflows_p: e.target.premium_workflows.value,
      defeult_password: e.target.defeult_password.value,
      forgot_password: e.target.forgot_password.value,
      agency_id: e.target.agency_id.value,
      userID: e.target.userID.value,
      stripe_customer: e.target.stripe_customer.value,
      subscription: e.target.subscription.value,
      new_agent_login_info: e.target.new_agent_login_info.value,
      new_topic_posted: e.target.new_topic_posted.value,
      replied_topic_notification: e.target.replied_topic_notification.value,
      new_ticket_submitted: e.target.new_ticket_submitted.value,
      changing_password: e.target.changing_password.value,
      user_id: user_id,
    }
    // console.log(data)

    // 4848 7150 5203 7927
    if (saved_data === '') {
      axios
        .post(BASE_URL + '/superadmin/settings/app_setup', { data })
        .then(async function (response) {
          // console.log(response.data)
          setProcessing(false)
          setresponse(response.data.message)
          setTimeout(() => {
            setresponse('')
          }, 2000)
          setsaved_data(response.data)
          sethandlerefresh(!handlerefresh)
        })
        .catch(function (error) {
          setProcessing(false)
          seterrormsg(error.response.data.message)
          sethandlerefresh(!handlerefresh)
          setTimeout(() => {
            seterrormsg('')
          }, 2000)
          // console.log(error.response.data)
        })
    } else {
      axios
        .post(BASE_URL + '/superadmin/settings/app_setup/update/' + saved_data.data._id, { data })
        .then(async function (response) {
          // console.log(response.data)
          setProcessing(false)
          setresponse(response.data.message)
          sethandlerefresh(!handlerefresh)
          setTimeout(() => {
            setresponse('')
          }, 2000)
          setsaved_data(response.data)
        })
        .catch(function (error) {
          setProcessing(false)
          seterrormsg(error.response.data.message)
          sethandlerefresh(!handlerefresh)
          setTimeout(() => {
            seterrormsg('')
          }, 2000)
          // console.log(error.response.data)
        })
    }
  }
  return (
    <MDBox pb={3}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit}>
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
                <MDBox pt={2} px={3}>
                  <MDTypography id="modal-modal-title" sx={{ mb: 1 }} variant="h6" component="h2">
                    Stripe Prices
                  </MDTypography>
                  <Multiselect data={stripe_data} edit_data={stripe} name="stripe" />
                </MDBox>
              </Grid>
            </Grid>
            <Grid container mt={2} mb={2} justifyContent="center">
              <Grid item xs={11}>
                <MDBox px={3}>
                  <MDTypography id="modal-modal-title" sx={{ mb: 1 }} variant="h6" component="h2">
                    Change Password
                  </MDTypography>
                  <Singleselect data={workflows_data} edit_data={workflows} name="workflows" />
                </MDBox>
              </Grid>
            </Grid>
            <Grid container mt={2} mb={2} justifyContent="center">
              <Grid item xs={11}>
                <MDBox px={3}>
                  <MDTypography id="modal-modal-title" sx={{ mb: 1 }} variant="h6" component="h2">
                    Premium Workflows
                  </MDTypography>
                  <Singleselect
                    data={workflows_data}
                    edit_data={premium_workflows}
                    name="premium_workflows"
                  />
                </MDBox>
              </Grid>
            </Grid>
            <Grid container mt={2} mb={2} justifyContent="center">
              <Grid item xs={11}>
                <MDBox px={3}>
                  <MDTypography id="modal-modal-title" sx={{ mb: 1 }} variant="h6" component="h2">
                    Forgot Password Workflows
                  </MDTypography>
                  <Singleselect
                    data={workflows_data}
                    edit_data={forgot_password}
                    name="forgot_password"
                  />
                </MDBox>
              </Grid>
            </Grid>
            {/* price_1OHu4CCjSxZC7v1uXmtBjCdh */}
            <Grid container mt={2} mb={2} justifyContent="center">
              <Grid item xs={11}>
                <MDBox px={3}>
                  <MDTypography id="modal-modal-title" sx={{ mb: 1 }} variant="h6" component="h2">
                    Default Password
                  </MDTypography>
                  <Singleselect
                    data={customFields_data}
                    edit_data={defeult_password}
                    name="defeult_password"
                  />
                </MDBox>
              </Grid>
            </Grid>
            <Grid container mt={2} mb={2} justifyContent="center">
              <Grid item xs={11}>
                <MDBox px={3}>
                  <MDTypography id="modal-modal-title" sx={{ mb: 1 }} variant="h6" component="h2">
                    Agency Account ID
                  </MDTypography>
                  <Singleselect
                    data={customFields_data}
                    edit_data={app_setup?.agency_id}
                    name="agency_id"
                  />
                </MDBox>
              </Grid>
            </Grid>
            <Grid container mt={2} mb={2} justifyContent="center">
              <Grid item xs={11}>
                <MDBox px={3}>
                  <MDTypography id="modal-modal-title" sx={{ mb: 1 }} variant="h6" component="h2">
                    User ID
                  </MDTypography>
                  <Singleselect
                    data={customFields_data}
                    edit_data={app_setup?.userID}
                    name="userID"
                  />
                </MDBox>
              </Grid>
            </Grid>
            <Grid container mt={2} mb={2} justifyContent="center">
              <Grid item xs={11}>
                <MDBox px={3}>
                  <MDTypography id="modal-modal-title" sx={{ mb: 1 }} variant="h6" component="h2">
                    Stripe Customer ID
                  </MDTypography>
                  <Singleselect
                    data={customFields_data}
                    edit_data={app_setup?.stripe_customer}
                    name="stripe_customer"
                  />
                </MDBox>
              </Grid>
            </Grid>
            <Grid container mt={2} mb={2} justifyContent="center">
              <Grid item xs={11}>
                <MDBox px={3}>
                  <MDTypography id="modal-modal-title" sx={{ mb: 1 }} variant="h6" component="h2">
                    Subscription ID
                  </MDTypography>
                  <Singleselect
                    data={customFields_data}
                    edit_data={app_setup?.subscription}
                    name="subscription"
                  />
                </MDBox>
              </Grid>
            </Grid>
            {/* workflow */}

            {/* ew */}
            <Grid container mt={2} mb={2} justifyContent="center">
              <Grid item xs={11}>
                <MDBox px={3}>
                  <MDTypography id="modal-modal-title" sx={{ mb: 1 }} variant="h6" component="h2">
                    New Agent/User Login Information
                  </MDTypography>
                  <Singleselect
                    data={workflows_data}
                    edit_data={app_setup?.new_agent_login_info}
                    name="new_agent_login_info"
                  />
                </MDBox>
              </Grid>
            </Grid>
            <Grid container mt={2} mb={2} justifyContent="center">
              <Grid item xs={11}>
                <MDBox px={3}>
                  <MDTypography id="modal-modal-title" sx={{ mb: 1 }} variant="h6" component="h2">
                    Team Notified when new topic is posted.
                  </MDTypography>
                  <Singleselect
                    data={workflows_data}
                    edit_data={app_setup?.new_topic_posted}
                    name="new_topic_posted"
                  />
                </MDBox>
              </Grid>
            </Grid>
            <Grid container mt={2} mb={2} justifyContent="center">
              <Grid item xs={11}>
                <MDBox px={3}>
                  <MDTypography id="modal-modal-title" sx={{ mb: 1 }} variant="h6" component="h2">
                    Get notification when some replied to topic
                  </MDTypography>
                  <Singleselect
                    data={workflows_data}
                    edit_data={app_setup?.replied_topic_notification}
                    name="replied_topic_notification"
                  />
                </MDBox>
              </Grid>
            </Grid>
            <Grid container mt={2} mb={2} justifyContent="center">
              <Grid item xs={11}>
                <MDBox px={3}>
                  <MDTypography id="modal-modal-title" sx={{ mb: 1 }} variant="h6" component="h2">
                    Get notification when new ticket submitted
                  </MDTypography>
                  <Singleselect
                    data={workflows_data}
                    edit_data={app_setup?.new_ticket_submitted}
                    name="new_ticket_submitted"
                  />
                </MDBox>
              </Grid>
            </Grid>
            <Grid container mt={2} mb={2} justifyContent="center">
              <Grid item xs={11}>
                <MDBox px={3}>
                  <MDTypography id="modal-modal-title" sx={{ mb: 1 }} variant="h6" component="h2">
                    Changing Password
                  </MDTypography>
                  <Singleselect
                    data={workflows_data}
                    edit_data={app_setup?.changing_password}
                    name="changing_password"
                  />
                </MDBox>
              </Grid>
            </Grid>
            <Grid container mt={3} mb={2} justifyContent="center">
              <Grid item xs={11}>
                <MDBox px={3} className="d-flex justify-content-end">
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
                </MDBox>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </MDBox>
  )
}

export default AppSetup
