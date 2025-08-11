const express = require('express')
const router = express.Router()

const { ReqMethods } = require('../../../_enums/enums')

const { ApiErrorHandler } = require('../../../_utils/handler')

const { Authenticate, Validate } = require('../../../lib/auth/auth.services')

const services = require('./services')
const { ghlVld } = require('../../../_validations')

const Route = () => {
    const routes = [
        {
            method: ReqMethods.POST,
            url: '/',
            middlewares: [Validate(ghlVld.GHLservices, 'body')],
            fn: ApiErrorHandler(services.CallService)
        },
    ]

    for (var route of routes) {
        const { method, url, middlewares, fn } = route

        router[method](url, ...middlewares, fn)
    }

    return router
}

module.exports = Route()