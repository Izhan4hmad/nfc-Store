const { ghlAuthHandler } = require("../../_utils/ghlauthhandler");
const { ServiceHandler } = require("../../_utils/handler");
const twilio = require("twilio");
/*
const accountSid = 'ACc0d9b5f610958b66eb9b529009a8701d';
const authToken = 'e057a61c3032eb0c9f3a9a6a60281d58';
*/

// const accountSid = "ACe01414e6a5e9a26f30517f36a72d575b";
// const authToken = "2d320f78d70f35abd47289f47bb31a8e";
const SendSMS = async (req) => {
  const app_id = req.params.app_id;
  const loc_id = req.body.extras.locationId;
  const company_id = null;
  const varify_app = await ghlAuthHandler(app_id, loc_id, company_id, req.body);

  if (varify_app.success) {
    if (varify_app.data.app_configuration) {
      // sid ACe01414e6a5e9a26f30517f36a72d575b
      // access token 2d320f78d70f35abd47289f47bb31a8e
      const { from, to, body } = req.body.data;
      const accountSid = varify_app.data.app_configuration.client_id;
      const authToken = varify_app.data.app_configuration.client_secert;
      const client = new twilio(accountSid, authToken);

      const result = await client.messages
        .create({
          body: body,
          from: from,
          to: to,
        })
        .then((message) => {
          return {
            success: true,
            status: 200,
            data: message,
          };
        })
        .catch((error) => {
          console.error(`Error: ${error.message}`);
          return {
            success: false,
            status: 400,
            data: error.message,
          };
        });
      if (!result.success) {
        return {
          success: false,
          status: 400,
          message: "Message not Sent Successfully",
          data: result.data,
        };
      }
      return {
        success: true,
        status: 200,
        message: "Message Sent Successfully",
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: "app Api Key Not Found",
        status: 404,
      };
    }
  } else {
    return {
      success: false,
      message: varify_app.message,
      status: varify_app.status,
    };
  }
};

const SendVoiceCall = async (req) => {
  const app_id = req.params.app_id;
  const loc_id = req.body.extras.locationId;
  const company_id = null;
  const varify_app = await ghlAuthHandler(app_id, loc_id, company_id, req.body);

  if (varify_app.success) {
    if (varify_app.data.app_configuration) {
      // sid ACe01414e6a5e9a26f30517f36a72d575b
      // access token 2d320f78d70f35abd47289f47bb31a8e

      // Your Twilio Account SID and Auth Token
      const accountSid = varify_app.data.app_configuration.client_id;
      const authToken = varify_app.data.app_configuration.client_secert;
      const { from, to, message } = req.body.data;
      // Create a Twilio client
      const client = new twilio(accountSid, authToken);

      // Make a voice call
      const result = await client.calls
        .create({
          twiml:
            "<Response><Say>Hello from Twilio! " +
            message +
            ".</Say></Response>",
          to: to, // The phone number you want to call
          from: from, // Your Twilio phone number
        })
        .then((call) => {
          return {
            success: true,
            status: 200,
            data: call,
          };
        })
        .catch((error) => {
          console.error(`Error: ${error.message}`);
          return {
            success: false,
            status: 400,
            data: error.message,
          };
        });
      if (!result.success) {
        return {
          success: false,
          status: 400,
          message: "Voice call not Sent Successfully",
          data: result.data,
        };
      }
      return {
        success: true,
        status: 200,
        message: "Voice call Sent Successfully",
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: "app Api Key Not Found",
        status: 404,
      };
    }
  } else {
    return {
      success: false,
      message: varify_app.message,
      status: varify_app.status,
    };
  }
};
const SendWhatsappSMS = async (req) => {
  const app_id = req.params.app_id;
  const loc_id = req.body.extras.locationId;
  const company_id = null;
  const varify_app = await ghlAuthHandler(app_id, loc_id, company_id, req.body);
  if (varify_app.success) {
    if (varify_app.data.app_configuration) {
      // sid ACe01414e6a5e9a26f30517f36a72d575b
      // access token 2d320f78d70f35abd47289f47bb31a8e

      // Your Twilio Account SID and Auth Token
      // service id MGe68aed603c4430542324adc20442d676
      const accountSid = varify_app.data.app_configuration.client_id;
      const authToken = varify_app.data.app_configuration.client_secert;
      const { from, to, body } = req.body.data;
      // Create a Twilio client
      const client = new twilio(accountSid, authToken);

      // Send a verification code
      const result = await client.messages
        .create({
          from: `whatsapp:${from}`, // Your WhatsApp Business number
          to: `whatsapp:${to}`, // Recipient's WhatsApp number
          body: `${body}`,
        })
        .then((verification) => {
          return {
            success: true,
            status: 200,
            data: verification,
          };
        })
        .catch((error) => {
          console.error(`Error: ${error.message}`);
          return {
            success: false,
            status: 400,
            data: error.message,
          };
        });
      if (!result.success) {
        return {
          success: false,
          status: 400,
          message: "Verification Message not Sent Successfully",
          data: result.data,
        };
      }
      return {
        success: true,
        status: 200,
        message: "Verification Message Sent Successfully",
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: "app Api Key Not Found",
        status: 404,
      };
    }
  } else {
    return {
      success: false,
      message: varify_app.message,
      status: varify_app.status,
    };
  }
};
// List sms

