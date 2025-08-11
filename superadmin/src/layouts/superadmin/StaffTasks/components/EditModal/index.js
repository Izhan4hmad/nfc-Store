import MDButton from 'components/MDButton'
import React, { useState } from 'react'
import MDModal from 'components/MDModal'
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import {
  TextareaAutosize,
} from '@mui/material'
import { useAppServices } from 'hook/services'
import MDInput from 'components/MDInput'
import Multiselect from '../CreateModal/components/Multiselect'

const EditModal = ({ staff, apps, handleRefresh, data }) => {
  const [openAddProduct, setOpenAddProduct] = useState(false)
  const AppService = useAppServices()

  const handlemodal = () => {
    setOpenAddProduct(true)
  }
  function AddProduct({ open, onClose }) {
    const [processing, setProcessing] = useState(false)

    const handleSubmit = async (e) => {
      e.preventDefault()

      const staff = JSON.parse(e.target.staff.value);
      const app = JSON.parse(e.target.app.value);

      const { response } = await AppService.tasks.update({
        payload: {
          _id: data._id,
          name: e.target.name.value,
          desc: e.target.desc.value,
          app_id: app.value,
          staff: staff?.map(item => item.value),
          points: e.target.points.value,
          status: JSON.parse(e.target.status.value)
        }
      })

      if (response) {
        setProcessing(false)
        onClose()
        handleRefresh()
      }
    }

    const appOptions = apps?.map(item => ({
      label: item?.name,
      value: item?._id,
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

    return (
      <MDModal open={open} onClose={onClose} width={440}>
        <MDBox component="form" onSubmit={handleSubmit} role="form" sx={style}>
          <MDTypography variant="h5" mb={2}>
            Update Task
          </MDTypography>

          <MDBox>
            <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
              Task Name
            </MDTypography>
            <MDInput placeholder="Name" name="name" fullWidth defaultValue={data?.name} />
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
              defaultValue={data?.desc}
            />
          </MDBox>
          <MDBox>
            <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
              App
            </MDTypography>
            <Multiselect data={appOptions} edit_data={{ label: data?.app_name, values: data?.app_id }} isMulti={false} name="app" />
          </MDBox>
          <MDBox>
            <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
              Staff to assign
            </MDTypography>
            <Multiselect data={staffOptions} edit_data={data?.staff?.map(item => ({ label: item?.username, value: item?._id }))} isMulti={true} name="staff" />
          </MDBox>
          <MDBox>
            <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
              Points
            </MDTypography>
            <MDInput placeholder="Points" name="points" type="number" fullWidth defaultValue={data?.points} />
          </MDBox>
          <MDBox>
            <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
              Status
            </MDTypography>
            <Multiselect data={statusOptions} edit_data={data?.status} isMulti={false} name="status" />
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
              Edit
            </MDButton>
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
      <MDButton color="info" variant="contained" onClick={handlemodal}>
        Edit
      </MDButton>
      <AddProduct open={openAddProduct} onClose={closeAddProduct} data={data} />
    </>
  )
}

export default EditModal
