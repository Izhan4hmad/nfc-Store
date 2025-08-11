const User = require('../../model/user')

const { ResponseStatus, ResponseMessages } = require("../../_enums")
const { ApiErrorHandler, ValidationrHandler } = require("../../_utils/handler")
const { decodeToken } = require('../../_utils/guard')
const Responses = require('./responses')
const enums = require('../../_enums/enums')
const { Apps } = require('../../model')

const Authenticate = async (req, res, next) => {

    const token = req.header('x-auth-token');

    if (!token || !token.includes('Bearer')) // check valid token
        return res.status(ResponseStatus.UNAUTHORIZED).send({ error: ResponseMessages.AUTH_ERROR })

    const jwtToken = token.split(' ')[1]

    if (!jwtToken) // check token exist
        return res.status(ResponseStatus.UNAUTHORIZED).send({ error: ResponseMessages.AUTH_ERROR })

    if (jwtToken.length < 100) // check token length
        return res.status(ResponseStatus.UNAUTHORIZED).send({ error: ResponseMessages.AUTH_ERROR })

    const tokenData = await decodeToken(jwtToken)

    if (!tokenData.success) // error in token
        return res.status(ResponseStatus.UNAUTHORIZED).send({ error: tokenData.error })

    const user = await User.findById(tokenData.data._id)

    if (!user) // no user found
        return res.status(ResponseStatus.UNAUTHORIZED).send({ error: Responses.User.NOT_FOUND })

    req.user = user.toJSON()

    next()

}

const Authorize = ({ types = Object.values(enums.user.Types), roles = Object.values(enums.user.Roles) }) => {
    return async (req, res, next) => {
        const user = req.user

        if (!user || !types.some(type => user.user_type == type) || !user.roles.some(role => roles.includes(role)))
            return res.status(ResponseStatus.FORBIDDEN).send({ error: ResponseMessages.FORBIDDEN })

        next()
    }
}

const VerifyApp = async (req, res, next) => {
    const key = req.header('apiKey')

    if (!key)
        return res.status(ResponseStatus.UNAUTHORIZED).send({ error: ResponseMessages.AUTH_ERROR })

    const [bearer, apiKey] = key.split(' ')
    // const app_id           = req.query.app_id || req.params.app_id || req.body.app_id

    if (!bearer || bearer != 'Bearer' || !apiKey)
        return res.status(ResponseStatus.UNAUTHORIZED).send({ error: ResponseMessages.AUTH_ERROR })

    const app = await Apps.findOne({ apikey: apiKey })

    if (!app)
        return res.status(ResponseStatus.UNAUTHORIZED).send({ error: ResponseMessages.AUTH_ERROR })

    if (apiKey != app.toJSON().apikey)
        return res.status(ResponseStatus.UNAUTHORIZED).send({ error: ResponseMessages.AUTH_ERROR })

    req.app = app.toJSON()

    next()
}

const Validate = (schema, dataIn) => {
    return async (req, res, next) => {
        const { invalid, value } = ValidationrHandler(schema, req[dataIn], res)
        if (invalid) return invalid()
        req.validValues = value
        next()
    }
}

const VerifyRequest = async (req, res, next) => {
    const key = req.header("apiKey");

    if (!key)
        return res
            .status(ResponseStatus.UNAUTHORIZED)
            .send({ error: ResponseMessages.AUTH_ERROR });

    const [bearer, apiKey] = key.split(" ");
    if (!bearer || bearer != "Bearer" || !apiKey)
        return res
            .status(ResponseStatus.UNAUTHORIZED)
            .send({ error: ResponseMessages.AUTH_ERROR });

    if (apiKey !== '3cd5bc70-21c10a09-b4d57562')
        return res
            .status(ResponseStatus.UNAUTHORIZED)
            .send({ error: ResponseMessages.AUTH_ERROR });

    next();
};

module.exports = {
    Authenticate: ApiErrorHandler(Authenticate),
    VerifyApp: ApiErrorHandler(VerifyApp),
    VerifyRequest: ApiErrorHandler(VerifyRequest),
    Validate: (schema, dataIn) => ApiErrorHandler(Validate(schema, dataIn)),
    Authorize: (types, roles) => ApiErrorHandler(Authorize({ types, roles })),

}
