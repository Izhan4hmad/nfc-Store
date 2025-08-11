import MDButton from 'components/MDButton'
import React, { useEffect, useState } from 'react'
import MDModal from 'components/MDModal'
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import {
  TextareaAutosize,
} from '@mui/material'
import { useAppServices } from 'hook/services'
import MDInput from 'components/MDInput'
import Multiselect from './components/Multiselect'

const CreateModal = ({ staff, handleRefresh, apps, appData }) => {

  const [openAddProduct, setOpenAddProduct] = useState(false)
  const AppService = useAppServices()

  const appOptions = apps?.map(item => ({
    label: item?.name,
    value: item?.app_id,
  }))

  const staffOptions = staff?.map(item => ({
    label: item?.username,
    value: item?._id,
  }))

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    bgcolor: 'background.paper',
    border: '2px  #000',
    boxShadow: 24,
    p: 4,
  }

  const statusOptions = [
    {
      label: 'Pending',
      value: 'pending',
    },
    {
      label: 'In Progress',
      value: 'in-progress',
    },
    {
      label: 'In Review',
      value: 'in-review',
    },
    {
      label: 'Completed',
      value: 'completed',
    }
  ]

  const handlemodal = () => {
    setOpenAddProduct(true)
  }
  function AddProduct({ open, onClose }) {
    const [processing, setProcessing] = useState(false)
    const [selectedApp, setSelectedApp] = useState(null);

    const handleSubmit = async (e) => {
      e.preventDefault()
      const staff = JSON.parse(e.target.staff.value);
      const app = JSON.parse(e.target.app.value);

      const payload = {
        name: e.target.name.value,
        desc: e.target.desc.value,
        app_id: app.value,
        staff: staff?.map(item => item.value),
        points: e.target.points.value,
        status: JSON.parse(e.target.status.value)
      }

      const { response } = await AppService.tasks.create({
        payload: payload,
        toaster: true
      })

      if (response) {
        setProcessing(false)
        onClose()
        handleRefresh()
      }
    }

    useEffect(() => {
      console.log('appDataappDataappData', appData)
      if (appData) {
        setSelectedApp({
          label: appData.name,
          value: appData.app_id,
        });
      }
    }, [appData]);

    return (
      <MDModal open={open} onClose={onClose} width={440}>
        <MDBox component="form" onSubmit={handleSubmit} role="form" sx={style}>
          <MDTypography variant="h5" mb={2}>
            Create Task
          </MDTypography>

          <MDBox>
            <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
              Task Name
            </MDTypography>
            <MDInput placeholder="Name" name="name" fullWidth />
          </MDBox>
          <MDBox>
            <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
              Task Description
            </MDTypography>
            <TextareaAutosize
              type="text"
              name="desc"
              minRows={3}
              style={{ width: '100%' }}
            />
          </MDBox>
          <MDBox>
            <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
              App
            </MDTypography>
            <Multiselect data={appOptions} isMulti={false} name="app" edit_data={selectedApp} />
          </MDBox>
          <MDBox>
            <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
              Staff to assign
            </MDTypography>
            <Multiselect data={staffOptions} isMulti={true} name="staff" />
          </MDBox>
          <MDBox>
            <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
              Points
            </MDTypography>
            <MDInput placeholder="Points" name="points" fullWidth />
          </MDBox>
          <MDBox>
            <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
              Status
            </MDTypography>
            <Multiselect data={statusOptions} isMulti={false} name="status" />
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
              Add
            </MDButton>
          </MDBox>
        </MDBox>
      </MDModal>
    )
  }
  const closeAddProduct = () => {
    setOpenAddProduct(false)
  }
  return (
    <>
      <MDButton color="white" variant="contained" onClick={handlemodal}>
        Create
      </MDButton>
      <AddProduct open={openAddProduct} onClose={closeAddProduct} />
    </>
  )
}

export default CreateModal
