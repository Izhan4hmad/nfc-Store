const { default: axios } = require("axios");
const {
  FreeAppTokenModel,
  AcculynxDataModel,
  TriggersModel,
} = require("../../model");
const { sendTrigger, upsertContact } = require("../../_utils/GhlHandler");
const sendJobUpdatedTrigger = async (triggerData, ghl, data) => {
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
    const filters = element.triggerData.filters;

    let condition = false;

    if (filters.length === 0) {
      condition = true;
    } else {
      filters.forEach((filter) => {
        if (
          filter.id == "milestone_id" &&
          filter.value === data.currentMilestone
        ) {
          condition = true;
        }
      });
    }
    if (condition) {
      await axios
        .request(config)
        .then((response) => {
          // console.log(
          //   JSON.stringify(
          //     response.data,
          //     "responseresponseresponseresponseresponseresponseresponseresponseresponseresponse"
          //   )
          // );
        })
        .catch((error) => {
          // console.log(error, "errorerrorerrorerrorerror");
        });
    } else {
      // console.log("filter not match");
    }
  }
};

const getContactEmail = async (app_token, contact_data) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api.acculynx.com/api/v2/contacts/${contact_data?.id}/email-addresses/${contact_data?.emailAddresses?.[0]?.id}`,
    headers: {
      Authorization: `Bearer ${app_token?.credentials?.apiKey}`,
      "Content-Type": "application/json",
    },
  };
  const result = await axios
    .request(config)
    .then(async function (response) {
      // console.log('contact email response')
      return {
        status: 200,
        success: true,
        data: response.data,
      };
    })
    .catch(function (error) {
      // console.log('contact email error')
      return {
        status: 400,
        success: false,
      };
    });
  return result;
};

const getContacts = async (app_token) => {
  let skip = 0;
  let fetch = true;
  while (fetch) {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.acculynx.com/api/v2/contacts?pageSize=50&pageStartIndex=${skip}`,
      headers: {
        Authorization: `Bearer ${app_token?.credentials?.apiKey}`,
        "Content-Type": "application/json",
      },
    };
    // console.log(config, "config");

    const result = await axios
      .request(config)
      .then(async function (response) {
        // console.log('contacts get success')

        for (let index = 0; index < response.data.items.length; index++) {
          const element = response.data.items[index];
          const find = await AcculynxDataModel.findOne({
            app_id: app_token.app_id,
            location_id: app_token.location_id,
            type: "contact",
            id: element.id,
          });
          const save_data = {
            type: "contact",
            data: element,
            id: element.id,
            app_id: app_token.app_id,
            company_id: app_token?.company_id,
            location_id: app_token.location_id,
          };
          const trigger_data = {
            ...element,
            email_id: element?.emailAddresses?.[0]?.id,
          };
          if (find) {
            const result = await AcculynxDataModel.findByIdAndUpdate(
              find?._id,
              save_data
            ).catch(function (error) {
              // console.log(error)
            });

            if (JSON.stringify(element) != JSON.stringify(find?.data)) {
              const triggerData = await TriggersModel.find({
                "extras.locationId": app_token?.location_id,
                "triggerData.key": "contact_updatedd",
              });
              // console.log(triggerData, "triggerData");
              const trigger = await sendTrigger(
                triggerData,
                app_token,
                trigger_data
              );
            }
          } else {
            const triggerData = await TriggersModel.find({
              "extras.locationId": app_token?.location_id,
              "triggerData.key": "contact_createdd_",
            });
            // console.log(triggerData, "triggerData");
            const result = await AcculynxDataModel.create(save_data).catch(
              function (error) {
                // console.log(error)
              }
            );
            const trigger = await sendTrigger(
              triggerData,
              app_token,
              trigger_data
            );
          }

          // if (element?.emailAddresses?.length) {
          //   const contact_email = await getContactEmail(app_token, element);
          //   if (contact_email.success) {
          //     const contact_data = {
          //       name: element?.firstName + "" + element?.lastName,
          //       email: contact_email?.data?.address,
          //       tags: ["acculynx"],
          //       locationId: app_token?.location_id,
          //     };
          //     const GhlContact = await upsertContact(app_token, contact_data);
          //   }
          // }
        }
        return {
          status: 200,
          success: true,
          data: response.data.items,
        };
      })
      .catch(function (error) {
        // console.log(error, "contacts error");
        return {
          status: 400,
          success: false,
        };
      });
    if (result.success) {
      if (result.data?.length == 50) {
        skip = skip + 1;
      } else {
        fetch = false;
      }
    } else {
      fetch = false;
    }
  }
};
const getJobs = async (app_token) => {
  let skip = 0;
  let fetch = true;
  while (fetch) {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.acculynx.com/api/v2/jobs?pageSize=25&pageStartIndex=${skip}`,
      headers: {
        Authorization: `Bearer ${app_token?.credentials?.apiKey}`,

        "Content-Type": "application/json",
      },
    };
    const result = await axios
      .request(config)
      .then(async function (response) {
        // console.log('jobs get success')
        for (let index = 0; index < response.data.items.length; index++) {
          const element = response.data.items[index];
          const find = await AcculynxDataModel.findOne({
            app_id: app_token.app_id,
            location_id: app_token.location_id,
            type: "job",
            id: element.id,
          });
          const save_data = {
            type: "job",
            data: element,
            id: element.id,
            app_id: app_token.app_id,
            company_id: app_token?.company_id,
            location_id: app_token.location_id,
          };
          const trigger_data = {
            ...element,
            contact_id: element?.contacts?.[0]?.contact?.id,
          };
          if (find) {
            const result = await AcculynxDataModel.findByIdAndUpdate(
              find?._id,
              save_data
            ).catch(function (error) {
              // console.log(error)
            });
            if (JSON.stringify(element) != JSON.stringify(find?.data)) {
              const triggerData = await TriggersModel.find({
                "extras.locationId": app_token?.location_id,
                "triggerData.key": "job_updated__",
              });
              // console.log(triggerData, "triggerData");
              sendJobUpdatedTrigger(triggerData, app_token, trigger_data);
            }
          } else {
            const triggerData = await TriggersModel.find({
              "extras.locationId": app_token?.location_id,
              "triggerData.key": "job_createdd_",
            });
            // console.log(triggerData, "triggerData");
            const result = await AcculynxDataModel.create(save_data).catch(
              function (error) {
                // console.log(error)
              }
            );
            const trigger = await sendTrigger(
              triggerData,
              app_token,
              trigger_data
            );
          }
          if (
            element?.currentMilestone ==
            app_token?.credentials?.stage_status?.value
          ) {
            if (element?.contacts?.length) {
              const find_contact = await AcculynxDataModel.findOne({
                app_id: app_token.app_id,
                type: "contact",
                "data.id": element?.contacts?.[0]?.contact?.id,
              });
              if (find_contact) {
                const contact_email = await getContactEmail(
                  app_token,
                  find_contact
                );
                if (contact_email.success) {
                  const contact_data = {
                    name: find_contact?.firstName + "" + find_contact?.lastName,
                    email: contact_email?.data?.address,
                    tags: [app_token?.credentials?.contact_tag],
                    locationId: app_token?.location_id,
                  };
                  const GhlContact = await upsertContact(
                    app_token,
                    contact_data
                  );
                }
              }
            }
          }
        }
        return {
          status: 200,
          success: true,
          data: response.data.items,
        };
      })
      .catch(function (error) {
        // console.log(error, "jobs error");
        return {
          status: 400,
          success: false,
        };
      });
    if (result.success) {
      if (result.data?.length == 50) {
        skip = skip + 1;
      } else {
        fetch = false;
      }
    } else {
      fetch = false;
    }
  }
};
const getUsers = async (app_token) => {
  let skip = 0;
  let fetch = true;
  while (fetch) {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.acculynx.com/api/v2/users?pageSize=50&pageStartIndex=${skip}`,
      headers: {
        Authorization: `Bearer ${app_token?.credentials?.apiKey}`,

        "Content-Type": "application/json",
      },
    };
    const result = await axios
      .request(config)
      .then(async function (response) {
        // console.log('users get success')

        for (let index = 0; index < response.data.items.length; index++) {
          const element = response.data.items[index];
          const find = await AcculynxDataModel.findOne({
            app_id: app_token.app_id,
            location_id: app_token.location_id,
            type: "user",
            id: element.id,
          });
          const save_data = {
            type: "user",
            data: element,
            id: element.id,
            app_id: app_token.app_id,
            company_id: app_token?.company_id,
            location_id: app_token.location_id,
          };
          if (find) {
            const result = await AcculynxDataModel.findByIdAndUpdate(
              find?._id,
              save_data
            ).catch(function (error) {
              // console.log(error)
            });
            if (JSON.stringify(element) != JSON.stringify(find?.data)) {
              const triggerData = await TriggersModel.find({
                "extras.locationId": app_token?.location_id,
                "triggerData.key": "userupdated",
              });
              // console.log(triggerData, "triggerData");
              const trigger = await sendTrigger(
                triggerData,
                app_token,
                element
              );
            }
          } else {
            const triggerData = await TriggersModel.find({
              "extras.locationId": app_token?.location_id,
              "triggerData.key": "user_createdd",
            });
            // console.log(triggerData, "triggerData");
            const result = await AcculynxDataModel.create(save_data).catch(
              function (error) {
                // console.log(error)
              }
            );
            const trigger = await sendTrigger(triggerData, app_token, element);
          }
        }
        return {
          status: 200,
          success: true,
          data: response.data.items,
        };
      })
      .catch(function (error) {
        // console.log('users error')
        return {
          status: 400,
          success: false,
        };
      });
    if (result.success) {
      if (result.data?.length == 50) {
        skip = skip + 1;
      } else {
        fetch = false;
      }
    } else {
      fetch = false;
    }
  }
};
const GetAcculynxData = async () => {
  const app_token = await FreeAppTokenModel.find({
    location_id: { $exists: true },
    "credentials.apiKey": { $exists: true },
    app_id: "66c34199cef1d1207d983c1f",
  });
  // console.log(app_token.length, "app_token.length");

  for (let index = 0; index < app_token.length; index++) {
    const element = app_token[index];
    getContacts(element);
    getJobs(element);
    getUsers(element);
  }
};

module.exports = {
  GetAcculynxData,
};
