const axios = require("axios");
const {
  FreeAppTokenModel,
  AppTokenModel,
  ServiceTitanModel,
  ServiceTitanTokensModel,
  SnapshotOnBoardingTokenModel,
  SnapshotOnBoardingModel,
} = require("../../model");
const qs = require("querystring");
const jwt = require("jsonwebtoken");
const getUpdateToken = async ({ refresh_token, keys }) => {
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
const GetServiceM8AccessToken = async (tokens) => {
  let data = qs.stringify({
    grant_type: "refresh_token",
    client_id: "490284",
    client_secret: "1f4a233599a24f1d9c6c219002e5bb3b",
    refresh_token: tokens?.refresh_token,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://go.servicem8.com/oauth/access_token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };
  const result = await axios.request(config).catch((err) => {
    // console.log("Token ERROR:", err);
    return err.response.data;
  });
  return result?.data ? result.data : "";
};
const GetZoomAccessToken = async (tokens) => {
  // const clientId = "0SHhxpBySfWviaAHkuu1lA";
  // const clientSecret = "8hZDoYHZe3eYDY4glJUYfoxmFyRRs62J";
  const clientId = "YHP9s84HSBmBUv1SfpA_ag";
  const clientSecret = "IcSMKB9gUW0fKmYkJwGBatN3FZVKj9C6";
  const encodedCredentials = Buffer.from(
    `${clientId}:${clientSecret}`
  ).toString("base64");
  // console.log(encodedCredentials);
  const result = await axios
    .post("https://zoom.us/oauth/token", null, {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        refresh_token: tokens?.refresh_token,
        grant_type: "refresh_token",
      },
    })
    .catch((err) => {
      // console.log("Token ERROR:", err);
      return err.response.data;
    });
  // const result = await axios.request(config).catch((err) => {
  //   console.log("Token ERROR:", err);
  //   return err.response.data;
  // });
  return result?.data ? result.data : "";
};
const UpdateServiceTitanAccessToken = async () => {
  const tokens = await ServiceTitanTokensModel.find({
    "appCred.client_id": { $exists: true },
  });
  // console.log(tokens?.length)
  let result = false;
  for (let index = 0; index < tokens.length; index++) {
    const element = tokens[index];

    let data = qs.stringify({
      grant_type: "client_credentials",
      client_id: element?.appCred?.client_id,
      client_secret: element?.appCred?.client_secert,
    });
    let config = {
      method: "post",
      url: "https://auth.servicetitan.io/connect/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };
    result = await axios.request(config).catch((err) => {
      // console.log("Token ERROR:", err);
      return err.response.data;
    });
    // console.log(result?.data, 'result?.data')
    if (result?.data) {
      const appCred = {
        client_id: element?.appCred?.client_id,
        client_secert: element?.appCred?.client_secert,
        tenant_id: element?.appCred?.tenant_id,
        access_token: result?.data?.access_token,
        expires_in: result?.data?.expires_in,
        scope: result?.data?.scope,
      };

      const payload = {
        appCred: appCred,
      };
      // console.log(payload, 'payload')
      // console.log(element._id, 'element._id')
      const update = await ServiceTitanTokensModel.findByIdAndUpdate(
        element._id,
        payload
      );
    }
  }
  return result?.data ? result.data : "";
};
const UpdatepdgGenraotrToken = async (type) => {
  const collections = {
    app_token: AppTokenModel,
    free_app_token: FreeAppTokenModel,
  };
  // console.log(type, 'type')
  var items = [];
  var app_id = "6633701d7b639f0fbcb1a0e5";
  if (type == "app_token") {
    var app_id = "65eee6aea5c68d589cc218d4";
  }
  // console.log('start')
  items = await collections[type].find({
    app_id: app_id,
    "credentials.token": { $exists: true },
  });

  if (!items.length) return;
  // console.log('check length true')

  const result = await items.reduce(async (acc, item) => {
    const expirationTime = Math.floor(Date.now() / 1000) + 864000;

    const header = {
      alg: "HS256",
      typ: "JWT",
    };

    const payload = {
      iss: item?.app_cred?.apiKey,
      sub: item?.app_cred?.workspaceId,
      exp: expirationTime,
    };
    // console.log(expirationTime, "expirationTime");

    const token = jwt.sign(payload, item?.app_cred?.apiSecret, {
      header: header,
    });
    // console.log(token, type, "token");
    var result = false;
    if (token) {
      result = await collections[type].findByIdAndUpdate(item._id, {
        credentials: { ...item?.credentials, token: token },
      });
    }
    return [...(await acc), result];
  }, []);
};
const UpdateServiceM8Token = async (type) => {
  const collections = {
    app_token: AppTokenModel,
    free_app_token: FreeAppTokenModel,
  };
  var items = [];
  var app_id = "652d6d5787b9f948125bb85b";
  if (type == "app_token") {
    var app_id = "653a45fc5846f3d8c2893c6c";
  }
  // console.log('start')
  items = await collections[type].find({
    app_id: app_id,
    "app_cred.refresh_token": { $exists: true },
  });

  if (!items.length) return;
  // console.log('check length true')

  const result = await items.reduce(async (acc, item) => {
    var token_data = "";

    token_data = await GetServiceM8AccessToken(item.app_cred);
    // console.log(token_data, "token_data");
    var result = false;
    if (token_data?.access_token) {
      result = await collections[type].findByIdAndUpdate(item._id, {
        app_cred: token_data,
      });
    }
    return [...(await acc), result];
  }, []);

  return result;
};
const UpdateZoomToken = async (type) => {
  const collections = {
    app_token: AppTokenModel,
    free_app_token: FreeAppTokenModel,
  };
  var items = [];
  var app_id = "64f218cb9bace7699ea417b8";
  if (type == "app_token") {
    var app_id = "653a6038623dcfbff207320e";
  }
  // console.log('start')
  items = await collections[type].find({
    app_id: app_id,
    "app_cred.refresh_token": { $exists: true },
  });

  if (!items.length) return;
  // console.log('check length true')

  const result = await items.reduce(async (acc, item) => {
    var token_data = "";

    token_data = await GetZoomAccessToken(item.app_cred);
    // console.log(token_data, "token_data");
    var result = false;
    if (token_data?.access_token) {
      result = await collections[type].findByIdAndUpdate(item._id, {
        app_cred: token_data,
      });
    }
    return [...(await acc), result];
  }, []);

  return result;
};
const UpdateSVUToken = async (type) => {
  const items = await SnapshotOnBoardingTokenModel.find({
    app_id: { $exists: true },
    refresh_token: { $exists: true },
  });

  if (!items.length) return;
  // console.log('check length true')

  const result = await items.reduce(async (acc, item) => {
    var token_data = "";
    const app_keys = await SnapshotOnBoardingModel.findOne({
      app_id: item.app_id,
    });
    token_data = await getUpdateToken({
      refresh_token: item.refresh_token,
      keys: app_keys,
    });
    // console.log(token_data, "token_data");
    var result = false;
    if (token_data?.access_token) {
      result = await SnapshotOnBoardingTokenModel.findByIdAndUpdate(item._id, {
        access_token: token_data.access_token,
        refresh_token: token_data.refresh_token,
      });
    }
    return [...(await acc), result];
  }, []);

  return result;
};
module.exports = {
  UpdateServiceM8Token,
  UpdateServiceTitanAccessToken,
  UpdatepdgGenraotrToken,
  UpdateZoomToken,
  UpdateSVUToken,
};
