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

import React, { createContext, useContext, useReducer, useMemo } from 'react'

// prop-types is a library for typechecking of props
import PropTypes from 'prop-types'
import MDSnackbar from 'components/MDSnackbar'
import { format } from 'timeago.js'

// Material Dashboard 2 React main context
const Notification = createContext()

// Setting custom name for the context which is visible on react dev tools
Notification.displayName = 'NotificationContext'

// Material Dashboard 2 React reducer
function reducer(state, action) {
  switch (action.type) {
    case 'NOTIFICATION': {
      return { ...state, ...action.value}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

// Material Dashboard 2 React context provider
function NotificationProvider({ children }) {
  const initialState = {
    title   : '',
    message : '',
    open    : false,
  }

  const [controller, dispatch] = useReducer(reducer, initialState)

  const value = useMemo(() => [controller, dispatch], [controller, dispatch])

  const closeNotification = () => dispatch({ type: 'NOTIFICATION', value: { message: '', open: false } })

  const icons = {
    success : 'check',
    error   : 'warning'
  }

  return <Notification.Provider value={value}>
    {children}
    <MDSnackbar
      color    = {controller.severity}
      icon     = {icons[controller.severity]}
      title    = {controller.title}
      dateTime = {format(Date.now())}
      onClose  = {closeNotification}
      close    = {closeNotification}
      content  = {controller.message}
      open     = {controller.open}
      duration = {controller.duration || 5000}
      bgWhite
    />
  </Notification.Provider>
}

// Material Dashboard 2 React custom hook for using context
function useNotifcation() {
  const context = useContext(Notification)

  return context || []
}

// Typechecking props for the MaterialUIControllerProvider
NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

// Context module functions
const setNotification = (dispatch, value) => dispatch({ type: 'NOTIFICATION', value })

export {
  NotificationProvider,
  useNotifcation,
  setNotification
}
