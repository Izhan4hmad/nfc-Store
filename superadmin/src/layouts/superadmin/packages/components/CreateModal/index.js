import FormField from 'components/FormField'
import MDModal from 'components/MDModal'
import MDBox from 'components/MDBox'
import MDButton from 'components/MDButton'
import MDTypography from 'components/MDTypography'
import PropTypes from 'prop-types'
import { useState } from 'react'
// import Multiselect from "./components/Multiselect";
import { useAppServices, useUploadImage } from 'hook/services'
import { Button, Stack, TextareaAutosize } from '@mui/material'
import MDInput from 'components/MDInput'
import MultiSelect from './components/Multiselect'
import { useAgencyInfo } from 'context/agency'

function ModalComponent({ open, onClose, products, apps, handleRefresh }) {
  const AppService = useAppServices()
  const uploadImage = useUploadImage()
  const [agency] = useAgencyInfo()
  const [apps_data, setapps_data] = useState()
  const [products_data, setproducts_data] = useState()
  const [processing, setprocessing] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log(payload, "payload");
    const image_response = await uploadImage({
      file: e.target.image.files[0],
      desiredPath: `app/logo/image`,
    })
    const superadmin_prices = {
      selling_price: JSON.parse(e.target.selling_price.value),
      basic: JSON.parse(e.target.basic.value),
    }
    const data = {
      name: e.target.name.value,
      type: 'packages',
      image_url: image_response.response.data,
      description: e.target.description.value,
      apps: JSON.parse(e.target.apps.value),
      superadmin_prices: superadmin_prices,
      iframe_url: e.target.iframe_url.value,
      agency_id: agency._id,
    }
    const payload = {
      data: data,
    }
    // console.log(payload, 'payload')
    const { response } = await AppService.snapshot.create({ payload })
    // console.log(response, 'response')
    if (response) {
      onClose()
      handleRefresh()
    }
  }
  return (
    <MDModal open={open} onClose={onClose} width={400}>
      <MDBox component="form" onSubmit={handleSubmit} role="form">
        <MDTypography variant="h5" mb={2}>
          packages
        </MDTypography>
        <MDBox mb={2} ml={1} display="flex" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button variant="contained" component="label" sx={{ color: '#fff' }}>
              Upload Image +
              <input hidden name="image" type="file" />
            </Button>
          </Stack>
        </MDBox>
        <MDBox>
          <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
            Name
          </MDTypography>
          <MDInput label="Name" placeholder="Name" name="name" fullWidth />
        </MDBox>
        <MDBox sx={{ fontSize: '15px' }}>
          <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
            Apps
          </MDTypography>
          <MultiSelect data={apps} edit_data={[]} isMulti={true} name="apps" />
        </MDBox>

        <MDBox>
          <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
            Description
          </MDTypography>
          <MDBox>
            <TextareaAutosize
              type="text"
              name="description"
              minRows={4}
              style={{ width: '100%' }}
            />
          </MDBox>
        </MDBox>

        <MDBox sx={{ fontSize: '15px' }}>
          <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
            Pay As You Go
          </MDTypography>
          <MultiSelect data={products} edit_data={[]} isMulti={false} name="basic" />
        </MDBox>
        <MDBox sx={{ fontSize: '15px' }}>
          <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
            Selling Price
          </MDTypography>
          <MultiSelect data={products} edit_data={[]} isMulti={false} name="selling_price" />
        </MDBox>
        <MDBox sx={{ fontSize: '15px' }}>
          <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
            Preview Link
          </MDTypography>
          <MDInput label="Preview Link" placeholder="Preview Link" name="iframe_url" fullWidth />
        </MDBox>

        {/* <MDBox sx={{ fontSize: '15px' }}>
          <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
            Yearly
          </MDTypography>
          <MultiSelect data={products} edit_data={[]} isMulti={false} name="yearly" />
        </MDBox> */}
        <MDBox display="flex" justifyContent="flex-end">
          <MDButton
            variant="gradient"
            color="primary"
            type="button"
            sx={{ mt: 4, mb: 1 }}
            onClick={onClose}
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
    </MDModal>
  )
}
ModalComponent.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  handleRefresh: PropTypes.func,
  products: PropTypes.array,
  apps: PropTypes.array,
}
function Modal({ products, apps, handleRefresh }) {
  const [openAddMember, setOpenAddMember] = useState(false)

  return (
    <>
      <MDButton
        variant="contained"
        color="white"
        size="small"
        onClick={() => setOpenAddMember(true)}
      >
        create
      </MDButton>
      <ModalComponent
        open={openAddMember}
        onClose={() => setOpenAddMember(false)}
        products={products}
        apps={apps}
        handleRefresh={handleRefresh}
      />
    </>
  )
}
Modal.propTypes = {
  products: PropTypes.array,
  handleRefresh: PropTypes.func,
  apps: PropTypes.array,
}
export default Modal
