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
import Editor from '../../editor'
import Multiselect from './components/Multiselect'

const CreateModal = ({ appData, handleRefresh, events }) => {
  const uploadImage = useUploadImage()
  const { app_id } = useParams
  const [openAddProduct, setOpenAddProduct] = useState(false)
  const AppService = useAppServices()
  const [user] = useUserInfo()
  var axios = require('axios')
  const handlemodal = () => {
    setOpenAddProduct(true)
  }
  const Types = [
    {
      label: 'External',
      value: 'external',
    },
    {
      label: 'Internal',
      value: 'internal',
    },
  ]
  useEffect(async () => {}, [])
  function AddProduct({ open, onClose }) {
    const [processing, setProcessing] = useState(false)
    const [editor, setEditor] = useState(null)

    const handleSubmit = async (e) => {
      e.preventDefault()
      setProcessing(true)
      const type = JSON.parse(e.target.type.value)
      const videpdata = {
        event: JSON.parse(e.target.event.value),
        type: type,
        url: type.value == 'external' ? e.target.url.value : null,
        key: type.value == 'internal' ? e.target.key.value : null,
      }
      const payload = {
        _id: appData._id,
        events: [...appData.events, videpdata],
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
    function ModalBody() {
      const [Type, setType] = useState('')
      return (
        <>
          <MDBox sx={{ fontSize: '15px' }}>
            <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
              Event
            </MDTypography>
            <Multiselect data={events} edit_data={[]} isMulti={false} name="event" />
          </MDBox>
          <MDBox sx={{ fontSize: '15px' }}>
            <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
              Type
            </MDTypography>
            <Multiselect
              data={Types}
              edit_data={[]}
              isMulti={false}
              name="type"
              setType={setType}
            />
          </MDBox>
          {Type == 'internal' && (
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                Key
              </MDTypography>
              <MDInput label="key" name="key" fullWidth />
            </MDBox>
          )}
          {Type == 'external' && (
            <MDBox>
              <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                url
              </MDTypography>
              <MDInput label="url" name="url" fullWidth />
            </MDBox>
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
              App Event
            </MDTypography>
            <ModalBody />

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
        Create Event
      </MDButton>
      <AddProduct open={openAddProduct} onClose={closeAddProduct} />
    </>
  )
}

export default CreateModal
