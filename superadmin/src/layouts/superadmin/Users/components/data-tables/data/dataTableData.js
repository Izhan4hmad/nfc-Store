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
import { useAppServices } from 'hook/services'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DataTableData() {
  const AppService = useAppServices()
  const navigate = useNavigate()
  const [List, setList] = useState([])
  const [loader, setloader] = useState(true)

  const getAppUsers = async () => {
    const { response } = await AppService.appusers.get()
    // console.log(response, 'getAppUsers')
    if (response) {
      setList(response.data)
      setloader(false)
    } else {
      setList([])
      setloader(false)
    }
  }
  const onLoad = () => {
    getAppUsers()
  }

  useEffect(onLoad, [])
  return {
    loader: loader,
    handleRefresh: onLoad,
    dataTableData: {
      columns: [
        { Header: 'Name', accessor: 'name' },
        { Header: 'email', accessor: 'email' },
        { Header: 'User Id', accessor: 'user_id' },
        { Header: 'companyId', accessor: 'company_id' },
        { Header: 'LocationId', accessor: 'location_id' },
      ],

      rows: List.map((data) => ({
        user_id: data?.GHLuserId,
        company_id: data?.CompanyId,
        location_id: data?.Locationid,
        name: data?.Name,
        email: data?.email,
      })),
    },
  }
}
