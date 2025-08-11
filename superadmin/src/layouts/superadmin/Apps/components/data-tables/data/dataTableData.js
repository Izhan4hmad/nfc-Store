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
import { useNavigate } from 'react-router-dom'
import FreeAppModel from '../../FreeAppModel'
import FormFields from '../../FormFields'
import NestedApp from '../../NestedApp'
import Swal from 'sweetalert2'

export default function DataTableData() {
  const AppService = useAppServices()
  const navigate = useNavigate()
  const [List, setList] = useState([])
  const [products, setproducts] = useState([])
  const [Categories, setCategories] = useState([])
  const [loader, setloader] = useState(true)

  const getProducts = async () => {
    const { response } = await AppService.superadmin.getProducts({
      toaster: false,
    })
    // console.log(response, 'response')
    if (response) {
      var newArray = response.data.products.data.filter(function (item) {
        return item.active == true
      })
      const temp = []
      newArray.forEach((product) => {
        temp.push({
          label:
            (product.unit_amount / 100).toFixed(2) +
            (product.nickname ? ' ( ' + product.nickname + ' ) ' : '') +
            ' - ' +
            product.id,
          value:
            (product.unit_amount / 100).toFixed(2) +
            (product.nickname ? ' ( ' + product.nickname + ' ) ' : '') +
            ' - ' +
            product.id,
        })
      })
      // console.log(temp, 'temp')
      setproducts(temp)
    }
  }
  const getApps = async () => {
    const { response, error } = await AppService.app.get()
    // console.log(response, 'response')
    if (response) {
      getappVotes(response.data)
      // setList(response.data)
    } else {
      setList([])
      setloader(false)
    }
  }
  const getappVotes = async (data) => {
    const { response } = await AppService.vote.getappvotes()
    // console.log(response, 'getappVotes')
    var temp_apps = data
    if (response) {
      for (let index = 0; index < response.data.length; index++) {
        const element = response.data[index]
        var newArray = temp_apps.filter(function (item) {
          return element.app.app_id == item.app_id
        })
        const indexToRemove = temp_apps.findIndex((item) => element.app.app_id === item.app_id)
        // console.log(indexToRemove, 'indexToRemove')
        if (indexToRemove !== -1) {
          temp_apps.splice(indexToRemove, 1)
        }
        if (newArray[0]) {
          temp_apps.push({
            ...newArray[0],
            votes: element.votes,
          })
        } else {
          temp_apps.push({
            ...element.app,
            votes: 0,
          })
        }
      }
      // console.log(temp_apps, 'temp_appsresponse')
      // setpurchases(temp_apps)
      setList(temp_apps)
      setloader(false)
    } else {
      setList(temp_apps)
      setloader(false)
    }
  }
  const getCategories = async () => {
    const { response } = await AppService.categories.get({
      query: `created_by=superadmin`,
      toaster: false,
    })
    // console.log(response, 'getCategories')
    if (response) {
      var temp = []
      for (let index = 0; index < response.data.length; index++) {
        const element = response.data[index]
        temp.push({
          label: element.name,
          value: element._id,
        })
      }
      setCategories(temp)
    } else {
      setCategories([])
    }
  }
  const onLoad = () => {
    getCategories()
    getProducts()
    getApps()
  }
  const handleDelete = async (id, idx) => {
    Swal.fire({
      title: 'Warning',
      text: 'Are you sure you want to delete?',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Yes',
    }).then(async (res) => {
      if (!res.isConfirmed) return ''
      const { response } = await AppService.app.delete({
        query: `_id=${id}`,
        toaster: true,
      })
      if (response) {
        onLoad()
      }
    })
  }

  useEffect(onLoad, [])
  return {
    loader: loader,
    products: products,
    Categories: Categories,
    handleRefresh: onLoad,
    dataTableData: {
      columns: [
        { Header: 'Name', accessor: 'name' },
        { Header: 'App Id', accessor: 'app_id' },
        { Header: 'Videos', accessor: 'Videos' },
        { Header: 'Images', accessor: 'Images' },
        { Header: 'Actions', accessor: 'Actions' },
        { Header: 'Triggers', accessor: 'Triggers' },
        { Header: 'Docs', accessor: 'Docs' },
        { Header: 'Status', accessor: 'status' },
        { Header: 'Action', accessor: 'action' },
      ],

      rows: List.map((data) => ({
        name: data.name,
        status: data?.status?.value,
        app_id: data.app_id,
        Videos: data.videos.length,
        Images: data.images.length,
        Actions: data.actions.length,
        Triggers: data.triggers.length,
        Docs: data.docs.length,
        action: (
          <MDBox>
            <MDButton
              variant="contained"
              color="info"
              size="small"
              sx={{ marginRight: 2 }}
              onClick={() => navigate(`./plans/${data._id}`)}
            >
              Plans
            </MDButton>
            {data?.free_app?.integrationType?.value == 'form' && (
              <FormFields data={data} handleRefresh={onLoad} />
            )}
            <FreeMaretplaceAppsModel
              products={products}
              data={data}
              handleRefresh={onLoad}
              Categories={Categories}
            />
            <NestedApp
              products={products}
              data={data}
              handleRefresh={onLoad}
              Categories={Categories}
            />
            <EditModal
              products={products}
              data={data}
              handleRefresh={onLoad}
              Categories={Categories}
            />
            <MDButton
              variant="contained"
              color="warning"
              size="small"
              sx={{ marginLeft: 2 }}
              onClick={() => navigate(`./${data._id}`)}
            >
              View
            </MDButton>
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
