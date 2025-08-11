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
      method: ReqMethods.GET,
      url: '/GetBundleByMerchantId',
      middlewares: [],
      fn: ApiErrorHandler(services.GetBundleByMerchantId),
    },
    {
      method: ReqMethods.GET,
      url: '/GetByBundleId',
      middlewares: [],
      fn: ApiErrorHandler(services.GetByBundleId),
    },
    {
      method: ReqMethods.GET,
      url: '/GetBundleByCompanyId',
      middlewares: [],
      fn: ApiErrorHandler(services.GetBundleByCompanyId),
    },
    {
      method: ReqMethods.DELETE,
      url: '/',
      middlewares: [],
      fn: ApiErrorHandler(services.Delete),
    },
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
      method: ReqMethods.PUT,
      url: '/RemoveBundleFromStore',
      middlewares: [],
      fn: ApiErrorHandler(services.RemoveBundleFromStore),
    },
    {
      method: ReqMethods.POST,
      url: '/buy',
      middlewares: [],
      fn: ApiErrorHandler(services.BuyPackage),
    },
    {
      method: ReqMethods.GET,
      url: '/get_order',
      middlewares: [],
      fn: ApiErrorHandler(services.GetPackage),
    },
    {
      method: ReqMethods.GET,
      url: '/get_order_details',
      middlewares: [],
      fn: ApiErrorHandler(services.GetOrderDetails),
    },
  ]

  for (var route of routes) {
    const { method, url, middlewares, fn } = route

    router[method](url, ...middlewares, fn)
  }

  return router
}

module.exports = Route()
