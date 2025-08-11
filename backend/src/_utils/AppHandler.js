const {
  AppTokenModel,
  MaretplaceAppsModel,
  FreeAppTokenModel,
} = require('../model')
const { VerifyAccessToken } = require('./GhlTokenHandler')

const AppTokenHandler = async (request_data) => {
  let app_token = null
  let type = 'app_token'
  // //console.log(request_data, "request_datarequest_datarequest_datarequest_data");
  if (request_data?.agency_id) {
    app_token = await AppTokenModel.findOne({
      agency_id: request_data.agency_id,
    })
    if (app_token) {
      // return app_token;
    } else {
      app_token = await FreeAppTokenModel.findOne({
        agency_id: request_data.agency_id,
      })
      type = 'free_app_token'
      // return app_token;
    }
  } else {
    // const app = await MaretplaceAppsModel.findOne({ app_id: request_data?.app_id });
    app_token = await AppTokenModel.findOne(request_data)
    // //console.log(app_token, "app_token");

    if (app_token) {
      // return app_token;
    } else {
      // //console.log("else");
      app_token = await FreeAppTokenModel.findOne(request_data)
      // //console.log(app_token, "app_token");
      type = 'free_app_token'
      // return app_token;
    }
  }
  // //console.log(app_token, "app_tokenapp_tokenapp_tokenapp_token");
  if (app_token) {
    const verify = await VerifyAccessToken(app_token, type)
    if (verify.success) {
      app_token = await FreeAppTokenModel.findById(app_token._id)
      if (!app_token) {
        app_token = await AppTokenModel.findById(app_token._id)
      }
    }
  }
  return app_token
}
const UpdateAppTokenHandler = async (id, body) => {
  const app_token = await AppTokenModel.findById(id)

  if (app_token) {
    const app_token = await AppTokenModel.findByIdAndUpdate(id, body)
    return app_token
  } else {
    const app_token = await FreeAppTokenModel.findByIdAndUpdate(id, body)
    return app_token
  }
}
const FreeAppInstallEventHandler = async (req) => {
  // //console.log(req.body, "installevent");
  var data = req.body
  // const app = await MaretplaceAppsModel.findOne({ "free_app.app_id": data.appId })
  // if (app?.free_app?.app_triggers == undefined || app?.free_app?.app_triggers == false) {
  //   return {
  //     success: true,
  //     message: 'App do not need app token',
  //   }
  // }
  if (data.locationId) {
    // //console.log("location installevent");

    var find = await FreeAppTokenModel.findOne({
      location_id: data.locationId,
      app_id: data.appId,
    })
  } else {
    // //console.log("company installevent");
    var find = await FreeAppTokenModel.findOne({
      app_id: data.appId,
      company_id: data.companyId,
    })
  }
  // //console.log(find, "findfindfind");
  if (req.body.type == 'INSTALL') {
    const create_data = {
      location_id: data.locationId,
      app_id: data.appId,
      company_id: data.companyId,
      type: data.type,
    }
    if (find) {
      var result = await FreeAppTokenModel.findByIdAndUpdate(
        find._id,
        create_data
      )
    } else {
      var result = await FreeAppTokenModel.create(create_data)
    }
  }
  if (req.body.type == 'UNINSTALL') {
    if (find) {
      const payload = {
        refresh_token: null,
        access_token: null,
      }
      var result = await FreeAppTokenModel.findByIdAndUpdate(find._id, payload)
    }
  }
  return {
    success: result ? true : false,
    message: result ? 'App Found' : 'something went wrong while getting data',
    data: result,
  }
}

// const TokenHandler = async (options, ) => {

// }

module.exports = {
  AppTokenHandler,
  UpdateAppTokenHandler,
  FreeAppInstallEventHandler,
}
