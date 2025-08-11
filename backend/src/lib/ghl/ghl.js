const axios = require("axios");
const {
  AgencyModel,
  Superadmin_settings,
  GHlLocationsModel,
  UserModel,
  stripeTokenModel,
  Agency_location_settings,
  AppTokenModel,
  MaretplaceAppsModel,
  FreeAppTokenModel,
  AppSetupModal,
} = require("../../model");
const env = require("../../_config/config");
const { ReqMethods } = require("../../_enums");
const enums = require("../../_enums/enums");
const { auth_data_collections } = require("../../_utils/Collections");
const { GHLV2APITokenHandler } = require("../../_utils/handler");
const qs = require("querystring");
const { CallWebhook, guard } = require("../../_utils");
const BASE_URL = "https://rest.gohighlevel.com/v1";
const V2_BASE_URL = "https://api.msgsndr.com";

const APIs = {
  oauth: {
    v1: {},
    v2: {
      base: V2_BASE_URL + "/oauth/token",
    },
  },
  locations: {
    v1: {
      base: BASE_URL + "/locations/",
      get: () => BASE_URL + "/locations/",
      getDetail: (locationId) => BASE_URL + "/locations/" + locationId,
      lookup: ({ query }) => BASE_URL + "/locations/lookup?" + query,
    },
    v2: {
      base: V2_BASE_URL + "/locations",
      getDetail: (locationId) => V2_BASE_URL + "/locations/" + locationId,
    },
  },
  users: {
    v1: {
      base: BASE_URL + "/users/",
      lookup: ({ query }) => BASE_URL + "/users/lookup?" + query,
    },
    v2: {
      base: V2_BASE_URL + "/users/",
    },
  },
  custom_fields: {
    v1: {
      base: () => BASE_URL + "/custom-fields/",
    },
    v2: {
      base: (locationId) =>
        V2_BASE_URL + "/locations/" + locationId + "/customFields",
    },
  },
  work_flows: {
    v1: {
      base: BASE_URL + "/workflows/",
      get: () => BASE_URL + "/workflows/",
    },
    v2: {
      base: V2_BASE_URL + "/workflows/",
      get: (locationId) => V2_BASE_URL + "/workflows/?locationId=" + locationId,
    },
  },
  contacts: {
    v1: {
      base: BASE_URL + "/contacts/",
      trigger_workflow: ({ contact_id, workflow_id }) =>
        BASE_URL + "/contacts/" + contact_id + "/workflow/" + workflow_id,
      lookup: ({ query }) => BASE_URL + "/contacts/lookup?" + query,
    },
    v2: {
      base: V2_BASE_URL + "/contacts/",
      trigger_workflow: ({ contact_id, workflow_id }) =>
        V2_BASE_URL + "/contacts/" + contact_id + "/workflow/" + workflow_id,
      lookup: ({ locationId, query }) =>
        V2_BASE_URL + "/contacts/?locationId=" + locationId + "&query=" + query,
    },
  },
  saas: {
    v1: {
      update: (locationId) =>
        BASE_URL + "/saas/update-saas-subscription/" + locationId,
    },
  },
};

