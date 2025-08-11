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
import Grid from '@mui/material/Grid'

// Material Dashboard 2 React components
import MDBox from 'components/MDBox'

// Material Dashboard 2 React examples

import MasterCard from 'examples/Cards/MasterCard'
import DefaultInfoCard from 'examples/Cards/InfoCards/DefaultInfoCard'

// card page components
import { useEffect, useState } from 'react'
import { useAppServices } from 'hook/services'
import { useAgencyInfo } from 'context/agency'
import PaymentMethod from '../PaymentMethod'
import Invoices from '../Invoice'
// import cardInformation from './components/cardInformation'
// import Transactions from './components/Transactions'

function Card_details() {
  const [agency] = useAgencyInfo()
  const AppService = useAppServices()

  const [paymentMethods, setPaymentMethods] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [customer, setCustomer] = useState({})
  const [total_locations, setTotalLocations] = useState(0)
  const [primaryCard, setPrimaryCard] = useState({})

  // console.log(subscriptions)

  const getPaymentMethods = async () => {
    const { response } = await AppService.agency.get_payment_methods({
      query: `customer_id=${agency.stripe?.customer_id}`,
    })

    const getPrimaryCard = () =>
      response.data.find(
        (item) => item.id == response.customer.invoice_settings?.default_payment_method
      )

    if (response) {
      setPaymentMethods(response.data)
      setPrimaryCard(getPrimaryCard())
      setCustomer(response.customer)
    }
  }

  const getSubscriptions = async () => {
    const { response } = await AppService.agency.subscriptions({
      query: `_id=${agency._id}`,
    })

    if (response) {
      setSubscriptions(response.data.subscriptions)
      setTotalLocations(response.data.total_locations)
    }
  }

  const onLoad = () => {
    getPaymentMethods()
    getSubscriptions()
  }

  useEffect(onLoad, [])

  // console.log(primaryCard)

  return (
    <MDBox mt={8}>
      <MDBox mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Grid container justifyContent="center" spacing={3}>
              <Grid item xs={12} xl={6}>
                <MDBox maxWidth={350}>
                  <MasterCard
                    number={`************${primaryCard.card?.last4 || '****'}`}
                    holder={primaryCard.billing_details?.name || 'N/A'}
                    expires={`${primaryCard.card?.exp_month || '**'}/${
                      primaryCard.card?.exp_year.toString().substr(2) || '**'
                    }`}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} xl={3}>
                <DefaultInfoCard
                  icon="account_balance_wallet"
                  title="Basic"
                  description="Belong Interactive"
                  value={subscriptions[0] ? `$${subscriptions[0].plan.amount / 100} / mo` : 'N/A'}
                />
              </Grid>
              <Grid item xs={12} md={6} xl={3}>
                <DefaultInfoCard
                  icon="network_check"
                  title="Metered"
                  description={`${total_locations} Locations`}
                  value={subscriptions[1] ? `$${subscriptions[1].plan.amount / 100} / mo` : 'N/A'}
                />
              </Grid>
              <Grid item xs={12}>
                <PaymentMethod
                  paymentMethodState={{ paymentMethods, setPaymentMethods }}
                  customerState={{ customer, setCustomer }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Invoices />
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  )
}

export default Card_details
