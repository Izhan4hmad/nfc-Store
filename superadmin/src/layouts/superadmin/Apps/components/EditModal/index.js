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
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
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
const EditModal = ({ data, handleRefresh, products, Categories }) => {
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
    //   label: 'Auth',
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
      const integrationChecked = JSON.parse(e.target.integration_type.value).value
      const app_type = JSON.parse(e.target.app_type.value).value
      // setProcessing(true);
      var image_response = data.image
      if (e.target.image.files[0]) {
        var response_data = await uploadImage({
          file: e.target.image.files[0],
          desiredPath: `app/logo/image`,
        })
        if (response_data.response) {
          image_response = response_data.response.data
        }
      }
      const payload = {
        _id: data._id,
        name: e.target.name.value,
        app_id: e.target.app_id.value,
        video_url: e.target.video_url.value,
        client_id: e.target.client_id.value,
        client_secret: e.target.client_secret.value,
        description: e.target.description.value,
        monthly_id: e.target.monthly_id.value,
        monthly_price: e.target.monthly_price.value,
        yearly_id: e.target.yearly_id.value,
        yearly_price: e.target.yearly_price.value,
        limited_yearly_id: app_type == 'agency' ? e.target.limited_yearly_id.value : null,
        limited_yearly_price: app_type == 'agency' ? e.target.limited_yearly_price.value : null,
        limited_monthly_id: app_type == 'agency' ? e.target.limited_monthly_id.value : null,
        limited_monthly_price: app_type == 'agency' ? e.target.limited_monthly_price.value : null,
        sso: e.target.sso.value,
        categories: JSON.parse(e.target.categories.value),
        app_subscription_type: JSON.parse(e.target.app_subscription_type.value),
        app_type: JSON.parse(e.target.app_type.value),
        status: JSON.parse(e.target.status.value),
        image: image_response,
        user_id: user._id,
        integrationType: JSON.parse(e.target.integration_type.value),
        route: integrationChecked == 'auth' ? e.target.route.value : null,
        iframe: integrationChecked == 'iframe' ? e.target.iframe.value : null,
        url:
          integrationChecked == 'url' || integrationChecked == 'form' ? e.target.url.value : null,
        ghlLocations_enable: app_type == 'agency' ? e.target.ghlLocations_enable.checked : false,
        ghlusers_enable: app_type == 'agency' ? e.target.ghlusers_enable.checked : false,
        location_modal_key:
          app_type == 'agency' && e.target.ghlLocations_enable.checked == true
            ? e.target.location_modal_key.value
            : null,
        location_auth:
          app_type == 'agency' && e.target.ghlLocations_enable.checked == true
            ? e.target.location_auth.checked
            : null,
        user_modal_key:
          app_type == 'agency' && e.target.ghlusers_enable.checked == true
            ? e.target.user_modal_key.value
            : null,
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
      const [integrationValue, setIntegrationValue] = useState(data?.integrationType?.value)
      return (
        <>
          <MDBox sx={{ fontSize: '15px' }}>
            <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
              Integration Type
            </MDTypography>
            <Multiselect
              data={integration_type}
              edit_data={data.integrationType}
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
              <MDInput label="Route" defaultValue={data?.route} name="route" fullWidth />
            </MDBox>
          )}
          {integrationValue == 'iframe' && (
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Iframe
              </MDTypography>
              <MDInput label="Iframe" name="iframe" defaultValue={data?.iframe} fullWidth />
            </MDBox>
          )}
          {integrationValue == 'url' && (
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                url
              </MDTypography>
              <MDInput label="url" name="url" defaultValue={data?.url} fullWidth />
            </MDBox>
          )}
          {integrationValue == 'form' && (
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                url
              </MDTypography>
              <MDInput label="url" name="url" fullWidth defaultValue={data?.url} />
            </MDBox>
          )}
        </>
      )
    }
    function AppType() {
      const [apptype, setApptype] = useState(data?.app_type?.value || '')
      const [ghlLocations_enable, setGhlLocations_enable] = useState(
        data?.ghlLocations_enable || false
      )
      const [ghlusers_enable, setGhlUsers_enable] = useState(data?.ghlusers_enable || false)
      return (
        <>
          <MDBox sx={{ fontSize: '15px' }}>
            <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
              Type
            </MDTypography>
            <Multiselect
              data={types}
              edit_data={data.app_type}
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
                <MDInput
                  label="limited Monthly Plan Id"
                  name="limited_monthly_id"
                  fullWidth
                  defaultValue={data?.limited_monthly_id}
                />
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
                  defaultValue={data?.limited_monthly_price}
                />
              </MDBox>
              <MDBox>
                <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                  limited Yearly Plan Id
                </MDTypography>
                <MDInput
                  label="limited Yearly Plan Id"
                  name="limited_yearly_id"
                  fullWidth
                  defaultValue={data?.limited_yearly_id}
                />
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
                  defaultValue={data?.limited_yearly_price}
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
                      <MDInput
                        label="Location Modal Key"
                        name="location_modal_key"
                        fullWidth
                        defaultValue={data?.location_modal_key}
                      />
                    </MDBox>
                    <MDBox>
                      <FormControlLabel
                        control={
                          <Checkbox name="location_auth" defaultChecked={data?.location_auth} />
                        }
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
                    <MDInput
                      label="User Modal Key"
                      name="user_modal_key"
                      fullWidth
                      defaultValue={data?.user_modal_key}
                    />
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
            <MDBox sx={{ fontSize: '15px' }}>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Categories
              </MDTypography>
              <Multiselect
                data={Categories}
                edit_data={data.categories}
                isMulti={true}
                name="categories"
              />
            </MDBox>
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Name
              </MDTypography>
              <MDInput label="Name" name="name" fullWidth defaultValue={data?.name} />
            </MDBox>
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Description
              </MDTypography>
              <MDBox>
                <TextareaAutosize
                  type="text"
                  name="description"
                  defaultValue={data?.description}
                  minRows={3}
                  style={{ width: '100%' }}
                />
              </MDBox>
            </MDBox>
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Video Url
              </MDTypography>
              <MDInput
                defaultValue={data?.video_url}
                label="Video Url"
                name="video_url"
                fullWidth
              />
            </MDBox>
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                App Id
              </MDTypography>
              <MDInput
                label="App Id"
                defaultValue={data?.app_id}
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
                defaultValue={data?.client_id}
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
                defaultValue={data?.client_secret}
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
                defaultValue={data?.sso}
                fullWidth
              />
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
            <MDBox sx={{ fontSize: '15px' }}>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                App Subscription Type
              </MDTypography>
              <Multiselect
                data={SubscriptionTypes}
                edit_data={data?.app_subscription_type}
                isMulti={false}
                name="app_subscription_type"
              />
            </MDBox>
            <MDBox sx={{ fontSize: '15px' }}>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Status
              </MDTypography>
              <Multiselect data={status} edit_data={data.status} isMulti={false} name="status" />
            </MDBox>

            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Monthly Plan ID
              </MDTypography>
              <MDInput
                label="Monthly Plan ID"
                placeholder="Monthly Plan ID"
                name="monthly_id"
                defaultValue={data?.monthly_id}
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
                defaultValue={data?.monthly_price}
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
                defaultValue={data?.yearly_id}
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
                defaultValue={data?.yearly_price}
                fullWidth
              />
            </MDBox>
            {/* new */}
            {/* <MDBox sx={{ fontSize: '15px' }}>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Integration Type
              </MDTypography>
              <Multiselect
                data={integration_type}
                edit_data={data.integrationType}
                isMulti={false}
                name="integration_type"
              />
            </MDBox> */}
            {IN()}
            {/* /// */}
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
        color="info"
        variant="contained"
        onClick={handlemodal}
      >
        Edit
      </MDButton>
      <AddProduct open={openAddProduct} onClose={closeAddProduct} />
    </>
  )
}

export default EditModal
