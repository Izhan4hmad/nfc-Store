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
      url: '/associateIdproduct',
      middlewares: [],
      fn: ApiErrorHandler(services.GetByAssociateID),
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
      url: '/create',
      middlewares: [],
      fn: ApiErrorHandler(services.Create),
    },
    {
      method: ReqMethods.POST,
      url: '/createNfcGroups',
      middlewares: [],
      fn: ApiErrorHandler(services.CreateGroups),
    },
    {
      method: ReqMethods.PUT,
      url: '/update',
      middlewares: [],
      fn: ApiErrorHandler(services.Update),
    },
    {
      method: ReqMethods.PUT,
      url: '/updateurl',
      middlewares: [],
      fn: ApiErrorHandler(services.UpdateNFCURL),
    },
    {
      method: ReqMethods.PUT,
      url: '/associatebyagency',
      middlewares: [],
      fn: ApiErrorHandler(services.AssociatedbyAgencyID),
    },
    {
      method: ReqMethods.GET,
      url: '/getbyagency',
      middlewares: [],
      fn: ApiErrorHandler(services.getByAgency),
    },
    {
      method: ReqMethods.POST,
      url: '/updatecarduser',
      middlewares: [],
      fn: ApiErrorHandler(services.UpdateCardUser),
    },
    {
      method: ReqMethods.POST,
      url: '/verify',
      middlewares: [],
      fn: ApiErrorHandler(services.VerifyUser),
    },
    {
      method: ReqMethods.GET,
      url: '/verify_token',
      middlewares: [],
      fn: ApiErrorHandler(services.VerifyToken),
    },
    {
      method: ReqMethods.GET,
      url: '/getusercards',
      middlewares: [],
      fn: ApiErrorHandler(services.getUserCards),
    },
    {
      method: ReqMethods.GET,
      url: '/getnfcgroups',
      middlewares: [],
      fn: ApiErrorHandler(services.GetNfcGroups),
    },
    {
      method: ReqMethods.POST,
      url: '/attach_action',
      middlewares: [],
      fn: ApiErrorHandler(services.attachAction),
    },
    {
      method: ReqMethods.POST,
      url: '/attach_action_by_admin',
      middlewares: [],
      fn: ApiErrorHandler(services.associateActionFromAdmin),
    },
    {
      method: ReqMethods.POST,
      url: '/detach_action',
      middlewares: [],
      fn: ApiErrorHandler(services.detachAction),
    },
    {
      method: ReqMethods.POST,
      url: '/detach_action_by_admin',
      middlewares: [],
      fn: ApiErrorHandler(services.deleteActionFromAdmin),
    },
    {
      method: ReqMethods.GET,
      url: '/getcard',
      middlewares: [],
      fn: ApiErrorHandler(services.getcard),
    },
    {
      method: ReqMethods.GET,
      url: '/getcard',
      middlewares: [],
      fn: ApiErrorHandler(services.getcard),
    },
    {
      method: ReqMethods.GET,
      url: '/getAllusers',
      middlewares: [],
      fn: ApiErrorHandler(services.GetAllUsers),
    },
    {
      method: ReqMethods.GET,
      url: '/getUserCards',
      middlewares: [],
      fn: ApiErrorHandler(services.GetCardsByIds),
    },
    {
      method: ReqMethods.GET,
      url: '/getAssociatedActionById',
      middlewares: [],
      fn: ApiErrorHandler(services.GetAssociatedActionById),
    },
    {
      method: ReqMethods.GET,
      url: '/UpdateAssociatedActionById',
      middlewares: [],
      fn: ApiErrorHandler(services.UpdateAssociatedAction),
    },
    {
      method: ReqMethods.POST,
      url: '/create_admin_action',
      middlewares: [],
      fn: ApiErrorHandler(services.CreateSuperAdminAction),
    },
    {
      method: ReqMethods.GET,
      url: '/get_admin_action',
      middlewares: [],
      fn: ApiErrorHandler(services.GetSuperAdminActions),
    },
    {
      method: ReqMethods.PUT,
      url: '/update_admin_action',
      middlewares: [],
      fn: ApiErrorHandler(services.UpdateSuerAdminAction),
    },
    {
      method: ReqMethods.POST,
      url: '/delete_admin_action',
      middlewares: [],
      fn: ApiErrorHandler(services.DeleteSuperAdminAction),
    },
    {
      method: ReqMethods.GET,
      url: '/get_by_user_id',
      middlewares: [],
      fn: ApiErrorHandler(services.GetByUserId),
    },
  ]

  for (var route of routes) {
    const { method, url, middlewares, fn } = route

    router[method](url, ...middlewares, fn)
  }

  return router
}

module.exports = Route()
