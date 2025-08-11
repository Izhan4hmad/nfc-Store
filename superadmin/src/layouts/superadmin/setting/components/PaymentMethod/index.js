/* eslint-disable react/prop-types */
/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Icon from '@mui/material/Icon'
import Tooltip from '@mui/material/Tooltip'

// Material Dashboard 2 React components
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import MDButton from 'components/MDButton'

// Images
import masterCardLogo from 'assets/images/logos/mastercard.png'
import visaLogo from 'assets/images/logos/visa.png'

// Material Dashboard 2 React context
import { useMaterialUIController } from 'context'
import MDModal from 'components/MDModal'
import { useState } from 'react'
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import env from 'config'
// import MDInput from 'components/MDInput'
// import { TextField } from '@mui/material'
import StripeInput from '../StripeInput'
import MDInput from 'components/MDInput'
import { CircularProgress, Switch } from '@mui/material'
import { useAppServices } from 'hook/services'
import { useAgencyInfo } from 'context/agency'
import { useUserInfo } from 'context/user'
import { useFormik } from 'formik'
import localforage from 'localforage'
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined'
import GradeIcon from '@mui/icons-material/Grade'
import React, { useEffect } from 'react'

const stripePromise = loadStripe(
  'pk_live_51L3PMJIWkKHgmagg7G4j2VF4fxZSKUrqUKDU3k2tcT25SRcBU9AxUh3bHtW3UKNIZisAmiZ86xUC0LS9IV0JaK2u00bAmp135X'
)
function AddPaymentMethod({ open, onClose }) {
  const AppService = useAppServices()
  const [agency] = useAgencyInfo()
  const [user] = useUserInfo()
  const element = useElements()
  const stripe = useStripe()

  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [customer_id, setcustomer_id] = useState('')
  const [stripe_key, setstripe_key] = useState([])

  const initState = {
    name: '',
    make_default: false,
  }
  var axios = require('axios')

  useEffect(async () => {
    const localBrand = await localforage.getItem('brand')
    // console.log(localBrand.stripe.customer_id)
    setcustomer_id(localBrand.stripe.customer_id)
    axios
      .get('https://dev.api.snapshopstore.com/api/v1/agency/main_agency')
      .then(async function (response) {
        setstripe_key(response.data.data.data.stripe.publish_key)
        // console.log(response.data);
      })
      .catch(function (error) {
        // console.log(error);
      })
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    // var make_default = event.target.switch.checked;
    var name = event.target.name.value

    if (element == null) {
      return
    }
    const source = await stripe.createSource(element.getElement(CardElement))

    // 4848 7150 5203 7927

    // console.log(source)
    // console.log(error)
    // console.log(paymentMethod)
    const data = {
      customer_id: customer_id,
      name: name,
      email: 'admin@admin.com',
      make_default: 'make_default',
      paymentMethod: source,
      location_id: 'location_id',
      agency_id: 'agency_id',
      stripe_key: stripe_key,
    }
    // console.log(data)
    if (source.error) {
      // handleClose();
      // seterror(source.error.message)
    } else {
      //   axios.post('https://dev.api.snapshopstore.com/api/v1/snapshot/stripe/submit', { data }).then(async function (response) {
      //     console.log(response.data);
      //   // setmessage(response.data.message)
      //   // seterror('')
      //   // handleClose();
      // }).catch(function (error) {
      //   // handleClose();
      //   console.log(error.response);
      //   // setmessage('')
      //   // seterror(error.response.data.message)
      // });
    }
  }

  const formik = useFormik({
    initialValues: { ...initState },
    onSubmit: handleSubmit,
  })

  return (
    <MDModal open={open} onClose={onClose}>
      <MDBox component="form" onSubmit={handleSubmit} role="form">
        <MDInput
          fullWidth
          InputProps={{
            inputComponent: StripeInput,
            inputProps: {
              component: CardElement,
            },
          }}
        />
        <MDBox mt={2}>
          <MDInput
            label="Name"
            name="name"
            onChange={formik.handleChange}
            inputProps={{ onFocus: formik.handleBlur }}
            value={formik.values.name}
            error={formik.touched.name && formik.errors.name}
            helperText={formik.touched.name && formik.errors.name ? formik.errors.name : ''}
            success={formik.touched.name && !formik.errors.name}
            fullWidth
          />
        </MDBox>
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={3}
          lineHeight={1}
        >
          <MDTypography variant="h6">Make Primary</MDTypography>

          <Switch
            name="make_default"
            checked={formik.values.make_default}
            onChange={() =>
              formik.setValues({ ...formik.values, make_default: !formik.values.make_default })
            }
          />
        </MDBox>
        <MDButton
          variant="gradient"
          color="info"
          type="submit"
          loading={processing}
          disabled={processing || !formik.isValid}
          sx={{ mt: 4, mb: 1 }}
          fullWidth
        >
          Submit
        </MDButton>
        <MDTypography variant="button" color="error">
          {error}
        </MDTypography>
      </MDBox>
    </MDModal>
  )
}

function RemoveCardConfirmation({ open, onClose, paymentMethod, updateCardList }) {
  const AppService = useAppServices()

  const [processing, setProcessing] = useState(false)

  const removeCard = async () => {
    setProcessing(true)
    const { response } = await AppService.agency.payment_method_remove({
      toaster: true,
      payload: { payment_method_id: paymentMethod.id },
    })
    setProcessing(false)
    response && updateCardList()
  }

  return (
    <MDModal open={open} onClose={onClose}>
      <MDBox>
        <MDTypography>Are you sure you want to delete this payment method</MDTypography>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDButton
            variant="gradient"
            color="info"
            loading={processing}
            disabled={processing}
            sx={{ mt: 4, mb: 1, mr: 2 }}
            onClick={removeCard}
            fullWidth
          >
            Yes
          </MDButton>
          <MDButton
            variant="outlined"
            color="info"
            sx={{ mt: 4, mb: 1, ml: 2 }}
            onClick={onClose}
            fullWidth
          >
            Cancel
          </MDButton>
        </MDBox>
      </MDBox>
    </MDModal>
  )
}

function PaymentMethod({ paymentMethodState, customerState }) {
  const { paymentMethods, setPaymentMethods } = paymentMethodState
  const { customer, setCustomer } = customerState

  const [agency] = useAgencyInfo()
  const [controller] = useMaterialUIController()
  const { darkMode } = controller

  const [addPaymentMethod, setAddPaymentMethod] = useState(false)
  const [removeCard, setRemoveCard] = useState(false)
  const [processing, setProcessing] = useState(false)

  const AppService = useAppServices()

  const getPaymentMethods = async () => {
    const { response } = await AppService.agency.get_payment_methods({
      query: `customer_id=${agency.stripe?.customer_id}`,
    })
    if (response) {
      setPaymentMethods(response.data)
    }
  }

  const handleClose = () => {
    setAddPaymentMethod(false)
    getPaymentMethods()
  }

  const updateCardList = (idx) => {
    paymentMethods.splice(idx, 1)
    setPaymentMethods([...paymentMethods])
    setRemoveCard(false)
  }

  const MakePrimary = async (paymentMethod) => {
    setProcessing(true)
    const payload = {
      customer_id: agency.stripe?.customer_id,
      payment_method_id: paymentMethod.id,
    }

    const { response } = await AppService.agency.update_payment_methods({
      toaster: true,
      payload,
    })

    setProcessing(false)

    setCustomer(response.data)
  }

  return (
    <Card id="delete-account">
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          Payment Method
        </MDTypography>
        <MDButton onClick={() => setAddPaymentMethod(true)} variant="gradient" color="dark">
          <Icon sx={{ fontWeight: 'bold' }}>add</Icon>
          &nbsp;add new card
        </MDButton>
        <Elements stripe={stripePromise}>
          <AddPaymentMethod open={addPaymentMethod} onClose={handleClose} />
        </Elements>
      </MDBox>
      <MDBox p={2}>
        <Grid container spacing={3}>
          {paymentMethods.map((paymentMethod, idx) => (
            <Grid key={paymentMethod.id} item xs={12} md={6}>
              <MDBox
                borderRadius="lg"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={3}
                sx={{
                  border: ({ borders: { borderWidth, borderColor } }) =>
                    `${borderWidth[1]} solid ${borderColor}`,
                }}
              >
                <MDBox
                  component="img"
                  src={paymentMethod.card.brand == 'visa' ? visaLogo : masterCardLogo}
                  alt="master card"
                  width="10%"
                  mr={2}
                />
                <MDTypography variant="h6" fontWeight="medium">
                  ****&nbsp;&nbsp;****&nbsp;&nbsp;****&nbsp;&nbsp;{paymentMethod.card.last4}
                </MDTypography>
                {paymentMethod.id != customer.invoice_settings?.default_payment_method && (
                  <MDBox ml="auto" lineHeight={0} color={darkMode ? 'white' : 'dark'}>
                    <Tooltip title="Delete Card" placement="top">
                      <Icon
                        onClick={() => setRemoveCard(paymentMethod.id)}
                        sx={{ cursor: 'pointer' }}
                        fontSize="small"
                      >
                        delete
                      </Icon>
                    </Tooltip>
                    <RemoveCardConfirmation
                      open={removeCard == paymentMethod.id}
                      onClose={() => setRemoveCard()}
                      paymentMethod={paymentMethod}
                      updateCardList={() => updateCardList(idx)}
                    />
                  </MDBox>
                )}
                {paymentMethod.id != customer.invoice_settings?.default_payment_method ? (
                  <MDBox ml={1} lineHeight={0} color={darkMode ? 'white' : 'dark'}>
                    <Tooltip title="Make Primary" placement="top">
                      {processing ? (
                        <CircularProgress size={14} />
                      ) : (
                        <GradeOutlinedIcon
                          onClick={() => MakePrimary(paymentMethod)}
                          sx={{ cursor: 'pointer' }}
                          fontSize="small"
                        />
                      )}
                    </Tooltip>
                  </MDBox>
                ) : (
                  <MDBox ml="auto" lineHeight={0} color={darkMode ? 'white' : 'dark'}>
                    <Tooltip title="Primary Card" placement="top">
                      <GradeIcon fontSize="small" />
                    </Tooltip>
                  </MDBox>
                )}
              </MDBox>
            </Grid>
          ))}
        </Grid>
      </MDBox>
    </Card>
  )
}

export default PaymentMethod