const ListSMS = async (req) => {
  const app_id = req.params.app_id;
  const loc_id = req.body.extras.locationId;
  const company_id = null;
  const varify_app = await ghlAuthHandler(app_id, loc_id, company_id, req.body);

  if (varify_app.success) {
    if (varify_app.data.app_configuration) {
      const accountSid = varify_app.data.app_configuration.client_id;
      const authToken = varify_app.data.app_configuration.client_secert;
      const client = new twilio(accountSid, authToken);

      const result = await client.messages.list();
      // res.status(200).json({
      //   success: true,
      //   messages: messages.map((message) => ({
      //     sid: message.sid,
      //     body: message.body,
      //     from: message.from,
      //     to: message.to,
      //   })),
      // });
      return {
        success: true,
        message: "Message Sent Successfully",
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: "app Api Key Not Found",
        status: 404,
      };
    }
  } else {
    return {
      success: false,
      message: varify_app.message,
      status: varify_app.status,
    };
  }
};
// Get a message
const GetSMS = async (req) => {
  const accountSid = req.body.accountSid;
  const authToken = req.body.authToken;

  const client = twilio(accountSid, authToken);
  const messageSid = req.params.sid;
  const result = await client.messages(messageSid).fetch();

  // res.status(200).json({
  //   success: true,
  //   message: {
  //     sid: message.sid,
  //     body: message.body,
  //     from: message.from,
  //     to: message.to,
  //     dateSent: message.dateSent,
  //     status: message.status,
  //   },
  // });
  return {
    success: true,
    message: "Message Sent Successfully",
    data: result.data,
  };
};
// Delete Message
const DeleteSMS = async (req) => {
  const accountSid = req.body.accountSid;
  const authToken = req.body.authToken;

  const client = twilio(accountSid, authToken);
  const messageSid = req.params.sid;
  const result = await client.messages(messageSid).remove();

  return {
    success: true,
    message: "Message Sent Successfully",
    data: result.data,
  };
};
// Message media
const MessageMedia = async (req) => {
  const accountSid = req.body.accountSid;
  const authToken = req.body.authToken;

  const client = twilio(accountSid, authToken);
  const messageSid = req.params.sid;
  const media = await client.messages(messageSid).media.list();
  const result = media.map((item) => ({
    sid: item.sid,
    contentType: item.contentType,
    url: item.uri,
  }));

  return {
    success: true,
    message: "Message Sent Successfully",
    data: result.data,
  };
};
// Create a Call

const CreateCall = async (req) => {
  const accountSid = req.body.accountSid;
  const authToken = req.body.authToken;

  const client = twilio(accountSid, authToken);

  const { to, from, twimlUrl } = req.body;
  const result = await client.calls.create({
    to: to,
    from: from,
    url: twimlUrl,
  });
  return {
    success: true,
    message: "Call Successfully",
    data: result.data,
  };
};
// List Call

const ListCall = async (req) => {
  const accountSid = req.body.accountSid;
  const authToken = req.body.authToken;

  const client = twilio(accountSid, authToken);

  const calls = await client.calls.list();
  const result = calls.map((call) => ({
    sid: call.sid,
    to: call.to,
    from: call.from,
    startTime: call.startTime,
    endTime: call.endTime,
    duration: call.duration,
    status: call.status,
  }));

  return {
    success: true,
    message: "Call Successfully",
    data: result.data,
  };
};
// Get Call
const GetCall = async (req) => {
  const accountSid = req.body.accountSid;
  const authToken = req.body.authToken;

  const client = twilio(accountSid, authToken);
  const callSid = req.params.sid;
  const call = await client.calls(callSid).fetch();
  const result = {
    sid: call.sid,
    to: call.to,
    from: call.from,
    startTime: call.startTime,
    endTime: call.endTime,
    duration: call.duration,
    status: call.status,
  };

  return {
    success: true,
    message: "Call Successfully",
    data: result.data,
  };
};
// Delete a Call
const DeleteCall = async (req) => {
  const accountSid = req.body.accountSid;
  const authToken = req.body.authToken;

  const client = twilio(accountSid, authToken);
  const callSid = req.params.sid;
  const result = await client.calls(callSid).remove();

  return {
    success: true,
    message: "Call Successfully",
    data: result.data,
  };
};

module.exports = {
  SendSMS: (req, res) => ServiceHandler(SendSMS, req, res),
  SendVoiceCall: (req, res) => ServiceHandler(SendVoiceCall, req, res),
  SendWhatsappSMS: (req, res) => ServiceHandler(SendWhatsappSMS, req, res),
  ListSMS: (req, res) => ServiceHandler(ListSMS, req, res),
  GetSMS: (req, res) => ServiceHandler(GetSMS, req, res),
  DeleteSMS: (req, res) => ServiceHandler(DeleteSMS, req, res),
  MessageMedia: (req, res) => ServiceHandler(MessageMedia, req, res),
  CreateCall: (req, res) => ServiceHandler(CreateCall, req, res),
  ListCall: (req, res) => ServiceHandler(ListCall, req, res),
  GetCall: (req, res) => ServiceHandler(GetCall, req, res),
  DeleteCall: (req, res) => ServiceHandler(DeleteCall, req, res),
};
