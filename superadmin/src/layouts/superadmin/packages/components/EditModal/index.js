import FormField from 'components/FormField'
import MDModal from 'components/MDModal'
import MDBox from 'components/MDBox'
import MDButton from 'components/MDButton'
import MDTypography from 'components/MDTypography'
import PropTypes from 'prop-types'
import { useState } from 'react'
// import Multiselect from "./components/Multiselect";
import { useAppServices } from 'hook/services'
import { Button, Stack, TextareaAutosize } from '@mui/material'
import MDInput from 'components/MDInput'
import Multiselect from '../CreateModal/components/Multiselect'

function ModalComponent({ open, onClose, apps, products, data, handleRefresh }) {
  const AppService = useAppServices()
  const [apps_data, setapps_data] = useState()
  const [products_data, setproducts_data] = useState()
  const [processing, setprocessing] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log(payload, "payload");
    var image_response = data.image
    var result = await uploadImage({
      file: e.target.image.files[0],
      desiredPath: `app/logo/image`,
    })
    if (result.response.data) {
      image_response = result.response.data
    }
    const payload = {
      name: e.target.name.value,
      image: image_response.response.data,
      description: e.target.description.value,
      apps: JSON.parse(e.target.apps.value),
      monthly: JSON.parse(e.target.monthly.value),
      yearly: JSON.parse(e.target.yearly.value),
    }
    // console.log(payload, 'payload')
    const { response } = await AppService.offer.update({ payload })
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
          <MDInput label="Name" placeholder="Name" name="name" fullWidth defaultValue={data.name} />
        </MDBox>
        <MDBox sx={{ fontSize: '15px' }}>
          <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
            Apps
          </MDTypography>
          <Multiselect data={apps} edit_data={data.apps} isMulti={true} name="apps" />
        </MDBox>

        <MDBox>
          <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
            Description
          </MDTypography>
          <MDBox>
            <TextareaAutosize
              defaultValue={data.description}
              type="text"
              name="description"
              minRows={4}
              style={{ width: '100%' }}
            />
          </MDBox>
        </MDBox>

        <MDBox sx={{ fontSize: '15px' }}>
          <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
            Monthly
          </MDTypography>
          <Multiselect data={products} edit_data={data.monthly} isMulti={false} name="monthly" />
        </MDBox>
        <MDBox sx={{ fontSize: '15px' }}>
          <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
            Yearly
          </MDTypography>
          <Multiselect data={products} edit_data={data.yearly} isMulti={false} name="yearly" />
        </MDBox>
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
  products: PropTypes.array,
  apps: PropTypes.array,
  data: PropTypes.array,
  handleRefresh: PropTypes.func,
}
function Modal({ products, apps, data, handleRefresh }) {
  const [openAddMember, setOpenAddMember] = useState(false)

  return (
    <>
      <MDButton
        variant="contained"
        color="info"
        size="small"
        onClick={() => setOpenAddMember(true)}
      >
        Edit
      </MDButton>
      <ModalComponent
        open={openAddMember}
        onClose={() => setOpenAddMember(false)}
        products={products}
        data={data}
        apps={apps}
        handleRefresh={handleRefresh}
      />
    </>
  )
}
Modal.propTypes = {
  products: PropTypes.array,
  apps: PropTypes.array,
  data: PropTypes.array,
  handleRefresh: PropTypes.func,
}
export default Modal
