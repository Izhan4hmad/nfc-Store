import MDButton from 'components/MDButton'
import AddBoxIcon from '@mui/icons-material/AddBox'
import React, { useEffect, useState } from 'react'
import MDModal from 'components/MDModal'
import MDInput from 'components/MDInput'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import env from 'config'
import { useRef } from 'react'

const Category_Modal = (props) => {
  const [openAddProduct, setOpenAddProduct] = useState(false)
  const BASE_URL = `${env.API_URL}/v1`

  useEffect(async () => {}, [])

  function AddProduct({ open, onClose, id, button, processing, handleSubmit, editname }) {
    // const [processing, setProcessing] = useState(false)

    const handleClick = async (e) => {
      e.preventDefault()
      handleSubmit(e.target.name.value)
      if (processing == false) {
        onClose()
      }
    }

    return (
      <MDModal open={open} onClose={onClose}>
        <MDBox>
          <MDTypography component="h1" mb={3} variant="h5">
            Theme Name
          </MDTypography>

          <MDBox component="form" onSubmit={handleClick} role="form" sx={{ width: 335 }}>
            <Grid item md={12}>
              <MDBox mb={1}>
                {props.id == undefined ? (
                  <MDInput type="name" label="Name" name="name" fullWidth />
                ) : (
                  <MDInput type="name" label="Name" name="name" fullWidth defaultValue={editname} />
                )}
              </MDBox>
            </Grid>

            <MDBox>
              <MDButton
                variant="gradient"
                color="info"
                type="submit"
                sx={{ mt: 4, mb: 1 }}
                fullWidth
                loading={processing}
                disabled={processing}
              >
                Confirm to {props.id == undefined ? 'save' : 'update'}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </MDModal>
    )
  }
  const closeAddProduct = (subscription) => {
    // if (subscription?._id)
    setOpenAddProduct(false)
  }
  return (
    <>
      <MDButton
        variant="gradient"
        color="info"
        className={props.button ? 'button' : ''}
        type="submit"
        sx={{ mt: 1, mb: 2 }}
        onClick={() => setOpenAddProduct(true)}
      >
        Click to {props.id == undefined ? 'save' : 'update'}
      </MDButton>
      <AddProduct
        open={openAddProduct}
        onClose={closeAddProduct}
        id={'props?.id'}
        button={props?.button}
        processing={props.processing}
        handleSubmit={props.handleSubmit}
        editname={props.editname}
      />
    </>
  )
}

export default Category_Modal
