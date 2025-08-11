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
const AllAppSetup = () => {
  const AppService = useAppServices()
  const [workflows_data, setworkflows_data] = React.useState([])
  const [stripe_data, setstripe_data] = React.useState([])
  const [customFields_data, setcustomFields_data] = React.useState([])
  const [Apps, setApps] = React.useState([])
  const [saved_data, setsaved_data] = React.useState('')
  const [processing, setProcessing] = React.useState(false)
  const [errormsg, seterrormsg] = React.useState('')
  const [response, setresponse] = React.useState('')
  const [user_id, setuser_id] = React.useState('')
  const [defeult_password, setdefeult_password] = React.useState('')
  const [stripe, setstripe] = React.useState('')
  const [workflows, setworkflows] = React.useState('')
  const [premium_workflows, setpremium_workflows] = React.useState('')
  const [handlerefresh, sethandlerefresh] = React.useState(false)

  const BASE_URL = `${env.API_URL}/v1`

  var axios = require('axios')
  React.useEffect(async () => {
    const localBrand = await localforage.getItem('user')
    setuser_id(localBrand._id)

    axios
      .get(BASE_URL + '/snapshot/superadmin_settings/workflows')
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
      .get(BASE_URL + '/snapshot/superadmin_settings/all_app_setup')
      .then(async (response) => {
        setsaved_data(response.data.data)
        // console.log(response.data, 'saved_data')
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
      selling_price: e.target.selling_price.value,
      preview_link: e.target.preview_link.value,
      user_id: user_id,
    }
    // console.log(data, 'data')

    // 4848 7150 5203 7927
    if (saved_data === '') {
      axios
        .post(BASE_URL + '/snapshot/superadmin_settings/all_app_setup', { data })
        .then(async function (response) {
          // console.log(response.data)
          setProcessing(false)
          setresponse(response.data.message)
          setTimeout(() => {
            setresponse('')
          }, 2000)
          setsaved_data(response.data.data)
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
        .post(BASE_URL + '/snapshot/superadmin_settings/all_app_setup/update/' + saved_data._id, {
          data,
        })
        .then(async function (response) {
          // console.log(response.data)
          setProcessing(false)
          setresponse(response.data.message)
          sethandlerefresh(!handlerefresh)
          setTimeout(() => {
            setresponse('')
          }, 2000)
          setsaved_data(response.data.data)
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
                    Super Admin Prices
                  </MDTypography>
                  <Singleselect data={stripe_data} edit_data={saved_data.stripe} name="stripe" />
                </MDBox>
              </Grid>
            </Grid>
            <Grid container mt={2} mb={2} justifyContent="center">
              <Grid item xs={11}>
                <MDBox px={3}>
                  <MDTypography id="modal-modal-title" sx={{ mb: 1 }} variant="h6" component="h2">
                    Selling Price For Agency
                  </MDTypography>
                  <div className="row">
                    <div className="col-sm-12">
                      <input
                        type="number"
                        defaultValue={saved_data.selling_price}
                        className=" form-control"
                        name="selling_price"
                        placeholder="Selling price for agency"
                      />
                    </div>
                  </div>
                </MDBox>
              </Grid>
            </Grid>
            <Grid container mt={2} mb={2} justifyContent="center">
              <Grid item xs={11}>
                <MDBox px={3}>
                  <MDTypography id="modal-modal-title" sx={{ mb: 1 }} variant="h6" component="h2">
                    Preview Link
                  </MDTypography>
                  <div className="row">
                    <div className="col-sm-12">
                      <input
                        type="text"
                        defaultValue={saved_data.preview_link}
                        className=" form-control"
                        name="preview_link"
                        placeholder="Selling price for agency"
                      />
                    </div>
                  </div>
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

export default AllAppSetup
