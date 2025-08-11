const express = require('express')
const router = express.Router()

const { ReqMethods } = require('../../_enums/enums')
// const { Authenticate, Validate } = require('../../lib/auth/auth.services')

const { ApiErrorHandler } = require('../../_utils/handler')
// const { DocsVld } = require('../../_validations')

const services = require('./services')

const Route = () => {
  const routes = [
    {
      method: ReqMethods.GET,
      url: '/',
      middlewares: [],
      fn: ApiErrorHandler(services.Get),
    },
    // {
    //   method: ReqMethods.GET,
    //   url: '/associateIdproduct',
    //   middlewares: [],
    //   fn: ApiErrorHandler(services.GetByAssociateID),
    // },
    {
      method: ReqMethods.POST,
      url: '/create',
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
      method: ReqMethods.POST,
      url: '/',
      middlewares: [],
      fn: ApiErrorHandler(services.Delete),
    },
    {
      method: ReqMethods.GET,
      url: '/GetProductByMerchantId',
      middlewares: [],
      fn: ApiErrorHandler(services.GetProductByMerchantId),
    },
    {
      method: ReqMethods.GET,
      url: '/GetByProductId',
      middlewares: [],
      fn: ApiErrorHandler(services.GetByProductId),
    },
    {
      method: ReqMethods.GET,
      url: '/GetProductByCompanyId',
      middlewares: [],
      fn: ApiErrorHandler(services.GetProductByCompanyId),
    },
    {
      method: ReqMethods.GET,
      url: '/GetByAgencyCreatedVariants',
      middlewares: [],
      fn: ApiErrorHandler(services.GetByAgencyCreatedVariants),
    },
    {
      method: ReqMethods.PUT,
      url: '/RemoveProductFromStore',
      middlewares: [],
      fn: ApiErrorHandler(services.RemoveProductFromStore),
    },
  ]

  for (var route of routes) {
    const { method, url, middlewares, fn } = route

    router[method](url, ...middlewares, fn)
  }

  return router
}

module.exports = Route()
