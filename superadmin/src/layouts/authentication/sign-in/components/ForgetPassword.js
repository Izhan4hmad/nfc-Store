import EditIcon from '@mui/icons-material/Edit';
import MDButton from 'components/MDButton'
import Button from '@mui/material/Button'
import AddBoxIcon from '@mui/icons-material/AddBox'
import React, { useEffect, useState } from 'react'
import MDModal from 'components/MDModal'
import { useRef } from 'react';
import Grid from '@mui/material/Grid'
import Icon from '@mui/material/Icon'
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import localforage from 'localforage'


const ForgetPassword = (props) => {
  const [openAddProduct, setOpenAddProduct] = useState(false)
  const [account_type, setaccount_type] = useState('')


  // const stripePromise = loadStripe('pk_live_51Lyvl5IFQJPuAPurroNLnypochHdFrbCoy73ual8nIuGF3RtwlgGHUiPZDubxc4FpC7gvb3LT0XmmIDAT4gNCiHY00vn2KVEQw')
  const inputRef = useRef();

  var axios = require('axios')

  const handlemodal = () => {
    setOpenAddProduct(true)

  }
  useEffect(async () => {
  }, [])
  function AddProduct({ open, onClose }) {

    const [processing, setProcessing] = useState(false)

   
    return (
      <MDModal open={open} onClose={onClose} >
        <MDBox sx={{ width: 500,height:200 }}>
        <iframe 
          src="https://api.fixmyonline.com/widget/form/vgKShMWY8LOXVc58KVfb" 
          style={{width:'100%',height:'100%'}}
          id="inline-vgKShMWY8LOXVc58KVfb" 
        data-layout="{'id':'INLINE'}"
        data-trigger-type="alwaysShow"
        data-trigger-value=""
        data-activation-type="alwaysActivated"
        data-activation-value=""
        data-deactivation-type="neverDeactivate"
        data-deactivation-value=""
        data-form-name="Forgot pass word identifier"
        data-height="450"
        data-layout-iframe-id="inline-vgKShMWY8LOXVc58KVfb"
        data-form-id="vgKShMWY8LOXVc58KVfb"
      >
        </iframe>
        <script src="https://api.fixmyonline.com/js/form_embed.js"></script>
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
 <MDTypography variant="body2" sx={{textDecoration:'underline',cursor:'pointer'}} 
    onClick={handlemodal}
    >
                  forgot password
                </MDTypography>
      

      <AddProduct open={openAddProduct} onClose={closeAddProduct} />

    </>
  )
}

export default ForgetPassword