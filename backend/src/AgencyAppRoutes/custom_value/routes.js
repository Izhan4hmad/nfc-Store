const express = require('express')
const router = express.Router()

const { ReqMethods } = require('../../_enums/enums')
const { Authenticate, Validate } = require('../../lib/auth/auth.services')

const { ApiErrorHandler } = require('../../_utils/handler')
const { Docs_categoryVld } = require('../../_validations')

const services = require('./services')

const Route = () => {
  const routes = [
    {
      method: ReqMethods.GET,
      url: '/crm/list',
      middlewares: [],
      fn: ApiErrorHandler(services.GetGHLCustomValueList),
    },
    {
      method: ReqMethods.GET,
      url: '/crm/workflow',
      middlewares: [],
      fn: ApiErrorHandler(services.GetGHLWorkflowList),
    },
    {
      method: ReqMethods.POST,
      url: '/',
      middlewares: [],
      fn: ApiErrorHandler(services.Create),
    },
    {
      method: ReqMethods.GET,
      url: '/',
      middlewares: [],
      fn: ApiErrorHandler(services.Get),
    },
    {
      method: ReqMethods.GET,
      url: '/filter',
      middlewares: [],
      fn: ApiErrorHandler(services.Filter),
    },
    {
      method: ReqMethods.DELETE,
      url: '/',
      middlewares: [],
      fn: ApiErrorHandler(services.Delete),
    },
    {
      method: ReqMethods.PUT,
      url: '/',
      middlewares: [],
      fn: ApiErrorHandler(services.Update),
    },
    {
      method: ReqMethods.POST,
      url: '/webhookaccess/:app_id',
      middlewares: [],
      fn: ApiErrorHandler(services.TrigerData),
    },
  ]

  for (var route of routes) {
    const { method, url, middlewares, fn } = route

    router[method](url, ...middlewares, fn)
  }

  return router
}

module.exports = Route()
