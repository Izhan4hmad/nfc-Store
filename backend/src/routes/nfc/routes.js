const express = require('express')
const router = express.Router()

const { ReqMethods } = require('../../_enums/enums')

const { ApiErrorHandler } = require('../../_utils/handler')

const {
  Authenticate,
  Validate,
  Authorize,
} = require('../../lib/auth/auth.services')

const services = require('./services')
const { agencyVld } = require('../../_validations')

const Route = () => {
  const routes = [
    {
      method: ReqMethods.GET,
      url: '/',
      middlewares: [],
      fn: ApiErrorHandler(services.Get),
    },
    {
      method: ReqMethods.DELETE,
      url: '/',
      middlewares: [],
      fn: ApiErrorHandler(services.Delete),
    },
    {
      method: ReqMethods.GET,
      url: '/getcardinfo',
      middlewares: [],
      fn: ApiErrorHandler(services.GetCardInfo),
    },
    {
      method: ReqMethods.GET,
      url: '/getById',
      middlewares: [],
      fn: ApiErrorHandler(services.GetById),
    },
    // {
    //   method: ReqMethods.GET,
    //   url: '/profile',
    //   middlewares: [],
    //   fn: ApiErrorHandler(services.GetAppProfile)
    // },
    {
      method: ReqMethods.POST,
      url: '/',
      middlewares: [],
      fn: ApiErrorHandler(services.Create),
    },
    {
      method: ReqMethods.PUT,
      url: '/',
      middlewares: [],
      fn: ApiErrorHandler(services.Update),
    },
    {
      method: ReqMethods.GET,
      url: '/get-one',
      middlewares: [],
      fn: ApiErrorHandler(services.GetOne),
    },

    // {
    //   method: ReqMethods.PUT,
    //   url: '/update_with_company_id',
    //   middlewares: [],
    //   fn: ApiErrorHandler(services.UpdateAgencyWithCompanyId)
    // },
    // {
    //   method: ReqMethods.PUT,
    //   url: '/update_with_snapshot_id',
    //   middlewares: [],
    //   fn: ApiErrorHandler(services.UpdateAgencyWithSnapshotId)
    // },
    // {
    //   method: ReqMethods.GET,
    //   url: '/get-agency-with-user',
    //   middlewares: [],
    //   fn: ApiErrorHandler(services.GetAgencyWithUser)
    // },
    // {
    //   method: ReqMethods.GET,
    //   url: "/getworkflows",
    //   middlewares: [],
    //   fn: ApiErrorHandler(services.GetWorkFlows),
    // },
    // {
    //   method: ReqMethods.PUT,
    //   url: '/',
    //   middlewares: [Validate(agencyVld.Update, 'body')],
    //   fn: ApiErrorHandler(services.Update)
    // },
    // {
    //   method: ReqMethods.GET,
    //   url: "/getprospect",
    //   middlewares: [],
    //   fn: ApiErrorHandler(services.getProspect),
    // },
  ]

  for (var route of routes) {
    const { method, url, middlewares, fn } = route

    router[method](url, ...middlewares, fn)
  }

  return router
}

module.exports = Route()
