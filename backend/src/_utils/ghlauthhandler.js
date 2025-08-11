const enums = require("../_enums");
const { ResponseStatus, ResponseMessages } = require("../_enums");
const {
  AppTokenModel,
  AppLogsModel,
  AllAppLocationsModel,
  MaretplaceAppsModel,
} = require("../model");
const { AppTokenHandler } = require("../_utils/AppHandler");
const ghlAuthHandler = async (app_id, loc_id, company_id, body_data) => {
  // console.log(app_id, loc_id, company_id, body_data, "ghlAuthHandler");
  if (body_data) {
    const applogspayload = {
      locationId: loc_id,
      companyId: company_id,
      app_id: app_id,
      action: body_data?.meta?.key,
    };

    // console.log(applogspayload, "applogspayload");
    const result = await AppLogsModel.create(applogspayload);
    // console.log(result, "result");
  }

  // const app = await MaretplaceAppsModel.findOne({ app_id: app_id });
  // //console.log(app, "app");
  // if (app) {
  // let check_auth = await AppTokenModel.findOne({
  //   $or: [{ location_id: loc_id }, { "Ghl.location_id": loc_id }],
  //   $or: [{ app_id: app_id }, { "Ghl.app_id": app_id }],
  // });
  // //console.log(check_auth, "check_auth");
  // if (check_auth) {
  //   const app = await MaretplaceAppsModel.findOne({ app_id: app_id });
  //   let type = "paid"
  //   if (app?.app_subscription_type?.value == "unlimited") {
  //     type = "unlimited"
  //   }
  //   return {
  //     success: true,
  //     status: 200,
  //     message: "app found",
  //     data: check_auth,
  //     type: type,
  //   };
  // } else {
  //   var main_company_id = company_id;
  //   //console.log(company_id, "company_id");
  //   if (!company_id) {
  //     const allLocations = await AllAppLocationsModel.findOne({
  //       locatoin_id: loc_id,
  //     });
  //     //console.log(allLocations, "allLocations");

  //     var main_company_id = allLocations?.company_id;
  //   }
  //   //console.log(main_company_id, "main_company_id");
  //   check_auth = await AppTokenModel.findOne({
  //     company_id: main_company_id,
  //     app_id: "66683d23e145c0823215ecd9",
  //   });
  //   //console.log(check_auth, "check_auth");
  //   if (check_auth) {
  //     return {
  //       success: true,
  //       status: 200,
  //       message: "app found",
  //       data: check_auth,
  //       type: "free",
  //     };
  //   } else {
  //     return {
  //       success: false,
  //       status: 400,
  //       message: "Sorry this app is not authenticate for this location free",
  //     };
  //   }
  // }
  const app = await MaretplaceAppsModel.findOne({ app_id: app_id });
  let check_auth = await AppTokenHandler({
    location_id: loc_id,
    app_id: app_id,
  });
  // console.log(check_auth, "check_auth");
  if (check_auth) {
    if (app?.type == "paid" || app?.type == undefined) {
      return {
        success: true,
        status: 200,
        message: "app found",
        data: check_auth,
        type: "free",
      };
    } else {
      return {
        success: true,
        status: 200,
        message: "app found",
        data: check_auth,
        type: "paid",
      };
    }
  } else {
    return {
      success: false,
      status: 400,
      message: "Sorry this app is not authenticate for this location",
    };
  }
  // } else {
  //   const free_app = await MaretplaceAppsModel.findOne({ "free_app.app_id": app_id });
  //   if (free_app) {
  //     var main_company_id = company_id;
  //     //console.log(company_id, "company_id");
  //     if (!company_id) {
  //       const allLocations = await AllAppLocationsModel.findOne({
  //         locatoin_id: loc_id,
  //       });
  //       //console.log(allLocations, "allLocations");

  //       var main_company_id = allLocations?.company_id;
  //     }
  //     //console.log(main_company_id, "main_company_id");
  //     const check_auth = await AppTokenModel.findOne({
  //       company_id: main_company_id,
  //       app_id: "66683d23e145c0823215ecd9",
  //     });
  //     //console.log(check_auth, "check_auth");
  //     if (check_auth) {
  //       return {
  //         success: true,
  //         status: 200,
  //         message: "app found",
  //         data: check_auth,
  //         type: "free",
  //       };
  //     } else {
  //       return {
  //         success: false,
  //         status: 400,
  //         message: "Sorry this app is not authenticate for this location free",
  //       };
  //     }
  //   } else {
  //     return {
  //       success: false,
  //       status: 400,
  //       message: "Sorry this app is not authenticate for this location paid",
  //     };
  //   }
  // }

  // if (app_id == "652d6e35ccaaad174708ec8d") {
  //   const auth_data = await AppTokenModel.findOne({
  //     company_id: company_id,
  //     $or: [
  //       { app_id: "66211c630c2c0e437621b252" },
  //       { app_id: "65b7a17e3d62af6ddc63289b" }
  //     ]
  //   });
  //   if (auth_data) {
  //     return {
  //       success: true,
  //       status: 200,
  //       message: "app found",
  //       data: auth_data,
  //     }
  //   }

  //   return {
  //     success: false,
  //     status: 400,
  //     message: "Sorry this app is not authenticate for this location",
  //   };
  // }
  // const auth_data = await AppTokenModel.find({
  //   location_id: loc_id
  // });
  // var check_auth = auth_data.filter(function (item) {
  //   return item.app_id == app_id || item.type == "unlimited_app";
  // });
  // if (check_auth[0]) {
  //   return {
  //     success: true,
  //     status: 200,
  //     message: "app found",
  //     data: check_auth[0],
  //   }
  // } else {
  //   return {
  //     success: false,
  //     status: 400,
  //     message: "Sorry this app is not authenticate for this location",
  //   };
  // }
};

// return {
//   success: false,
//   status: 404,
//   message: "Sorry this app is not authenticate for this location",

// };

const EmailHandler = (fn) => {
  return (data) => {
    return fn({ ...data })
      .then((res) => {
        // logging.EmailErrorLog(data, res, null) You can generate logs here
        return res;
      })
      .catch((err) => {
        // //console.log(`Sending ${data.service} Email - ERROR`, err);
        // logging.EmailErrorLog(data, null, err)
        return {
          success: false,
          message: "Error sending email",
          error: err.message,
        };
      });
  };
};

/**
 *
 * @param {Object} schema - The valid data schema
 * @param {Object} data - The data object that needs to be verify
 * @param {Object} res - The controller response param
 *
 */
const ValidationrHandler = (schema, data, res) => {
  const { error, value } = schema.validate(data);

  if (!error)
    return {
      value,
    };

  return {
    invalid: () => {
      return res.status(ResponseStatus.BAD_REQUEST).send({
        success: false,
        message: ResponseMessages.VALIDATION_ERROR,
        error: error.message,
      });
    },
  };
};

/**
 *
 * @param {Function} fn - The service function
 * @param {Object} data - The data object that needs to be pass in the service function
 * @param {Object} res - The controller response param
 *
 */
const ServiceHandler = async (fn, data, res) => {
  const result = await fn(data);

  if (!result?.success)
    return res.status(enums.ResponseStatus.BAD_REQUEST).send(result);

  if (result?.success) {
    const { execution, ...detail } = result;
    res.status(enums.ResponseStatus.SUCCESS).send(detail);
    execution && execution();
    return;
  }
};

module.exports = {
  ghlAuthHandler,
  EmailHandler,
  ValidationrHandler,
  ServiceHandler,
};
