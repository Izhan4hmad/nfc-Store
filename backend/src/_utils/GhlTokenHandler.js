const { default: axios } = require("axios");
const qs = require("querystring");
const {
  FreeAppTokenModel,
  AppTokenModel,
  MaretplaceAppsModel,
  AppUserModel,
  AppSetupModal,
  TriggersModel,
  AppCompaniesModel,
} = require("../model");
const { upsertContact } = require("./GhlHandler");
const models = require("../model");
const { AccessTokenTypes } = require("../_enums");
const sendTrigger = async (triggerData, ghl, data) => {
  // //console.log("sendTrigger work");
  for (let i = 0; i < triggerData.length; i++) {
    var element = triggerData[i];
    var config = {};
    config = {
      method: "post",
      maxBodyLength: Infinity,
      url: element.triggerData.targetUrl,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ghl?.access_token}`,
        Version: "2021-04-15",
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios
      .request(config)
      .then((response) => {
        // //console.log(
        //   JSON.stringify(
        //     response.data,
        //     "responseresponseresponseresponseresponseresponseresponseresponseresponseresponse"
        //   )
        // );
      })
      .catch((error) => {
        // //console.log(error, "errorerrorerrorerrorerror");
      });
  }
};
const RefreshTokenWithAppKeys = async ({
  client_id,
  client_secret,
  refresh_token,
}) => {
  var options = {
    method: "POST",
    url: "https://api.msgsndr.com/oauth/token",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: qs.stringify({
      client_id: client_id,
      client_secret: client_secret,
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }),
  };

  const result = await axios
    .request(options)
    .then(function (response) {
      return {
        success: true,
        status: 200,
        data: response.data,
      };
    })
    .catch(function (error) {
      // //console.log(error);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });

  return result;
};
const getUpdateToken = async (data) => {
  const app = await MaretplaceAppsModel.findOne({ app_id: data.app_id });
  var options = {
    method: "POST",
    url: "https://api.msgsndr.com/oauth/token",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: qs.stringify({
      client_id: app?.client_id,
      client_secret: app?.client_secret,
      grant_type: "refresh_token",
      refresh_token: data?.refresh_token,
    }),
  };

  const result = await axios
    .request(options)
    .then(function (response) {
      return {
        success: true,
        status: 200,
        data: response.data,
      };
    })
    .catch(function (error) {
      // //console.log(error);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });

  return result;
};
const getUpdateTokenWithModelType = async (data, app) => {
  var options = {
    method: "POST",
    url: "https://api.msgsndr.com/oauth/token",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: qs.stringify({
      client_id: app?.client_id,
      client_secret: app?.client_secret,
      grant_type: "refresh_token",
      refresh_token: data?.refresh_token,
    }),
  };

  const result = await axios
    .request(options)
    .then(function (response) {
      // //console.log(response.data);
      return {
        success: true,
        status: 200,
        data: response.data,
      };
    })
    .catch(function (error) {
      // //console.log(error);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });

  return result;
};
const getUpdateSupportToken = async (data, keys) => {
  //console.log("getUpdateSupportToken");
  var options = {
    method: "POST",
    url: "https://api.msgsndr.com/oauth/token",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: qs.stringify({
      client_id: keys?.client_id,
      client_secret: keys?.client_secret,
      grant_type: "refresh_token",
      refresh_token: data?.refresh_token,
    }),
  };

  const result = await axios
    .request(options)
    .then(function (response) {
      return {
        success: true,
        status: 200,
        data: response.data,
      };
    })
    .catch(function (error) {
      // //console.log(error);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });

  return result;
};
const search_contact_token_check = async (ghl, email) => {
  var options = {
    method: "GET",
    url: "https://services.leadconnectorhq.com/contacts/",
    params: {
      locationId: ghl.location_id,
      query: email,
      limit: "1",
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + ghl.access_token,
      Version: "2021-04-15",
    },
  };

  var contact_search = await axios
    .request(options)
    .then(function (response) {
      // //console.log(response.data);
      return {
        success: true,
        status: 200,
        data: response.data.contacts,
      };
    })
    .catch(function (error) {
      // console.error(error);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  if (contact_search.success) {
    if (contact_search.data.length > 0) {
      // //console.log(contact_search.data.length);
      return {
        success: true,
        status: 200,
        data: contact_search.data[0],
      };
    }
    // //console.log(contact_search.data.length);

    return {
      success: false,
      status: 404,
      data: contact_search.data,
    };
  }
  return contact_search;
};
const VerifyAccessToken = async (token_data, type) => {
  // //console.log("VerifyAccessTokenVerifyAccessToken");
  const check_token = await search_contact_token_check(
    token_data,
    "test@gmail.com"
  );
  // //console.log(check_token?.success, "check_token?.success");
  // //console.log(check_token?.data?.response, "check_token?.data?.response");

  if (
    !check_token?.success &&
    check_token?.data?.response?.data?.statusCode == 401 &&
    check_token?.data?.response?.data?.message == "Invalid JWT"
  ) {
    const collections = {
      free_app_token: FreeAppTokenModel,
      app_token: AppTokenModel,
    };
    const token = await getUpdateToken(token_data);
    if (token?.success) {
      var result = await collections[type].findByIdAndUpdate(
        token_data?._id,
        {
          access_token: token.data.access_token,
          refresh_token: token.data.refresh_token,
        },
        { new: true }
      );
      return {
        success: true,
        message: "token get successfully",
        data: token?.data,
      };
    } else {
      const app = await MaretplaceAppsModel.findOne({
        app_id: token_data.app_id,
      });
      // //console.log(app?.name, "app?.nameapp?.name");
      const user = await AppUserModel.findOne({
        app_id: token_data?.app_id,
        CompanyId: token_data?.company_id,
      });
      // //console.log(user, "useruser");

      if (user && user?.GHLContactID) {
        const app_setup = await AppSetupModal.findOne();
        // //console.log(app_setup, "app_setupapp_setup");
        const triggerData = await TriggersModel.find({
          "extras.locationId": app_setup?.ghl?.location_id,
          "triggerData.key": "app_token_expire",
        });
        const company = await AppCompaniesModel.find({
          app_id: token_data?.app_id,
          CompanyId: token_data?.company_id,
        });
        // //console.log(triggerData, "triggerDatatriggerData");
        let domain = "";
        if (company?.Domain) {
          domain = company?.Domain;
        }
        const install_link = `https://${domain}/integration/${app?.app_id}`;
        const data = {
          contactId: user?.GHLContactID,
          app_name: app?.name,
          app_id: app?.app_id,
          user_name: user?.Name,
          user_email: user?.email,
          app_type: app?.app_type?.value,
          install_link: install_link,
        };
        // //console.log(data, "datadata");
        const trigger = await sendTrigger(triggerData, app_setup?.ghl, data);
      }
      return {
        success: false,
        message: "something went wrong while updating token",
        data: token?.data,
      };
    }
  } else {
    return {
      success: true,
      message: "missing scopes or something else",
    };
  }
};
const VerifyAccessTokenWithType = async (token_data, key, type) => {
  const check_token = await search_contact_token_check(
    token_data,
    "test@gmail.com"
  );

  if (
    !check_token?.success &&
    check_token?.data?.response?.data?.statusCode == 401 &&
    check_token?.data?.response?.data?.message == "Invalid JWT"
  ) {
    const app = await MaretplaceAppsModel.findOne({
      app_id: token_data.app_id,
    });
    if (type == AccessTokenTypes.MAIN) {
      var token = await getUpdateTokenWithModelType(token_data, app);
    } else if (type == AccessTokenTypes.GHL) {
      var token = await getUpdateTokenWithModelType(token_data?.ghl, app);
      //console.log(token, "token");
    } else {
      var token = await getUpdateTokenWithModelType(
        token_data?.agency_ghl,
        app
      );
    }
    if (token?.success) {
      var result = await models[key].findByIdAndUpdate(
        token_data?._id,
        {
          access_token: token.data.access_token,
          refresh_token: token.data.refresh_token,
        },
        { new: true }
      );
      return {
        success: true,
        message: "new token get successfully",
        data: result,
      };
      // return result;
    } else {
      // //console.log(app?.name, "app?.nameapp?.name");
      const user = await AppUserModel.findOne({
        app_id: token_data?.app_id,
        CompanyId: token_data?.company_id,
      });
      // //console.log(user, "useruser");

      if (user && user?.GHLContactID) {
        const app_setup = await AppSetupModal.findOne();
        // //console.log(app_setup, "app_setupapp_setup");
        const triggerData = await TriggersModel.find({
          "extras.locationId": app_setup?.ghl?.location_id,
          "triggerData.key": "app_token_expire",
        });
        const company = await AppCompaniesModel.find({
          app_id: token_data?.app_id,
          CompanyId: token_data?.company_id,
        });
        // //console.log(triggerData, "triggerDatatriggerData");
        let domain = "";
        if (company?.Domain) {
          domain = company?.Domain;
        }
        const install_link = `https://${domain}/integration/${app?.app_id}`;
        const data = {
          contactId: user?.GHLContactID,
          app_name: app?.name,
          app_id: app?.app_id,
          user_name: user?.Name,
          user_email: user?.email,
          app_type: app?.app_type?.value,
          install_link: install_link,
        };
        // //console.log(data, "datadata");
        const trigger = await sendTrigger(triggerData, app_setup?.ghl, data);
      }
      return {
        success: false,
        message: "something went wrong while getting new token",
        data: token_data,
      };
      // return token_data;
    }
  } else {
    return {
      success: true,
      message: "token is already refresh",
      data: token_data,
    };
    // return token_data;
  }
};
const VerifySupportToken = async (token_data, type) => {
  const check_token = await search_contact_token_check(
    token_data.ghl,
    "test@gmail.com"
  );
  if (
    !check_token?.success &&
    check_token?.data?.response?.data?.statusCode == 401 &&
    check_token?.data?.response?.data?.message == "Invalid JWT"
  ) {
    let ClientId = "668fce5baff239cd7461ffb7-lyh97gk6";
    let ClientSecert = "6cff26fc-9308-4b33-9147-d945766ab67a";
    if (type == "yourself") {
      ClientId = "67c4c24e8a711266d564f5b5-m7s3mzub";
      ClientSecert = "7f4b8424-7d4d-4e28-9065-5a6bd81fcb20";
    }
    let keys = {
      client_id: ClientId,
      client_secret: ClientSecert,
    };
    //console.log("called", keys);
    var token = await getUpdateSupportToken(token_data?.ghl, keys);
    //console.log("tokentokentokentoken", token);
    let update_data = {
      ghl: {
        access_token: token.data.access_token,
        refresh_token: token.data.refresh_token,
        location_id: token.data.locationId,
        company_id: token.data.companyId,
      },
    };
    if (token?.success) {
      if (type == "yourself") {
        var find = await models.supportCustomizationModel.findOne({
          company_id: token.data.companyId,
        });
        var result = await models.supportCustomizationModel.findByIdAndUpdate(
          find._id,
          update_data,
          { new: true }
        );
      } else {
        var find = await AppSetupModal.findOne();
        var result = await AppSetupModal.findByIdAndUpdate(
          find._id,
          update_data,
          {
            new: true,
          }
        );
      }

      return {
        success: true,
        message: "new token get successfully",
        data: result,
      };
      // return result;
    } else {
      return {
        success: false,
        message: "something went wrong while getting new token",
        data: token_data,
      };
      // return token_data;
    }
  } else {
    return {
      success: true,
      message: "token is already refresh",
      data: token_data,
    };
    // return token_data;
  }
};
module.exports = {
  VerifyAccessToken,
  VerifyAccessTokenWithType,
  VerifySupportToken,
  RefreshTokenWithAppKeys,
};
