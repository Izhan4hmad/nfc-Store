// const BASE_URL    = 'https://rest.gohighlevel.com/v1'
const V2_BASE_URL = 'https://api.msgsndr.com'

const APIs = {
  oauth : `${V2_BASE_URL}/oauth/token`,
  v2    : {
    location: `${V2_BASE_URL}/locations`
  }
}

export {
  APIs
}