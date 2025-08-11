const axios = require("axios");
const {
  createContact,
  getLocationAccessToken,
  createLocation,
} = require("./GhlHandler");
const { FreeAppTokenModel } = require("../model");
const { MarketPlaceApps, appDetails } = require("../routes/webhook/services");

// 🔁 Reusable API request function
const sendRequest = async (method, url, data = {}, apiKey) => {
  const config = {
    method,
    url,
    headers: {
      apiKey,
    },
  };

  if (method === "get" || method === "delete") {
    config.params = data;
  } else {
    config.data = data;
  }

  const response = await axios(config);
  return response.data.data;
};

const handleAIFunction = async (call, req, toolOutputs, company_id) => {
  const args = JSON.parse(call.function.arguments || "{}");
  const tool_call_id = call.id;

  // GET AGENCY TOKEN
  const agency_token = await FreeAppTokenModel.findOne({
    app_id: "670ce982292541018a34fb9a",
    company_id: company_id,
  });

  // GET LOCATION TOKEN
  const loc_token = await getLocationAccessToken(
    req.body.location_id,
    agency_token
  );

  let result;

  switch (call.function.name) {
    case "CreateContact": {
      const contact_data = {
        name: args.name,
        email: args.email,
        locationId: req.body.location_id,
      };
      //console.log("contact_data", contact_data);
      result = await createContact(contact_data, loc_token?.data);
      if (!result) {
        return {
          status: 400,
          message: "Failed to create contact",
        };
      }
      toolOutputs.push({
        tool_call_id,
        output: JSON.stringify(result),
      });
      break;
    }

    case "CreateSubaccount": {
      const loc_data = {
        name: args.name,
        companyId: company_id,
      };
      //console.log("loc_data", loc_data);
      result = await createLocation(loc_data, agency_token);
      if (!result) {
        return {
          status: 400,
          message: "Failed to create subaccount",
        };
      }
      toolOutputs.push({
        tool_call_id,
        output: JSON.stringify(result),
      });
      break;
    }

    case "GetLevelUpMarketplaceApps": {
      result = await MarketPlaceApps();
      //console.log("apps_data", result.data);
      if (!result) {
        return {
          status: 400,
          message: "Failed to get marketplace apps",
        };
      }
      toolOutputs.push({
        tool_call_id,
        output: JSON.stringify(result.data),
      });
      break;
    }

    case "GetLevelUpMarketplaceAppDetails": {
      result = await appDetails({
        query: {
          app_id: args.app_id,
        },
      });
      if (!result) {
        return {
          status: 400,
          message: "Failed to get app details",
        };
      }
      toolOutputs.push({
        tool_call_id,
        output: JSON.stringify(result),
      });
      break;
    }

    default:
      console.warn(`Unknown function name: ${call.function.name}`);
      return {
        status: 400,
        message: "Unknown function name",
      };
  }
};

// 🎯 Simple switch-based function call handler
// const handleAIFunction = async (call, req, toolOutputs, company_id) => {
//   const args = JSON.parse(call.function.arguments || "{}");
//   const tool_call_id = call.id;

//   // GET AGENCY TOKEN
//   const agency_token = await FreeAppTokenModel.findOne({
//     app_id: "670ce982292541018a34fb9a",
//     company_id: company_id,
//   });
//   // GET LOCATION TOKEN
//   const loc_token = await getLocationAccessToken(
//     req.body.location_id,
//     agency_token
//   );

//   let result;

