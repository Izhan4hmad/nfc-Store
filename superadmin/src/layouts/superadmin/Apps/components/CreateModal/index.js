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
  Switch,
  TextField,
  TextareaAutosize,
  FormControlLabel,
} from '@mui/material'
import { useAppServices, useUploadImage } from 'hook/services'
import { useUserInfo } from 'context/user'
import FormField from 'components/FormField'
import MDInput from 'components/MDInput'
import Multiselect from './components/Multiselect'
import RadioInput from 'components/Radio/RadioInput'
import Editor from 'components/editor'
const CreateModal = ({ products, handleRefresh, Categories }) => {
  const uploadImage = useUploadImage()
  // select

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
  const integration_type = [
    {
      label: 'Auth',
      value: 'auth',
    },
    {
      label: 'Form',
      value: 'form',
    },
    {
      label: 'Url',
      value: 'url',
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
  const SubscriptionTypes = [
    {
      label: 'Free',
      value: 'free',
    },
    {
      label: 'Paid',
      value: 'paid',
    },
    {
      label: 'Unlimited',
      value: 'unlimited',
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
      const integrationChecked = JSON.parse(e.target.integration_type.value).value
      // setProcessing(true);
      const image_response = await uploadImage({
        file: e.target.image.files[0],
        desiredPath: `app/logo/image`,
      })
      // const logo_response = await uploadImage({
      //   file: e.target.logo.files[0],
      //   desiredPath: `app/logo/image`,
      // })
      const payload = {
        name: e.target.name.value,
        app_id: e.target.app_id.value,
        video_url: e.target.video_url.value,
        client_id: e.target.client_id.value,
        client_secret: e.target.client_secret.value,
        description: e.target.description.value,
        sso: e.target.sso.value,
        monthly_id: e.target.monthly_id.value,
        monthly_price: e.target.monthly_price.value,
        yearly_id: e.target.yearly_id.value,
        yearly_price: e.target.yearly_price.value,
        app_subscription_type: e.target.app_subscription_type.value,
        categories: JSON.parse(e.target.categories.value),
        app_type: JSON.parse(e.target.app_type.value),
        status: JSON.parse(e.target.status.value),
        image: image_response.response.data,
        // logo: logo_response.response.data,
        // app_page_url: e.target.app_page_url.value,
        user_id: user._id,
        integrationType: JSON.parse(e.target.integration_type.value),
        url:
          integrationChecked == 'url' || integrationChecked == 'auth' ? e.target.url.value : null,
        content:
          integrationChecked == 'form' || integrationChecked == 'auth'
            ? e.target.content.value
            : null,
      }
      // console.log(payload)

      const { response } = await AppService.app.create({
        payload: payload,
      })
      // console.log(response)
      if (response) {
        setProcessing(false)
        onClose()
        handleRefresh()
      }
    }
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
    function IN() {
      const [integrationValue, setIntegrationValue] = useState('')
      const [editor, setEditor] = useState(null)

      return (
        <>
          <MDBox sx={{ fontSize: '15px' }}>
            <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
              Integration Type
            </MDTypography>
            <Multiselect
              data={integration_type}
              edit_data={[]}
              isMulti={false}
              name="integration_type"
              onChange={setIntegrationValue}
            />
          </MDBox>
          {integrationValue == 'form' ? (
            <>
              <MDBox>
                <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                  Content
                </MDTypography>
                <Editor
                  handleChange={(data) => {
                    // console.log('html', data)
                    setEditor(data)
                  }}
                  data={editor}
                />
              </MDBox>
            </>
          ) : (
            <></>
          )}
          {integrationValue == 'auth' ? (
            <>
              <MDBox>
                <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                  url
                </MDTypography>
                <MDInput label="url" name="url" fullWidth />
              </MDBox>
              <MDBox>
                <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                  Content
                </MDTypography>
                <Editor
                  handleChange={(data) => {
                    // console.log('html', data)
                    setEditor(data)
                  }}
                  data={editor}
                />
              </MDBox>
            </>
          ) : (
            <></>
          )}
          {integrationValue == 'url' ? (
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                url
              </MDTypography>
              <MDInput label="url" name="url" fullWidth />
            </MDBox>
          ) : (
            <></>
          )}
          <input type="hidden" name="content" value={editor} />
        </>
      )
    }
    function AppType() {
      const [apptype, setApptype] = useState('')
      const [ghlLocations_enable, setGhlLocations_enable] = useState(false)
      const [ghlusers_enable, setGhlUsers_enable] = useState(false)
      return (
        <>
          <MDBox sx={{ fontSize: '15px' }}>
            <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
              Type
            </MDTypography>
            <Multiselect
              data={types}
              edit_data={[]}
              isMulti={false}
              name="app_type"
              onChange={setApptype}
            />
          </MDBox>
          {apptype == 'agency' && (
            <>
              <MDBox>
                <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                  limited Monthly Plan Id
                </MDTypography>
                <MDInput label="limited Monthly Plan Id" name="limited_monthly_id" fullWidth />
              </MDBox>
              <MDBox>
                <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                  limited Monthly Price
                </MDTypography>
                <MDInput
                  type="number"
                  label="limited Monthly Price"
                  name="limited_monthly_price"
                  fullWidth
                />
              </MDBox>
              <MDBox>
                <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                  limited Yearly Plan Id
                </MDTypography>
                <MDInput label="limited Yearly Plan Id" name="limited_yearly_id" fullWidth />
              </MDBox>
              <MDBox>
                <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                  limited Yearly Price
                </MDTypography>
                <MDInput
                  type="number"
                  label="limited Yearly Price"
                  name="limited_yearly_price"
                  fullWidth
                />
              </MDBox>
              <MDBox>
                <FormControlLabel
                  control={
                    <Switch
                      name="ghlLocations_enable"
                      checked={ghlLocations_enable}
                      onChange={(e) => setGhlLocations_enable(e.target.checked)}
                    />
                  }
                  label="is ghl location is required for this app?"
                />
                {ghlLocations_enable && (
                  <MDBox mt={-1}>
                    <MDBox>
                      <MDTypography
                        variant="button"
                        sx={{ fontSize: '14px', fontWeight: '500' }}
                        mb={1}
                      >
                        Location Modal Key
                      </MDTypography>
                      <MDInput label="Location Modal Auth" name="location_modal_key" fullWidth />
                    </MDBox>
                    <MDBox>
                      <FormControlLabel
                        control={<Checkbox name="location_auth" />}
                        label="is auth tokens required for the locations?"
                      />
                    </MDBox>
                  </MDBox>
                )}
              </MDBox>
              <MDBox>
                <FormControlLabel
                  control={
                    <Switch
                      name="ghlusers_enable"
                      checked={ghlusers_enable}
                      onChange={(e) => setGhlUsers_enable(e.target.checked)}
                    />
                  }
                  label="is ghl user is required for this app?"
                />
                {ghlusers_enable && (
                  <MDBox mt={-1}>
                    <MDTypography
                      variant="button"
                      sx={{ fontSize: '14px', fontWeight: '500' }}
                      mb={1}
                    >
                      User Modal Key
                    </MDTypography>
                    <MDInput label="User Modal Key" name="user_modal_key" fullWidth />
                  </MDBox>
                )}
              </MDBox>
            </>
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
            <MDBox mb={2} ml={1} display="flex" alignItems="center">
              <Stack direction="row" alignItems="center" spacing={2}>
                <Button variant="contained" component="label" sx={{ color: '#fff' }}>
                  Upload Image +
                  <input hidden name="image" type="file" />
                </Button>
              </Stack>
            </MDBox>
            {/* <MDBox mb={2} ml={1} display="flex" alignItems="center">
              <Stack direction="row" alignItems="center" spacing={2}>
                <Button variant="contained" component="label" sx={{ color: '#fff' }}>
                  Upload Logo +
                  <input hidden name="logo" type="file" />
                </Button>
              </Stack>
            </MDBox> */}
            <MDBox sx={{ fontSize: '15px' }}>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Categories
              </MDTypography>
              <Multiselect data={Categories} edit_data={[]} isMulti={true} name="categories" />
            </MDBox>
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Name
              </MDTypography>
              <MDInput label="Name" name="name" fullWidth />
            </MDBox>
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Description
              </MDTypography>
              <MDBox>
                <TextareaAutosize
                  type="text"
                  name="description"
                  minRows={3}
                  style={{ width: '100%' }}
                />
              </MDBox>
            </MDBox>
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Video Url
              </MDTypography>
              <MDInput label="Video Url" name="video_url" fullWidth />
            </MDBox>
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                App Id
              </MDTypography>
              <MDInput label="App Id" placeholder="App Id" name="app_id" fullWidth />
            </MDBox>
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Client Id
              </MDTypography>
              <MDInput label="Client Id" placeholder="Client Id" name="client_id" fullWidth />
            </MDBox>
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Client Secret
              </MDTypography>
              <MDInput
                label="Client Secret"
                placeholder="Client Secret"
                name="client_secret"
                fullWidth
              />
            </MDBox>
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                SSO Key
              </MDTypography>
              <MDInput label="SSO Key" placeholder="SSO Key" name="sso" fullWidth />
            </MDBox>
            {/* <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Preview Link
              </MDTypography>
              <MDInput
                label="Preview Link"
                placeholder="Preview Link"
                name="preview_link"
                fullWidth
              />
            </MDBox> */}
            {/* <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Documentation Link
              </MDTypography>
              <MDInput
                label="Documentation Link"
                placeholder="Documentation Link"
                name="doc_link"
                fullWidth
              />
            </MDBox> */}
            {AppType()}
            {/* <MDBox sx={{ fontSize: '15px' }}>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Type
              </MDTypography>
              <Multiselect data={types} edit_data={[]} isMulti={false} name="app_type" />
            </MDBox> */}
            {/* new */}

            {/* // */}
            <MDBox sx={{ fontSize: '15px' }}>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                App Subscription Type
              </MDTypography>
              <Multiselect data={SubscriptionTypes} isMulti={false} name="app_subscription_type" />
            </MDBox>
            <MDBox sx={{ fontSize: '15px' }}>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Status
              </MDTypography>
              <Multiselect data={status} edit_data={[]} isMulti={false} name="status" />
            </MDBox>
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Monthly Plan ID
              </MDTypography>
              <MDInput
                label="Monthly Plan ID"
                placeholder="Monthly Plan ID"
                name="monthly_id"
                fullWidth
              />
            </MDBox>
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Monthly Plan Price
              </MDTypography>
              <MDInput
                label="Monthly Plan Price"
                placeholder="Monthly Plan Price"
                name="monthly_price"
                type="number"
                fullWidth
              />
            </MDBox>
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Yearly Plan ID
              </MDTypography>
              <MDInput
                label="Yearly Plan ID"
                placeholder="Yearly Plan ID"
                name="yearly_id"
                fullWidth
              />
            </MDBox>
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Yearly Plan Price
              </MDTypography>
              <MDInput
                label="Yearly Plan Price"
                placeholder="Yearly Plan Price"
                name="yearly_price"
                type="number"
                fullWidth
              />
            </MDBox>
            {/* <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                App Page Url
              </MDTypography>
              <MDInput
                label="App Page Url"
                placeholder="App Page Url"
                name="app_page_url"
                type="text"
                fullWidth
              />
            </MDBox> */}
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
                Add
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
      <MDButton color="white" size="small" variant="contained" onClick={handlemodal}>
        Create
      </MDButton>
      <AddProduct open={openAddProduct} onClose={closeAddProduct} />
    </>
  )
}

export default CreateModal