const CallService = async ({
  method,
  path,
  query,
  payload,
  headers = {},
  key,
  version = "2021-04-15",
}) => {
  const pathname = query ? path + "?" + query : path;

  const config = {
    headers: { Authorization: "Bearer " + key, Version: version, ...headers },
  };

  const details = {};
  if (payload || method == ReqMethods.POST) details.payload = payload || {};
  details.config = config;

  const res = await axios[method](pathname, ...Object.values(details));

  return {
    success: true,
    data: res.data,
  };
};
const search_user = async (ghl, email) => {
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
      // console.log(response.data);
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
      // console.log(contact_search.data.length);
      return {
        success: true,
        status: 200,
        data: contact_search.data[0],
      };
    }
    // console.log(contact_search.data.length);

    return {
      success: false,
      status: 404,
      data: contact_search.data,
    };
  }
  return {
    success: false,
    status: 400,
    data: contact_search.data,
  };
};
const update_customField = async (custom_field, contact, ghl) => {
  var temp = [
    {
      id: custom_field.id,
      field_value: custom_field.value,
    },
  ];
  var data = JSON.stringify({
    email: contact.email,
    phone: contact.phone,
    name: contact.username,
    source: "public api",
    customFields: temp,
  });
  // console.log(data, "temp");

  var options = {
    method: "PUT",
    url: "https://services.leadconnectorhq.com/contacts/" + contact.id,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + ghl.access_token,
      Version: "2021-04-15",
    },
    data: data,
  };
  // console.log(options, "options");

  var contact_data = await axios
    .request(options)
    .then(function (response) {
      return {
        success: true,
        status: 200,
        data: response.data,
      };
    })
    .catch(function (error) {
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  // console.log(contact_data, "contact_data updating");

  if (contact_data.success) {
    return {
      success: true,
      status: 200,
      data: contact_data.data,
    };
  }
  return {
    success: false,
    status: 400,
    data: contact_data.data,
  };
};

const create_contact = async (custom_field, contact, ghl) => {
  var data = JSON.stringify({
    email: contact.email,
    phone: contact.phone,
    name: contact.name,
    locationId: ghl.location_id,
    source: "public api",
    customFields: custom_field,
  });
  // console.log(data, "create_contact");
  var options = {
    method: "POST",
    url: "https://services.leadconnectorhq.com/contacts/",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + ghl.access_token,
      Version: "2021-04-15",
    },
    data: data,
  };

  var contact_data = await axios
    .request(options)
    .then(function (response) {
      // console.log(response.data);
      return {
        success: true,
        status: 200,
        data: response.data.contact,
      };
    })
    .catch(function (error) {
      console.error(error);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  if (contact_data.success) {
    return {
      success: true,
      status: 200,
      data: contact_data.data,
    };
  }
  return {
    success: false,
    status: 400,
    data: contact_data.data,
  };
};

/**
 * @constructo
 * @param {object} props - The function properties
 * @param {object} props.super_admin - The session location data.
 * @param {object} props.location - The session location data.
 * @param {object} props.campaign - The session campaign data.
 * @param {string} props.contact_id - The contact id that need to be update.
 * @param {object} props.fields - The fields object that need to be update for the contact
 * @param {object} props.fields.super_admin - The Super Admin level fields object
 * @param {string} props.fields.super_admin.password - The password field
 * @param {string} props.fields.super_admin.rgs_pass - The password field
 * @param {string} props.fields.agency.agency_password - The password field
 * @param {string} props.fields.agency.location_password - The password field
 * @param {string} props.fields.agency.stripe_password - The password field
 * @param {string} props.fields.agency.location_user_password - The password field
 * @param {object} props.fields.location - The Location level fields object
 * @param {string} props.fields.location.password - The password field
 * @param {string} props.fields.location.subscriber_link - The subscriber_link field
 * @param {string} props.fields.location.subscriber_code - The subscriber_code field
 * @param {string} props.fields.location.total_point - The total_point field
 * @param {string} props.fields.location.total_stamp - The total_stamp field
 * @param {string} props.fields.location.total_ticket_received - The total_ticket_received field
 * @param {string} props.fields.location.total_ticket_redeem - The total_ticket_redeem field
 * @param {string} props.fields.location.total_amount - The total_amount field
 * @param {string} props.fields.location.total_redemption - The total_redemption field
 * @param {string} props.fields.location.total_pass_added - The total_pass_added field
 * @param {string} props.fields.location.total_pass_created - The total_pass_created field
 * @param {string} props.fields.location.last_redemption - The last_redemption field
 * @param {object} props.fields.campaign - The Campaign level fields object
 * @param {string} props.fields.campaign.pass_link - The pass_link field
 * @param {string} props.fields.campaign.pass_code - The pass_code field
 * @param {string} props.fields.campaign.wallet - The wallet field
 * @param {string} props.fields.campaign.createdAt - The createdAt field
 * @param {string} props.fields.campaign.redemption_amount - The redemption_amount field
 * @param {string} props.fields.campaign.redemption_time - The redemption_time field
 *
 */

const getUpdateToken = async ({ refresh_token, type, keys }) => {
  var options = {
    method: "POST",
    url: "https://api.msgsndr.com/oauth/token",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: qs.stringify({
      client_id: keys.client_id,
      client_secret: keys.client_secret,
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }),
  };

  const result = await axios.request(options).catch((err) => {
    // console.log("GHL Refresh Token ERROR:");
    return err.response.data;
  });
  // console.log(result);

  return result?.data ? result.data : "";
};
const getUpdateSuperAdminToken = async ({ refresh_token, type }) => {
  var options = {
    method: "POST",
    url: "https://api.msgsndr.com/oauth/token",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: qs.stringify({
      client_id: env.GHL.SUPER_ADMIN_Location_CLIENT_ID,
      client_secret: env.GHL.SUPER_ADMIN_Location_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }),
  };

  const result = await axios.request(options).catch((err) => {
    // console.log("GHL Refresh Token ERROR:");
    return err.response.data;
  });
  // console.log(result);

  return result?.data ? result.data : "";
};
const getLocationData = async ({ access_token, company_id }) => {
  // console.log({ access_token, company_id }, "companyIdcompanyId");
  const axios = require("axios");

  let options = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://services.leadconnectorhq.com/locations/search?companyId=${company_id}&limit=500`,
    headers: {
      Version: "2021-07-28",
      Authorization: `Bearer ${access_token}`,
    },
  };

  const result = await axios.request(options).catch((err) => {
    // console.log("GHL Location ERROR:");
    return err.response.data;
  });
  // if (result.status != 403) {
  //   console.log(result);
  // }

  return result?.data ? result.data : "";
};
const getUserData = async ({ access_token, company_id }) => {
  // console.log({ access_token, company_id }, "companyIdcompanyId");
  const axios = require("axios");

  let options = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://services.leadconnectorhq.com/users/search?companyId=${company_id}`,
    headers: {
      Version: "2021-07-28",
      Authorization: `Bearer ${access_token}`,
    },
  };

  const result = await axios.request(options).catch((err) => {
    // console.log("GHL Location ERROR:");
    return err.response.data;
  });
  // if (result.status != 403) {
  //   console.log(result);
  // }

  return result?.data ? result.data : "";
};

