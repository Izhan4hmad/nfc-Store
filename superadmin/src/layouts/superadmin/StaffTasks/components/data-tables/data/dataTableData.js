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
import { useAgencyInfo } from 'context/agency'
import { Roles } from 'enums/user'
import { useUserInfo } from 'context/user'

export default function DataTableData() {
  const [user] = useUserInfo()
  const AppService = useAppServices()
  const [staff, setStaff] = useState([])
  const [loader, setloader] = useState(true)
  const [agency] = useAgencyInfo()
  const [apps, setApps] = useState();
  const [tasks, setTasks] = useState([]);
  const allowedRoles = ['superadmin', 'manager'];

  const getApps = async () => {
    const { response, error } = await AppService.app.superadmin_apps()

    if (response) {
      setApps(response?.data);
    }
  }

  const getTasks = async () => {
    const { response, error } = await AppService.tasks.get()
    if (response) {
      setTasks(response?.data);
    }
  }

  const getStaff = async () => {
    const { response } = await AppService.user.GetTeam({
      query: `role=${Roles.SUPERADMIN}&agency_id=${agency._id}`,
      toaster: false,
    })
    // console.log(response, 'request_app')
    if (response) {
      setStaff(response.data)
    } else {
      setStaff([])
    }
    setloader(false)
  }
  const onLoad = () => {
    getStaff()
    getTasks()
  }
  const handleDelete = async (id) => {
    const { response } = await AppService.tasks.delete({
      id: id,
    })
    if (response) onLoad()
  }

  useEffect(getApps, [])
  useEffect(onLoad, [])
  return {
    loader: loader,
    handleRefresh: onLoad,
    apps,
    staff,
    tasks,
    dataTableData: {
      columns: [
        { Header: 'Task', accessor: 'name' },
        { Header: 'Staff', accessor: 'staff' },
        { Header: 'App', accessor: 'app' },
        { Header: 'Status', accessor: 'status' },
        { Header: 'Action', accessor: 'action' },
      ],

      rows: tasks?.map((data) => ({
        name: data.name,
        staff: data?.staff?.map(item => item?.username).join(", "),
        app: data?.app_name,
        status: data?.status?.label,
        action: (
          <MDBox>
            <EditModal staff={staff} apps={apps} data={data} handleRefresh={onLoad} />
            {user?.roles?.some((role) => allowedRoles.includes(role)) && (
              <MDButton
                variant="contained"
                color="error"
                size="small"
                sx={{ marginLeft: 2 }}
                onClick={() => handleDelete(data._id)}
              >
                Delete
              </MDButton>
            )}
          </MDBox>
        ),
      })),
    },
  }
}
