import PageLayout from 'examples/LayoutContainers/PageLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React from 'react'
import { Grid } from '@mui/material'
import Loader from 'examples/Loader'
import { useEffect, useState } from 'react'
import { useAppServices } from 'hook/services'
import MDButton from 'components/MDButton'
import { useNavigate, useParams } from 'react-router-dom'
import './style.css'
import PlansComponent from './components/pages/PlansComponent'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import PlansEditModal from './components/Modals/Plans/Edit'

function Plans() {
  const navigate = useNavigate()
  const { app_id } = useParams()
  // const [agency] = useAgencyInfo()
  const Service = useAppServices()

  const [Conjo, setConjo] = useState([])
  const [data, setdata] = useState([])
  const [agency, setAency] = useState({})
  const [processing, setProcessing] = useState(true)
  const [copy, setCopy] = useState(false)
  const copyToClipboard = (url) => {
    const text = url

    // Create a temporary textarea element to hold the text
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'

    // Append the textarea to the body
    document.body.appendChild(textarea)

    // Select the text inside the textarea
    textarea.select()

    // Execute the copy command
    document.execCommand('copy')
    setCopy(true)
    // Remove the textarea from the DOM
    document.body.removeChild(textarea)

    setTimeout(() => {
      setCopy(false)
    }, 2000)
  }
  const columns = [
    {
      name: 'Name',
      options: {
        filter: false,
      },
    },
    {
      name: 'Price',
      options: {
        filter: false,
      },
    },
    {
      name: 'Plan Id',
      options: {
        filter: false,
      },
    },
    {
      name: 'Action',
      options: {
        filter: false,
      },
    },
  ]

  const options = {
    filter: false,
    download: false,
    print: false,
    viewColumns: false,
    selectableRows: 'none',
    filterType: 'multiselect',
    responsive: 'standard',
  }
  const getData = async () => {
    const { response } = await Service.app.get_single_app({
      query: `_id=${app_id}`,
    })
    // console.log(response, 'response')
    if (response) {
      var tabel_data = []
      let plans_data = []
      if (response.data?.plans) {
        plans_data = response.data?.plans
      }
      plans_data.forEach((element, index) => {
        const temp = [
          element.name,
          element.price,
          element.plan_id,
          <>
            <PlansEditModal
              handleChange={getData}
              plans={plans_data}
              editData={element}
              index={index}
            />
            <MDButton
              variant="contained"
              color="error"
              size="small"
              sx={{ marginLeft: '4px' }}
              onClick={() => hadleDelete(index)}
            >
              Delete
            </MDButton>
          </>,
        ]
        tabel_data.push(temp)
      })
      setConjo(tabel_data)
      setdata(plans_data)
      setProcessing(false)
    } else {
      setProcessing(false)
    }
  }
  const onLoad = () => {
    getData()
  }
  useEffect(async () => {
    onLoad()
  }, [])
  const hadleDelete = async (index) => {
    const plans_data = data
    if (index > -1) {
      plans_data.splice(index, 1)
    }
    const payload = {
      plans: plans_data,
      _id: app_id,
    }
    const { response } = await Service.app.update({ payload })
    if (response) {
      getData()
    }
  }

  return (
    <DashboardLayout>
      {processing ? (
        <Loader />
      ) : (
        <>
          <PlansComponent
            onLoad={onLoad}
            Conjo={Conjo}
            plans={data}
            columns={columns}
            options={options}
          />
        </>
      )}
    </DashboardLayout>
  )
}

export default Plans
