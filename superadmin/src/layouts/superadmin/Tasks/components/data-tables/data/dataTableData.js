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
  console.log(tasks, "tasks")
  const [ghlFeatures, setGhlFeatures] = useState([])
  const [team, setTeam] = useState([])
  const [tags, setTags] = useState([])
  const [jobs, setJobs] = useState([])
  const allowedRoles = ['superadmin', 'manager'];
  console.log(staff, "staff")

  const getTags = async () => {
    const { response } = await AppService.team_tags.get({
      toaster: false,
    })
    if (response) {
      setTags(response.data)
    } else {
      setTags([])
    }
  }

  const getGhlFeatures = async () => {
    const { response } = await AppService.ghl_features.get({
      toaster: false,
    })
    if (response) {
      setGhlFeatures(response.data)
    } else {
      setGhlFeatures([])
    }
    // setLoader(false)
  }

  const getTEam = async () => {
    const { response } = await AppService.team.get({})
    if (response) {
      setTeam(response.data)
      console.log(response.data,"team data")
    } else {
      setTeam([])
    }
    // setLoader(false)
  }




  const getApps = async () => {
    const { response, error } = await AppService.app.superadmin_apps()

    if (response) {
      setApps(response?.data);
    }
  }

  const getTasks = async () => {
    const { response, error } = await AppService.tasks.get()
    console.log(response, "ali")
    if (response) {
      setTasks(response?.task);
    }
  }

  const getStaff = async () => {
    const { response } = await AppService.user.GetTeam({
      query: `role=${Roles.SUPERADMIN}&agency_id=${agency._id}`,
      toaster: false,
    })
    if (response) {
      setStaff(response.data)
    } else {
      setStaff([])
    }
    setloader(false)
  }
  const getJobs = async () => {
    const { response } = await AppService.staff_job.get()
    // console.log(response, 'request_app')
    if (response) {
      setJobs(response.data)
    } else {
      setJobs([])
    }
    setloader(false)
  }
  const onLoad = () => {
    getStaff()
    getTasks()
    getJobs()
    getTags()
    getTEam()
    getGhlFeatures()
  }
  const handleDelete = async (id) => {
    const { response } = await AppService.tasks.delete({
      query: `_id=${id}`
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
    ghlFeatures,
    team,
    tags,
    jobs,
    dataTableData: {
      columns: [
        { Header: 'Task', accessor: 'name' },
        { Header: 'Description', accessor: 'desc' },
        { Header: 'Points', accessor: 'points' },
        { Header: 'Staff', accessor: 'staff' },
        { Header: 'App', accessor: 'app_id' },
        { Header: 'Status', accessor: 'status' },
        { Header: 'Secret Note', accessor: 'secret_note' },
        { Header: 'Team', accessor: 'team' },
        { Header: 'Staff Tag', accessor: 'staff_tag' },
        { Header: 'Jobs', accessor: 'jobs' },
        { Header: 'GHL Features', accessor: 'ghl_features' },
        { Header: 'Action', accessor: 'action' },


      ],

      rows: tasks?.map((data) => ({
        name: data.name,
        desc: data.desc ? `${data.desc.replace(/<[^>]+>/g, "").substring(0, 50)}...` 
    : "",
        points: data.points,
        staff: data?.staff?.map(item => item?.label || item?.username).join(', '),
        app_id: data?.app_id,
        status: data?.status?.label,
        secret_note: data?.secret_note,
        team: data?.team?.map(item => item?.label || item?.name).join(', '),
        staff_tag: data?.staff_tag?.map(item => item?.label || item?.name).join(', '),
        jobs: data?.jobs?.map(item => item?.label || item?.name).join(', '),
        ghl_features: data?.ghl_features?.map(item => item?.label || item?.name).join(', '),
        action: (
          <MDBox>
            <EditModal staff={staff} tasks={tasks} ghlFeatures={ghlFeatures} team={team} apps={apps} tags={tags} jobs={jobs} data={data} handleRefresh={onLoad} />
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
