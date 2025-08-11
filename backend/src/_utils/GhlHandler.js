const { GhlUserModel, GHlLocationsModel } = require("../model");
const { collections } = require("./Collections");
const axios = require("axios").default;
const { URLSearchParams } = require("url");
const FormData = require("form-data"); // Use 'form-data' package for Node.js
const { VerifyAccessTokenWithType } = require("./GhlTokenHandler");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sendTrigger = async (triggerData, ghl, data) => {
  // //console.log(data, "data");
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
const getFunnelsList = async (ghl, params) => {
  // //console.log(params, "params");
  const options = {
    method: "GET",
    url: "https://services.leadconnectorhq.com/funnels/funnel/list",
    params: params,
    headers: {
      Authorization: "Bearer " + ghl?.access_token,
      Version: "2021-07-28",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  var funnels = await axios
    .request(options)
    .then(function (response) {
      // //console.log(response.data);
      return {
        success: true,
        status: 200,
        data: response.data.funnels,
      };
    })
    .catch(function (error) {
      console.error(error.response.data);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  return funnels;
};
const update_opporunity = async (ghl, data, opportunity_id) => {
  // //console.log(data);
  // //console.log(opportunity_id);
  const options = {
    method: "PUT",
    url: `https://services.leadconnectorhq.com/opportunities/${opportunity_id}`,
    headers: {
      Authorization: "Bearer " + ghl?.access_token,
      Version: "2021-07-28",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: data,
  };
  var opportunity = await axios
    .request(options)
    .then(function (response) {
      // //console.log(response.data);
      return {
        success: true,
        status: 200,
        data: response.data.opportunity,
      };
    })
    .catch(function (error) {
      console.error(error.response.data);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  return opportunity;
};
const SendMessage = async (ghl, data) => {
  // //console.log(data);
  const options = {
    method: "POST",
    url: "https://services.leadconnectorhq.com/conversations/messages",
    headers: {
      Authorization: "Bearer " + ghl?.access_token,
      Version: "2021-07-28",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: data,
  };
  var message = await axios
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
      console.error(error.response.data);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  return message;
};
const CreateMessage = async (ghl, data) => {
  // //console.log(data);
  const options = {
    method: "POST",
    url: "https://services.leadconnectorhq.com/conversations/messages",
    headers: {
      Authorization: "Bearer " + ghl?.access_token,
      Version: "2021-07-28",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: data,
  };
  var message = await axios
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
      console.error(error.response.data);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  return message;
};

const CreateConversationAgencyChat = async (ghl, data) => {
  const options = {
    method: "POST",
    url: "https://services.leadconnectorhq.com/conversations/",
    headers: {
      Authorization: "Bearer " + ghl?.access_token,
      Version: "2021-07-28",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: data,
  };

  var message = await axios
    .request(options)
    .then(function (response) {
      // //console.log(response.data);
      return {
        success: true,
        status: 200,
        data: response.data.conversation,
      };
    })
    .catch(function (error) {
      console.error(error.response.data);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  return message;
};

const CreateConverstaion = async (ghl, data) => {
  // //console.log(data);
  // const options = {
  //     method: 'POST',
  //     url: 'https://services.leadconnectorhq.com/conversations',
  //     headers: {
  //         Authorization: "Bearer " + ghl?.access_token,
  //         Version: '2021-07-28',
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json'
  //     },
  //     data: data
  // };
  const options = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://services.leadconnectorhq.com/conversations/",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + ghl?.access_token,
      "Content-Type": "application/json",
      Version: "2021-04-15",
    },
    data: data,
  };
  var message = await axios
    .request(options)
    .then(function (response) {
      return {
        success: true,
        status: 200,
        data: response.data.conversation,
      };
    })
    .catch(function (error) {
      console.error(error.response.data);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  return message;
};

const searchConversation = async (query, ghl) => {
  // locationId=qWoD6buy7bMkismujCZR&contactId=xvLxwM6VwGM7lw0NHal3
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://services.leadconnectorhq.com/conversations/search?${query}`,
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + ghl?.access_token,
      Version: "2021-04-15",
    },
  };

  const conversations = await axios
    .request(config)
    .then((response) => {
      return {
        success: true,
        status: 200,
        data: response.data,
      };
    })
    .catch((error) => {
      //console.log(error);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  return conversations;
};
const getCustomFields = async (ghl, query, id) => {
  if (query) {
    var url = `https://services.leadconnectorhq.com/locations/${
      ghl?.location_id || ghl?.locationId
    }/customFields?${query}`;
  } else if (id) {
    var url = `https://services.leadconnectorhq.com/locations/${
      ghl?.location_id || ghl?.locationId
    }/customFields/${id}`;
  } else {
    var url = `https://services.leadconnectorhq.com/locations/${
      ghl?.location_id || ghl?.locationId
    }/customFields`;
  }
  // //console.log(url, "url");
  // //console.log(ghl, "ghl");
  var options = {
    method: "GET",
    url: url,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + ghl?.access_token,
      Version: "2021-04-15",
    },
  };

  const custom_fields = await axios
    .request(options)
    .then(function (response) {
      // //console.log(response.data.customFields, "response.data.customFields");
      if (id) {
        return {
          status: 200,
          success: true,
          data: response.data.customField,
        };
      } else {
        return {
          status: 200,
          success: true,
          data: response.data.customFields,
        };
      }
    })
    .catch(function (error) {
      //console.log(error, "custom_fields getting error");
      return {
        status: 400,
        success: false,
        data: [],
      };
    });
  return custom_fields;
};

const getCustomFieldsForLocationId = async (ghl) => {
  const locationId = ghl?.location_id || ghl?.locationId;
  const url = `https://services.leadconnectorhq.com/locations/${locationId}/customFields`;

  const options = {
    method: "GET",
    url,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ghl?.access_token}`,
      Version: "2021-04-15",
    },
  };

  try {
    const response = await axios.request(options);
    return {
      status: 200,
      success: true,
      data: response.data.customFields,
    };
  } catch (error) {
    console.error("Error fetching custom fields:", error);
    return {
      status: 400,
      success: false,
      data: [],
    };
  }
};
const getTagsForLocationId = async (ghl) => {
  const locationId = ghl?.location_id || ghl?.locationId;
  const url = `https://services.leadconnectorhq.com/locations/${locationId}/tags`;

  const options = {
    method: "GET",
    url,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ghl?.access_token}`,
      Version: "2021-04-15",
    },
  };

  try {
    const response = await axios.request(options);
    return {
      status: 200,
      success: true,
      data: response.data.tags,
    };
  } catch (error) {
    console.error("Error fetching custom fields:", error);
    return {
      status: 400,
      success: false,
      data: [],
    };
  }
};
const getCustomValues = async (ghl, query) => {
  if (query) {
    var url = `https://services.leadconnectorhq.com/locations/${
      ghl?.location_id || ghl?.locationId
    }/customValues?${query}`;
  } else {
    var url = `https://services.leadconnectorhq.com/locations/${
      ghl?.location_id || ghl?.locationId
    }/customValues`;
  }
  var options = {
    method: "GET",
    url: url,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + ghl?.access_token,
      Version: "2021-04-15",
    },
  };

  const custom_fields = await axios
    .request(options)
    .then(function (response) {
      return {
        status: 200,
        success: true,
        data: response.data.customValues,
      };
    })
    .catch(function (error) {
      //console.log(error, "custom_values getting error");
      return {
        status: 400,
        success: false,
        data: [],
      };
    });
  return custom_fields;
};

const getCustomValue = async (ghl, id) => {
  var options = {
    method: "GET",
    url: `https://services.leadconnectorhq.com/locations/${ghl?.location_id}/customValues/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + ghl?.access_token,
      Version: "2021-04-15",
    },
  };

  const custom_fields = await axios
    .request(options)
    .then(function (response) {
      return {
        status: 200,
        success: true,
        data: response.data,
      };
    })
    .catch(function (error) {
      return {
        status: 400,
        success: false,
      };
    });
  return custom_fields;
};
const getCustomValueByName = async (ghl, name) => {
  const options = {
    method: "GET",
    url: `https://services.leadconnectorhq.com/locations/${ghl.location_id}/customValues`,
    headers: {
      Authorization: `Bearer ${ghl.access_token}`,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  };
  const response = await axios.request(options);
  const customValues = response.data.customValues;

  const customValue = customValues.find(
    (value) => value.name.toLowerCase() === name.toLowerCase()
  );

  return customValue;
};
const getCustomFieldByName = async (ghl, name) => {
  const options = {
    method: "GET",
    url: `https://services.leadconnectorhq.com/locations/${ghl.location_id}/customFields?model=all`,
    headers: {
      Authorization: `Bearer ${ghl.access_token}`,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  };
  const response = await axios.request(options);
  const customFields = response.data.customFields;

  const customField = customFields.find(
    (value) => value.name.toLowerCase() === name.toLowerCase()
  );

  return customField;
};
const getWorkflowByName = async (ghl, name) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://services.leadconnectorhq.com/workflows/?locationId=${ghl.location_id}`,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${ghl?.access_token}`,
      Version: "2021-07-28",
    },
  };
  const response = await axios.request(config);
  const workflows = response?.data?.workflows;

  const workflow = workflows.find(
    (value) => value.name.toLowerCase() === name.toLowerCase()
  );

  return workflow;
};
const deleteCustomValue = async (ghl, id) => {
  var options = {
    method: "DELETE",
    url: `https://services.leadconnectorhq.com/locations/${ghl?.location_id}/customValues/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + ghl?.access_token,
      Version: "2021-04-15",
    },
  };

  const custom_fields = await axios
    .request(options)
    .then(function (response) {
      return {
        status: 200,
        success: true,
        data: response.data,
      };
    })
    .catch(function (error) {
      // //console.log(error, "custom_fields delete error");
      return {
        status: 400,
        success: false,
      };
    });
  return custom_fields;
};
const getWorkflows = async (ghl, locationId) => {
  const options = {
    method: "GET",
    url: "https://services.leadconnectorhq.com/workflows/",
    params: { locationId: ghl?.location_id || locationId },
    headers: {
      Authorization: "Bearer " + ghl?.access_token,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  };

  var workflows = await axios
    .request(options)
    .then(function (response) {
      // //console.log(
      //   JSON.stringify(response.data.workflows.length, "workflows get success")
      // );
      return {
        status: 200,
        success: true,
        data: response.data.workflows,
      };
    })
    .catch(function (error) {
      // //console.log(error, "workflows error");
      return {
        status: 400,
        success: false,
      };
    });
  return workflows;
};
const getCalendars = async (ghl) => {
  const options = {
    method: "GET",
    url: "https://services.leadconnectorhq.com/calendars/",
    params: { locationId: ghl.locationId },
    headers: {
      Authorization: "Bearer " + ghl?.access_token,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  };

  var calendars = await axios
    .request(options)
    .then(function (response) {
      return {
        status: 200,
        success: true,
        data: response.data.calendars,
      };
    })
    .catch(function (error) {
      //console.log("calendars_error", error?.message);
      return {
        status: 400,
        success: false,
      };
    });
  return calendars;
};
const getCalendarGroups = async (ghl) => {
  const options = {
    method: "GET",
    url: "https://services.leadconnectorhq.com/calendars/groups",
    params: { locationId: ghl.locationId },
    headers: {
      Authorization: "Bearer " + ghl?.access_token,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  };

  var calendars = await axios
    .request(options)
    .then(function (response) {
      return {
        status: 200,
        success: true,
        data: response.data.groups,
      };
    })
    .catch(function (error) {
      //console.log("calendars_groups_error", error?.message);
      return {
        status: 400,
        success: false,
      };
    });
  return calendars;
};
const getObjects = async (ghl) => {
  const options = {
    method: "GET",
    url: "https://services.leadconnectorhq.com/objects/",
    params: { locationId: ghl.locationId },
    headers: {
      Authorization: "Bearer " + ghl?.access_token,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  };

  var calendars = await axios
    .request(options)
    .then(function (response) {
      return {
        status: 200,
        success: true,
        data: response.data.objects,
      };
    })
    .catch(function (error) {
      //console.log("objects_error", error?.message);

      return {
        status: 400,
        success: false,
      };
    });
  return calendars;
};
const getForms = async (ghl) => {
  const options = {
    method: "GET",
    url: "https://services.leadconnectorhq.com/forms/",
    params: { locationId: ghl.locationId },
    headers: {
      Authorization: "Bearer " + ghl?.access_token,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  };

  var forms = await axios
    .request(options)
    .then(function (response) {
      return {
        status: 200,
        success: true,
        data: response.data.forms,
      };
    })
    .catch(function (error) {
      return {
        status: 400,
        success: false,
      };
    });
  return forms;
};
const getTemplates = async (ghl, type) => {
  const options = {
    method: "GET",
    url: `https://services.leadconnectorhq.com/locations/${ghl?.locationId}/templates?originId=${ghl?.locationId}&type=${type}`,
    // params: { locationId: ghl.locationId },
    headers: {
      Authorization: "Bearer " + ghl?.access_token,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  };

  var templates = await axios
    .request(options)
    .then(function (response) {
      //console.log(`${type} template`, response?.data);
      return {
        status: 200,
        success: true,
        data: response.data.templates,
      };
    })
    .catch(function (error) {
      //console.log(`${type} template`, error?.message);
      return {
        status: 400,
        success: false,
      };
    });
  return templates;
};
const getInvoiceTemplates = async (ghl) => {
  const options = {
    method: "GET",
    url: `https://services.leadconnectorhq.com/invoices/template`,
    params: {
      altId: ghl.locationId,
      altType: "location",
      limit: 500,
      offset: 0,
    },
    headers: {
      Authorization: "Bearer " + ghl?.access_token,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  };

  var templates = await axios
    .request(options)
    .then(function (response) {
      return {
        status: 200,
        success: true,
        data: response.data.data,
      };
    })
    .catch(function (error) {
      //console.log("invoice_template_error", error?.message);

      return {
        status: 400,
        success: false,
      };
    });
  return templates;
};
const getTriggerLinks = async (ghl) => {
  const options = {
    method: "GET",
    url: `https://services.leadconnectorhq.com/links/`,
    params: { locationId: ghl.locationId },
    headers: {
      Authorization: "Bearer " + ghl?.access_token,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  };

  var links = await axios
    .request(options)
    .then(function (response) {
      return {
        status: 200,
        success: true,
        data: response.data.links,
      };
    })
    .catch(function (error) {
      //console.log("triggerLinks_error", error?.message);
      return {
        status: 400,
        success: false,
      };
    });
  return links;
};
const getPipelines = async (ghl) => {
  const options = {
    method: "GET",
    url: `https://services.leadconnectorhq.com/opportunities/pipelines`,
    params: { locationId: ghl.locationId },
    headers: {
      Authorization: "Bearer " + ghl?.access_token,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  };

  var pipelines = await axios
    .request(options)
    .then(function (response) {
      return {
        status: 200,
        success: true,
        data: response.data.pipelines,
      };
    })
    .catch(function (error) {
      return {
        status: 400,
        success: false,
      };
    });
  return pipelines;
};
const getSurveys = async (ghl) => {
  const options = {
    method: "GET",
    url: `https://services.leadconnectorhq.com/surveys/`,
    params: { locationId: ghl.locationId },
    headers: {
      Authorization: "Bearer " + ghl?.access_token,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  };

  var surveys = await axios
    .request(options)
    .then(function (response) {
      return {
        status: 200,
        success: true,
        data: response.data.surveys,
      };
    })
    .catch(function (error) {
      return {
        status: 400,
        success: false,
      };
    });
  return surveys;
};
const getTags = async (ghl, locationId) => {
  const options = {
    method: "GET",
    url: `https://services.leadconnectorhq.com/locations/${
      ghl?.location_id || locationId
    }/tags`,
    headers: {
      Authorization: "Bearer " + ghl?.access_token,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  };

  var Tags = await axios
    .request(options)
    .then(function (response) {
      // //console.log(
      //   JSON.stringify(response.data.tags.length, "Tags get success")
      // );
      return {
        status: 200,
        success: true,
        data: response.data.tags,
      };
    })
    .catch(function (error) {
      // //console.log(error, "Tags error");
      return {
        status: 400,
        success: false,
      };
    });
  return Tags;
};
const getUser = async (ghl, userId) => {
  const options = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://services.leadconnectorhq.com/users/${userId}`,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${ghl.access_token}`,
      "Content-Type": "application/json",
      Version: "2021-04-15",
    },
  };

  var User = await axios
    .request(options)
    .then(function (response) {
      return {
        status: 200,
        success: true,
        data: response.data,
      };
    })
    .catch(function (error) {
      // //console.log(error, "User error");
      return {
        status: 400,
        success: false,
      };
    });
  return User;
};

const upsertContact = async (ghl, contact) => {
  var data = JSON.stringify(contact);
  // return contact
  var options = {
    method: "post",
    url: "https://services.leadconnectorhq.com/contacts/upsert",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${ghl?.access_token}`,
      "Content-Type": "application/json",
      Version: "2021-07-28",
    },
    data: data,
  };

  var Contact = await axios
    .request(options)
    .then(function (response) {
      // //console.log(
      //   JSON.stringify(response.data.contact, "contact upsert success")
      // );
      return {
        status: 200,
        success: true,
        data: response.data.contact,
      };
    })
    .catch(function (error) {
      //console.log(error, "contact error");
      return {
        status: 400,
        success: false,
      };
    });
  return Contact;
};

const triggerWorkflows = async (ghl) => {
  const options = {
    method: "GET",
    url:
      "https://services.leadconnectorhq.com/contacts/" +
      ghl.contact_id +
      "/workflow/" +
      ghl.workflow_id,
    headers: {
      Authorization: "Bearer " + ghl?.access_token,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  };

  var workflows = await axios
    .request(options)
    .then(function (response) {
      // //console.log(
      //   JSON.stringify(response.data.workflows.length, "workflows get success")
      // );
      return {
        status: 200,
        success: true,
        data: response.data.workflows,
      };
    })
    .catch(function (error) {
      // //console.log(error, "workflows error");
      return {
        status: 400,
        success: false,
      };
    });
  return workflows;
};
const getLocationAccessToken = async (locationId, ghl) => {
  console.log(locationId, "locationId");
  console.log(ghl, "ghl");
  const encodedParams = new URLSearchParams();
  encodedParams.set("companyId", ghl?.company_id);
  encodedParams.set("locationId", locationId);
  const options = {
    method: "POST",
    url: "https://services.leadconnectorhq.com/oauth/locationToken",
    headers: {
      Version: "2021-07-28",
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      Authorization: `Bearer ${ghl?.access_token}`,
    },
    data: encodedParams,
  };

  var token = await axios
    .request(options)
    .then(function (response) {
      return {
        status: 200,
        success: true,
        data: response.data,
      };
    })
    .catch(function (error) {
      //console.log("error", error?.message);
      return {
        status: 400,
        success: false,
      };
    });

  return token;
};
const getMessageById = async (messageId, ghl) => {
  const options = {
    method: "get",
    url: `https://services.leadconnectorhq.com/conversations/messages/${messageId}`,
    headers: {
      Version: "2021-07-28",
      Accept: "application/json",
      Authorization: `Bearer ${ghl?.access_token}`,
    },
  };
  var token = await axios
    .request(options)
    .then(function (response) {
      return {
        status: 200,
        success: true,
        data: response.data,
      };
    })
    .catch(function (error) {
      //console.log("error", error?.message);
      return {
        status: 400,
        success: false,
      };
    });

  return token;
};
const createCustomValue = async (data, ghl) => {
  const options = {
    method: "POST",
    url: `https://services.leadconnectorhq.com/locations/${ghl?.location_id}/customValues`,
    headers: {
      Authorization: `Bearer ${ghl?.access_token}`,
      Version: "2021-07-28",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: data,
  };

  var custom_value = await axios
    .request(options)
    .then(function (response) {
      // //console.log(JSON.stringify(response.data, "custom value create success"));
      return {
        status: 200,
        success: true,
        data: response.data,
      };
    })
    .catch(function (error) {
      // //console.log(error, "custom value create error");
      return {
        status: 400,
        success: false,
      };
    });
  return custom_value;
};
const updateCustomValue = async (data, ghl, custom_value_id) => {
  const options = {
    method: "PUT",
    url: `https://services.leadconnectorhq.com/locations/${ghl?.location_id}/customValues/${custom_value_id}`,
    headers: {
      Authorization: `Bearer ${ghl?.access_token}`,
      Version: "2021-07-28",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: data,
  };

  var custom_value = await axios
    .request(options)
    .then(function (response) {
      // //console.log(JSON.stringify(response.data, "custom value create success"));
      return {
        status: 200,
        success: true,
        data: response.data,
      };
    })
    .catch(function (error) {
      // //console.log(error, "custom value create error");
      return {
        status: 400,
        success: false,
      };
    });
  return custom_value;
};
const createContact = async (data, ghl) => {
  const options = {
    method: "POST",
    url: `https://services.leadconnectorhq.com/contacts/upsert`,
    headers: {
      Authorization: `Bearer ${ghl?.access_token}`,
      Version: "2021-07-28",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: data,
  };

  var contact_data = await axios
    .request(options)
    .then(function (response) {
      return {
        status: 200,
        success: true,
        data: response.data,
      };
    })
    .catch(function (error) {
      // //console.log(error, "contact create error");
      //console.log(error.message, "contact create error");

      return {
        status: 400,
        success: false,
      };
    });
  return contact_data;
};
const getPaymentsTransactions = async (query_data, ghl) => {
  const options = {
    method: "get",
    url: `https://services.leadconnectorhq.com/payments/transactions?altId=${query_data.locationId}&altType=location&startAt=${query_data.startDate}&endAt=${query_data.endDate}`,
    headers: {
      Version: "2021-07-28",
      Accept: "application/json",
      Authorization: `Bearer ${ghl?.access_token}`,
    },
  };

  var transactions = await axios
    .request(options)
    .then(function (response) {
      // //console.log(JSON.stringify(response.data, "transations get success"));
      return {
        status: 200,
        success: true,
        data: response.data.data,
      };
    })
    .catch(function (error) {
      // //console.log(error, "transations error");
      return {
        status: 400,
        success: false,
      };
    });
  return transactions;
};
const sendWorkflow = async (GhlContact, workflowId, ghl) => {
  var options = {
    method: "POST",
    url:
      "https://services.leadconnectorhq.com/contacts/" +
      GhlContact.data.id +
      "/workflow/" +
      workflowId,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + ghl.access_token,
      Version: "2021-04-15",
    },
  };

  var workflow = await axios
    .request(options)
    .then(function (response) {
      // //console.log(JSON.stringify(response.data, "workflow success"));
      return {
        status: 200,
        success: true,
        data: response.data,
      };
    })
    .catch(function (error) {
      // //console.log(error, "workflow error");
      return {
        status: 400,
        success: false,
      };
    });
  return workflow;
};

const get_pipelines = async (ghl) => {
  const options = {
    method: "GET",
    url: "https://services.leadconnectorhq.com/opportunities/pipelines",
    params: { locationId: ghl.location_id },
    headers: {
      Authorization: "Bearer " + ghl.access_token,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  };

  var pipelines = await axios
    .request(options)
    .then(function (response) {
      // //console.log(response.data);
      return {
        success: true,
        status: 200,
        data: response.data.pipelines,
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
  if (pipelines.success) {
    return {
      success: true,
      status: 200,
      data: pipelines.data,
    };
  }
  return {
    success: false,
    status: 400,
    data: pipelines.data,
  };
};
const create_opportunity = async (ghl, keys, GhlContact, Ticket, agent) => {
  // //console.log(Ticket, "TicketTicketTicketTicket");
  // const opportunity_id = keys?.opportunity.split("-")[0];
  // const key = keys?.opportunity.split("-")[1];
  let data = JSON.stringify(Ticket);
  const options = {
    method: "POST",
    url: "https://services.leadconnectorhq.com/opportunities/",
    headers: {
      Authorization: "Bearer " + ghl.access_token,
      Version: "2021-07-28",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: data,
  };

  var opportunity = await axios
    .request(options)
    .then(function (response) {
      // //console.log(response.data);
      return {
        success: true,
        status: 200,
        data: response.data.opportunity,
      };
    })
    .catch(function (error) {
      console.error(error.response.data);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  return opportunity;
};

const sendoutbound = async (ghl, payload) => {
  const axios = require("axios");
  let data = JSON.stringify(payload);
  // //console.log(data);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://services.leadconnectorhq.com/conversations/messages",
    headers: {
      Authorization: "Bearer " + ghl.access_token,
      Version: "2021-07-28",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: data,
  };

  var conversation_data = await axios
    .request(config)
    .then(function (response) {
      // //console.log(response.data);
      return {
        success: true,
        status: 200,
        data: response.data,
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
  if (conversation_data.success) {
    return {
      success: true,
      status: 200,
      data: conversation_data.data,
    };
  }
  return {
    success: false,
    status: 400,
    data: conversation_data.data,
  };
};

const sendOutbound = async (ghl, payload) => {
  let data = JSON.stringify(payload);
  // //console.log(JSON.stringify(payload));
  // //console.log(data);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://services.leadconnectorhq.com/conversations/messages/outbound",
    headers: {
      Authorization: "Bearer " + ghl.access_token,
      Version: "2021-07-28",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: data,
  };

  var inbound = await axios
    .request(config)
    .then(function (response) {
      // //console.log(response.data);
      return {
        success: true,
        status: 200,
        data: response.data,
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
  if (inbound.success) {
    return {
      success: true,
      status: 200,
      data: inbound.data,
    };
  }
  return {
    success: false,
    status: 400,
    data: inbound.data,
  };
};
const sendinbound = async (ghl, payload) => {
  let data = JSON.stringify(payload);
  //console.log(JSON.stringify(payload));
  //console.log(data);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://services.leadconnectorhq.com/conversations/messages/inbound",
    headers: {
      Authorization: "Bearer " + ghl.access_token,
      Version: "2021-07-28",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: data,
  };

  var inbound = await axios
    .request(config)
    .then(function (response) {
      // //console.log(response.data);
      return {
        success: true,
        status: 200,
        data: response.data,
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
  if (inbound.success) {
    return {
      success: true,
      status: 200,
      data: inbound.data,
    };
  }
  return {
    success: false,
    status: 400,
    data: inbound.data,
  };
};
const UpdateMessage = async (ghl, payload, messageId) => {
  let data = JSON.stringify(payload);
  // //console.log(JSON.stringify(payload));
  // //console.log(data);
  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `https://services.leadconnectorhq.com/conversations/messages/${messageId}/status`,
    headers: {
      Authorization: "Bearer " + ghl.access_token,
      Version: "2021-07-28",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: data,
  };

  var inbound = await axios
    .request(config)
    .then(function (response) {
      // //console.log(response.data);
      return {
        success: true,
        status: 200,
        data: response.data,
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
  if (inbound.success) {
    return {
      success: true,
      status: 200,
      data: inbound.data,
    };
  }
  return {
    success: false,
    status: 400,
    data: inbound.data,
  };
};
const create_business = async (location, ghl) => {
  // //console.log("create_businesscreate_businesscreate_business");
  const options = {
    method: "POST",
    url: "https://services.leadconnectorhq.com/businesses/",
    headers: {
      Authorization: "Bearer " + ghl?.access_token,
      Version: "2021-04-15",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: {
      name: location.name,
      locationId: ghl?.location_id,
      phone: location.phone,
      email: location.email,
      website: location.website,
      address: location.address,
      city: location.city,
      postalCode: location.postalCode,
      state: location.state,
    },
  };

  var business_data = await axios
    .request(options)
    .then(function (response) {
      // //console.log(response.data, 'bussiness');
      return {
        success: true,
        status: 200,
        data: response.data.business,
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
  if (business_data.success) {
    return {
      success: true,
      status: 200,
      data: business_data.data,
    };
  }
  return {
    success: false,
    status: 400,
    data: business_data.data,
  };
};

const get_contact = async (contact_id, ghl) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://services.leadconnectorhq.com/contacts/" + contact_id,
    headers: {
      "Content-Type": "application/json",
      Version: "2021-04-15",
      Authorization: "Bearer " + ghl.access_token,
    },
  };

  var contact_data = await axios
    .request(config)
    .then(function (response) {
      // //console.log(response.data);
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
        data: {},
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

const get_contacts = async (ghl, location_id) => {
  //console.log(location_id, "location_idlocation_idlocation_id");
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://services.leadconnectorhq.com/contacts",
    headers: {
      "Content-Type": "application/json",
      Version: "2021-04-15",
      Authorization: "Bearer " + ghl.access_token,
    },
    params: {
      locationId: location_id,
    },
  };

  var contact_data = await axios
    .request(config)
    .then(function (response) {
      // //console.log(response.data);
      return {
        success: true,
        status: 200,
        data: response.data.contacts,
      };
    })
    .catch(function (error) {
      console.error(error);
      return {
        success: false,
        status: 400,
        data: {},
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

const create_contact = async (custom_field, contact, ghl) => {
  var data = JSON.stringify({
    ...contact,
    locationId: ghl.location_id,
    source: "public api",
    customFields: custom_field,
  });
  var options = {
    method: "POST",
    url: "https://services.leadconnectorhq.com/contacts/",
    headers: {
      "Content-Type": "application/json",
      Version: "2021-04-15",
      Authorization: "Bearer " + ghl.access_token,
    },
    data: data,
  };
  //console.log(options);
  var contact_data = await axios
    .request(options)
    .then(function (response) {
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

const update_contact = async (custom_field, contact, ghl, GhlContactID) => {
  // //console.log(GhlContactID, "GhlContactIDGhlContactID");
  var data = JSON.stringify({
    ...contact,
    source: "public api",
    customFields: custom_field,
  });
  // //console.log(data, "temp");

  var options = {
    method: "PUT",
    url: `https://services.leadconnectorhq.com/contacts/${GhlContactID}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ghl.access_token}`,
      Version: "2021-04-15",
    },
    data: data,
  };
  // //console.log(options, "options");

  var update_contact = await axios
    .request(options)
    .then(function (response) {
      return {
        success: true,
        status: 200,
        data: response.data.contact,
      };
    })
    .catch(function (error) {
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  // //console.log(update_contact, "update_contact");

  if (update_contact.success) {
    return {
      success: true,
      status: 200,
      data: update_contact.data,
    };
  }
  return {
    success: false,
    status: 400,
    data: update_contact.data,
  };
};
const search_contact = async (ghl, email) => {
  // //console.log(ghl, "ghl");
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
      console.error(error);
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
  return {
    success: false,
    status: 400,
    data: contact_search.data,
  };
};
const createLocation = async (data, ghl) => {
  const options = {
    method: "POST",
    url: "https://services.leadconnectorhq.com/locations/",
    headers: {
      Authorization: `Bearer ${ghl?.access_token}`,
      Version: "2021-07-28",
      Accept: "application/json",
    },
    data: data,
  };
  // //console.log(options, "optionsoptionsoptionsoptions");
  var location = await axios
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
      console.error(error);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  // //console.log(location, "location");
  return location;
};
const getLocationById = async (ghl, locationId) => {
  const options = {
    method: "GET",
    url: "https://services.leadconnectorhq.com/locations/" + locationId,
    headers: {
      Authorization: `Bearer ${ghl?.access_token}`,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  };
  // //console.log(options, "optionsoptionsoptionsoptions");
  var location = await axios
    .request(options)
    .then(function (response) {
      // //console.log(response.data);
      return {
        success: true,
        status: 200,
        data: response.data.location,
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
  // //console.log(location, "location");
  return location;
};
const getLocationsWhereAppInstalled = async (ghl, appId) => {
  const axios = require("axios");

  let options = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://services.leadconnectorhq.com/oauth/installedLocations?limit=500&isInstalled=true&companyId=${ghl.company_id}&appId=${appId}`,
    headers: {
      Accept: "application/json",
      Version: "2021-07-28",
      Authorization: `Bearer ${ghl.access_token}`,
    },
  };

  // //console.log(options, "optionsoptionsoptionsoptions");
  var locations = await axios
    .request(options)
    .then(function (response) {
      //console.log(response.data);
      return {
        success: true,
        status: 200,
        data: response?.data?.locations || [],
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
  // //console.log(location, "location");
  return locations;
};
const create_location = async (data, ghl) => {
  const options = {
    method: "POST",
    url: "https://services.leadconnectorhq.com/locations/",
    headers: {
      Authorization: "Bearer " + ghl.access_token,
      Version: "2021-07-28",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: JSON.stringify(data),
  };
  var location_data = await axios
    .request(options)
    .then(function (response) {
      // //console.log(response.data, 'bussiness');
      return {
        success: true,
        status: 200,
        data: response.data,
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
  if (location_data.success) {
    return {
      success: true,
      status: 200,
      data: location_data.data,
    };
  }
  return {
    success: false,
    status: 400,
    data: location_data.data,
  };
};
const getLocationsData = async ({ access_token, company_id }, skip = 0) => {
  // //console.log(
  //   { access_token, company_id ,skip},
  //   "companyIdcompanyId getLocationData"
  // );

  let options = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://services.leadconnectorhq.com/locations/search?companyId=${company_id}&limit=500&skip=${skip}`,
    headers: {
      Version: "2021-07-28",
      Authorization: `Bearer ${access_token}`,
    },
  };

  const result = await axios.request(options).catch((err) => {
    // //console.log("GHL Location ERROR:");
    return err.response.data;
  });
  console.log(result, "result");
  // if (result.status != 403) {
  //   //console.log(result);
  // }

  return result?.data ? result.data : "";
};
const getGHLLocations = async (ghl, skip = 0, limit = 500) => {
  let options = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://services.leadconnectorhq.com/locations/search?companyId=${ghl?.company_id}&limit=${limit}&skip=${skip}`,
    headers: {
      Version: "2021-07-28",
      Authorization: `Bearer ${ghl?.access_token}`,
    },
  };

  const result = await axios.request(options).catch((err) => {
    // //console.log("GHL Location ERROR:");
    return err.response.data;
  });
  // if (result.status != 403) {
  //   //console.log(result);
  // }

  return result?.data ? result.data?.locations : "";
};
const UpdateLocationsData = async (
  agency_data,
  app,
  app_token,
  main_app_keys
) => {
  var location_data = null;
  let hasMore = true;
  let skip = 0;
  var result = false;
  while (hasMore) {
    location_data = await getLocationsData({
      access_token: app_token.access_token,
      company_id: app_token.company_id,
    });
    console.log("location_data", location_data);
    if (location_data.statusCode != 403) {
      // //console.log("GHL Token Refreshed", location_data.locations);
    }
    // var result = false;
    for (let index = 0; index < location_data?.locations?.length; index++) {
      const item = location_data?.locations[index];

      if (app?.location_auth == true) {
        await delay(200);
        const location_token = await getLocationAccessToken(item.id, app_token);

        var create_data = {
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
          saasMode: item?.settings?.saasSettings?.saasMode,
          customer_id: item?.settings?.saasSettings?.customerId,
          subscription_id:
            item?.settings?.saasSettings?.planDetails?.subscriptionId,
          productId: item?.settings?.saasSettings?.planDetails?.productId,
          subscriptionStatus:
            item?.settings?.saasSettings?.planDetails?.subscriptionStatus,
          priceId: item?.settings?.saasSettings?.planDetails?.priceId,
          company_id: app_token.company_id,
          agency_id: agency_data?._id,
          access_token: location_token?.data?.access_token,
          refresh_token: location_token?.data?.refresh_token,
          app_id: main_app_keys?.app_id,
        };
      } else {
        var create_data = {
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
          saasMode: item?.settings?.saasSettings?.saasMode,
          customer_id: item?.settings?.saasSettings?.customerId,
          subscription_id:
            item?.settings?.saasSettings?.planDetails?.subscriptionId,
          productId: item?.settings?.saasSettings?.planDetails?.productId,
          subscriptionStatus:
            item?.settings?.saasSettings?.planDetails?.subscriptionStatus,
          priceId: item?.settings?.saasSettings?.planDetails?.priceId,
          company_id: app_token.company_id,
          agency_id: agency_data?._id,
          app_id: main_app_keys?.app_id,
        };
      }
      // //console.log(create_data, "create_datacreate_data");
      // var loc_create = await collections[app?.location_modal_key]
      //   .create(create_data)
      //   .catch((error) => {
      //     // Handle the error here
      //     //console.log(error)
      //   })
      // //console.log(loc_create)
      let find = await collections[app?.location_modal_key].findOne({
        id: item.id,
      });
      if (find) {
        // //console.log("findfindfindfindfind");
        var loc_create = await collections[app?.location_modal_key]
          .findByIdAndUpdate(find?._id, create_data)
          .catch((error) => {
            // Handle the error here
            // //console.log(error);
          });
        // //console.log(loc_create);
      } else {
        // //console.log("elseelseelseelseelse");

        var loc_create = await collections[app?.location_modal_key]
          .create(create_data)
          .catch((error) => {
            // Handle the error here
            // //console.log(error);
          });
        // //console.log(loc_create);
      }
    }
    if (location_data.locations?.length == 500) {
      hasMore = true;
      skip = skip + 500;
    } else {
      hasMore = false;
    }
  }
  return result;
};
const UpdateUsersData = async (agency_data, app, app_token) => {
  var user_data = "";
  let hasMore = true;
  let skip = 0;
  var result = false;

  while (hasMore) {
    user_data = await getUsersData({
      access_token: app_token.access_token,
      company_id: app_token.company_id,
    });

    if (user_data.statusCode != 403) {
      // //console.log("GHL Token Refreshed");
    }
    // //console.log("user_datauser_datauser_datauser_data");
    // var result = false;
    if (user_data.users) {
      // //console.log(
      //   user_data.users.length,
      //   "user_data.users.lengthuser_data.users.lengthuser_data.users.length"
      // );
      for (let index = 0; index < user_data.users.length; index++) {
        const item = user_data.users[index];

        var locationId = "";
        const create_data = {
          id: item.id,
          username: item.name,
          firstName: item?.firstName,
          lastName: item?.lastName,
          email: item.email,
          password: "guard.generatePassHash(password)",
          assign_password: "password",
          roles: ["admin"],
          ghl_role: item.roles?.role,
          ghl_locations: item.roles?.locationIds,
          phone: item.phone,
          agency_id: agency_data?._id,
          company_id: app_token.company_id,
          location_id: locationId,
        };

        let user_create = await collections[app?.user_modal_key]
          .create(create_data)
          .catch((error) => {
            // Handle the error here
          });
      }
      if (user_data.users.length == 500) {
        hasMore = true;
        skip = skip + 500;
      } else {
        hasMore = false;
      }
    }
  }

  return result;
};

const getUsersData = async ({ access_token, company_id }) => {
  let options = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://services.leadconnectorhq.com/users/search?companyId=${company_id}&limit=500`,
    headers: {
      Version: "2021-07-28",
      Authorization: `Bearer ${access_token}`,
    },
  };

  const result = await axios.request(options).catch((err) => {
    // //console.log("GHL Location ERROR:");
    return err.response.data;
  });
  // if (result.status != 403) {
  //   //console.log(result);
  // }

  return result?.data ? result.data : "";
};
const searchUsers = async (params, access_token) => {
  const options = {
    method: "GET",
    url: "https://services.leadconnectorhq.com/users/search",
    params: params,
    headers: {
      Version: "2021-07-28",
      Authorization: `Bearer ${access_token}`,
    },
  };
  console.log("options",options)
  const result = await axios.request(options).catch((err) => {
    // //console.log("GHL Location ERROR:");
    return err.response.data;
  });
  console.log('result.data',result.data)
  // if (result.status != 403) {
  //   //console.log(result);
  // }

  return result?.data ? result.data?.users : "";
};

const getuser = async (ghl, userId) => {
  const options = {
    method: "GET",
    url: "https://services.leadconnectorhq.com/users/" + userId,
    headers: {
      Authorization: `Bearer ${ghl?.access_token}`,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  };
  // //console.log(options, "optionsoptionsoptionsoptions");
  var user = await axios
    .request(options)
    .then(function (response) {
      // //console.log(response.data);
      return {
        success: true,
        status: 200,
        data: response.data,
      };
    })
    .catch(async function (error) {
      return {
        success: false,
        status: 400,
        data: error,
      };
      // const token_response = await VerifyAccessTokenWithType(
      //   ghl,
      //   "FreeAppTokenModel",
      //   "main"
      // );
      // if (token_response?.success) {
      //   return await getuser(token_response?.data, userId);
      // } else {
      //   return {
      //     success: false,
      //     status: 400,
      //     data: error,
      //   };
      // }
    });
  return user;
};

const update_customField = async (custom_field, contact, ghl) => {
  var data = JSON.stringify({
    email: contact.email,
    phone: contact.phone,
    name: contact.username,
    source: "public api",
    customFields: custom_field,
  });
  // //console.log(data, "update_customField data");

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
  // //console.log(options, "options");

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
      // //console.log(error);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  // //console.log(contact_data, "contact_data updating");

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
const update_contact_custom_fields = async (customFields, contactId, ghl) => {
  let data = JSON.stringify({
    customFields: customFields,
  });
  const options = {
    method: "put",
    maxBodyLength: Infinity,
    url: `https://services.leadconnectorhq.com/contacts/${contactId}`,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${ghl?.access_token}`,
      "Content-Type": "application/json",
      Version: "2021-07-28",
    },
    data: data,
  };
  // //console.log(options, "options");

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
      // //console.log(error);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  // //console.log(contact_data, "contact_data updating");

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
const getCompanies = async (ghl) => {
  var options = {
    method: "get",
    url: "https://services.leadconnectorhq.com/companies/" + ghl.company_id,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + ghl.access_token,
      Version: "2021-04-15",
    },
  };
  // //console.log(options, "options");

  var company = await axios
    .request(options)
    .then(function (response) {
      return {
        success: true,
        status: 200,
        data: response.data.company,
      };
    })
    .catch(function (error) {
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  // //console.log(company, "company updating");

  if (company.success) {
    return {
      success: true,
      status: 200,
      data: company.data,
    };
  }
  return {
    success: false,
    status: 400,
    data: company.data,
  };
};
const sendWorkflowToContact = async (ghl, workflow_id) => {
  // //console.log(ghl?.access_token, "ghl?.access_tokenghl?.access_token");
  // //console.log(ghl.contact_id, "ghl.contact_id ghl.contact_id ");
  // //console.log(workflow_id, "workflow_id workflow_id ");

  var options = {
    method: "POST",
    url:
      "https://services.leadconnectorhq.com/contacts/" +
      ghl.contact_id +
      "/workflow/" +
      workflow_id,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + ghl?.access_token,
      Version: "2021-04-15",
    },
  };

  var workflow = await axios
    .request(options)
    .then(function (response) {
      // //console.log(JSON.stringify(response.data, "workflow success"));
      return {
        status: 200,
        success: true,
        data: response.data,
      };
    })
    .catch(function (error) {
      // //console.log(error, "workflow error");
      return {
        status: 400,
        success: false,
      };
    });
  return workflow;
};

// get form submission data
const getFormSubmission = async (
  access_token,
  location_id,
  form_id,
  contact_id
) => {
  const options = {
    method: "GET",
    url: `https://services.leadconnectorhq.com/forms/submissions?locationId=${location_id}&formId=${form_id}&limit=100&q=${contact_id}`,
    headers: {
      Authorization: `Bearer ${access_token}`,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  };

  var formSubmission = await axios
    .request(options)
    .then(function (response) {
      return {
        success: true,
        status: 200,
        data: response.data.submissions,
      };
    })
    .catch(function (error) {
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  return formSubmission;
};

// getSurveySubmission
const getSurveySubmission = async (
  access_token,
  location_id,
  survey_id,
  contact_id
) => {
  // &surveyId=${survey_id}
  const options = {
    method: "GET",
    url: `https://services.leadconnectorhq.com/surveys/submissions?locationId=${location_id}&limit=100&surveyId=${survey_id}&q=${contact_id}`,
    headers: {
      Authorization: `Bearer ${access_token}`,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  };

  var surveySubmission = await axios
    .request(options)
    .then(function (response) {
      return {
        success: true,
        status: 200,
        data: response.data.submissions,
      };
    })
    .catch(function (error) {
      return {
        success: false,
        status: 400,
        data: error,
      };
    });

  return surveySubmission;
};

// upload file
const uploadFileGhlPdf = async (ghl, fileBuffer, name) => {
  // Create a new instance of FormData
  const formData = new FormData();

  // Append the file buffer as a field, specifying the filename and content type
  formData.append("file", fileBuffer, {
    filename: name, // Filename of the PDF
    contentType: "application/pdf", // MIME type for PDF
  });

  // Log formData to see the output
  // //console.log(formData, "formData");

  const options = {
    method: "POST",
    url: `https://services.leadconnectorhq.com/medias/upload-file`,
    headers: {
      Authorization: `Bearer ${ghl.access_token}`,
      Version: "2021-07-28",
      Accept: "application/json",
      ...formData.getHeaders(), // Get the headers necessary for multipart/form-data
    },
    data: formData, // Pass formData as the body
  };

  try {
    const fileUpload = await axios.request(options);
    return {
      success: true,
      status: 200,
      data: fileUpload.data, // Return the response from GHL
      fileName: name,
    };
  } catch (error) {
    return {
      success: false,
      status: 400,
      data: error.response ? error.response.data : error.message, // Return error details
    };
  }
};

// getFileByName
const getFileByName = async (ghl, fileName) => {
  const options = {
    method: "GET",
    url: `https://services.leadconnectorhq.com/medias/files?sortBy=createdAt&sortOrder=decs&altType=location&query=${fileName}`,
    headers: {
      Authorization: `Bearer ${ghl.access_token}`,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  };

  try {
    const file = await axios.request(options);
    return {
      success: true,
      status: 200,
      data: file.data.files,
    };
  } catch (error) {
    return {
      success: false,
      status: 400,
      data: error.response ? error.response.data : error.message,
    };
  }
};
const getCompanyInfo = async (ghl, company_id) => {
  // //console.log(company_id, "company_id");
  const options = {
    method: "GET",
    url: `https://services.leadconnectorhq.com/companies/${company_id}`,
    headers: {
      Authorization: "Bearer " + ghl?.access_token,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  };

  var result = await axios
    .request(options)
    .then(function (response) {
      // //console.log(response.data);
      return {
        success: true,
        status: 200,
        data: response.data.company,
      };
    })
    .catch(function (error) {
      console.error(error.response.data);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  return result;
};
const CreateIntegrationProvider = async (ghl, data) => {
  let options = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://services.leadconnectorhq.com/payments/integrations/provider/whitelabel",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${acc.access_token}`,
      "Content-Type": "application/json",
      Version: "2021-04-15",
    },
    data: data,
  };

  var result = await axios
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
      console.error(error.response.data);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  return result;
};
const GetContactTransactions = async (ghl, loc_id, contactId) => {
  const options = {
    method: "get",
    url: `https://services.leadconnectorhq.com/payments/transactions?altId=${loc_id}&altType=location&contactId=${contactId}`,
    headers: {
      Authorization: "Bearer " + ghl?.access_token,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  };
  var result = await axios
    .request(options)
    .then(function (response) {
      // //console.log(response.data);
      return {
        success: true,
        status: 200,
        data: response.data.data,
      };
    })
    .catch(function (error) {
      console.error(error.response.data);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  return result;
};

const GetIntegrationProvider = async (ghl, query) => {
  let options = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://services.leadconnectorhq.com/payments/integrations/provider/whitelabel?${query}`,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${ghl.access_token}`,
      "Content-Type": "application/json",
      Version: "2021-04-15",
    },
  };
  var result = await axios
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
      console.error(error.response.data);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  return result;
};
const CreateNewIntegration = async (ghl, body) => {
  let data = JSON.stringify(body);

  let options = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://services.leadconnectorhq.com/payments/custom-provider/provider?locationId=${ghl?.location_id}`,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${ghl.access_token}`,
      "Content-Type": "application/json",
      Version: "2021-04-15",
    },
    data: data,
  };
  var result = await axios
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
      console.error(error.response.data);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  return result;
};

const CreateNewProviderConfig = async (ghl, body) => {
  let data = JSON.stringify(body);
  let options = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://services.leadconnectorhq.com/payments/custom-provider/connect?locationId=${ghl.location_id}`,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${ghl.access_token}`,
      "Content-Type": "application/json",
      Version: "2021-04-15",
    },
    data: data,
  };
  var result = await axios
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
      console.error(error.response.data);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  return result;
};

const CreateCustomMenuLinks = async (ghl, body) => {
  let data = JSON.stringify(body);
  let options = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://services.leadconnectorhq.com/custom-menus/`,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${ghl.access_token}`,
      "Content-Type": "application/json",
      Version: "2021-04-15",
    },
    data: data,
  };
  var result = await axios
    .request(options)
    .then(function (response) {
      return {
        success: true,
        status: 200,
        data: response.data,
      };
    })
    .catch(function (error) {
      console.error(error.response.data);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });

  return result;
};

const DeleteCustomMenuLinks = async (ghl, id) => {
  let options = {
    method: "delete",
    maxBodyLength: Infinity,
    url: `https://services.leadconnectorhq.com/custom-menus/${id}`,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${ghl.access_token}`,
      "Content-Type": "application/json",
      Version: "2021-04-15",
    },
  };
  var result = await axios
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

  return result;
};
const UpdateCustomField = async (ghl, customfield) => {
  const customFieldData = req.body;

  const config = {
    method: "put",
    url: `https://services.leadconnectorhq.com/locations/${locationId}/customFields/${customFieldId}`,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${ghl?.access_token}`,
      "Content-Type": "application/json",
      Version: "2021-07-28",
    },
    data: customFieldData,
  };

  try {
    const response = await axios(config);
    return {
      success: true,
      status: 200,
      message: "Custom Field Updated Successfully",
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || 500,
      message: error.message,
      data: error.response?.data || null,
    };
  }
};
const UpdateCustomMenuLinks = async (ghl, body, id) => {
  let data = JSON.stringify(body);
  let options = {
    method: "put",
    maxBodyLength: Infinity,
    url: `https://services.leadconnectorhq.com/custom-menus/${id}`,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${ghl.access_token}`,
      "Content-Type": "application/json",
      Version: "2021-04-15",
    },
    data: data,
  };

  var result = await axios
    .request(options)
    .then(function (response) {
      return {
        success: true,
        status: 200,
        data: response.data,
      };
    })
    .catch(function (error) {
      console.error(error.response.data);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  return result;
};
const getGhlProducts = async (ghl) => {
  const options = {
    method: "GET",
    url: "https://services.leadconnectorhq.com/products/",
    params: { locationId: ghl?.location_id },
    headers: {
      Authorization: `Bearer ${ghl?.access_token}`,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  };

  var result = await axios
    .request(options)
    .then(function (response) {
      return {
        success: true,
        status: 200,
        data: response.data.products,
      };
    })
    .catch(function (error) {
      console.error(error.response.data);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  return result;
};
const getSnapshots = async (ghl) => {
  const options = {
    method: "GET",
    url: "https://services.leadconnectorhq.com/snapshots/",
    params: { companyId: ghl?.company_id },
    headers: {
      Authorization: `Bearer ${ghl?.access_token}`,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  };

  var result = await axios
    .request(options)
    .then(function (response) {
      return {
        success: true,
        status: 200,
        data: response.data.snapshots,
      };
    })
    .catch(function (error) {
      console.error(error.response.data);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  return result;
};

const searchContactByLocation = async (ghl, body) => {
  // //console.log("ghl", ghl);
  const options = {
    method: "POST",
    url: `https://services.leadconnectorhq.com/contacts/search`,
    headers: {
      Authorization: `Bearer ${ghl?.access_token}`,
      Version: "2021-07-28",
      Accept: "application/json",
    },
    data: body,
  };

  try {
    var result = await axios.request(options);
    return {
      success: true,
      status: 200,
      data: result.data,
    };
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    return {
      success: false,
      status: error.response ? error.response.status : 500,
      data: error.response ? error.response.data : error.message,
    };
  }
};

const updateProductPrice = async (ghl, product_id, price_id, data) => {
  const options = {
    method: "PUT",
    url: `https://services.leadconnectorhq.com/products/${product_id}/price/${price_id}`,
    params: { locationId: ghl?.location_id },
    headers: {
      Authorization: `Bearer ${ghl?.access_token}`,
      Version: "2021-07-28",
      Accept: "application/json",
    },
    data: data,
  };
  var result = await axios
    .request(options)
    .then(function (response) {
      return {
        success: true,
        status: 200,
        data: response.data,
      };
    })
    .catch(function (error) {
      console.error(error.response.data);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  return result;
};

const getProductPrice = async (ghl, product_id) => {
  const options = {
    method: "GET",
    url: `https://services.leadconnectorhq.com/products/${product_id}/price`,
    params: { locationId: ghl?.location_id },
    headers: {
      Authorization: `Bearer ${ghl?.access_token}`,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  };
  var result = await axios
    .request(options)
    .then(function (response) {
      return {
        success: true,
        status: 200,
        data: response.data.prices[0],
      };
    })
    .catch(function (error) {
      console.error(error.response.data);
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  return result;
};
const getContactsByQuery = async (ghl, startAfter, startAfterId, limit) => {
  if (startAfter) {
    var url = `https://services.leadconnectorhq.com/contacts/?locationId=${ghl?.location_id}&limit=${limit}&startAfter=${startAfter}&startAfterId=${startAfterId}`;
  } else {
    var url = `https://services.leadconnectorhq.com/contacts/?locationId=${ghl?.location_id}&limit=${limit}`;
  }
  var options = {
    method: "get",
    url: url,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${ghl?.access_token}`,
      "Content-Type": "application/json",
      Version: "2021-07-28",
    },
  };
  // //console.log(options, "optionsoptions");

  var contacts = await axios
    .request(options)
    .then(function (response) {
      return {
        status: 200,
        success: true,
        data: response.data,
        total: response.data.meta.total,
      };
    })
    .catch(async function (error) {
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  return contacts;
};
const getOpportunities = async (ghl, limit) => {
  var url = `https://services.leadconnectorhq.com/opportunities/search/?locationId=${ghl?.location_id}&limit=${limit}`;
  var options = {
    method: "get",
    url: url,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${ghl?.access_token}`,
      "Content-Type": "application/json",
      Version: "2021-07-28",
    },
  };
  // //console.log(options, "optionsoptions");

  var result = await axios
    .request(options)
    .then(function (response) {
      return {
        status: 200,
        success: true,
        data: response.data,
        total: response.data.meta.total,
      };
    })
    .catch(async function (error) {
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  return result;
};
const getOpportunitiesForContactsMap = async (ghl) => {
  var options = {
    method: "get",
    url: `https://services.leadconnectorhq.com/opportunities/search?location_id=${ghl?.location_id}`,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${ghl?.access_token}`,
      "Content-Type": "application/json",
      Version: "2021-07-28",
    },
  };
  // //console.log(options, "optionsoptions");

  var result = await axios
    .request(options)
    .then(function (response) {
      return {
        status: 200,
        success: true,
        data: response.data,
      };
    })
    .catch(async function (error) {
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  return result;
};
const getConversations = async (ghl, limit) => {
  var url = `https://services.leadconnectorhq.com/conversations/search/?locationId=${ghl?.location_id}&limit=${limit}`;
  var options = {
    method: "get",
    url: url,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${ghl?.access_token}`,
      "Content-Type": "application/json",
      Version: "2021-07-28",
    },
  };
  // //console.log(options, "optionsoptions");

  var result = await axios
    .request(options)
    .then(function (response) {
      return {
        status: 200,
        success: true,
        data: response.data,
        total: response.data.total,
      };
    })
    .catch(async function (error) {
      return {
        success: false,
        status: 400,
        data: error,
      };
    });
  return result;
};
const UpdateRebilling = async (ghl, data) => {
  const options = {
    method: "POST",
    url: `https://services.leadconnectorhq.com/saas-api/public-api/update-rebilling/${ghl?.company_id}`,
    headers: {
      Authorization: `Bearer ${ghl?.access_token}`,
      Version: "2021-04-15",
      channel: "OAUTH",
      source: "INTEGRATION",
      "Content-Type": "application/json",
    },
    data: JSON.stringify(data),
  };

  var rebilling = await axios
    .request(options)
    .then(function (response) {
      //console.log(JSON.stringify(response.data, "rebilling success"));
      return {
        status: 200,
        success: true,
        data: response.data,
      };
    })
    .catch(function (error) {
      //console.log(error, "rebilling error");
      return {
        status: 400,
        success: false,
      };
    });
  return rebilling;
};
module.exports = {
  getFileByName,
  CreateIntegrationProvider,
  uploadFileGhlPdf,
  getFormSubmission,
  getSurveySubmission,
  create_contact,
  search_contact,
  update_contact,
  getLocationById,
  getLocationsData,
  UpdateLocationsData,
  create_location,
  UpdateUsersData,
  getUsersData,
  create_opportunity,
  update_opporunity,
  get_pipelines,
  sendWorkflow,
  create_business,
  getWorkflows,
  getuser,
  updateProductPrice,
  sendoutbound,
  sendOutbound,
  getCustomFields,
  getCustomFieldsForLocationId,
  getTagsForLocationId,
  getCustomValues,
  update_customField,
  getLocationAccessToken,
  getPaymentsTransactions,
  SendMessage,
  CreateMessage,
  CreateConverstaion,
  CreateConversationAgencyChat,
  sendinbound,
  UpdateMessage,
  getFunnelsList,
  searchUsers,
  sendTrigger,
  triggerWorkflows,
  createCustomValue,
  updateCustomValue,
  getTags,
  getProductPrice,
  getUser,
  upsertContact,
  getCompanies,
  get_contact,
  get_contacts,
  update_contact_custom_fields,
  createContact,
  getCustomValue,
  deleteCustomValue,
  getCustomValueByName,
  getCustomFieldByName,
  getWorkflowByName,
  sendWorkflowToContact,
  getCompanyInfo,
  getLocationsWhereAppInstalled,
  GetContactTransactions,
  GetIntegrationProvider,
  CreateNewIntegration,
  CreateNewProviderConfig,
  searchConversation,
  CreateCustomMenuLinks,
  DeleteCustomMenuLinks,
  UpdateCustomMenuLinks,
  UpdateCustomField,
  getGhlProducts,
  searchContactByLocation,
  getSnapshots,
  getGHLLocations,
  getContactsByQuery,
  getOpportunities,
  getOpportunitiesForContactsMap,
  getConversations,
  getCalendars,
  getCalendarGroups,
  getObjects,
  getTemplates,
  getForms,
  getInvoiceTemplates,
  getTriggerLinks,
  getPipelines,
  getSurveys,
  createLocation,
  UpdateRebilling,
  getMessageById,
};