//   switch (call.function.name) {
//     case "CreateContact":
//       const contact_data = {
//         name: args.name,
//         email: args.email,
//         locationId: req.body.location_id,
//       };
//       //console.log("contact_data", contact_data);
//       result = await createContact(contact_data, loc_token?.data);
//       if (!result) {
//         return {
//           status: 400,
//           message: "Failed to create contact",
//         };
//       }
//       toolOutputs.push({
//         tool_call_id,
//         output: JSON.stringify(result),
//       });
//     case "CreateSubaccount":
//       const loc_data = {
//         name: args.name,
//         companyId: company_id,
//       };
//       //console.log("loc_data", loc_data);
//       result = await createLocation(loc_data, agency_token);
//       if (!result) {
//         return {
//           status: 400,
//           message: "Failed to create subaccount",
//         };
//       }
//       toolOutputs.push({
//         tool_call_id,
//         output: JSON.stringify(result),
//       });
//     case "GetLevelUpMarketplaceApps":
//       result = await MarketPlaceApps();
//       //console.log("apps_data", result.data);
//       if (!result) {
//         return {
//           status: 400,
//           message: "Failed to create subaccount",
//         };
//       }
//       toolOutputs.push({
//         tool_call_id,
//         output: JSON.stringify(result.data),
//       });
//     case "GetLevelUpMarketplaceAppDetails":
//       result = await appDetails({
//         query: {
//           app_id: args.app_id,
//         },
//       });
//       if (!result) {
//         return {
//           status: 400,
//           message: "Failed to get app details",
//         };
//       }
//       toolOutputs.push({
//         tool_call_id,
//         output: JSON.stringify(result),
//       });
//       break;
//   }

//   // const functionMap = {
//   //   CreateSubaccount: {

//   //     method: "post",
//   //     endpoint: "https://chatapi.trustbrand.ai/api/levelup/create-subaccount",
//   //     data: {
//   //       name: args.name,
//   //       companyId: company_id,
//   //     },
//   //     apiKey: "Bearer f7e47s1b-c9bz4eb9-d333ecb9",
//   //   },
//   //   CreateContact: {

//   // 		const contact_data = {
//   // 			name: args.name,
//   // 			email: args.email,
//   // 			locationId: req.body.location_id,
//   // 			companyId: company_id,
//   // 		};
//   // 		createContact(contact_data,loc_token);

//   //     method: "post",
//   //     endpoint: "https://chatapi.trustbrand.ai/api/levelup/CreateContacts",
//   //     data: {
//   //       name: args.name,
//   //       email: args.email,
//   //       locationId: req.body.location_id,
//   //       companyId: company_id,
//   //     },
//   //     apiKey: "Bearer f7e47s1b-c9bz4eb9-d333ecb9",
//   //   },
//   //   GetLevelUpMarketplaceApps: {
//   //     method: "get",
//   //     endpoint: "https://api.alltheapps.io/api/v1/webhook/apps",
//   //     apiKey: "Bearer 3cd5bc70-21c10a09-b4d57562",
//   //   },
//   //   GetLevelUpMarketplaceAppDetails: {
//   //     method: "get",
//   //     endpoint: `https://api.alltheapps.io/api/v1/webhook/app/details`,
//   //     data: {
//   //       app_id: args.app_id,
//   //     },
//   //     apiKey: "Bearer 3cd5bc70-21c10a09-b4d57562",
//   //   },
//   //   // 🧩 Add more functions easily here
//   // };

//   // const config = functionMap[call.function.name];

//   // //console.log("config", config);

//   // //console.log("Function", call.function.name);

//   // if (!config) {
//   //   console.warn("Unknown function:", call.function.name);
//   //   toolOutputs.push({
//   //     tool_call_id,
//   //     output: JSON.stringify({ error: "Unknown function name" }),
//   //   });
//   //   return;
//   // }

//   // try {
//   //   const result = await sendRequest(
//   //     config.method,
//   //     config.endpoint,
//   //     config?.data,
//   //     config.apiKey
//   //   );
//   //   toolOutputs.push({
//   //     tool_call_id,
//   //     output: JSON.stringify(result),
//   //   });
//   // } catch (error) {
//   //   console.error("API error:", error?.message);
//   //   toolOutputs.push({
//   //     tool_call_id,
//   //     output: JSON.stringify({ error: "App details not found or API error." }),
//   //   });
//   // }
// };

module.exports = {
  handleAIFunction,
};
