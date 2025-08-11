const {
  FunnelUrlsModel,
  MaretplaceAppsModel,
  CustomValueModel,
  EventsModel,
  TriggersModel,
} = require("../../model");

const { ServiceHandler } = require("../../_utils/handler");
const {
  getFunnelsList,
  getCustomValues,
  getWorkflows,
  sendTrigger,
} = require("../../_utils/GhlHandler");
const { AppTokenHandler } = require("../../_utils/AppHandler");
const cron = require("node-cron");
const { ghlAuthHandler } = require("../../_utils/ghlauthhandler");

const GetGHLCustomValueList = async (req) => {
  // Will Get Here soon
  const request_query = {
    location_id: req.query.location_id,
    app_id: req.query.app_id,
  };
  const app_token = await AppTokenHandler(request_query);

  if (!app_token?.access_token)
    return {
      success: false,
      message: "no token found",
    };

  const values = await getCustomValues(app_token);

  return {
    success: true,
    message: "custom values found",
    data: values?.data,
  };
};

const GetGHLWorkflowList = async (req) => {
  // Will Get Here soon
  const request_query = {
    location_id: req.query.location_id,
    app_id: req.query.app_id,
  };
  const app_token = await AppTokenHandler(request_query);

  if (!app_token?.access_token)
    return {
      success: false,
      message: "no token found",
    };

  const values = await getWorkflows(app_token);

  return {
    success: true,
    message: "workflows found",
    data: values?.data,
  };
};

const Get = async (req) => {
  const result = await CustomValueModel.find(req.query);

  if (!result)
    return {
      success: false,
      message: "custom values not found successfully ",
    };

  return {
    success: true,
    message: "custom values found successfully ",
    data: result,
  };
};
const Filter = async (req) => {
  const request_query = {
    location_id: req.query.locationId,
  };
  const result = await CustomValueModel.find(request_query);

  return {
    success: true,
    options: result.map((cv) => ({
      label: cv.custom_value.name + " - limit:" + cv.execution_limit,
      value: cv._id,
    })),
  };
};

const TriggerCustomValueCronFunction = async (internalCustomValue) => {
  // if (result.execution_count < internalCustomValue.execution_limit) return

  const request_query = {
    location_id: internalCustomValue.location_id,
    app_id: internalCustomValue.app_id,
  };
  const app_token = await AppTokenHandler(request_query);

  if (!app_token?.access_token) {
    console.log("No Token Found, job terminated");
    return {
      success: false,
      message: "no token found",
    };
  }

  console.log("Getting Custom Value");
  const custom_value = await getCustomValues(
    app_token,
    internalCustomValue.custom_value.id
  );

  if (!custom_value.data?.length) {
    console.log("No Custom Value Found, Job dismissed");
  }

  console.log("Custom Value Found");

  // Condition Goes here
  if (custom_value.data[0].value <= internalCustomValue.limit) {
    console.log("Custom Value Limit Not Reached, Job Dismissed");
    return;
  }

  console.log("Custom Value Limit Reached, Proceeding with Job");
  console.log("Getting Trigger Data");
  const triggerData = await TriggersModel.find({
    "extras.locationId": internalCustomValue.location_id,
    "triggerData.key": "custom_value_limit_reach",
    type: "custom_value",
    app_id: internalCustomValue.app_id,
  });

  if (!triggerData.length) {
    console.log("No Trigger Data Found, Job Dismissed");
    return;
  }

  console.log(triggerData.length, " Triggers Found, proceeding");

  const result = await sendTrigger(triggerData, app_token, {
    custom_value_id: internalCustomValue.custom_value.id,
    limit: internalCustomValue.limit,
    executed: internalCustomValue.execution_count + 1,
    custom_value: custom_value.data[0].value,
    trigger_id: internalCustomValue._id,
  });

  await CustomValueModel.findByIdAndUpdate(internalCustomValue._id, {
    $inc: { execution_count: 1 },
  });
};

const RestartCustomValuesCronJobs = async () => {
  console.log("restarting custom values cron jobs");
  const custom_values = await CustomValueModel.find();
  const filteredCustomValues = custom_values.filter((customValue) => {
    return customValue.execution_count < parseInt(customValue.execution_limit);
  });
  console.log(filteredCustomValues.length, " Custom Values Cron Jobs Found");
  filteredCustomValues.map((customValue) => {
    cron.schedule(customValue.automation, async () => {
      console.log(`Cron job triggered for: ${customValue.automation}`);
      TriggerCustomValueCronFunction(customValue);
    });
  });
};

