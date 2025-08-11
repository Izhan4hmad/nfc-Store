import MDButton from 'components/MDButton';
import React, { useState } from 'react';
import MDModal from 'components/MDModal';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { TextareaAutosize } from '@mui/material';
import { useAppServices } from 'hook/services';
import MDInput from 'components/MDInput';
import Multiselect from '../CreateModal/components/Multiselect';

const EditModal = ({ staff, apps, handleRefresh, data, ghlFeatures, team, tags, jobs }) => {
  
  const [openEditProduct, setOpenEditProduct] = useState(false);
  const [processing, setProcessing] = useState(false);
  const AppService = useAppServices();

  const tagsOptions = tags?.map(item => ({
    label: item?.name,
    value: item?._id,
  }))
  const ghlfeaturesOptions = ghlFeatures?.map(item => ({
    label: item?.name,
    value: item?._id,
  }))
  const teamOptions = team?.map(item => ({
    label: item?.name,
    value: item?._id,
  }))

  const appOptions = apps?.map(item => ({
    label: item?.name,
    value: item?.app_id,
  }))

  const staffOptions = staff?.map(item => ({
    label: item?.username,
    value: item?._id,
  }))
  const jobOptions = jobs?.map(item => ({
    label: item?.name,
    value: item?._id,
  }))

  const handleOpenModal = () => setOpenEditProduct(true);
  const handleCloseModal = () => setOpenEditProduct(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const app = JSON.parse(e.target.app.value);

    const payload = {
      _id: data._id,
      name: e.target.name.value,
      desc: e.target.desc.value,
      app_id: app.value,
      staff: e.target.staff ? JSON.parse(e.target.staff.value) : [],
      points: e.target.points.value,
      status: JSON.parse(e.target.status.value),
      secret_note: e.target.secret_note.value,
      team: e.target.team ? JSON.parse(e.target.team.value) : [],
      staff_tag: e.target.staff_tag ? JSON.parse(e.target.staff_tag.value) : [],
      jobs: e.target.jobs ? JSON.parse(e.target.jobs.value) : [],
      ghl_features: e.target.ghl_features ? JSON.parse(e.target.ghl_features.value) : [],
    };

    const { response } = await AppService.tasks.update({ payload });

    if (response) {
      setProcessing(false);
      handleCloseModal();
      handleRefresh();
    }
  };



  const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'In Review', value: 'in-review' },
    { label: 'Completed', value: 'completed' },
  ];

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <MDButton color="info" variant="contained" onClick={handleOpenModal}>
        Edit
      </MDButton>

      <MDModal open={openEditProduct} onClose={handleCloseModal} width={440}>
        <MDBox
          component="form"
          onSubmit={handleSubmit}
          role="form"
          sx={modalStyle}
          height={770}
          style={{ overflow: 'auto' }}
        >
          <MDTypography variant="h5" mb={2}>
            Update Task
          </MDTypography>


          <MDBox>
            <MDTypography variant="button" sx={{ fontSize: '12px', fontWeight: '500' }} mb={1}>
              Task Name
            </MDTypography>
            <MDInput placeholder="Name" name="name" fullWidth defaultValue={data?.name} />
          </MDBox>
          <MDBox>
            <MDTypography variant="button" sx={{ fontSize: '12px', fontWeight: '500' }} mb={1}>
              Task Description
            </MDTypography>
            <TextareaAutosize
              type="text"
              name="desc"
              defaultValue={data?.desc}
              minRows={2}
              style={{ width: '100%' }}
            />
          </MDBox>
          <MDBox>
            <MDTypography variant="button" sx={{ fontSize: '12px', fontWeight: '500' }} mb={1}>
              App
            </MDTypography>
            <Multiselect data={appOptions} isMulti={false} name="app" edit_data={appOptions?.find((item)=>item.value==data?.app_id)} />
          </MDBox>
          <MDBox>
            <MDTypography variant="button" sx={{ fontSize: '12px', fontWeight: '500' }} mb={1}>
              Staff to assign
            </MDTypography>
            <Multiselect data={staffOptions} isMulti={true} name="staff" edit_data={data?.staff || []} />

          </MDBox>
          <MDBox>
            <MDTypography variant="button" sx={{ fontSize: '12px', fontWeight: '500' }} mb={1}>
              Jobs
            </MDTypography>
            <Multiselect data={jobOptions} isMulti={true} name="jobs" edit_data={data?.jobs || []} />

          </MDBox>
          <MDBox>
            <MDTypography variant="button" sx={{ fontSize: '12px', fontWeight: '500' }} mb={1}>
              Points
            </MDTypography>
            <MDInput placeholder="Points" name="points" fullWidth defaultValue={data?.points} />
          </MDBox>
          <MDBox>
            <MDTypography variant="button" sx={{ fontSize: '12px', fontWeight: '500' }} mb={1}>
              Secret Note
            </MDTypography>
            <MDInput placeholder="Secret Note" name="secret_note" fullWidth
              defaultValue={data?.secret_note}
            />
          </MDBox>
          <MDBox>
            <MDTypography variant="button" sx={{ fontSize: '12px', fontWeight: '500' }} mb={1}>
              Status
            </MDTypography>
            <Multiselect data={statusOptions} isMulti={false} name="status" edit_data={data?.status || []} />

          </MDBox>
          <MDBox>
            <MDTypography variant="button" sx={{ fontSize: '12px', fontWeight: '500' }} mb={1}>
              Ghl Features
            </MDTypography>
            <Multiselect data={ghlfeaturesOptions} isMulti={true} name="ghl_features" edit_data={data?.ghl_features || []} />
          </MDBox>

          <MDBox>
            <MDTypography variant="button" sx={{ fontSize: '12px', fontWeight: '500' }} mb={1}>
              Team
            </MDTypography>
            <Multiselect data={teamOptions} edit_data={data?.team || []} isMulti={true} name="team" />
          </MDBox>
          <MDBox>
            <MDTypography variant="button" sx={{ fontSize: '12px', fontWeight: '500' }} mb={1}>
              Tags
            </MDTypography>
            <Multiselect data={tagsOptions} edit_data={data?.staff_tag || []} isMulti={true} name="staff_tag" />
          </MDBox>
          <MDBox display="flex" justifyContent="flex-end">
            <MDButton variant="gradient" color="primary" type="button" sx={{ mt: 4, mb: 1 }} onClick={handleCloseModal}>
              Close
            </MDButton>
            <MDButton variant="gradient" color="info" type="submit" sx={{ mt: 4, mb: 1, ml: 1 }} loading={processing} disabled={processing}>
              Edit
            </MDButton>
          </MDBox>
        </MDBox>
      </MDModal>
    </>
  );
};

export default EditModal;