const checkWebhookEvent = async ({ location }) => {
  const apps = await location.apps.reduce(async (acc, app) => {
    const result = await Apps.findById(app);
    if (!result) return acc;
    return [...(await acc), result];
  }, []);

  if (!apps.length) return;

  return await apps.reduce(async (acc, app) => {
    if (!app.events.includes(enums.app.Events.GHL_INTEGRATE)) return acc;

    const payload = {
      event_type: enums.app.Events.REFRESH_TOKEN,
      internal_location_id: location._id,
      ghl: {
        name: location.ghl.name,
        address: location.ghl.address,
        access_token: location.ghl.keys.v2,
        refresh_token: location.ghl.refresh_token,
        location_id: location.ghl.location_id,
        company_id: location.ghl.company_id,
      },
    };

    const result = await CallWebhook({
      path: app.webhook,
      body: payload,
      caller_detail: {
        type: enums.LOGS_TYPE.APP_WEBHOOK,
        event: enums.app.Events.GHL_INTEGRATE,
        agency_id: location.agency_id,
        user_id: location.creator,
        location_id: location._id,
        app_id: app._id,
      },
    });

    return [...(await acc), result];
  }, []);
};

const UpdateToken = async (type) => {
  const collections = {
    app_token: AppTokenModel,
    free_app_token: FreeAppTokenModel,
  };
  // console.log(type, "type");
  var items = [];
  // console.log('start')
  items = await collections[type].find({
    $or: [
      { location_id: { $exists: true } },
      { company_id: { $exists: true } },
    ],
    refresh_token: { $exists: true },
  });
  // console.log(items.length);
  // console.log(items, "items");

  if (!items.length) return;
  // console.log('check length true')

  const result = await items.reduce(async (acc, item) => {
    // console.log(item, "itemitem");
    if (type == "app_token") {
      const main_app_keys = await MaretplaceAppsModel.findOne({
        app_id: item.app_id,
      });
      var creds = "";
      creds = await getUpdateToken({
        refresh_token: item.refresh_token,
        type: type,
        keys: main_app_keys,
      });

      // console.log("GHL Token Refreshed", type, {
      //   access_token: creds.access_token,
      //   expires_in: creds.expires_in,
      //   locationId: creds.locationId,
      // });
      var result = false;
      result = await collections[type].findByIdAndUpdate(
        item._id,
        {
          access_token: creds.access_token,
          refresh_token: creds.refresh_token,
        },
        { new: true }
      );
    } else {
      const app_keys = await MaretplaceAppsModel.findOne({
        app_id: item.app_id,
      });
      var creds = "";
      creds = await getUpdateToken({
        refresh_token: item.refresh_token,
        type: type,
        keys: app_keys,
      });

      // console.log("GHL Token Refreshed", type, {
      //   access_token: creds.access_token,
      //   expires_in: creds.expires_in,
      //   locationId: creds.locationId,
      // });
      var result = false;
      result = await collections[type].findByIdAndUpdate(
        item._id,
        {
          access_token: creds.access_token,
          refresh_token: creds.refresh_token,
        },
        { new: true }
      );
    }

    return [...(await acc), result];
  }, []);

  return result;
};
const UpdateAppsAuthToken = async (type) => {
  // console.log(type, "typetypetype");
  var items = [];
  // console.log('start')
  items = await auth_data_collections[type].find({
    company_id: { $exists: true },
    app_id: { $exists: true },
    refresh_token: { $exists: true },
  });
  // console.log(items.length);
  // console.log(items, "items");

  if (!items.length) return;
  // console.log('check length true')

  const result = await items.reduce(async (acc, item) => {
    // console.log(item, "itemitem");
    let main_app_keys = await MaretplaceAppsModel.findOne({
      app_id: item.app_id,
    });
    var creds = "";
    creds = await getUpdateToken({
      refresh_token: item.refresh_token,
      type: type,
      keys: main_app_keys,
    });

    // console.log("GHL Token Refreshed", type, {
    //   access_token: creds.access_token,
    //   refresh_token: creds.refresh_token,
    //   expires_in: creds.expires_in,
    //   locationId: creds.locationId,
    // });
    var result = false;
    result = await auth_data_collections[type].findByIdAndUpdate(
      item._id,
      {
        access_token: creds.access_token,
        refresh_token: creds.refresh_token,
      },
      { new: true }
    );
    return [...(await acc), result];
  }, []);

  return result;
};
const UpdateAgencyToken = async (type) => {
  // console.log(type, "typetypetype");
  var items = [];
  const collections = {
    agency: AgencyModel,
    location: AgencyModel,
    super_admin_location: AppSetupModal,
  };
  // console.log('start')
  if (type == "agency") {
    items = await collections[type].find({
      app_id: { $exists: true },
      "agency_ghl.refresh_token": { $exists: true },
    });
  } else if (type == "super_admin_location") {
    items = await collections[type].find({
      "ghl.refresh_token": { $exists: true },
    });
  } else {
    items = await collections[type].find({
      app_id: { $exists: true },
      "ghl.refresh_token": { $exists: true },
    });
  }
  // console.log(items.length);
  // console.log(items, "items");

  if (!items.length) return;
  // console.log('check length true')

  const result = await items.reduce(async (acc, item) => {
    // console.log(item, "itemitem");
    const app = await MaretplaceAppsModel.findOne({ app_id: item.app_id });
    var creds = "";
    if (type == "super_admin_location") {
      creds = await getUpdateSuperAdminToken({
        refresh_token: item.ghl.refresh_token,
        type: type,
      });
    } else if (type == "agency") {
      creds = await getUpdateToken({
        refresh_token: item.agency_ghl.refresh_token,
        type: type,
        keys: app.nested_app,
      });
    } else {
      creds = await getUpdateToken({
        refresh_token: item.ghl.refresh_token,
        type: type,
        keys: app.nested_app,
      });
    }
    // console.log("GHL Token Refreshed", type, {
    //   access_token: creds.access_token,
    //   refresh_token: creds.refresh_token,
    //   expires_in: creds.expires_in,
    //   locationId: creds.locationId,
    // });
    var result = false;
    if (type == "agency") {
      result = await collections[type].findByIdAndUpdate(
        item._id,
        {
          "agency_ghl.access_token": creds.access_token,
          "agency_ghl.refresh_token": creds.refresh_token,
        },
        { new: true }
      );
    } else {
      result = await collections[type].findByIdAndUpdate(
        item._id,
        {
          "ghl.access_token": creds.access_token,
          "ghl.refresh_token": creds.refresh_token,
        },
        { new: true }
      );
    }
    return [...(await acc), result];
  }, []);

  return result;
};
const UpdateLocationData = async (type) => {
  const collections = {
    agency: AgencyModel,
    super_admin: Superadmin_settings,
    location: AgencyModel,
  };
  // console.log(type,'type')
  var items = [];
  // console.log('start')
  if (type == "agency") {
    items = await collections[type].find({
      "agency_ghl.company_id": { $exists: true },
      "agency_ghl.refresh_token": { $exists: true },
    });
  }
  // else {
  //   items = await collections[type].find({
  //     "ghl.location_id": { $exists: true },
  //     "ghl.refresh_token": { $exists: true },
  //   });
  // }
  // console.log(items.length);
  // console.log(items, "items");

  if (!items.length) return;
  // console.log('check length true')

  const result = await items.reduce(async (acc, agency_data) => {
    var location_data = "";
    if (type == "agency") {
      // console.log({
      //   access_token: item.agency_ghl.access_token,
      //   company_id: item.agency_ghl.company_id,
      // });
      location_data = await getLocationData({
        access_token: agency_data.agency_ghl.access_token,
        company_id: agency_data.agency_ghl.company_id,
      });
    }
    if (location_data.statusCode != 403) {
      // console.log("GHL Token Refreshed", location_data.locations);
    }
    var result = false;
    if (type == "agency") {
      const create_loc = await location_data.locations.reduce(
        async (acc, item) => {
          const create_data = {
            id: item.id,
            name: item.name,
            address: item.address,
            city: item.city,
            state: item.state,
            country: item.country,
            postalCode: item.postalCode,
            website: item.website,
            timezone: item.timezone,
            firstName: item.firstName,
            lastName: item.lastName,
            email: item.email,
            phone: item.phone,
            company_id: agency_data.agency_ghl.company_id,
            agency_id: agency_data._id,
          };
          // console.log(create_data, "create_datacreate_data");
          let loc_create = await GHlLocationsModel.create(create_data).catch(
            (error) => {
              // Handle the error here
              // console.log(error);
            }
          );
          // console.log(loc_create);
        }
      );

      // result = await GHlLocationsModel.create(
      //   item._id,
      //   {
      //     "agency_ghl.access_token": creds.access_token,
      //     "agency_ghl.refresh_token": creds.refresh_token,
      //   },
      //   { new: true }
      // );
    }
    // else {
    //   result = await collections[type].findByIdAndUpdate(
    //     item._id,
    //     {
    //       "ghl.access_token": creds.access_token,
    //       "ghl.refresh_token": creds.refresh_token,
    //     },
    //     { new: true }
    //   );
    // }
    // console.log(result)
    // if (result.apps) checkWebhookEvent({ location: result })

    return [...(await acc), result];
  }, []);

  return result;
};

