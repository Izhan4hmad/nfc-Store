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

export default function DataTableData() {
  const AppService = useAppServices()
  const [List, setList] = useState([])
  const [Apps, setApps] = useState([])
  const [products, setproducts] = useState([])
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
    const { response } = await AppService.app.get({
      query: '',
      toaster: false,
    })
    // console.log(response, 'Apps')
    if (response) {
      const temp = [
        {
          label: 'Select All',
          value: 'select_all',
        },
      ]
      response.data.forEach((element) => {
        temp.push({
          label: element.name,
          value: element._id,
        })
      })
      setApps(temp)
    }
  }
  const getpackages = async () => {
    const { response } = await AppService.snapshot.findbyquery({
      query: 'type=package',
      toaster: false,
    })
    // console.log(response, 'getpackages')
    if (response) {
      setList(response.data)
    } else {
      setList([])
    }
    setloader(false)
  }
  const onLoad = () => {
    getProducts()
    getApps()
    getpackages()
  }
  const handleDelete = async (id) => {
    const { response } = await AppService.offer.delete({
      query: `_id=${id}`,
    })
    if (response) onLoad()
  }

  useEffect(onLoad, [])
  return {
    products: products,
    loader: loader,
    apps: Apps,
    handleRefresh: onLoad,
    dataTableData: {
      columns: [
        { Header: 'Name', accessor: 'name' },
        { Header: 'Description', accessor: 'description' },
        { Header: 'Action', accessor: 'action' },
      ],

      rows: List.map((data) => ({
        name: data.name,
        description: data.description,
        action: (
          <MDBox>
            <EditModal products={products} apps={Apps} data={data} handleRefresh={onLoad} />
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
