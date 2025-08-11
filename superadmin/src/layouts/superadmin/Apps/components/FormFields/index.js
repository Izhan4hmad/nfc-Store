import MDButton from 'components/MDButton'
import React, { useEffect, useState } from 'react'
import MDModal from 'components/MDModal'
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import { DeleteForever, Edit } from '@mui/icons-material'
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
import EditIcon from '@mui/icons-material/Edit'
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 'auto',
  maxHeight: '80vh',
  overflow: 'auto',
  bgcolor: 'background.paper',
  border: '2px  #000',
  boxShadow: 24,
  p: 4,
}
const FormFields = ({ data, handleRefresh }) => {
  const uploadImage = useUploadImage()
  const [openAddProduct, setOpenAddProduct] = useState(false)
  const AppService = useAppServices()
  const [user] = useUserInfo()
  var axios = require('axios')
  const types = [
    {
      label: 'Workflow',
      value: 'workflow app',
    },
    {
      label: 'Funnel',
      value: 'funnel app',
    },
    {
      label: 'Both',
      value: 'workflow & funnel app',
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
  const type = [
    {
      label: 'Basic',
      value: 'basic',
    },
    {
      label: 'Api key',
      value: 'apikey',
    },
    // {
    //   label: 'Client ID / Clien Secret',
    //   value: 'dual_api_keys',
    // },
    // {
    //   label: 'O Auth',
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

  // useEffect(async () => { console.log(data, 'data') }, [])
  function AddProduct({ open, onClose }) {
    const [processing, setProcessing] = useState(false)

    const handleSubmit = async (e) => {
      e.preventDefault()
      const configration = {
        fields: JSON.parse(e.target.configration_fields.value),
      }

      const payload = {
        _id: data._id,
        configration,
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
    function CreateFields() {
      const [fields, setFields] = useState(data?.configration?.fields || [])
      const [addfield, setAddfield] = useState(false)
      const [fieldIndex, setfieldIndex] = useState(null)
      const [refresh, setrefresh] = useState(false)
      const [label, setlabel] = useState('')
      const [helpingText, setHelpingText] = useState('')
      const [name, setName] = useState('')
      const handleField = () => {
        const data = {
          label: label,
          name: name,
          helpingText: helpingText,
        }
        if (fieldIndex != null) {
          const temp_fields = fields
          temp_fields[fieldIndex] = data
          setFields(temp_fields)
        } else {
          setFields([...fields, data])
        }
        setlabel('')
        setHelpingText('')
        setName('')
        setfieldIndex(null)
        setAddfield(false)
      }
      const handleEdit = (data, index) => {
        setfieldIndex(index)
        setlabel(data.label)
        setName(data.name)
        setHelpingText(data.helpingText)
        setAddfield(true)
      }
      const handleDelete = (index) => {
        // console.log(index)
        const temp_fields = fields
        temp_fields.splice(index, 1)
        setFields(temp_fields)
        setrefresh(!refresh)
      }
      return (
        <>
          {addfield ? (
            <MDBox>
              <MDBox>
                <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                  Field Label
                </MDTypography>
                <MDInput
                  value={label}
                  onChange={(e) => setlabel(e.target.value)}
                  label="Field Label"
                  placeholder="Field Label"
                  fullWidth
                />
              </MDBox>
              <MDBox>
                <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                  Field Helping Text
                </MDTypography>
                <MDInput
                  value={helpingText}
                  onChange={(e) => setHelpingText(e.target.value)}
                  label="Field Helping Text"
                  placeholder="Field Helping Text"
                  fullWidth
                />
              </MDBox>
              <MDBox>
                <MDTypography variant="button" sx={{ fontSize: '14px', fontWeight: '500' }} mb={1}>
                  Field Value
                </MDTypography>
                <MDInput
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  label=" Field Name"
                  placeholder=" Field Name"
                  fullWidth
                />
              </MDBox>
              <MDBox mt={3}>
                <MDButton
                  variant="gradient"
                  color="info"
                  type="button"
                  fullWidth
                  onClick={handleField}
                >
                  {fieldIndex != null ? 'Edit' : 'Add'}
                </MDButton>
              </MDBox>
            </MDBox>
          ) : (
            <MDBox>
              {fields.length ? (
                <>
                  {fields.map((field, index) => (
                    <MDBox mt={1}>
                      <MDTypography
                        variant="button"
                        sx={{ fontSize: '14px', fontWeight: '500' }}
                        mb={1}
                      >
                        {field.label}
                      </MDTypography>
                      <MDBox display="flex" alignItems="center" gap={1}>
                        <MDInput disabled label={field.label} placeholder={field.label} fullWidth />
                        <EditIcon
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleEdit(field, index)}
                        />
                        <DeleteForever
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleDelete(index)}
                        />
                      </MDBox>
                    </MDBox>
                  ))}
                </>
              ) : (
                <MDTypography
                  width="100%"
                  variant="button"
                  sx={{ fontSize: '14px', fontWeight: '500', textAlign: 'center' }}
                  mb={1}
                >
                  no field yet
                </MDTypography>
              )}
              <MDBox mt={3}>
                <MDButton
                  variant="gradient"
                  color="info"
                  type="button"
                  fullWidth
                  onClick={() => setAddfield(true)}
                >
                  Add Field
                </MDButton>
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
                  Save
                </MDButton>
              </MDBox>
            </MDBox>
          )}
          <input type="hidden" name="configration_fields" value={JSON.stringify(fields)} />
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
              Fields
            </MDTypography>
            <CreateFields />
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
        color={data?.configration ? 'success' : 'info'}
        variant="contained"
        onClick={handlemodal}
      >
        Add Fields
      </MDButton>
      <AddProduct open={openAddProduct} onClose={closeAddProduct} />
    </>
  )
}

export default FormFields
