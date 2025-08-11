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
  TextField,
  TextareaAutosize,
} from '@mui/material'
import { useAppServices, useUploadImage } from 'hook/services'
import { useUserInfo } from 'context/user'
import FormField from 'components/FormField'
import MDInput from 'components/MDInput'
import { useParams } from 'react-router-dom'

const CreateModal = ({ appData, handleRefresh }) => {
  const uploadImage = useUploadImage()
  const { app_id } = useParams
  const [openAddProduct, setOpenAddProduct] = useState(false)
  const AppService = useAppServices()
  const [user] = useUserInfo()
  var axios = require('axios')
  const handlemodal = () => {
    setOpenAddProduct(true)
  }
  useEffect(async () => {}, [])
  function AddProduct({ open, onClose }) {
    const [processing, setProcessing] = useState(false)

    const handleSubmit = async (e) => {
      e.preventDefault()
      setProcessing(true)
      //   const image_response = await uploadImage({
      //     file: e.target.image.files[0],
      //     desiredPath: `app/logo/image`,
      //   })
      const videpdata = {
        name: e.target.name.value,
        description: e.target.description.value,
        link: e.target.link.value,
        // image: image_response.response.data,
      }
      const payload = {
        _id: appData._id,
        triggers: [...appData.triggers, videpdata],
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
    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      height: 'auto',
      overflow: 'auto',
      bgcolor: 'background.paper',
      border: '2px  #000',
      boxShadow: 24,
      p: 4,
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
              App Trigger
            </MDTypography>
            {/* <MDBox mb={2} ml={1} display="flex" alignItems="center">
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Button variant="contained" component="label" sx={{ color: '#fff' }}>
                                    Upload Image +
                                    <input hidden name="image" type="file" />
                                </Button>
                            </Stack>
                        </MDBox> */}
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
                Youtube Link
              </MDTypography>
              <MDInput label="Youtube Link" name="link" fullWidth />
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
        Create Trigger
      </MDButton>
      <AddProduct open={openAddProduct} onClose={closeAddProduct} />
    </>
  )
}

export default CreateModal
