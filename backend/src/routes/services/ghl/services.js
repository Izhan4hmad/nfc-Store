const axios              = require('axios')
const { ServiceHandler } = require('../../../_utils/handler')
const { ReqMethods }     = require('../../../_enums')

const CallService = async req => {
  const {method, path, query, payload, headers={}, key, version='2021-04-15'} = req.body
  const pathname = query ? path + '?' + query : path

  const config = {headers: {Authorization : 'Bearer ' + key, Version: version, ...headers}}

  const details = {}
  if(payload || method == ReqMethods.POST) details.payload = payload || {}
  details.config = config

  const res = await axios[method](pathname, ...Object.values(details))

  return { 
      success : true,
      data    : res.data
  }
}

module.exports = {
  CallService : (req, res) => ServiceHandler(CallService, req, res),
}