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
import EditModal from '../../EditModal'
import CreateModal from '../../CreateModal'

export default function DataTableData() {
  const AppService = useAppServices()
  const [list, setList] = useState([])
  const [loader, setLoader] = useState(true)

  const getAppTypes = async () => {
    const { response } = await AppService.superadmin_webhook.get({
      toaster: false,
    })
    if (response) {
      setList(response.data)
    } else {
      setList([])
    }
    setLoader(false)
  }

  const onLoad = () => {
    getAppTypes()
  }

  const handleDelete = async (id) => {
    const { response } = await AppService.superadmin_webhook.delete({
      query: `_id=${id}`,
    })
    if (response) onLoad()
  }

  useEffect(onLoad, [])
  const truncateText = (text, wordLimit = 8) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
  };

  return {
    loader: loader,
    handleRefresh: onLoad,
    dataTableData: {
      columns: [
        { Header: 'Name', accessor: 'name' },
        { Header: 'Description', accessor: 'description' },
        { Header: 'Type', accessor: 'type' },
        { Header: 'User Point', accessor: 'user_point' },
        { Header: 'Location Point', accessor: 'location_point' },
        { Header: 'Agency Point', accessor: 'agency_point' },
        { Header: 'Action', accessor: 'action' },
      ],
      rows: list.map((data) => ({
        name: data.name,
        description: data.description,
        type: data.type,
        user_point: data.user_point,
        location_point: data.location_point,
        agency_point: data.agency_point,
        action: (
          <MDBox>
            <EditModal data={data} handleRefresh={onLoad} />
            <MDButton
              variant="contained"
              color="error"
              size="small"
              sx={{ marginLeft: 2 }}
              onClick={() => handleDelete(data._id)}
            >
              Delete
            </MDButton>
          </MDBox>
        ),
      })),
    },
  }
}
