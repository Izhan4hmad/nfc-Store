const axios = require("axios");
const { ServiceHandler } = require("../../../_utils/handler");
const { ReqMethods } = require("../../../_enums");
const { v4: uuidv4 } = require("uuid");
const { AgencyModel, ServeyStatusModel } = require("../../../model");
const FormData = require("form-data");
const uid = uuidv4();
async function GetuploadFile(file_name, access_token) {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://services.leadconnectorhq.com/medias/files?query=" + file_name,
    headers: {
      Authorization: "Bearer " + access_token,
      Version: "2021-07-28",
    },
  };

  const response_data = await axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return {
        success: true,
        data: response.data.files[0]?.url,
      };
    })
    .catch((error) => {
      console.log(error);
      return {
        success: false,
        data: error,
      };
    });
  return response_data;
}

async function uploadFileToGhl(image, name, type, access_token) {
  const apiUrl = "https://services.leadconnectorhq.com/medias/upload-file";
  const temp_name = name.split(" ")[0];
  const file_ext = type.split("/")[1];
  const key =
    temp_name + "-" + Math.floor(Math.random() * 110000) + "." + file_ext;
  const file_name = key;
  var formData = new FormData();
  formData.append("file", image, {
    filename: file_name, // Specify the filename
    contentType: { type }, // Specify the content type
  });

  // Set up headers for the request
  const headers = {
    Authorization: `Bearer ${access_token}`,
    Version: "2021-07-28",
    ...formData.getHeaders(), // Include FormData headers
  };

  // Make the API request to upload the image to Go High Level Media
  const response_data = await axios
    .post(apiUrl, formData, { headers })
    .then((response) => {
      const imageUrl = response;
      console.log("Image uploaded to Go High Level Media. URL:", imageUrl);
      return {
        success: true,
        data: response.data,
      };
    })
    .catch((error) => {
      console.error("Error:", error);
      return {
        success: false,
        data: error,
      };
    });
  console.log(file_name, "file_name");
  if (response_data.success) {
    const imageUrl = await GetuploadFile(file_name, access_token);
    console.log(imageUrl, "GetuploadImage");

    return {
      success: true,
      data: imageUrl.data,
    };
  } else {
    return {
      success: false,
      data: {},
    };
  }
}
const CallService = async (req) => {
  const {
    method,
    path,
    query,
    payload,
    headers = {},
    key,
    version = "2021-04-15",
  } = req.body;
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
const FileUpload = async (req) => {
  const { file } = req;
  const { location_id, agency_id, form_id } = req.query;
  const agency_data = await AgencyModel.findById(agency_id);

  const qs = require("qs");
  let data = qs.stringify({
    companyId: agency_data.agency_ghl.company_id,
    locationId: location_id,
  });

  let access_config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://services.leadconnectorhq.com/oauth/locationToken",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${agency_data.agency_ghl.access_token}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Version: "2021-07-28",
    },
    data: data,
  };

  const loc_token = await axios
    .request(access_config)
    .then((response) => {
      return response.data;
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
  console.log(
    loc_token?.access_token,
    "access_tokenaccess_tokenaccess_tokenaccess_token"
  );
  const servey = await ServeyStatusModel.findOne({
    form_id: form_id,
    location_id: location_id,
  });
  const payload = {
    ghl: loc_token,
  };
  console.log(payload, "payloadpayload");
  console.log(servey, "serveyservey");
  const response = await ServeyStatusModel.findByIdAndUpdate(
    servey._id,
    payload
  );

  const image = await uploadFileToGhl(
    file.buffer,
    file.originalname,
    file.mimetype,
    loc_token?.access_token
  );
  console.log(image, "image");
  // if (!image.success) {
  //   return {
  //     success: false,
  //     status: 400,
  //   };
  // }
  return {
    success: true,
    status: 200,
    data: image,
  };
};
module.exports = {
  CallService: (req, res) => ServiceHandler(CallService, req, res),
  FileUpload: (req, res) => ServiceHandler(FileUpload, req, res),
};
