const socketIO = require("socket.io");
const {
  SupportCommentsModel,
  SupportTicketsModel,
  AppSetupModal,
  MaretplaceAppsModel,
  UserModel,
  GhlUserModel,
  ConversationModel,
  chatAppUsersModel,
  AgencyChatTicketsModel,
  AgencyChatSupportCommentsModel,
  FreeAppTokenModel,
  supportCustomizationModel,
} = require("./src/model");
const {
  sendoutbound,
  create_contact,
  search_contact,
  UpdateMessage,
  sendinbound,
} = require("./src/_utils/GhlHandler");
const { datafusion } = require("googleapis/build/src/apis/datafusion");
const axios = require("axios").default;
const initAgencyAppSocket = require("./src/AgencyAppRoutes/socket");
const multer = require("multer");
const {
  VerifyAccessTokenWithType,
  VerifySupportToken,
} = require("./src/_utils/GhlTokenHandler");
const { AppTokenHandler } = require("./src/_utils/AppHandler");
const upload = multer();
const initSocket = (server, app) => {
  const io = socketIO(server, { cors: { origin: "*" } }); // origin needs to be update according to environment
  // console.log(io, 'ioioioioioioioioioioioioioioioioioioioioioioioio');
  app.post(
    "/webhook/support/chat/:provider_id",
    upload.none(),
    async (req, res) => {
      console.log(req, "req");
      console.log(req.params.provider_id, "provider_id");
      console.log(req.body, "req.body");
      const data = req.body;
      // return 0
      const ticket = await SupportTicketsModel.findOne({
        contactId: data.contactId,
        conversationId: data.conversationId,
      })
        .sort({ _id: -1 })
        .exec();
      console.log(ticket, "ticketticket");

      const payload = {
        task_id: ticket._id,
        username: "support agent",
        email: "support@levelupmarketplace.com",
        comment: data.message,
        messageId: data.messageId,
        conversationId: data.conversationId,
        type: "agent",
      };
      console.log(payload, "payloadpayload");
      var app_setup = await supportCustomizationModel.findOne({
        company_id: ticket.company_id,
      });
      if (
        app_setup.ghl &&
        ticket?.ghl_feature_id &&
        ticket?.manageTicketsBy == "yourself"
      ) {
        var converstion_provider = "67c4c3b4c466825a007684a3";
        const token_response = await VerifySupportToken(
          app_setup,
          ticket?.manageTicketsBy
        );
        if (token_response?.success) {
          app_setup = token_response?.data;
        }
      } else {
        app_setup = await AppSetupModal.findOne();
        var converstion_provider = "66901f06d6bddff56f56a92f";
        const token_response = await VerifySupportToken(
          app_setup,
          ticket?.manageTicketsBy
        );
        if (token_response?.success) {
          app_setup = token_response?.data;
        }
      }
      const comment = await SupportCommentsModel.create(payload);
      console.log(comment, "commentcomment");
      const msg_data = {
        status: "delivered",
      };
      const message_update = await UpdateMessage(
        app_setup?.ghl,
        msg_data,
        data.messageId
      );
      io.emit("supportcommentResponse", comment);
      res.json({
        success: true,
        status: 200,
        message: "Event triggered successfully",
      });
    }
  );
  app.post(
    "/partner-webhook/support/chat/:provider_id",
    upload.none(),
    async (req, res) => {
      console.log(req, "req");
      console.log(req.params.provider_id, "provider_id");
      console.log(req.body, "req.body");
      const data = req.body;
      // return 0
      const ticket = await SupportTicketsModel.findOne({
        contactId: data?.contactId,
        conversationId: data?.conversationId,
      })
        .sort({ _id: -1 })
        .exec();
      console.log(ticket, "ticketticket");

      const payload = {
        task_id: ticket?._id,
        username: "support agent",
        email: "support@levelupmarketplace.com",
        comment: data?.message,
        messageId: data?.messageId,
        conversationId: data?.conversationId,
        type: "agent",
      };
      console.log(payload, "payloadpayload");
     
     
         const app_setup = await AppTokenHandler({
      app_id: ticket?.app_id,
      location_id: ticket?.location_id,
      company_id: ticket?.company_id,
    });
      const comment = await SupportCommentsModel.create(payload);
      console.log(comment, "commentcomment");

      
          let message_config = {
            method: "put",
            maxBodyLength: Infinity,
            url: `https://services.leadconnectorhq.com/conversations/messages/${data?.messageId}/status`,
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${app_setup?.access_token}`,
              "Content-Type": "application/json",
              Version: "2021-04-15",
            },
            data: JSON.stringify({
            status: "read",
          })
          };


          console.log(message_config, "message_configmessage_config");
      
          axios
            .request(message_config)
            .then((response) => {
              console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
              console.log(error);
            });
      
         io.emit("supportcommentResponse", comment);
        res.json({
          success: true,
          status: 200,
          message: "Event triggered successfully",
        });

      //  const msg_data = {
      //    status: "read",
      //  };
      //  const message_update = await UpdateMessage(
      //    app_setup,
      //    msg_data,
      //    data?.messageId
      //  );
      // console.log(message_update, "message_updatemessage_update");
      // if(message_update?.success){
      //   io.emit("supportcommentResponse", comment);
      //   res.json({
      //     success: true,
      //     status: 200,
      //     message: "Event triggered successfully",
      //   });
      // } else {
      //   io.emit("supportcommentResponse", comment);
      //   res.json({
      //     success: true,
      //     status: 200,
      //     message: "Message status not updated",
      //   });
      // }
    }
  );

  app.post("/webhook/agency/chat", upload.none(), async (req, res) => {
    console.log(req, "req");
    console.log(req.body, "req.body");
    const data = req.body;
    const ticket = await AgencyChatTicketsModel.findOne({
      contactId: data.contactId,
      conversationId: data.conversationId,
    })
      .sort({ _id: -1 })
      .exec();
    console.log(ticket, "ticketticket");

    const payload = {
      task_id: ticket._id,
      username: "support agent",
      email: "support@levelupmarketplace.com",
      comment: data.message,
      messageId: data.messageId,
      conversationId: data.conversationId,
      type: "agent",
    };
    console.log(payload, "payloadpayload");
    const app_setup = await FreeAppTokenModel.findOne({
      app_id: "67bc86f6986c4eb6221f08cf",
      location_id: ticket.ref_location_id,
    });
    const comment = await AgencyChatSupportCommentsModel.create(payload);
    console.log(comment, "commentcomment");
    const msg_data = {
      status: "delivered",
    };
    const message_update = await UpdateMessage(
      app_setup,
      msg_data,
      data.messageId
    );
    io.emit("agencychatsupportcommentResponse", comment);
    res.json({
      success: true,
      status: 200,
      message: "Event triggered successfully",
    });
  });

  app.post("/webhook/callrail", upload.none(), async (req, res) => {
    console.log(req, "req");
    console.log(req.body, "req.body");
    const msg_data = {
      status: "delivered",
    };
    const message_update = await UpdateMessage(
      app_setup?.ghl,
      msg_data,
      data.messageId
    );
    io.emit("supportcommentResponse", req.body);
    res.json({
      success: true,
      status: 200,
      message: "Event triggered successfully",
    });
  });

  io.on("connection", (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on("supportcomment", async (data) => {
      const ticket = await SupportTicketsModel.findById(data.task_id);
      console.log(ticket, "data socket.io");

      var app_setup = await supportCustomizationModel.findOne({
        company_id: ticket.company_id,
      });

      if (
        app_setup.ghl &&
        ticket?.ghl_feature_id &&
        app_setup?.manageTicketsBy == "yourself"
      ) {
        var converstion_provider = "67c4c3b4c466825a007684a3";
        const token_response = await VerifySupportToken(
          app_setup,
          ticket.manageTicketsBy
        );
        if (token_response?.success) {
          app_setup = token_response?.data;
        }
      } else {
        app_setup = await AppSetupModal.findOne();
        var converstion_provider = "66901f06d6bddff56f56a92f";
        const token_response = await VerifySupportToken(
          app_setup,
          ticket.manageTicketsBy
        );
        if (token_response?.success) {
          app_setup = token_response?.data;
        }
      }
      console.log(ticket, "data socket.io");
      // return 0
      // const comment = await SupportCommentsModel.findOne({
      //   type: "location",
      //   task_id: data.task_id,
      // })
      //   .sort({ _id: -1 })
      //   .exec();
      let msg_body = {
        message: data.comment,
        type: "Custom",
        conversationId: ticket?.conversationId,
        conversationProviderId: converstion_provider,
      };
      const send_msg = await sendinbound(app_setup.ghl, msg_body);
      const payload = {
        task_id: data.task_id,
        username: data.username,
        email: data.email,
        comment: data.comment,
        messageId: send_msg?.data?.messageId,
        type: "location",
      };
      console.log(payload, "payloadpayload");
      const result = await SupportCommentsModel.create(payload);

      // const app_data = await MaretplaceAppsModel.findOne({ app_id: result.app_id });
      // const user = await UserModel.findById(app_setup.default_agent);
      // // const ghlUser = await GhlUserModel.findOne({ email: data.email })
      // if (data.type == "location") {
      //   var url = app_setup.comment_webhook;
      //   var response = await SupportCommentsModel.create({ ...data, username: result.username, email: result.email })

      // } else {
      //   var response = await SupportCommentsModel.create(data)
      //   var url = app_setup.receive_comment_webhook
      // }

      // console.log({
      //   // Include any data you want to send in the request body
      //   user: user,
      //   app_data: app_data,
      //   ticket: result,
      //   latest_message: data,
      // })
      // // return 0
      // await axios.post(url, {
      //   // Include any data you want to send in the request body
      //   user: user,
      //   app_data: app_data,
      //   ticket: result,
      //   latest_message: data,
      // })
      //   .then(response => {
      //     console.log('Response:', response.data);
      //   })
      //   .catch(error => {
      //     console.error('Error:', error);
      //   });
      io.emit("supportcommentResponse", result);
    });
    socket.on("partner_supportcomment", async (data) => {
      const ticket = await SupportTicketsModel.findById(data.task_id);
      console.log(ticket, "data socket.io");


       const app_setup = await AppTokenHandler({
      app_id: ticket?.app_id,
      location_id: ticket?.location_id,
      company_id: ticket?.company_id,
    });

        var converstion_provider = "682758a7926feb1fed53e7cf";
        
      console.log(ticket, "data socket.io");
      
      let msg_body = {
        message: data.comment,
        type: "Custom",
        conversationId: ticket?.conversationId,
        conversationProviderId: converstion_provider,
      };
      const send_msg = await sendinbound(app_setup, msg_body);
      const payload = {
        task_id: data.task_id,
        username: data.username,
        email: data.email,
        comment: data.comment,
        messageId: send_msg?.data?.messageId,
        type: "location",
      };
      console.log(payload, "payloadpayload");
      const result = await SupportCommentsModel.create(payload);

      io.emit("supportcommentResponse", result);
    });
    socket.on("agencychatsupportcomment", async (data) => {
      console.log(data, "agencychatsupportcomment");
      // return 0
      const ticket = await AgencyChatTicketsModel.findById(data.task_id);
      const app_setup = await FreeAppTokenModel.findOne({
        app_id: "67bc86f6986c4eb6221f08cf",
        location_id: ticket.ref_location_id,
      });
      // const comment = await SupportCommentsModel.findOne({
      //   type: "location",
      //   task_id: data.task_id,
      // })
      //   .sort({ _id: -1 })
      //   .exec();
      let msg_body = {
        message: data.comment,
        type: "Custom",
        conversationId: ticket?.conversationId,
        conversationProviderId: "67bc90f3b7b345b1d607b026",
      };
      const send_msg = await sendinbound(app_setup, msg_body);
      const payload = {
        task_id: data.task_id,
        username: data.username,
        email: data.email,
        comment: data.comment,
        messageId: send_msg?.data?.messageId,
        type: "location",
      };
      console.log(payload, "payloadpayload");
      const result = await AgencyChatSupportCommentsModel.create(payload);

      // const app_data = await MaretplaceAppsModel.findOne({ app_id: result.app_id });
      // const user = await UserModel.findById(app_setup.default_agent);
      // // const ghlUser = await GhlUserModel.findOne({ email: data.email })
      // if (data.type == "location") {
      //   var url = app_setup.comment_webhook;
      //   var response = await SupportCommentsModel.create({ ...data, username: result.username, email: result.email })

      // } else {
      //   var response = await SupportCommentsModel.create(data)
      //   var url = app_setup.receive_comment_webhook
      // }

      // console.log({
      //   // Include any data you want to send in the request body
      //   user: user,
      //   app_data: app_data,
      //   ticket: result,
      //   latest_message: data,
      // })
      // // return 0
      // await axios.post(url, {
      //   // Include any data you want to send in the request body
      //   user: user,
      //   app_data: app_data,
      //   ticket: result,
      //   latest_message: data,
      // })
      //   .then(response => {
      //     console.log('Response:', response.data);
      //   })
      //   .catch(error => {
      //     console.error('Error:', error);
      //   });
      io.emit("supportcommentResponse", result);
    });
    socket.on("disconnect", () => {
      console.log("🔥: A user disconnected");
    });

    socket.on("agency_chat_socket", async (data) => {
      const conversation = await createConversation(data);
      io.emit("agency_chat_socket_response", data);
    });

    socket.on("create_location_chat", async (data) => {
      await createConversation(data);
      io.emit("create_location_chat_response", data);
    });
  });

  const createConversation = async (conversation_data) => {
    console.log(
      conversation_data,
      "conversation_dataconversation_dataconversation_data"
    );
    const chat_id = conversation_data?.chat_id;
    var find = await ConversationModel.findById(chat_id);
    if (find) {
      var result = await ConversationModel.findByIdAndUpdate(chat_id, {
        messages: [...find?.messages, conversation_data?.message],
      });
    } else {
      var result = await ConversationModel.create(conversation_data);
    }
    return result;
  };

  const agency_io = io.of("/agency_app");

  agency_io.on("connection", (socket) => {
    initAgencyAppSocket(socket, agency_io);
  });
};
module.exports = initSocket;
