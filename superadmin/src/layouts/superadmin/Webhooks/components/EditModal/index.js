import React, { useState } from 'react';
import MDButton from 'components/MDButton';
import MDModal from 'components/MDModal';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import { useAppServices } from 'hook/services';
import { TextareaAutosize } from '@mui/material';

const EditModal = ({ data, handleRefresh }) => {
  const AppService = useAppServices();
  const [openEditProduct, setOpenEditProduct] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [svgIcon, setSvgIcon] = useState(null);


  const handleModal = () => {
    setOpenEditProduct(true);
  };

  const closeEditProduct = () => {
    setOpenEditProduct(false);
  };

  const handleSvgUpload = (e) => {
    setSvgIcon(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);


    const payload = {
      _id: data._id,
      name: e.target.name.value,
      description: e.target.description.value,
      type: e.target.type.value,
      user_point: e.target.user_point.value,
      location_point: e.target.location_point.value,
      agency_point: e.target.agency_point.value,


    };


    const { response } = await AppService.superadmin_webhook.update({ payload });
    console.log(response, "response")

    if (response) {
      setProcessing(false);
      closeEditProduct()
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
  };

  return (
    <>
      <MDButton color="info" variant="contained" onClick={handleModal}>
        Edit
      </MDButton>
      <MDModal open={openEditProduct} onClose={closeEditProduct}>
        <MDBox>
          <MDBox component="form" onSubmit={handleSubmit} role="form" sx={style} encType="multipart/form-data">
            <MDTypography variant="h5" mb={2}>
              Edit Tag
            </MDTypography>


            <MDBox mb={2}>
              <MDTypography variant="button">Name</MDTypography>
              <MDInput label="Name" name="name" fullWidth defaultValue={data.name} />
            </MDBox>
            <MDBox mb={2}>
              <MDTypography variant="button">Description</MDTypography>
              <MDBox>
                <TextareaAutosize
                  type="text"
                  name="description"
                  defaultValue={data.description}
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
                defaultValue={data.type}

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
              <MDInput label="User Point" name="user_point" fullWidth defaultValue={data.user_point} />
            </MDBox>
            <MDBox mb={2}>
              <MDTypography variant="button">Location Point</MDTypography>
              <MDInput label="Location Point" name="location_point" fullWidth defaultValue={data.location_point} />
            </MDBox>
            <MDBox mb={2}>
              <MDTypography variant="button">Agency Point</MDTypography>
              <MDInput label="Agency Point" name="agency_point" fullWidth defaultValue={data.agency_point} />
            </MDBox>
            <MDBox display="flex" justifyContent="flex-end">
              <MDButton
                variant="gradient"
                color="primary"
                type="button"
                sx={{ mt: 2, mb: 1 }}
                onClick={closeEditProduct}
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
                Save
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </MDModal>
    </>
  );
};

export default EditModal;
