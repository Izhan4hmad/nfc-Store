import MDButton from 'components/MDButton'
import React, { useEffect, useState } from 'react'
import MDModal from 'components/MDModal'
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import { Edit } from '@mui/icons-material'
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
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
      label: 'Agency',
      value: 'agency',
    },
    {
      label: 'Subaccount',
      value: 'sub_account',
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
  const status = [
    {
      label: 'Active',
      value: 'active',
    },
    {
      label: 'Inactive',
      value: 'inactive',
    },
  ]
  const docTypes = [
    {
      label: 'Youtube',
      value: 'youtube',
    },
    {
      label: 'Doc url',
      value: 'doc_url',
    },
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
    {
      label: 'Form',
      value: 'form',
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
      const custom_page = e.target.custom_page.value == '' ? null : e.target.custom_page.value
      const free_app = {
        app_id: e.target.app_id.value,
        client_id: e.target.client_id.value,
        client_secret: e.target.client_secret.value,
        sso: e.target.sso.value,
        app_triggers: e.target.app_triggers.checked,
        type: JSON.parse(e.target.type.value),
        integrationType: JSON.parse(e.target.integration_type.value),
        doc_type: JSON.parse(e.target.doc_type.value),
        doc_url: e.target.doc_url.value,
        click_up_task_id: e.target.click_up_task_id.value,
        scopes: e.target.scopes.value,
        custom_page: custom_page,
        route: integrationChecked == 'auth' ? e.target.route.value : null,
        iframe: integrationChecked == 'iframe' ? e.target.iframe.value : null,
        url:
          integrationChecked == 'url' || integrationChecked == 'form' ? e.target.url.value : null,
      }

      const payload = {
        _id: data._id,
        free_app,
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
        data?.free_app?.integrationType?.value || false
      )
      return (
        <>
          <MDBox sx={{ fontSize: '15px' }}>
            <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
              Integration Type
            </MDTypography>
            <Multiselect
              data={integration_type}
              edit_data={data?.free_app?.integrationType}
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
              <MDInput label="Route" name="route" defaultValue={data?.free_app?.route} fullWidth />
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
                defaultValue={data?.free_app?.iframe}
              />
            </MDBox>
          )}
          {integrationValue == 'url' && (
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                url
              </MDTypography>
              <MDInput label="url" name="url" fullWidth defaultValue={data?.free_app?.url} />
            </MDBox>
          )}
          {integrationValue == 'form' && (
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                url
              </MDTypography>
              <MDInput label="url" name="url" fullWidth defaultValue={data?.free_app?.url} />
            </MDBox>
          )}
        </>
      )
    }
    function DocType() {
      const [docType, setdocType] = useState(data?.free_app?.doc_type?.value || false)
      return (
        <>
          <MDBox sx={{ fontSize: '15px' }}>
            <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
              Doc Type
            </MDTypography>
            <Multiselect
              data={docTypes}
              edit_data={data?.free_app?.doc_type}
              isMulti={false}
              name="doc_type"
              onChange={setdocType}
            />
          </MDBox>
          {docType == 'youtube' && (
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Youtube video url
              </MDTypography>
              <MDInput
                label=" Youtube video url"
                name="doc_url"
                fullWidth
                defaultValue={data?.free_app?.doc_url}
              />
            </MDBox>
          )}
          {docType == 'doc_url' && (
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Doc url
              </MDTypography>
              <MDInput
                label=" Doc url"
                name="doc_url"
                fullWidth
                defaultValue={data?.free_app?.doc_url}
              />
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
                defaultValue={data?.free_app?.app_id}
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
                defaultValue={data?.free_app?.client_id}
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
                defaultValue={data?.free_app?.client_secret}
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
                defaultValue={data?.free_app?.sso}
                fullWidth
              />
            </MDBox>
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Click Up Task Id
              </MDTypography>
              <MDInput
                label="Click Up Task Id"
                placeholder="Click Up Task Id"
                name="click_up_task_id"
                defaultValue={data?.free_app?.click_up_task_id}
                fullWidth
              />
            </MDBox>
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Custom Page
              </MDTypography>
              <MDInput
                label="Custom Page"
                placeholder="Custom Page"
                name="custom_page"
                defaultValue={data?.free_app?.custom_page}
                fullWidth
              />
            </MDBox>
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Scopes
              </MDTypography>
              <MDInput
                label="Scopes"
                placeholder="Scopes"
                name="scopes"
                defaultValue={data?.free_app?.scopes}
                fullWidth
              />
            </MDBox>
            <MDBox sx={{ fontSize: '15px' }}>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Type
              </MDTypography>
              <Multiselect
                data={types}
                edit_data={data?.free_app?.type}
                isMulti={false}
                name="type"
                // setIntegrationValue={setIntegrationValue}
              />
            </MDBox>
            {IN()}
            {DocType()}
            <MDBox>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox defaultChecked={data?.free_app?.app_triggers} />}
                  label="Is App Have Triggers"
                  name="app_triggers"
                />
              </FormGroup>
            </MDBox>
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
        color={data.free_app ? 'success' : 'info'}
        variant="contained"
        onClick={handlemodal}
      >
        Free App
      </MDButton>
      <AddProduct open={openAddProduct} onClose={closeAddProduct} />
    </>
  )
}

export default FreeMaretplaceAppsModel
