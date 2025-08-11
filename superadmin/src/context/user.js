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

// Material Dashboard 2 React main context
const UserContext = createContext()

// Setting custom name for the context which is visible on react dev tools
UserContext.displayName = 'UserContext'

// Material Dashboard 2 React context provider
function UserProvider({ children }) {
  const Service = useAppServices()
  const [user, setUser] = useState({})
  const [loader, setLoader] = useState(true)

  const Update = (updates) => setUser({ ...user, ...updates })

  const clear = () => setUser({})

  const value = useMemo(() => [user, Update, clear], [user, Update, clear])

  const getUser = async localUser => {
    const token = await localforage.getItem('token')
    const { response } = await Service.user.get({ query: `_id=${localUser._id}`, token })
    if (response) setUser({ ...response.data, token })
  }

  const updateUser = async () => {
    const localUser = await localforage.getItem('user')
    const token = await localforage.getItem('token')
    if (!localUser) return setLoader(false)
    setUser({ ...localUser, token })
    setLoader(false)
    return getUser(localUser)
  }

  const onLoad = () => {
    updateUser()
  }

  useEffect(onLoad, [])

  return loader ? <Loader /> : <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

// Material Dashboard 2 React custom hook for using context
function useUserInfo() {
  return useContext(UserContext) || []
}

// Typechecking props for the MaterialUIControllerProvider
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export { UserProvider, useUserInfo }
