const express = require('express')
const router = express.Router()

const { ReqMethods } = require('../../_enums/enums')
const { Authenticate, Validate } = require('../../lib/auth/auth.services')

const { ApiErrorHandler } = require('../../_utils/handler')
const { DocsVld } = require('../../_validations')

const services = require('./services')

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
      url: '/product_details',
      middlewares: [],
      fn: ApiErrorHandler(services.GetProductDetails),
    },
    {
      method: ReqMethods.PUT,
      url: '/redeem_coupon',
      middlewares: [],
      fn: ApiErrorHandler(services.UpdateRedeemCoupon),
    },
    {
      method: ReqMethods.GET,
      url: '/coupon_details',
      middlewares: [],
      fn: ApiErrorHandler(services.GetCouponDetails),
    },
    {
      method: ReqMethods.GET,
      url: '/tags_details',
      middlewares: [],
      fn: ApiErrorHandler(services.GetTagsDetails),
    },
    
  ]

  for (var route of routes) {
    const { method, url, middlewares, fn } = route
    console.log(method, url, middlewares)
    router[method](url, ...middlewares, fn)
  }

  return router
}

module.exports = Route()
