const {
  AgencyModel,
  GHlLocationsModel,
  GhlUserModel,
  WhiteBoardModel,
} = require('../../model')
const { ServiceHandler } = require('../../_utils/handler')
const util = require('util')
const {
  AppTokenHandler,
  UpdateAppTokenHandler,
} = require('../../_utils/AppHandler')
// const nfc_card = require('../../model/nfc_card')
const NFCUSER = require('../../model/nfc_user')
const nfc_card = require('../../model/nfc_card')
const lookup = util.promisify(require('dns').lookup)
const exec = util.promisify(require('child_process').exec)

const Create = async (req) => {
  const result = await NFCUSER.create(req.body)
  if (!result)
    return {
      success: false,
      message: 'something went wrong while creating product',
    }

  return {
    success: true,
    message: 'product successfully created',
    data: result,
  }
}

const Update = async (req) => {
  const result = await NFCUSER.findByIdAndUpdate(req.body._id, req.body, {
    new: true,
  })
  if (!result)
    return {
      success: false,
      message: 'something went wrong while updating product',
    }

  return {
    success: true,
    message: 'product successfully updated',
    data: result,
  }
}

const GetMerchants = async (req) => {
  try {
    const result = await NFCUSER.find({ role: "Merchant" });

    console.log('result', result);

    if (!result || result.length === 0) {
      return {
        success: false,
        message: 'No merchants found.',
      };
    }

    return {
      success: true,
      message: 'Merchants retrieved successfully.',
      data: result,
    };
  } catch (error) {
    console.error('Error fetching merchants:', error);
    return {
      success: false,
      message: 'An error occurred while retrieving merchants.',
    };
  }
};
const GetById = async (req) => {
  
  try {
    const result = await NFCUSER.GetById(req.query);

    console.log('result', result);

    if (!result || result.length === 0) {
      return {
        success: false,
        message: 'No merchants found.',
      };
    }

    return {
      success: true,
      message: 'Merchants retrieved successfully.',
      data: result,
    };
  } catch (error) {
    console.error('Error fetching merchants:', error);
    return {
      success: false,
      message: 'An error occurred while retrieving merchants.',
    };
  }
};


const GetProductByMerchantId = async (req) => {
  const {merchantId} = req.query
  const result = await NFCUSER.find({merchantId})

  if (!result)
    return {
      success: false,
      message: 'product not found successfully',
    }

  return {
    success: true,
    message: 'product found successfully',
    data: result,
  }
}
const GetByCompanyId = async (req) => {
  const {companyId} = req.query
  const result = await NFCUSER.find({companyId})

  if (!result)
    return {
      success: false,
      message: 'product not found successfully',
    }

  return {
    success: true,
    message: 'product found successfully',
    data: result,
  }
}
const GetByProductId = async (req) => {
  const {productId} = req.query
const result = await NFCUSER.findOne({ productId });
  
  if (!result)
    return {
      success: false,
      message: 'product not found successfully',
    }

  return {
    success: true,
    message: 'product found successfully',
    data: result,
  }
}

const Delete = async (req) => {
  console.log('req.body._id', req.query._id)
  console.log('req.body._id', req.query)
  console.log('req.body._id', req.body)
  const result = await NFCUSER.findByIdAndDelete(req.body._id)
  console.log('result', result)
  if (!result)
    return {
      success: false,
      message: 'something went worng while delete product',
    }

  return {
    success: true,
    message: 'product successfully deleted',
    data: result,
  }
}

module.exports = {
  Create: (req, res) => ServiceHandler(Create, req, res),
  Delete: (req, res) => ServiceHandler(Delete, req, res),
  Update: (req, res) => ServiceHandler(Update, req, res),
  GetById: (req, res) => ServiceHandler(GetById, req, res),
  GetMerchants: (req, res) => ServiceHandler(GetMerchants, req, res),
  GetProductByMerchantId: (req, res) => ServiceHandler(GetProductByMerchantId, req, res),
  GetByProductId: (req, res) => ServiceHandler(GetByProductId, req, res),
  GetByCompanyId: (req, res) => ServiceHandler(GetByCompanyId, req, res),
  // GetByAssociateID: (req, res) => ServiceHandler(GetByAssociateID, req, res),
}
