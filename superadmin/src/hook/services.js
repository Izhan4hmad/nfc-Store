import axios from 'axios'
import env from 'config'
import { setNotification, useNotifcation } from 'context/notification'
import { ReqMethods, ResponseStatus } from 'enums'
import { useAuth, useLogout } from './auth'

const BASE_URL = `${env.API_URL}/v1`

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
    auth: {
      login: (options) => CallService(POST, `${BASE_URL}/auth/login`, options),
      CreateTeam: (options) => CallService(POST, `${BASE_URL}/auth/team`, options),
      UpdateTeam: (options) => CallService(PUT, `${BASE_URL}/auth/team`, options),
      delete: (options) => CallService(POST, `${BASE_URL}/auth/DeleteTeam`, options),

      GetTeam: (options) => CallService(POST, `${BASE_URL}/auth/team`, options),
    },
    dashboard: {
      get: (options) => CallService(GET, `${BASE_URL}/dashboard`, options),
    },
    updateRequest: {
      get: (options) => CallService(GET, `${BASE_URL}/updaterequest`, options),
      get_free_app: (options) => CallService(GET, `${BASE_URL}/updaterequest/free_app`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/updaterequest`, options),
      create: (options) => CallService(POST, `${BASE_URL}/updaterequest`, options),
      create_task: (options) => CallService(POST, `${BASE_URL}/updaterequest/create_task`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/updaterequest`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/updaterequest/filter`, options),
      connection_data: (options) =>
        CallService(GET, `${BASE_URL}/updaterequest/connection_data`, options),
      get_install_apps: (options) =>
        CallService(GET, `${BASE_URL}/updaterequest/get_install_apps`, options),
    },
    user: {
      get: (options) => CallService(GET, `${BASE_URL}/user`, options),
      GetUsers: (options) => CallService(GET, `${BASE_URL}/user/GetUsers`, options),

      filter: (options) => CallService(GET, `${BASE_URL}/user/filter`, options),
      GetTeam: (options) => CallService(GET, `${BASE_URL}/user/teams`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/user/teams`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/user`, options),
    },
    notes_type: {
      get: (options) => CallService(GET, `${BASE_URL}/notes_type`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/notes_type`, options),
      create: (options) => CallService(POST, `${BASE_URL}/notes_type`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/notes_type`, options),
    },
    notifications: {
      create: (options) => CallService(POST, `${BASE_URL}/notifications`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/notifications/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/notifications`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/notifications`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/notifications`, options),
    },
    app_tags: {
      create: (options) => CallService(POST, `${BASE_URL}/app_tags`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/app_tags/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/app_tags`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/app_tags`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/app_tags`, options),
    },
    app_todos: {
      create: (options) => CallService(POST, `${BASE_URL}/app_todos`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/app_todos/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/app_todos`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/app_todos`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/app_todos`, options),
    },
    app_tiers: {
      create: (options) => CallService(POST, `${BASE_URL}/app_tiers`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/app_tiers/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/app_tiers`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/app_tiers`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/app_tiers`, options),
    },
    app_trigger_model: {
      create: (options) => CallService(POST, `${BASE_URL}/app_trigger_model`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/app_trigger_model/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/app_trigger_model`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/app_trigger_model`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/app_trigger_model`, options),
    },
    dash_tags: {
      create: (options) => CallService(POST, `${BASE_URL}/dash_tags`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/dash_tags/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/dash_tags`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/dash_tags`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/dash_tags`, options),
    },
    onboarding_list: {
      create: (options) => CallService(POST, `${BASE_URL}/onboardinglist`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/onboardinglist/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/onboardinglist`, options),
      getsingle: (options) => CallService(GET, `${BASE_URL}/onboardinglist/:id`, options),
      deleteroute: (options) =>
        CallService(POST, `${BASE_URL}/onboardinglist/deleteroute`, options),

      update: (options) => CallService(PUT, `${BASE_URL}/onboardinglist`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/onboardinglist`, options),
    },
    onboardlistcategory: {
      create: (options) => CallService(POST, `${BASE_URL}/onboardlistcategory`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/onboardlistcategory/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/onboardlistcategory`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/onboardlistcategory`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/onboardlistcategory`, options),
    },

    checklist: {
      create: (options) => CallService(POST, `${BASE_URL}/checklist`, options),
      uploadCsv: (options) => CallService(POST, `${BASE_URL}/checklist/uploadCsv`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/checklist/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/checklist`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/checklist`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/checklist`, options),
    },
    ToolCategory: {
      create: (options) => CallService(POST, `${BASE_URL}/tool_category`, options),
      uploadCsv: (options) => CallService(POST, `${BASE_URL}/tool_category/uploadCsv`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/tool_category/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/tool_category`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/tool_category`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/tool_category`, options),
    },
    Tools: {
      create: (options) => CallService(POST, `${BASE_URL}/tools`, options),
      uploadCsv: (options) => CallService(POST, `${BASE_URL}/tools/uploadCsv`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/tools/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/tools`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/tools`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/tools`, options),
    },

    Players: {
      create: (options) => CallService(POST, `${BASE_URL}/players`, options),
      uploadCsv: (options) => CallService(POST, `${BASE_URL}/players/uploadCsv`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/players/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/players`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/players`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/players`, options),
    },
    Event: {
      create: (options) => CallService(POST, `${BASE_URL}/event`, options),
      uploadCsv: (options) => CallService(POST, `${BASE_URL}/event/uploadCsv`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/event/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/event`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/event`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/event`, options),
    },

    PlayersCategory: {
      create: (options) => CallService(POST, `${BASE_URL}/playerscategory`, options),
      uploadCsv: (options) => CallService(POST, `${BASE_URL}/playerscategory/uploadCsv`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/playerscategory/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/playerscategory`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/playerscategory`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/playerscategory`, options),
    },
    partner_keys: {
      create: (options) => CallService(POST, `${BASE_URL}/partner_keys`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/partner_keys/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/partner_keys`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/partner_keys`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/partner_keys`, options),
    },

    questions: {
      create: (options) => CallService(POST, `${BASE_URL}/questions`, options),
      uploadCsv: (options) => CallService(POST, `${BASE_URL}/questions/uploadCsv`, options),

      filter: (options) => CallService(GET, `${BASE_URL}/questions/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/questions`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/questions`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/questions`, options),
    },
    questions_chapters: {
      create: (options) => CallService(POST, `${BASE_URL}/questions_chapters`, options),
      uploadCsv: (options) =>
        CallService(POST, `${BASE_URL}/questions_chapters/uploadCsv`, options),

      filter: (options) => CallService(GET, `${BASE_URL}/questions_chapters/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/questions_chapters`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/questions_chapters`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/questions_chapters`, options),
    },
    questions_sections: {
      create: (options) => CallService(POST, `${BASE_URL}/questions_sections`, options),
      uploadCsv: (options) =>
        CallService(POST, `${BASE_URL}/questions_sections/uploadCsv`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/questions_sections/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/questions_sections`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/questions_sections`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/questions_sections`, options),
    },
    checklistcategory: {
      create: (options) => CallService(POST, `${BASE_URL}/checklistcategory`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/checklistcategory/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/checklistcategory`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/checklistcategory`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/checklistcategory`, options),
    },
    award_list: {
      create: (options) => CallService(POST, `${BASE_URL}/award_list`, options),
      CreateJSON: (options) => CallService(POST, `${BASE_URL}/award_list/CreateJSON`, options),

      filter: (options) => CallService(GET, `${BASE_URL}/award_list/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/award_list`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/award_list`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/award_list`, options),
    },
    agents: {
      create: (options) => CallService(POST, `${BASE_URL}/agents`, options),
      CreateJSON: (options) => CallService(POST, `${BASE_URL}/agents/CreateJSON`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/agents/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/agents`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/agents`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/agents`, options),
    },
    aisupprortkb: {
      create: (options) => CallService(POST, `${BASE_URL}/aisupprortkb`, options),
      CreateJSON: (options) => CallService(POST, `${BASE_URL}/aisupprortkb/CreateJSON`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/aisupprortkb/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/aisupprortkb`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/aisupprortkb`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/aisupprortkb`, options),
    },
    exchangepodcast: {
      create: (options) => CallService(POST, `${BASE_URL}/exchangepodcast`, options),
      CreateJSON: (options) => CallService(POST, `${BASE_URL}/exchangepodcast/CreateJSON`, options),

      filter: (options) => CallService(GET, `${BASE_URL}/exchangepodcast/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/exchangepodcast`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/exchangepodcast`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/exchangepodcast`, options),
    },
    partner: {
      create: (options) => CallService(POST, `${BASE_URL}/partner`, options),
      CreateJSON: (options) => CallService(POST, `${BASE_URL}/partner/CreateJSON`, options),

      filter: (options) => CallService(GET, `${BASE_URL}/partner/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/partner`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/partner`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/partner`, options),
    },

    medialibrary: {
      create: (options) => CallService(POST, `${BASE_URL}/medialibrary`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/medialibrary/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/medialibrary`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/medialibrary`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/medialibrary`, options),
    },

    medialibrarycategory: {
      create: (options) => CallService(POST, `${BASE_URL}/medialibrarycategory`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/medialibrarycategory/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/medialibrarycategory`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/medialibrarycategory`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/medialibrarycategory`, options),
    },
    award_ranking: {
      create: (options) => CallService(POST, `${BASE_URL}/award_ranking`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/award_ranking/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/award_ranking`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/award_ranking`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/award_ranking`, options),
      uploadCsv: (options) => CallService(POST, `${BASE_URL}/award_ranking/uploadCsv`, options),
    },
    changelogs: {
      create: (options) => CallService(POST, `${BASE_URL}/changelogs`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/changelogs/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/changelogs`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/changelogs`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/changelogs`, options),
      uploadCsv: (options) => CallService(POST, `${BASE_URL}/changelogs/uploadCsv`, options),
    },
    newsfeeds: {
      create: (options) => CallService(POST, `${BASE_URL}/newsfeeds`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/newsfeeds/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/newsfeeds`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/newsfeeds`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/newsfeeds`, options),
      uploadCsv: (options) => CallService(POST, `${BASE_URL}/newsfeeds/uploadCsv`, options),
    },
    superadmin_webhook: {
      create: (options) => CallService(POST, `${BASE_URL}/superadmin_webhook`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/superadmin_webhook/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/superadmin_webhook`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/superadmin_webhook`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/superadmin_webhook`, options),
      uploadCsv: (options) =>
        CallService(POST, `${BASE_URL}/superadmin_webhook/uploadCsv`, options),
    },

    award_ranking_category: {
      create: (options) => CallService(POST, `${BASE_URL}/award_ranking_category`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/award_ranking_category/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/award_ranking_category`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/award_ranking_category`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/award_ranking_category`, options),
      uploadCsv: (options) =>
        CallService(POST, `${BASE_URL}/award_ranking_category/uploadCsv`, options),
    },
    medialibrarytags: {
      create: (options) => CallService(POST, `${BASE_URL}/medialibrarytags`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/medialibrarytags/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/medialibrarytags`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/medialibrarytags`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/medialibrarytags`, options),
    },

    app_setup: {
      create: (options) => CallService(POST, `${BASE_URL}/app_setup`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/app_setup/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/app_setup`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/app_setup`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/app_setup`, options),
    },
    k_faq: {
      create: (options) => CallService(POST, `${BASE_URL}/k_faq`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/k_faq/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/k_faq`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/k_faq`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/k_faq`, options),
    },
    faq: {
      create: (options) => CallService(POST, `${BASE_URL}/faq`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/faq/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/faq`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/faq`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/faq`, options),
      updatebulk: (options) => CallService(PUT, `${BASE_URL}/faq/updatebulk`, options),
    },
    tasks: {
      create: (options) => CallService(POST, `${BASE_URL}/tasks`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/tasks/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/tasks`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/tasks`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/tasks`, options),
      GetStaffTask: (options) => CallService(GET, `${BASE_URL}/tasks/GetStaffTask`, options),
    },
    faq_video: {
      create: (options) => CallService(POST, `${BASE_URL}/faq_video`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/faq_video/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/faq_video`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/faq_video`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/faq_video`, options),
    },
    appusers: {
      create: (options) => CallService(POST, `${BASE_URL}/appusers`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/appusers/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/appusers`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/appusers`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/appusers`, options),
    },
    applocations: {
      create: (options) => CallService(POST, `${BASE_URL}/applocations`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/applocations/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/applocations`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/applocations`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/applocations`, options),
    },

    appinstalls: {
      create: (options) => CallService(POST, `${BASE_URL}/appinstalls`, options),

      filter: (options) => CallService(GET, `${BASE_URL}/appinstalls/filter`, options),
      getTokens: (options) => CallService(GET, `${BASE_URL}/appinstalls/tokens`, options),
      getsso: (options) => CallService(GET, `${BASE_URL}/appinstalls/sso`, options),
      getapplogs: (options) => CallService(GET, `${BASE_URL}/appinstalls/applogs`, options),
      get: (options) => CallService(GET, `${BASE_URL}/appinstalls`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/appinstalls`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/appinstalls`, options),
    },
    appcompanies: {
      create: (options) => CallService(POST, `${BASE_URL}/appcompanies`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/appcompanies/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/appcompanies`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/appcompanies`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/appcompanies`, options),
    },
    app_types: {
      create: (options) => CallService(POST, `${BASE_URL}/app_types`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/app_types/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/app_types`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/app_types`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/app_types`, options),
    },
    business_types: {
      create: (options) => CallService(POST, `${BASE_URL}/business_types`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/business_types/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/business_types`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/business_types`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/business_types`, options),
    },

    k_faq_category: {
      create: (options) => CallService(POST, `${BASE_URL}/k_faq_category`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/k_faq_category/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/k_faq_category`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/k_faq_category`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/k_faq_category`, options),
    },

    faq_category: {
      create: (options) => CallService(POST, `${BASE_URL}/faq_category`, options),
      unlimited_data: (options) =>
        CallService(GET, `${BASE_URL}/faq_category/unlimited_data`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/faq_category/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/faq_category`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/faq_category`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/faq_category`, options),
    },
    faq_subcategory: {
      create: (options) => CallService(POST, `${BASE_URL}/faq_subcategory`, options),
      unlimited_data: (options) =>
        CallService(GET, `${BASE_URL}/faq_subcategory/unlimited_data`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/faq_subcategory/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/faq_subcategory`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/faq_subcategory`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/faq_subcategory`, options),
    },
    team_services: {
      create: (options) => CallService(POST, `${BASE_URL}/team_services`, options),
      unlimited_data: (options) =>
        CallService(GET, `${BASE_URL}/team_services/unlimited_data`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/team_services/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/team_services`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/team_services`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/team_services`, options),
    },
    staff_job: {
      create: (options) => CallService(POST, `${BASE_URL}/staff_job`, options),
      unlimited_data: (options) =>
        CallService(GET, `${BASE_URL}/staff_job/unlimited_data`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/staff_job/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/staff_job`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/staff_job`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/staff_job`, options),
    },
    ghl_features: {
      create: (options) => CallService(POST, `${BASE_URL}/ghl_features`, options),
      unlimited_data: (options) =>
        CallService(GET, `${BASE_URL}/ghl_features/unlimited_data`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/ghl_features/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/ghl_features`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/ghl_features`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/ghl_features`, options),
    },

    servicecategory: {
      create: (options) => CallService(POST, `${BASE_URL}/servicescategory`, options),
      unlimited_data: (options) =>
        CallService(GET, `${BASE_URL}/servicescategory/unlimited_data`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/servicescategory/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/servicescategory`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/servicescategory`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/servicescategory`, options),
    },

    team: {
      create: (options) => CallService(POST, `${BASE_URL}/team`, options),
      unlimited_data: (options) => CallService(GET, `${BASE_URL}/team/unlimited_data`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/team/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/team`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/team`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/team`, options),
    },
    team_tags: {
      create: (options) => CallService(POST, `${BASE_URL}/team_tags`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/team_tags/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/team_tags`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/team_tags`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/team_tags`, options),
    },
    tickets_category: {
      create: (options) => CallService(POST, `${BASE_URL}/tickets_category`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/tickets_category/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/tickets_category`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/tickets_category`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/tickets_category`, options),
    },
    tickets_group: {
      create: (options) => CallService(POST, `${BASE_URL}/tickets_group`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/tickets_group/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/tickets_group`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/tickets_group`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/tickets_group`, options),
    },
    tickets_type: {
      create: (options) => CallService(POST, `${BASE_URL}/tickets_type`, options),
      get: (options) => CallService(GET, `${BASE_URL}/tickets_type`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/tickets_type`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/tickets_type`, options),
    },
    health_plan: {
      create: (options) => CallService(POST, `${BASE_URL}/health_plan`, options),
      get: (options) => CallService(GET, `${BASE_URL}/health_plan`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/health_plan`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/health_plan`, options),
    },
    health_features: {
      create: (options) => CallService(POST, `${BASE_URL}/health_features`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/health_features/filter`, options),
      get: (options) => CallService(GET, `${BASE_URL}/health_features`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/health_features`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/health_features`, options),
    },
    app: {
      get: (options) => CallService(GET, `${BASE_URL}/app`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/app`, options),
      create: (options) => CallService(POST, `${BASE_URL}/app`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/app`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/app/filter`, options),
      superadmin_apps: (options) => CallService(GET, `${BASE_URL}/app/superadmin_apps`, options),
      awarded_companies: (options) =>
        CallService(GET, `${BASE_URL}/app/awarded_companies`, options),
      get_single_app: (options) => CallService(GET, `${BASE_URL}/app/get_single_app`, options),
    },
    partner_module: {
      get: (options) => CallService(GET, `${BASE_URL}/partner_module`, options),
      update: (options) => CallService(POST, `${BASE_URL}/partner_module/update`, options),
      create: (options) => CallService(POST, `${BASE_URL}/partner_module`, options),
      delete: (options) => CallService(POST, `${BASE_URL}/partner_module/delete`, options),
      getDetail: (options) => CallService(GET, `${BASE_URL}/partner_module/retrieve`, options),
    },
    languages: {
      get: (options) => CallService(GET, `${BASE_URL}/languages`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/languages`, options),
      create: (options) => CallService(POST, `${BASE_URL}/languages`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/languages`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/languages/filter`, options),
    },
    tooltip: {
      get: (options) => CallService(GET, `${BASE_URL}/tooltip`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/tooltip`, options),
      update_index: (options) => CallService(PUT, `${BASE_URL}/tooltip/update_index`, options),
      create: (options) => CallService(POST, `${BASE_URL}/tooltip`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/tooltip`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/tooltip/filter`, options),
    },
    bannersconfig: {
      get: (options) => CallService(GET, `${BASE_URL}/bannersconfig`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/bannersconfig`, options),
      update_index: (options) =>
        CallService(PUT, `${BASE_URL}/bannersconfig/update_index`, options),
      create: (options) => CallService(POST, `${BASE_URL}/bannersconfig`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/bannersconfig`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/bannersconfig/filter`, options),
    },
    notifications: {
      get: (options) => CallService(GET, `${BASE_URL}/notifications`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/notifications`, options),
      update_index: (options) =>
        CallService(PUT, `${BASE_URL}/notifications/update_index`, options),
      create: (options) => CallService(POST, `${BASE_URL}/notifications`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/notifications`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/notifications/filter`, options),
    },
    pages: {
      get: (options) => CallService(GET, `${BASE_URL}/pages`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/pages`, options),
      create: (options) => CallService(POST, `${BASE_URL}/pages`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/pages`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/pages/filter`, options),
    },
    nfcbusinessCard: {
      get: (options) => CallService(GET, `${BASE_URL}/nfcbusiness/`, options),
      getbycardId: (options) => CallService(GET, `${BASE_URL}/nfcbusiness/getcardinfo`, options),
      GetById: (options) => CallService(GET, `${BASE_URL}/nfcbusiness/getById`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/nfcbusiness/update`, options),
      create: (options) => CallService(POST, `${BASE_URL}/nfcbusiness/create`, options),
      // delete: (options) => CallService(DELETE, `${BASE_URL}/pages`, options),
      // filter: (options) => CallService(GET, `${BASE_URL}/pages/filter`, options),
    },
    productsPage: {
      get: (options) => CallService(GET, `${BASE_URL}/productsPage/`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/productsPage/`, options),
      create: (options) => CallService(POST, `${BASE_URL}/productsPage/create`, options),
      delete: (options) => CallService(POST, `${BASE_URL}/productsPage/`, options),
      // filter: (options) => CallService(GET, `${BASE_URL}/pages/filter`, options),
    },
    packages: {
      get: (options) => CallService(GET, `${BASE_URL}/nfc_package/`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/nfc_package/`, options),
      create: (options) => CallService(POST, `${BASE_URL}/nfc_package/`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/nfc_package`, options),
      getOrder: (options) => CallService(GET, `${BASE_URL}/nfc_package/get_order`, options),
      getOrderDetails: (options) =>
        CallService(GET, `${BASE_URL}/nfc_package/get_order_details`, options),
    },
    nfcUsers: {
      get: (options) => CallService(GET, `${BASE_URL}/nfcbusiness/getAllusers`, options),
      getcards: (options) => CallService(GET, `${BASE_URL}/nfcbusiness/getUserCards`, options),
      getAction: (options) =>
        CallService(GET, `${BASE_URL}/nfcbusiness/getAssociatedActionById`, options),
      updateAction: (options) => CallService(PUT, `${BASE_URL}/nfc_action`, options),
      deleteAction: (options) =>
        CallService(POST, `${BASE_URL}/nfcbusiness/detach_action_by_admin`, options),
      attachAction: (options) =>
        CallService(POST, `${BASE_URL}/nfcbusiness/attach_action_by_admin`, options),
      CreateAdminAction: (options) =>
        CallService(POST, `${BASE_URL}/nfcbusiness/create_admin_action`, options),
      GetAdminAction: (options) =>
        CallService(GET, `${BASE_URL}/nfcbusiness/get_admin_action`, options),
      UpdateAdminAction: (options) =>
        CallService(PUT, `${BASE_URL}/nfcbusiness/update_admin_action`, options),
      DeleteAdminAction: (options) =>
        CallService(POST, `${BASE_URL}/nfcbusiness/delete_admin_action`, options),
    },
    banners: {
      get: (options) => CallService(GET, `${BASE_URL}/banners`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/banners`, options),
      create: (options) => CallService(POST, `${BASE_URL}/banners`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/banners`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/banners/filter`, options),
    },
    app_listing_category: {
      get: (options) => CallService(GET, `${BASE_URL}/app_listing_category`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/app_listing_category`, options),
      create: (options) => CallService(POST, `${BASE_URL}/app_listing_category`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/app_listing_category`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/app_listing_category/filter`, options),
    },
    app_listing: {
      get: (options) => CallService(GET, `${BASE_URL}/app_listing`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/app_listing`, options),
      create: (options) => CallService(POST, `${BASE_URL}/app_listing`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/app_listing`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/app_listing/filter`, options),
    },
    vote: {
      get: (options) => CallService(GET, `${BASE_URL}/vote`, options),
      getappvotes: (options) => CallService(GET, `${BASE_URL}/vote/getappvotes`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/vote`, options),
      create: (options) => CallService(POST, `${BASE_URL}/vote`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/vote`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/vote/filter`, options),
    },
    snapshot: {
      get: (options) => CallService(GET, `${BASE_URL}/snapshot`, options),
      create: (options) => CallService(POST, `${BASE_URL}/snapshot`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/snapshot`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/snapshot/filter`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/snapshot`, options),
    },
    snap_shot: {
      get: (options) => CallService(GET, `${BASE_URL}/snap_shot`, options),
      create: (options) => CallService(POST, `${BASE_URL}/snap_shot`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/snap_shot`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/snap_shot/filter`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/snap_shot`, options),
    },
    docs: {
      createDocs: (options) => CallService(POST, `${BASE_URL}/docs`, options),
      updateDocs: (options) => CallService(PUT, `${BASE_URL}/docs`, options),
      Docs: (options) => CallService(POST, `${BASE_URL}/docs`, options),
      move: (options) => CallService(PUT, `${BASE_URL}/docs/move`, options),
      get_filter: (options) => CallService(GET, `${BASE_URL}/docs/filter`, options),
      doc_move_data: (options) => CallService(GET, `${BASE_URL}/docs/doc_move_data`, options),
      get_filter_cat: (options) => CallService(GET, `${BASE_URL}/docs/category/filter`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/docs/delete`, options),
    },
    docs_category: {
      createDocs: (options) => CallService(POST, `${BASE_URL}/docs/category`, options),
      updateDocs: (options) => CallService(PUT, `${BASE_URL}/docs/category`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/docs/category/filter`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/docs/category/delete`, options),
    },
    docs_sub_category: {
      create: (options) => CallService(POST, `${BASE_URL}/docs/subcategory`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/docs/subcategory`, options),
      move: (options) => CallService(PUT, `${BASE_URL}/docs/subcategory/move`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/docs/subcategory/filter`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/docs/subcategory/delete`, options),
    },
    agency_articles: {
      createDocs: (options) => CallService(POST, `${BASE_URL}/agency_articles`, options),
      updateDocs: (options) => CallService(PUT, `${BASE_URL}/agency_articles`, options),
      Docs: (options) => CallService(POST, `${BASE_URL}/agency_articles`, options),
      get_filter: (options) => CallService(GET, `${BASE_URL}/agency_articles/filter`, options),
      get_filter_cat: (options) =>
        CallService(GET, `${BASE_URL}/agency_articles/category/filter`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/agency_articles/delete`, options),
    },
    agency_articles_category: {
      createDocs: (options) => CallService(POST, `${BASE_URL}/agency_articles/category`, options),
      updateDocs: (options) => CallService(PUT, `${BASE_URL}/agency_articles/category`, options),
      delete: (options) =>
        CallService(DELETE, `${BASE_URL}/agency_articles/category/delete`, options),
    },
    agency_articles_sub_category: {
      create: (options) => CallService(POST, `${BASE_URL}/agency_articles/subcategory`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/agency_articles/subcategory`, options),
      filter: (options) =>
        CallService(GET, `${BASE_URL}/agency_articles/subcategory/filter`, options),
      delete: (options) =>
        CallService(DELETE, `${BASE_URL}/agency_articles/subcategory/delete`, options),
    },
    request_app: {
      get: (options) => CallService(GET, `${BASE_URL}/requestapp`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/requestapp`, options),
      create: (options) => CallService(POST, `${BASE_URL}/requestapp`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/requestapp`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/requestapp/filter`, options),
    },
    categories: {
      get: (options) => CallService(GET, `${BASE_URL}/category/getsnaphotcategories`, options),
      update: (options) => CallService(POST, `${BASE_URL}/category/update/${options.id}`, options),
      create: (options) => CallService(POST, `${BASE_URL}/category/submit`, options),
      delete: (options) => CallService(POST, `${BASE_URL}/category/delete/${options.id}`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/category/filter`, options),
    },
    ActionsCategories: {
      get: (options) =>
        CallService(GET, `${BASE_URL}/actions_category/getsnaphotcategories`, options),
      update: (options) =>
        CallService(POST, `${BASE_URL}/actions_category/update/${options.id}`, options),
      create: (options) => CallService(POST, `${BASE_URL}/actions_category/submit`, options),
      delete: (options) =>
        CallService(POST, `${BASE_URL}/actions_category/delete/${options.id}`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/actions_category/filter`, options),
    },
    CompetitionCategories: {
      get: (options) => CallService(GET, `${BASE_URL}/competitoncat`, options),
      update: (options) =>
        CallService(POST, `${BASE_URL}/competitoncat/update/${options.id}`, options),
      create: (options) => CallService(POST, `${BASE_URL}/competitoncat`, options),
      delete: (options) =>
        CallService(POST, `${BASE_URL}/competitoncat/delete/${options.id}`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/competitoncat/filter`, options),
    },
    CompetitionPoints: {
      get: (options) => CallService(GET, `${BASE_URL}/competitionpoints`, options),
      update: (options) =>
        CallService(POST, `${BASE_URL}/competitionpoints/update/${options.id}`, options),
      create: (options) => CallService(POST, `${BASE_URL}/competitionpoints`, options),
      delete: (options) =>
        CallService(POST, `${BASE_URL}/competitionpoints/delete/${options.id}`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/competitionpoints/filter`, options),
    },
    categoriesnotification: {
      get: (options) =>
        CallService(GET, `${BASE_URL}/categorynotification/getsnaphotcategories`, options),
      update: (options) =>
        CallService(POST, `${BASE_URL}/categorynotification/update/${options.id}`, options),
      create: (options) => CallService(POST, `${BASE_URL}/categorynotification/submit`, options),
      delete: (options) =>
        CallService(POST, `${BASE_URL}/categorynotification/delete/${options.id}`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/categorynotification/filter`, options),
    },

    AppCollections: {
      get: (options) => CallService(GET, `${BASE_URL}/app_collections`, options),
      create: (options) => CallService(POST, `${BASE_URL}/app_collections`, options),
      delete: (options) =>
        CallService(DELETE, `${BASE_URL}/app_collections/${options.id}`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/app_collections`, options),
    },
    Aiknowledge: {
      get: (options) => CallService(GET, `${BASE_URL}/aiknowledge`, options),
      create: (options) => CallService(POST, `${BASE_URL}/aiknowledge`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/aiknowledge/${options.id}`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/aiknowledge`, options),
    },

    events: {
      get: (options) => CallService(GET, `${BASE_URL}/events`, options),
      update: (options) => CallService(POST, `${BASE_URL}/events/update/${options.id}`, options),
      create: (options) => CallService(POST, `${BASE_URL}/events/submit`, options),
      delete: (options) => CallService(POST, `${BASE_URL}/events/delete/${options.id}`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/events/filter`, options),
    },
    offer: {
      get: (options) => CallService(GET, `${BASE_URL}/offer`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/offer`, options),
      create: (options) => CallService(POST, `${BASE_URL}/offer`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/offer`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/offer/filter`, options),
    },
    brand: {
      get: (options) => CallService(GET, `${BASE_URL}/brand`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/brand`, options),
      superadmin: (options) => CallService(PUT, `${BASE_URL}/brand/superadmin`, options),
      filter: (options) => CallService(GET, `${BASE_URL}/brand/filter`, options),
    },
    agency: {
      get: (options) => CallService(GET, `${BASE_URL}/agency`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/agency`, options),
      getProducts: (options) => CallService(PUT, `${BASE_URL}/agency/getproducts`, options),
      update_ghl_company: (options) =>
        CallService(PUT, `${BASE_URL}/agency/update_ghl_company`, options),
    },
    superadmin: {
      getProducts: (options) =>
        CallService(GET, `${BASE_URL}/snapshot/superadmin_settings/workflows`, options),
    },
    utils: {
      upload_image: (options) => CallService(POST, `${BASE_URL}/utils/upload/image`, options),
      upload_images: (options) => CallService(POST, `${BASE_URL}/utils/upload/images`, options),
    },
    stripe: {
      // product: (options) => CallService(GET, `${BASE_URL}/services/stripe/products`, options),
      // getCustomer: (options) => CallService(GET, `${BASE_URL}/services/stripe/customers`, options),
      integrateAcocunt: (options) =>
        CallService(GET, `${BASE_URL}/snapshot/agency/stripe/integrate`, options),
      // addSubscription: (options) =>
      //   CallService(POST, `${BASE_URL}/services/stripe/subscription/add`, options),
    },
    services: {
      ghl: {
        call_service: (options) => CallService(POST, `${BASE_URL}/services/ghl/`, options),
      },
    },

    roadmap: {
      get: (options) => CallService(GET, `${BASE_URL}/roadmap`, options),
      update: (options) => CallService(PUT, `${BASE_URL}/roadmap`, options),
      create: (options) => CallService(POST, `${BASE_URL}/roadmap`, options),
      delete: (options) => CallService(DELETE, `${BASE_URL}/roadmap`, options),
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
