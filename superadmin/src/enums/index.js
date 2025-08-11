import * as ghl from './ghl'
import * as user from './user'

const Environment = {
  DEVELOPMENT : 'development',
  STAGING     : 'staging',
  PRODUCTION  : 'production',
}

const ReqMethods = {
  GET    : 'get',
  POST   : 'post',
  PUT    : 'put',
  DELETE : 'delete',
}

const ResponseStatus = {
  SUCCESS        : 200,
  BAD_REQUEST    : 400,
  UNAUTHORIZED   : 401,
  FORBIDDEN      : 403,
  NOT_FOUND      : 404,
  INTERNAL_ERROR : 500,
}

export { 
  Environment,
  ReqMethods,
  ResponseStatus,
  ghl,
  user
}
