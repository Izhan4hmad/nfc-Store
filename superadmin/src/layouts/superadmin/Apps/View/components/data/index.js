/**
=========================================================
* MD UI Dashboard PRO React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/MD-ui-dashboard-pro-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the MDware.
*/
import MDBox from 'components/MDBox'
import MDButton from 'components/MDButton'
import { useAppServices } from 'hook/services'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import EditTriggerModel from '../Modals/TriggerModal/EditTriggerModel'
import EditActionModel from '../Modals/ActionModal/EditActionModel'

export default function DataTableData() {
  const AppService = useAppServices()
  const params = useParams()
  const navigate = useNavigate()
  const [appData, setappData] = useState({})
  const [List, setList] = useState([])
  const [events, setEvents] = useState([])
  const [products, setproducts] = useState([])
  const [Categories, setCategories] = useState([])
  const [loader, setloader] = useState(true)
  // console.log('app data', appData)
  const getApp = async () => {
    const { response, error } = await AppService.app.filter({
      query: `_id=${params.app_id}`,
    })
    // console.log(response, 'response')
    if (response) {
      // setList(response.data)
      setappData(response.data)
      const event_data = response.events.map((event) => ({
        ...event,
        label: event.name,
        value: event._id,
      }))
      setEvents(event_data)
      setloader(false)
    } else {
      setList([])
      setloader(false)
    }
  }
  const onLoad = () => {
    getApp()
  }
  const handleImageDelete = async (index) => {
    const data = appData.images
    data.splice(index, 1)
    const payload = {
      _id: appData._id,
      images: [...data],
    }
    // console.log(payload)

    const { response } = await AppService.app.update({
      payload: payload,
    })
    if (response) onLoad()
  }
  const handleVideoDelete = async (index) => {
    const data = appData.videos
    data.splice(index, 1)
    const payload = {
      _id: appData._id,
      videos: [...data],
    }
    // console.log(payload)

    const { response } = await AppService.app.update({
      payload: payload,
    })
    if (response) onLoad()
  }
  const handleTriggerDelete = async (index) => {
    const data = appData.triggers
    data.splice(index, 1)
    const payload = {
      _id: appData._id,
      triggers: [...data],
    }
    // console.log(payload)

    const { response } = await AppService.app.update({
      payload: payload,
    })
    if (response) onLoad()
  }
  const handleActionsDelete = async (index) => {
    const data = appData.actions
    data.splice(index, 1)
    const payload = {
      _id: appData._id,
      actions: [...data],
    }
    // console.log(payload)

    const { response } = await AppService.app.update({
      payload: payload,
    })
    if (response) onLoad()
  }
  const handleDocDelete = async (index) => {
    const data = appData.docs
    data.splice(index, 1)
    const payload = {
      _id: appData._id,
      docs: [...data],
    }
    // console.log(payload)

    const { response } = await AppService.app.update({
      payload: payload,
    })
    if (response) onLoad()
  }
  const handleEventDelete = async (index) => {
    const data = appData.events
    data.splice(index, 1)
    const payload = {
      _id: appData._id,
      events: [...data],
    }
    // console.log(payload)

    const { response } = await AppService.app.update({
      payload: payload,
    })
    if (response) onLoad()
  }
  useEffect(onLoad, [])
  return {
    loader: loader,
    appData: appData,
    events: events,
    handleRefresh: onLoad,
    ImageDataTableData: {
      columns: [
        { Header: 'name', accessor: 'name' },
        { Header: 'image', accessor: 'image' },
        { Header: 'Action', accessor: 'action' },
      ],

      rows: appData?.images?.map((data, index) => ({
        name: data.name,
        image: <img src={data.image} height={'50px'} />,
        action: (
          <MDBox>
            <MDButton
              variant="contained"
              color="error"
              size="small"
              sx={{ marginLeft: 2 }}
              onClick={() => handleImageDelete(index)}
            >
              Delete
            </MDButton>
          </MDBox>
        ),
      })),
    },
    VideoDataTableData: {
      columns: [
        { Header: 'name', accessor: 'name' },
        { Header: 'link', accessor: 'link' },
        { Header: 'Action', accessor: 'action' },
      ],

      rows: appData?.videos?.map((data, index) => ({
        name: data.name,
        link: data.link,
        action: (
          <MDBox>
            <MDButton
              variant="contained"
              color="error"
              size="small"
              sx={{ marginLeft: 2 }}
              onClick={() => handleVideoDelete(index)}
            >
              Delete
            </MDButton>
          </MDBox>
        ),
      })),
    },
    TriggerDataTableData: {
      columns: [
        { Header: 'name', accessor: 'name' },
        { Header: 'Action', accessor: 'action' },
      ],

      rows: appData?.triggers?.map((data, index) => ({
        name: data.name,
        action: (
          <MDBox>
            <MDButton
              variant="contained"
              color="error"
              size="small"
              sx={{ marginLeft: 2 }}
              onClick={() => handleTriggerDelete(index)}
            >
              Delete
            </MDButton>
            <EditTriggerModel
              editData={data}
              index={index}
              appData={appData}
              handleRefresh={onLoad}
            />
          </MDBox>
        ),
      })),
    },
    ActionDataTableData: {
      columns: [
        { Header: 'name', accessor: 'name' },
        { Header: 'Action', accessor: 'action' },
      ],

      rows: appData?.actions?.map((data, index) => ({
        name: data.name,
        action: (
          <MDBox>
            <MDButton
              variant="contained"
              color="error"
              size="small"
              sx={{ marginLeft: 2 }}
              onClick={() => handleActionsDelete(index)}
            >
              Delete
            </MDButton>
            <EditActionModel
              editData={data}
              index={index}
              appData={appData}
              handleRefresh={onLoad}
            />
          </MDBox>
        ),
      })),
    },
    DocDataTableData: {
      columns: [
        { Header: 'name', accessor: 'name' },
        { Header: 'Action', accessor: 'action' },
      ],

      rows: appData?.docs?.map((data, index) => ({
        name: data.name,
        action: (
          <MDBox>
            <MDButton
              variant="contained"
              color="error"
              size="small"
              sx={{ marginLeft: 2 }}
              onClick={() => handleDocDelete(index)}
            >
              Delete
            </MDButton>
          </MDBox>
        ),
      })),
    },
    EventDataTableData: {
      columns: [
        { Header: 'event', accessor: 'event' },
        { Header: 'Action', accessor: 'action' },
      ],

      rows: appData?.events?.map((data, index) => ({
        event: data.event.label,
        action: (
          <MDBox>
            <MDButton
              variant="contained"
              color="error"
              size="small"
              sx={{ marginLeft: 2 }}
              onClick={() => handleEventDelete(index)}
            >
              Delete
            </MDButton>
          </MDBox>
        ),
      })),
    },
  }
}
