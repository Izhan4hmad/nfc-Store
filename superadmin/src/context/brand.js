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

/**
  This file is used for controlling the global states of the components,
  you can customize the states for the different components here.
*/

import { createContext, useContext, useState, useMemo, useEffect } from 'react'

// prop-types is a library for typechecking of props
import PropTypes from 'prop-types'
import localforage from 'localforage'
import { useAppServices } from 'hook/services'
import Loader from 'examples/Loader'
import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom'
import env from 'config'
const BASE_URL = `${env.API_URL}/v1`

// import { setDarkMode, setFixedNavbar, setSidenavColor, setTransparentSidenav, setWhiteSidenav, useMaterialUIController } from 'context'
// Material Dashboard 2 React main context
const BrandContext = createContext()

// Setting custom name for the context which is visible on react dev tools
BrandContext.displayName = 'BrandContext'

// Material Dashboard 2 React context provider
function BrandProvider({ children }) {
  // const [,dispatch]         = useMaterialUIController()
  const Service = useAppServices()
  const [brand, setBrand] = useState({})
  const [Category, setCategory] = useState({})
  const [loader, setLoader] = useState(true)
  const { pathname } = useLocation()
  const params = useParams()

  // Theme Functions
  // const handleThemeUpdates = updates => {
  //   setSidenavColor(dispatch, updates.sideNavColor)
  //   setWhiteSidenav(dispatch, updates.sideNavType == 'white')
  //   setTransparentSidenav(dispatch, updates.sideNavType == 'transparent')
  //   setFixedNavbar(dispatch, updates.navbarFixed)
  //   setDarkMode(dispatch, !updates.light)
  // }

  const Update = (updates) => setBrand({ ...brand, ...updates })

  const clear = () => setBrand({})

  const value = useMemo(() => [brand, Update, clear, Category], [brand, Update, clear, Category])

  const getBrand = async (localBrand) => {
    const token = await localforage.getItem('token')
    const { response } = await Service.brand.get({ query: `_id=${localBrand._id}`, token })
    if (!response) return setLoader(false)

    setBrand({ ...response.data })
    return localforage.setItem('brand', response.data)
  }
  const getCat = async () => {
    const localBrand = await localforage.getItem('loc_data')
    //   var agency_id = pathname.substring(
    //     pathname.indexOf("agency/") + 7,
    //     pathname.lastIndexOf("/Snapshot")
    // );
    var path = pathname.split('/')[1]
    // alert(pathname)
    if (path == 'location') {
      var agency_id = pathname.split('/')[6]
    } else if (path == 'custom') {
      var agency_id = pathname.split('/')[7]
    } else {
      var agency_id = pathname.split('/')[7]
    }
    // alert(agency_id)

    var axios = require('axios')
    if (agency_id) {

      const response = await axios
        .get(BASE_URL + '/snapshot/category/' + agency_id)
        .then(async function (response) {
          // console.log(response.data.data,'cat');
          var category = []
          // alert(path)
          if (path == 'location') {
            category.push(response.data.data)
            category = category[0]
          } else if (path == 'snapshots') {
            response.data.data.forEach((el) => {
              var temp = []
              el.type.forEach((element) => {
                if (element.value == 'snapshot') {
                  category.push(el)
                }
              })
              // category.push(temp)
            })
          } else if (path == 'custom') {
            var linkref = pathname.split('/')[2]

            //  category.push(response.data.data)
            response.data.data.forEach((el) => {
              var temp = []
              el.type.forEach((element) => {
                if (element.value == linkref) {
                  // console.log(element.value)
                  // console.log(el)
                  category.push(el)
                }
              })
              // category.push(temp)
            })
          } else if (path == 'funnels') {
            response.data.data.forEach((el) => {
              var temp = []
              el.type.forEach((element) => {
                if (element.value == 'funnels') {
                  category.push(el)
                }
              })
              // category.push(temp)
            })
          } else if (path == 'websites') {
            response.data.data.forEach((el) => {
              var temp = []
              el.type.forEach((element) => {
                if (element.value == 'websites') {
                  category.push(el)
                }
              })
              // category.push(temp)
            })
          } else if (path == 'automation') {
            response.data.data.forEach((el) => {
              var temp = []
              el.type.forEach((element) => {
                if (element.value == 'automation') {
                  category.push(el)
                }
              })
              // category.push(temp)
            })
          } else {
            response.data.data.forEach((el) => {
              var temp = []
              el.type.forEach((element) => {
                if (element.value == 'service') {
                  category.push(el)
                }
              })
              // category.push(temp)
            })
          }

          var data = {
            data: category,
          }
          return data
        })
        .catch(function (error) {
          // console.log(error)
        })
      if (!response) return setLoader(false)
      // console.log(response, 'response')
      var Category = response.data
      Category.sort((a, b) => (a.index > b.index ? 1 : b.index > a.index ? -1 : 0))

      setCategory(Category)
      return localforage.setItem('Category', Category)
    }
  }

  const updateBrand = async () => {
    const localBrand = await localforage.getItem('brand')
    if (!localBrand) return setLoader(false)
    setBrand({ ...localBrand })
    setLoader(false)
    return getBrand(localBrand)
  }

  const onLoad = () => {
    getCat()
    updateBrand()
  }

  useEffect(onLoad, [])

  return loader ? (
    <Loader />
  ) : (
    <BrandContext.Provider value={value}>{children}</BrandContext.Provider>
  )
}

// Material Dashboard 2 React custom hook for using context
function useBrandInfo() {
  return useContext(BrandContext) || []
}

// Typechecking props for the MaterialUIControllerProvider
BrandProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export { BrandProvider, useBrandInfo }
