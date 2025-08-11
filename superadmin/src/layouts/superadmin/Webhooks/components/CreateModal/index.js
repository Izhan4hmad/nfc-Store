import MDButton from 'components/MDButton'
import React, { useEffect, useState } from 'react'
import MDModal from 'components/MDModal'
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import MDInput from 'components/MDInput'
import { useAppServices, useUploadImage } from 'hook/services'
import { useAgencyInfo } from 'context/agency'
import { FormControl, InputLabel, MenuItem, Select, TextareaAutosize } from '@mui/material'

const CreateModal = ({ handleRefresh }) => {
  const uploadImage = useUploadImage()

  const [agency] = useAgencyInfo()
  const AppService = useAppServices()
  const [openAddProduct, setOpenAddProduct] = useState(false)
  const [processing, setProcessing] = useState(false)

  // console.log(svgIcon, "svgIcon")
  const handleModal = () => {
    setOpenAddProduct(true)
  }

  const closeAddProduct = () => {
    setOpenAddProduct(false)
  }


  const handleSubmit = async (e) => {

    e.preventDefault();
    setProcessing(true);

    const payload = {
      name: e.target.name.value,
      description: e.target.description.value,
      type: e.target.type.value,
      user_point: e.target.user_point.value,
      location_point: e.target.location_point.value,
      agency_point: e.target.agency_point.value,
    };

    console.log(payload, "payload");

    const { response } = await AppService.superadmin_webhook.create({ payload });

    if (response) {
      setProcessing(false);
      closeAddProduct();
      handleRefresh();
    }
  };


  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    maxHeight: '80vh',
    overflow: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  }

  return (
    <>
      <MDButton color="white" variant="contained" onClick={handleModal}>
        Create
      </MDButton>
      <MDModal open={openAddProduct} onClose={closeAddProduct}>
        <MDBox>
          <MDBox component="form" onSubmit={handleSubmit} role="form" sx={style} >
            <MDTypography variant="h5" mb={2}>
              Register Hook
            </MDTypography>

            <MDBox mb={2}>
              <MDTypography variant="button">Name</MDTypography>
              <MDInput label="Name" name="name" fullWidth required />
            </MDBox>
            <MDBox mb={2}>
              <MDTypography variant="button">Description</MDTypography>
              <MDBox>
                <TextareaAutosize
                  type="text"
                  name="description"
                  minRows={3}
                  style={{ width: '100%' }}
                />
              </MDBox>
            </MDBox>
            <MDBox mb={2}>
              <MDTypography variant="button">Webhook</MDTypography>
              <MDInput label="Type" name="type" fullWidth />
            </MDBox>


            {/* <MDBox mb={2}>
              <MDTypography variant="button">Type</MDTypography>
              <MDInput
                select
                name="type"
                fullWidth
                required
                SelectProps={{ native: true }}
              >
                <option value="" disabled selected>Select Type</option>

                <option value="AppointmentCreate">AppointmentCreate</option>
                <option value="AppointmentDelete">AppointmentDelete</option>
                <option value="AppointmentUpdate">AppointmentUpdate</option>
                <option value="LocationCreate">LocationCreate</option>
                <option value="LocationUpdate">LocationUpdate</option>
                <option value="ContactCreate">ContactCreate</option>
                <option value="ContactDelete">ContactDelete</option>
                <option value="ContactUpdate">ContactUpdate</option>
                <option value="OpportunityCreate">OpportunityCreate</option>
                <option value="OpportunityDelete">OpportunityDelete</option>
                <option value="OpportunityUpdate">OpportunityUpdate</option>
                <option value="ProductCreate">ProductCreate</option>
                <option value="ProductUpdate">ProductUpdate</option>
                <option value="ProductDelete">ProductDelete</option>
                <option value="UserCreate">UserCreate</option>
                <option value="OrderCreate">OrderCreate</option>
              </MDInput>
            </MDBox> */}

            <MDBox mb={2}>
              <MDTypography variant="button">User Point</MDTypography>
              <MDInput label="User Point" name="user_point" fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDTypography variant="button">Location Point</MDTypography>
              <MDInput label="Location Point" name="location_point" fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDTypography variant="button">Agency Point</MDTypography>
              <MDInput label="Agency Point" name="agency_point" fullWidth />
            </MDBox>
            <MDBox display="flex" justifyContent="flex-end">
              <MDButton
                variant="gradient"
                color="primary"
                type="button"
                sx={{ mt: 2, mb: 1 }}
                onClick={closeAddProduct}
              >
                Close
              </MDButton>
              <MDButton
                variant="gradient"
                color="info"
                type="submit"
                sx={{ mt: 2, mb: 1, ml: 1 }}
                loading={processing}
                disabled={processing}
              >
                Add
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </MDModal>
    </>
  )
}

export default CreateModal
