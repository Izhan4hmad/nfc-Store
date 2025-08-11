const express = require('express')
const router = express.Router()

const { ReqMethods } = require('../../_enums/enums')

const controllers = require('./controllers')
const { ApiErrorHandler } = require('../../_utils/handler')

const uploader = require('./files.middleware')

const Route = () => {
    const routes = [
        {
            method: ReqMethods.POST,
            url: '/upload/image',
            middlewares: [uploader.single('image')],
            fn: ApiErrorHandler(controllers.UploadImage)
        },
        {
            method: ReqMethods.POST,
            url: '/upload/images',
            middlewares: [uploader.single('company_logo')],
            fn: ApiErrorHandler(controllers.UploadImage)
        },

    ]

    for (var route of routes) {
        const { method, url, middlewares, fn } = route

        router[method](url, ...middlewares, fn)
    }

    return router
}

module.exports = Route()