const Create = async (req) => {
  const result = await CustomValueModel.create(req.body);
  if (!result)
    return {
      success: false,
      message: "something went wrong while creating custom value",
    };

  cron.schedule(req.body.automation, async () => {
    console.log(`Cron job triggered for: ${req.body.automation}`, req.body);
    // Add your automation task here

    if (result.execution_count < req.body.execution_limit) return;
    TriggerCustomValueCronFunction(req.body);

    // const request_query = {
    //   location_id: req.body.location_id,
    //   app_id: req.body.app_id,
    // }
    // const app_token = await AppTokenHandler(request_query)

    // if (!app_token?.access_token)
    //   return {
    //     success: false,
    //     message: 'no token found',
    //   }

    // const custom_value = await getCustomValues(
    //   app_token,
    //   req.body.custom_value.id
    // )

    // Condition Goes here
    // if (custom_value.data?.customValue?.value !== req.body.limit) return

    // const triggerData = await TriggersModel.find({
    //   'extras.locationId': req.body.location_id,
    //   'triggerData.key': 'custom_value_limit_reach',
    //   app_id: req.body.app_id,
    // })

    // if (!triggerData.length) return

    // const result = await sendTrigger(triggerData, app_token, {
    //   custom_value_id: req.body.custom_value.id,
    //   limit: req.body.limit,
    //   executed: result.execution_count + 1,
    //   custom_value: custom_value.data?.customValue.value,
    // })

    // await CustomValueModel.findByIdAndUpdate(result._id, {
    //   $inc: { execution_count: 1 },
    // })
  });

  return {
    success: true,
    message: "custom value successfully created",
    data: result,
  };
};
const Delete = async (req) => {
  const result = await CustomValueModel.findByIdAndDelete(req.query._id);
  if (!result)
    return {
      success: false,
      message: "something went worng while delete custom value",
    };

  return {
    success: true,
    message: "custom value successfully deleted",
    data: result,
  };
};
const Update = async (req) => {
  const result = await CustomValueModel.findByIdAndUpdate(
    req.body._id,
    req.body,
    { returnOriginal: false }
  );
  if (!result)
    return {
      success: false,
      message: "something went worng while updating custom value",
    };

  return {
    success: true,
    message: "Custom value successfully updated",
    data: result,
  };
};

const TrigerData = async (req) => {
  const app_id = req.params.app_id;
  const loc_id = req.body.extras.locationId;
  const company_id = req.body.extras.companyId;
  const varify_app = await ghlAuthHandler(app_id, loc_id, company_id, req.body);
  // const event_data = await EventsModel.findOne({
  //   locationId: req.body.extras.locationId,
  // })

  if (!varify_app.success)
    return {
      success: false,
      message: "no app found",
    };

  // var stripe
  // if (varify_app.type === 'paid') {
  //   const kHeadersSymbol = Object.getOwnPropertySymbols(req).find(
  //     (symbol) => symbol.description === 'kHeaders'
  //   )
  //   const kHeaders = req[kHeadersSymbol]

  //   const apikey = kHeaders.apikey
  //   console.log(apikey, 'apikeyapikey')
  //   stripe = require('stripe')(apikey)
  // } else {
  //   let apikeydata = await FreeAppTokenModel.findOne({
  //     location_id: loc_id,
  //     app_id: req.params.app_id,
  //   })
  //   const apikey = apikeydata.credentials.ApiKKey
  //   console.log('ApiKKeyApiKKeyApiKKey', apikey)
  //   stripe = require('stripe')(apikey)
  // }

  if (req.body.triggerData.eventType === "CREATED") {
    // if (event_data) {
    //   var events = event_data.events
    //   events.push(stripe_events[req.body.meta.key])
    //   events = [...new Set(events)]
    //   console.log(events)
    //   // const stripe = require("stripe")(api_data.apiKey);

    //   const webhookEndpoint = await stripe.webhookEndpoints.update(
    //     event_data.webhook_id,
    //     {
    //       enabled_events: events,
    //     }
    //   )
    //   console.log(webhookEndpoint)
    //   var payload = {
    //     events: events,
    //   }
    //   var event_data_update = await EventsModel.findByIdAndUpdate(
    //     event_data._id,
    //     payload
    //   )
    //   // return 0;
    // } else {
    //   var events = [stripe_events[req.body.meta.key]]
    //   events = [...new Set(events)]
    //   console.log(events)

    //   // const stripe = require("stripe")(apikey);
    //   const webhookEndpoint = await stripe.webhookEndpoints.create({
    //     enabled_events: events,
    //     url: `https://webhook.workflowtriggers.com/v1/stripetrigger/send/${req.body.extras.locationId}/${req.params.app_id}/${req.body.extras.companyId}`,
    //   })
    //   var event_data_update = await EventsModel.create({
    //     type: 'stripe',
    //     events: events,
    //     locationId: req.body.extras.locationId,
    //     webhook_id: webhookEndpoint.id,
    //   })
    //   console.log(webhookEndpoint)
    //   console.log(event_data_update)
    // }
    const triggerData = await TriggersModel.create({
      ...req.body,
      type: "custom_value",
      app_id,
    });
    return {
      success: true,
      message: "testing",
      data: triggerData,
    };
  } else if (req.body.triggerData.eventType === "DELETED") {
    const findtriggerData = await TriggersModel.deleteOne({
      "triggerData.id": req.body.triggerData.id,
    });
    return {
      success: true,
      message: "Event deleted successfully",
      data: findtriggerData,
    };
  }
};

module.exports = {
  GetGHLCustomValueList: (req, res) =>
    ServiceHandler(GetGHLCustomValueList, req, res),
  GetGHLWorkflowList: (req, res) =>
    ServiceHandler(GetGHLWorkflowList, req, res),
  Create: (req, res) => ServiceHandler(Create, req, res),
  Get: (req, res) => ServiceHandler(Get, req, res),
  Filter: (req, res) => ServiceHandler(Filter, req, res),
  Delete: (req, res) => ServiceHandler(Delete, req, res),
  Update: (req, res) => ServiceHandler(Update, req, res),
  TrigerData: (req, res) => ServiceHandler(TrigerData, req, res),
  RestartCustomValuesCronJobs,
};
