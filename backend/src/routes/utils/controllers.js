const services = require("./services");
const Responses = require("./responses");
const { ResponseStatus } = require("../../_enums/enums");
const { ServiceHandler } = require("../../_utils/handler");

const UploadImage = async (req, res) => {
  const file = req.file;
  // //console.log(file)
  if (!file)
    return res.status(ResponseStatus.BAD_REQUEST).send({
      success: false,
      message: Responses.UploadImage.FILE_REQ,
      error: Responses.UploadImage.FILE_REQ,
    });

  const { response } = await ServiceHandler(
    services.Upload,
    { file: file },
    res
  );
  // //console.log(response)
  return response;
};

module.exports = {
  UploadImage,
};
