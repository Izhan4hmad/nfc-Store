import axios from 'axios'
import env from 'config'
import { setNotification, useNotifcation } from 'context/notification'
import { ReqMethods, ResponseStatus } from 'enums'
import { useAuth, useLogout } from './auth'

const BASE_URL = `${env.AI_API_URL}/v1`

function useServiceHandler() {
  const [, dispatch] = useNotifcation()
  const Logout = useLogout()

  return (fn) =>
    async (method, path, { query, payload, token, apiKey, toaster, message, error } = {}) => {
      try {
        const res = await fn(method, path, { query, payload, token, apiKey })
        console.log('API - RESPONSE', res, toaster, message, error)
        toaster &&
          setNotification(dispatch, {
            open: true,
            message: message || res.data.message,
            severity: 'success',
            title: 'Success',
          })

        return { response: res.data }
      } catch (err) {
        console.log('API- ERROR', err.response?.data || err)

        // expire error : jwt expired
        if (err.response && err.response.status === ResponseStatus.UNAUTHORIZED) {
          setNotification(dispatch, {
            open: true,
            message: error || 'session expired',
            title: 'Error',
            severity: 'error',
          })
          setTimeout(Logout, 4000)
          return { error: err.response?.data || err }
        }

        const customError = err.response?.data?.error
          ? `${err.response?.data?.message} \n${err.response?.data?.error}`
          : err.response?.data?.message

        toaster &&
          setNotification(dispatch, {
            open: true,
            message: error || customError || err.message,
            severity: 'error',
            title: 'Error',
          })
        return { error: err.response ? err.response.data : err }
      }
    }
}

function useCallService() {
  const authToken = useAuth()
  const serviceHandler = useServiceHandler()

  const CallService = (method, path, { query, payload, token = true, apiKey = null }) => {
    const pathname = query ? `${path}?${query}` : path
    const config = {}

    if (token) config.headers = { 'x-auth-token': `Bearer ${authToken || token}` }
    if (apiKey) config.headers = { apiKey }

    const details = {}

    if (payload) details.payload = payload
    details.config = config

    return axios[method](pathname, ...Object.values(details))
  }

  return serviceHandler(CallService)
}

function useAppServices() {
  const { GET, POST, PUT, DELETE } = ReqMethods
  const CallService = useCallService()

  /**
    Option for service is the object that could has the following properties
    query, payload, token, apiKey
  */

  const APIs = {
    agents: {
      create: (options) => CallService(POST, `${BASE_URL}/agents`, options),
      CreateJSON: (options) => CallService(POST, `${BASE_URL}/agents/CreateJSON`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/agents/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/agents`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/agents`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/agents`, options),
    },
    app_agent: {
      create: (options) => CallService(POST, `${BASE_URL}/app_agent/create`, options),
      getAll: (options) => CallService(GET, `${BASE_URL}/app_agent/list`, options),
      get: (options) => CallService(GET, `${BASE_URL}/app_agent/retrieve`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/app_agent/update`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/app_agent/delete`, options),
    },
    app_function: {
      create: (options) => CallService(POST, `${BASE_URL}/app_agent/function/add`, options),
      getAll: (options) => CallService(GET, `${BASE_URL}/app_agent/function/list`, options),
      get: (options) => CallService(GET, `${BASE_URL}/app_agent/function/retrieve`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/app_agent/function/update`, options),
      update_status: (options) =>
        CallService(PUT, `${BASE_URL}/app_agent/function/update-status`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/app_agent/function/delete`, options),
    },
  }
  return APIs
}
const useUploadImage = () => {
  const AppService = useAppServices()
  return ({ toaster, file, desiredPath }) => {
    const form = new FormData()
    form.append('image', file, file.name)
    return AppService.utils.upload_image({
      toaster,
      payload: form,
      query: `desiredPath=${desiredPath}`,
    })
  }
}
const useUploadImages = () => {
  const AppService = useAppServices()
  return ({ toaster, file, desiredPath }) => {
    const form = new FormData()
    form.append('company_logo', file, file.name)
    return AppService.utils.upload_images({
      toaster,
      payload: form,
      query: `desiredPath=${desiredPath}`,
    })
  }
}
export { useAppServices, useCallService, useUploadImage, useUploadImages }
