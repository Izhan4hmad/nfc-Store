const socketIO = require("socket.io");
const axios = require("axios").default;
const createConversation = async (conversation_data) => {
  console.log(conversation_data, 'conversation_data')
  // await ConversationModel.deleteMany()
  // const user_id = conversation_data.userId
  // const isCustom = conversation_data.isCustom
  const chat_id = conversation_data?.chat_id
  var find = await ConversationModel.findById(chat_id)
  // if (isCustom) {

  // } else {

  //   var find = await ConversationModel.findOne({ userId: user_id, receiverId: conversation_data.receiverId })
  // }
  // console.log(find, 'find')
  if (find) {
    const update_data = {
      messages: [...find?.messages, conversation_data]
    }
    console.log(update_data, 'update_data')
    const data = await ConversationModel.findByIdAndUpdate(chat_id, update_data);
    var result = conversation_data
  } else {
    const create_data = {
      agency_id: conversation_data?.agency_id,
      type: conversation_data.type,
      location_id: conversation_data?.location_id,
      email: conversation_data?.email,
      messages: [conversation_data]
    }
    console.log(create_data, 'create_data')
    var result = await ConversationModel.create(create_data);
  }
  return result
};
const createLocationConversation = async (data) => {
  var result = await ConversationModel.create(data);
};
const SendWorkFLow = async (data) => {
  const workflow_data = data?.workflow_data
  // const app_token = await AppTokenModel.findOne(
  //   { agency_id: data.agency_id, app_id: workflow_data.app_id }
  // )
  const agency_data = await AgencyModel.findById(data?.agency_id)
  const assign_user_bycontact = await AssignUserModel.findOne(
    { agency_id: data?.agency_id, contactId: workflow_data?.contactId }
  )
  const assign_user_by_locationId = await AssignUserModel.findOne(
    { agency_id: data?.agency_id, locationId: workflow_data?.locationId }
  )
  // console.log(workflow_data?, 'workflow_data?')
  // console.log(assign_user_bycontact, 'assign_user_bycontact')
  // console.log(assign_user_by_locationId, 'assign_user_by_locationId')
  if (assign_user_bycontact && workflow_data?.type == "user" || workflow_data?.type == "location") {
    const user_data = await GhlUserModel.findOne(
      { id: assign_user_bycontact.user }
    )
    var GhlContact = await search_user(agency_data?.ghl, user_data?.email);
    console.log(GhlContact, "search_user");
    if (!GhlContact.success) {
      const temp_data = {
        customer_email: user_data?.email,
        customer_name: "name",
      };
      var GhlContact = await create_contact(temp_data, agency_data?.ghl, user_data?.email);
      console.log(GhlContact, "create_contact");
    }
    const workflow = await Workflow(GhlContact, agency_data?.workflows?.message_received, agency_data?.ghl)
  } else if (assign_user_by_locationId) {
    const user_data = await GhlUserModel.findOne(
      { id: assign_user_by_locationId?.user }
    )
    var GhlContact = await search_user(agency_data?.ghl, user_data?.email);
    console.log(GhlContact, "search_user");
    if (!GhlContact.success) {
      const temp_data = {
        customer_email: user_data?.email,
        customer_name: "name",
      };
      var GhlContact = await create_contact(temp_data, agency_data?.ghl, user_data?.email);
      console.log(GhlContact, "create_contact");
    }
    const workflow = await Workflow(GhlContact, agency_data?.workflows?.message_received, agency_data?.ghl)
  } else {
    const user_data = await GhlUserModel.findOne(
      { id: agency_data?.default_user }
    )
    var GhlContact = await search_user(agency_data?.ghl, user_data?.email);
    console.log(GhlContact, "search_user");
    if (!GhlContact.success) {
      const temp_data = {
        customer_email: user_data?.email,
        customer_name: "name",
      };
      var GhlContact = await create_contact(temp_data, agency_data?.ghl, user_data?.email);
      console.log(GhlContact, "create_contact");
    }
    const workflow = await Workflow(GhlContact, agency_data?.workflows?.message_received, agency_data?.ghl)
  }
}
const onlineUsers = new Set();
const initSocket = (socket, io) => {
  // const agencyAppServer = socketIO(server, { cors: { origin: "*" } }); // origin needs to be update according to environment
  // const io = agencyAppServer.of('/agency_app');
  // io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} agency user just connected!`);
  socket.on("agencytaskcomment", async (data) => {
    console.log(data, "agencytaskcommentagencytaskcomment")
    const response = await AgencyTaskCommentsModel.create(data)
    io.emit("agencytaskcommentResponse", response);
  });
  socket.on("conversation", async (data) => {
    console.log(data, 'datadata')
    const conversation = await createConversation(data)
    if (data.type == "location") {

      const workflow = await SendWorkFLow(data)
    }

    io.emit("conversationResponse", conversation);
  });
  socket.on("createlocationconversation", async (data) => {
    console.log(data, 'datadata')
    createLocationConversation(data)
    io.emit("createlocationconversationresponse", data);
  });
  socket.on('userOnline', (userId) => {
    onlineUsers.add(userId);
    io.emit('updateOnlineUserStatus', Array.from(onlineUsers));
  });

  // Event when a user goes offline
  socket.on('userOffline', (userId) => {
    onlineUsers.delete(userId);
    io.emit('updateOnlineUserStatus', Array.from(onlineUsers));
  });

  socket.on("disconnect", () => {
    console.log("🔥: A agency user disconnected");
  });
  socket.on("agency_chat_socket", (data) => {
    console.log(data, "data");
    io.emit("agency_chat_socket_response", data);
  });
  // });
};
const Workflow = async (GhlContact, workflowId, ghl) => {
  // console.log(GhlContact, 'GhlContactGhlContact')
  var options = {
    method: "POST",
    url:
      "https://services.leadconnectorhq.com/contacts/" +
      GhlContact?.data?.id +
      "/workflow/" +
      workflowId,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + ghl?.access_token,
      Version: "2021-04-15",
    },
  };

  var responses = await axios
    .request(options)
    .then(function (response) {
      console.log(JSON.stringify(response.data, 'workflow success'));
      return {
        status: 200,
        success: true,
      };
    })
    .catch(function (error) {
      // console.log(error, 'workflow error');
      return {
        status: 400,
        success: false,
      };
    });
}
const search_user = async (ghl, email) => {
  // console.log(ghl, "ghl");
  var options = {
    method: "GET",
    url: "https://services.leadconnectorhq.com/contacts/",
    params: {
      locationId: ghl?.location_id,
      query: email,
      limit: "1",
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + ghl?.access_token,
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
      console.log(contact_search.data.length);
      return {
        success: true,
        status: 200,
        data: contact_search.data[0],
      };
    }
    console.log(contact_search.data.length);

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

const create_contact = async (contact, ghl) => {
  var data = JSON.stringify({
    email: contact?.customer_email,
    name: contact?.customer_name,
    locationId: ghl?.location_id,
    source: "public api",
    customFields: [],
  });
  // console.log(data, "create_contact");
  var options = {
    method: "POST",
    url: "https://services.leadconnectorhq.com/contacts/",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + ghl?.access_token,
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
module.exports = initSocket;
