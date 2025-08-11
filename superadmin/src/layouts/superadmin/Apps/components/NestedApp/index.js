import MDButton from 'components/MDButton'
import React, { useEffect, useState } from 'react'
import MDModal from 'components/MDModal'
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import { Edit } from '@mui/icons-material'
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  TextareaAutosize,
} from '@mui/material'
import { useAppServices, useUploadImage } from 'hook/services'
import { useUserInfo } from 'context/user'
import FormField from 'components/FormField'
import MDInput from 'components/MDInput'
import Multiselect from '../CreateModal/components/Multiselect'
import RadioInput from 'components/Radio/RadioInput'
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: '80vh',
  overflow: 'auto',
  bgcolor: 'background.paper',
  border: '2px  #000',
  boxShadow: 24,
  p: 4,
}
const FreeMaretplaceAppsModel = ({ data, handleRefresh, products, Categories }) => {
  const uploadImage = useUploadImage()
  const [openAddProduct, setOpenAddProduct] = useState(false)
  const AppService = useAppServices()
  const [user] = useUserInfo()
  var axios = require('axios')
  const types = [
    {
      label: 'Workflow',
      value: 'workflow app',
    },
    {
      label: 'Funnel',
      value: 'funnel app',
    },
    {
      label: 'Both',
      value: 'workflow & funnel app',
    },
  ]
  // const integrationTypes = [
  //   {
  //     label: 'Api Key',
  //     value: 'key',
  //   },
  //   {
  //     label: 'Auth',
  //     value: 'login',
  //   },
  // ]
  const type = [
    {
      label: 'Basic',
      value: 'basic',
    },
    {
      label: 'Api key',
      value: 'apikey',
    },
    // {
    //   label: 'Client ID / Clien Secret',
    //   value: 'dual_api_keys',
    // },
    // {
    //   label: 'O Auth',
    //   value: 'auth',
    // },
    // {
    //   label: 'Basic Auth',
    //   value: 'basic_auth',
    // },
    // {
    //   label: 'Out Bound',
    //   value: 'out_bound',
    // },
    // {
    //   label: 'Out Bound Auth',
    //   value: 'out_bound_auth',
    // },
  ]
  const integration_type = [
    {
      label: 'Basic',
      value: 'basic',
    },
    {
      label: 'Iframe',
      value: 'iframe',
    },
    {
      label: 'Url',
      value: 'url',
    },
    // {
    //   label: 'Client ID / Clien Secret',
    //   value: 'dual_api_keys',
    // },
    // {
    //   label: 'O Auth',
    //   value: 'auth',
    // },
    // {
    //   label: 'Basic Auth',
    //   value: 'basic_auth',
    // },
    // {
    //   label: 'Out Bound',
    //   value: 'out_bound',
    // },
    // {
    //   label: 'Out Bound Auth',
    //   value: 'out_bound_auth',
    // },
  ]
  const status = [
    {
      label: 'Active',
      value: 'active',
    },
    {
      label: 'Inactive',
      value: 'inactive',
    },
    {
      label: 'Comming Soon',
      value: 'comming soon',
    },
  ]
  const timeline = [
    {
      label: '7 Days',
      value: '7 days',
    },
    {
      label: '14 Days',
      value: '14 days',
    },
    {
      label: '30 Days',
      value: '30 days',
    },
    {
      label: '60 Days',
      value: '60 days',
    },
    {
      label: '90 Days',
      value: '90 days',
    },
  ]
  const handlemodal = () => {
    setOpenAddProduct(true)
  }

  useEffect(async () => {}, [])
  function AddProduct({ open, onClose }) {
    const [processing, setProcessing] = useState(false)

    const handleSubmit = async (e) => {
      e.preventDefault()
      // const integrationChecked = JSON.parse(e.target.integration_type.value).value
      // setProcessing(true);
      // var image_response = data.image
      // if (e.target.image.files[0]) {
      //   var response_data = await uploadImage({
      //     file: e.target.image.files[0],
      //     desiredPath: `app/logo/image`,
      //   })
      //   if (response_data.response) {
      //     image_response = response_data.response.data
      //   }
      // }
      const integrationChecked = JSON.parse(e.target.integration_type.value).value

      const nested_app = {
        app_id: e.target.app_id.value,
        client_id: e.target.client_id.value,
        client_secret: e.target.client_secret.value,
        sso: e.target.sso.value,
        type: JSON.parse(e.target.type.value),
        integrationType: JSON.parse(e.target.integration_type.value),
        route: integrationChecked == 'auth' ? e.target.route.value : null,
        iframe: integrationChecked == 'iframe' ? e.target.iframe.value : null,
        url: integrationChecked == 'url' ? e.target.url.value : null,
      }

      const payload = {
        _id: data._id,
        nested_app: nested_app,
      }
      // console.log(payload)

      const { response } = await AppService.app.update({
        payload: payload,
      })
      // console.log(response)
      if (response) {
        setProcessing(false)
        onClose()
        handleRefresh()
      }
    }
    function IN() {
      const [integrationValue, setIntegrationValue] = useState(
        data?.nested_app?.integrationType?.value || false
      )
      return (
        <>
          <MDBox sx={{ fontSize: '15px' }}>
            <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
              Integration Type
            </MDTypography>
            <Multiselect
              data={integration_type}
              edit_data={data?.nested_app?.integrationType}
              isMulti={false}
              name="integration_type"
              onChange={setIntegrationValue}
            />
          </MDBox>
          {integrationValue == 'auth' && (
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Route
              </MDTypography>
              <MDInput
                label="Route"
                name="route"
                defaultValue={data?.nested_app?.route}
                fullWidth
              />
            </MDBox>
          )}
          {integrationValue == 'iframe' && (
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Iframe
              </MDTypography>
              <MDInput
                label="Iframe"
                name="iframe"
                fullWidth
                defaultValue={data?.nested_app?.iframe}
              />
            </MDBox>
          )}
          {integrationValue == 'url' && (
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                url
              </MDTypography>
              <MDInput label="url" name="url" fullWidth defaultValue={data?.nested_app?.url} />
            </MDBox>
          )}
        </>
      )
    }

    return (
      <MDModal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <MDBox>
          <MDBox component="form" onSubmit={handleSubmit} role="form" sx={style}>
            <MDTypography variant="h5" mb={2}>
              Apps
            </MDTypography>

            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                App Id
              </MDTypography>
              <MDInput
                label="App Id"
                defaultValue={data?.nested_app?.app_id}
                placeholder="App Id"
                name="app_id"
                fullWidth
              />
            </MDBox>
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Client Id
              </MDTypography>
              <MDInput
                label="Client Id"
                defaultValue={data?.nested_app?.client_id}
                placeholder="Client Id"
                name="client_id"
                fullWidth
              />
            </MDBox>
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Client Secret
              </MDTypography>
              <MDInput
                label="Client Secret"
                placeholder="Client Secret"
                name="client_secret"
                defaultValue={data?.nested_app?.client_secret}
                fullWidth
              />
            </MDBox>
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                SSO Key
              </MDTypography>
              <MDInput
                label="SSO Key"
                placeholder="SSO Key"
                name="sso"
                defaultValue={data?.nested_app?.sso}
                fullWidth
              />
            </MDBox>
            <MDBox sx={{ fontSize: '15px' }}>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Type
              </MDTypography>
              <Multiselect
                data={type}
                edit_data={data?.nested_app?.type}
                isMulti={false}
                name="type"
                // setIntegrationValue={setIntegrationValue}
              />
            </MDBox>
            {IN()}

            <MDBox display="flex" justifyContent="flex-end">
              <MDButton
                variant="gradient"
                color="primary"
                type="button"
                sx={{ mt: 4, mb: 1 }}
                onClick={closeAddProduct}
              >
                close
              </MDButton>
              <MDButton
                variant="gradient"
                color="info"
                type="submit"
                sx={{ mt: 4, mb: 1, ml: 1 }}
                loading={processing}
                disabled={processing}
              >
                Update
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </MDModal>
    )
  }
  const closeAddProduct = () => {
    // if (subscription?._id)
    setOpenAddProduct(false)
  }
  return (
    <>
      <MDButton
        size="small"
        sx={{ marginRight: 2 }}
        color={data.nested_app ? 'success' : 'info'}
        variant="contained"
        onClick={handlemodal}
      >
        Nested App
      </MDButton>
      <AddProduct open={openAddProduct} onClose={closeAddProduct} />
    </>
  )
}

export default FreeMaretplaceAppsModel