const UpdateUserData = async (type) => {
  const collections = {
    agency: AgencyModel,
    super_admin: Superadmin_settings,
    location: AgencyModel,
  };

  var items = [];
  if (type == "agency") {
    items = await collections[type].find({
      "agency_ghl.company_id": { $exists: true },
      "agency_ghl.refresh_token": { $exists: true },
    });
  }
  if (!items.length) return;

  const result = await items.reduce(async (acc, agency_data) => {
    var location_data = "";
    if (type == "agency") {
      // console.log({
      //   access_token: item.agency_ghl.access_token,
      //   company_id: item.agency_ghl.company_id,
      // });
      user_data = await getUserData({
        access_token: agency_data.agency_ghl.access_token,
        company_id: agency_data.agency_ghl.company_id,
      });
    }
    if (user_data.statusCode != 403) {
      // console.log("GHL Token Refreshed", user_data.users);
    }
    var result = false;
    if (type == "agency") {
      if (user_data.users) {
        // console.log(user_data.users.length);
        // console.log(user_data);
        const create_loc = await user_data.users.reduce(async (acc, item) => {
          if (item.roles.type == "account") {
            var password = "";
            var characters =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
            var charactersLength = characters.length;
            for (var i = 0; i < 10; i++) {
              password += characters.charAt(
                Math.floor(Math.random() * charactersLength)
              );
            }
            const temp_settings = await Agency_location_settings.findOne({
              agency_id: agency_data._id,
            });
            // searchcontact
            const GhlContact = await search_user(agency_data.ghl, item.email);
            if (GhlContact.success) {
              var customField = [
                {
                  id: temp_settings.defeult_password,
                  field_value: password,
                },
              ];
              if (temp_settings.LocationId) {
                customField.push({
                  id: temp_settings.LocationId,
                  field_value: item.roles.locationIds.join(","),
                });
                customField.push({
                  id: temp_settings.user_role,
                  field_value: item.roles.role,
                });
              }
              var customfield = await update_customField(
                customField,
                GhlContact.data,
                agency_data.ghl
              );
              if (!customfield.success) {
                error_logs.push(customfield);
              }
              // console.log(customfield, "customfield");
            } else {
              var customField = [
                {
                  id: temp_settings.defeult_password,
                  field_value: password,
                },
              ];
              if (temp_settings.LocationId) {
                customField.push({
                  id: temp_settings.LocationId,
                  field_value: item.roles.locationIds.join(","),
                });
                customField.push({
                  id: temp_settings.user_role,
                  field_value: item.roles.role,
                });
              }
              GhlContact = await create_contact(
                customField,
                item,
                agency_data.ghl
              );
              // console.log(GhlContact, "GhlContact");
              if (!GhlContact.success) {
                // console.log(
                //   GhlContact,
                //   "GhlContact error while updating custom field"
                // );
              }
            }
            // update_customField
            // create contact

            const create_data = {
              user_id: item.id,
              username: item.name,
              email: item.email,
              password: guard.generatePassHash(password),
              assign_password: password,
              roles: ["admin"],
              ghl_role: item.roles.role,
              phone: item.phone,
              agency_id: agency_data._id,
              location_id: GhlContact.data.locationId,
              ghl_contact_id: GhlContact.data.id,
            };
            let loc_create = await UserModel.create(create_data).catch(
              (error) => {
                // Handle the error here
                // console.log(error);
              }
            );
            // console.log(loc_create);
          }
        });
      }

      // result = await GHlLocationsModel.create(
      //   item._id,
      //   {
      //     "agency_ghl.access_token": creds.access_token,
      //     "agency_ghl.refresh_token": creds.refresh_token,
      //   },
      //   { new: true }
      // );
    }
    // else {
    //   result = await collections[type].findByIdAndUpdate(
    //     item._id,
    //     {
    //       "ghl.access_token": creds.access_token,
    //       "ghl.refresh_token": creds.refresh_token,
    //     },
    //     { new: true }
    //   );
    // }
    // console.log(result)
    // if (result.apps) checkWebhookEvent({ location: result })

    return [...(await acc), result];
  }, []);

  return result;
};

const sendTrigger = async (triggerData, ghl, data) => {
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
      .then((response) => { })
      .catch(async (error) => {
        return {
          success: false,
          status: 400,
          data: error,
        };
      });
  }
};

module.exports = {
  CallService: CallService,
  CallHandlerService: CallService,
  UpdateToken,
  UpdateLocationData,
  UpdateUserData,
  getUpdateToken,
  UpdateAppsAuthToken,
  UpdateAgencyToken,
  sendTrigger
};
