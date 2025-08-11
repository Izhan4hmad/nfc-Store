const {

  NFC } = require('../../model')
const { ServiceHandler } = require('../../_utils/handler')
const util = require('util')
const {
  AppTokenHandler,
  UpdateAppTokenHandler,
} = require('../../_utils/AppHandler')
const lookup = util.promisify(require('dns').lookup)
const exec = util.promisify(require('child_process').exec)

const Create = async (req) => {
  //console.log(req.body, "req.body")
  const result = await NFC.create(req.body)
  //console.log(result, "result")
  if (!result)
    return {
      success: false,
      message: 'something went wrong while creating card',
    }

  return {
    success: true,
    message: 'Card successfully created',
    data: result,
  }
}

const Delete = async (req) => {
  const result = await NFC.findByIdAndDelete(req.query._id)

  if (!result)
    return {
      success: false,
      message: 'NFC Data delete successfully',
    }

  return {
    success: true,
    message: 'NFC Data delete successfully',
    data: result,
  }
}
const Get = async (req) => {
  const result = await NFC.find()

  if (!result)
    return {
      success: false,
      message: 'NFC Data not found successfully',
    }

  return {
    success: true,
    message: 'NFC Data found successfully',
    data: result,
  }
}

const GetOne = async (req) => {
  //console.log(req.query, "wdfgn")
  const result = await NFC.findById(req.query.id)

  if (!result)
    return {
      success: false,
      message: 'NFC Data not found successfully',
    }

  return {
    success: true,
    message: 'NFC Data found successfully',
    data: result,
  }
}

const GetCardInfo = async (req) => {
  const { cardId } = req.query
  //console.log('cardId', req.query)
  const result = await NFC.findOne({ code: cardId })
  //console.log('result', result)
  if (!result)
    return {
      success: false,
      message: 'NFC Data not found successfully',
    }

  return {
    success: true,
    message: 'NFC Data found successfully',
    data: result,
  }
}
const GetById = async (req) => {
  try {
    const { cardId } = req.query
    //console.log('cardId', req.query)

    // Validate cardId
    if (!cardId) {
      return {
        success: false,
        message: 'cardId is required in query parameters',
      }
    }

    const result = await NFC.findOne({ code: cardId })
    //console.log('result', result)

    if (!result) {
      return {
        success: false,
        message: 'NFC Data not found',
      }
    }

    return {
      success: true,
      message: 'NFC Data found successfully',
      data: result,
    }
  } catch (error) {
    console.error('Error in GetById:', error)
    return {
      success: false,
      message: 'Server error while fetching NFC data',
      error: error.message,
    }
  }
}
const Update = async (req) => {
  //console.log(req.body, "testing")
  const { _id, ...configuration } = req.body; // Destructure and remove _id

  const result = await NFC.findByIdAndUpdate(
    _id,
    { configuration }, // Save the rest under configuration field
    { returnOriginal: false } // or { new: true } if using Mongoose 6+
  );

  if (!result)
    return {
      success: false,
      message: "something went worng while updating Docs",
    };

  return {
    success: true,
    message: "successfully updated",
    data: result,
  };
};
module.exports = {
  Create: (req, res) => ServiceHandler(Create, req, res),
  Get: (req, res) => ServiceHandler(Get, req, res),
  GetOne: (req, res) => ServiceHandler(GetOne, req, res),


  GetCardInfo: (req, res) => ServiceHandler(GetCardInfo, req, res),
  GetById: (req, res) => ServiceHandler(GetById, req, res),
  Update: (req, res) => ServiceHandler(Update, req, res),
  Delete: (req, res) => ServiceHandler(Delete, req, res),


}
