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
const productpage = require('../../model/productpage')
const nfc_card = require('../../model/nfc_card')
const lookup = util.promisify(require('dns').lookup)
const exec = util.promisify(require('child_process').exec)

const Create = async (req) => {
  const result = await productpage.create(req.body)
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
  const result = await productpage.findByIdAndUpdate(req.body._id, req.body, {
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

const Get = async (req) => {
  const result = await productpage.find()
console.log('result', result)
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
const GetProductByMerchantId = async (req) => {
  const {merchantId} = req.query
  const result = await productpage.find({merchantId})

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
const GetProductByCompanyId = async (req) => {
  const {companyId} = req.query
  const result = await productpage.find({companyId})

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
const result = await productpage.findOne({ productId });
  
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
const RemoveProductFromStore = async (req) => {
  console.log("calledddddd")
  try {
    const { _id, companyId } = req.body;

    if (!_id || !companyId) {
      return {
        success: false,
        message: 'Missing _id or companyId in request body',
      };
    }

    // Remove the provided companyId from the array
    const result = await productpage.findByIdAndUpdate(
      _id,
      {
        $pull: { companyId: companyId },
      },
      { new: true }
    );

    if (!result) {
      return {
        success: false,
        message: 'Package not found or could not be updated',
      };
    }

    return {
      success: true,
      message: 'Company ID removed successfully',
      data: result,
    };
  } catch (error) {
    console.error('Error removing company ID:', error);
    return {
      success: false,
      message: 'An error occurred while removing the company ID',
      error: error.message,
    };
  }
};
const Delete = async (req) => {
  console.log('req.body._id', req.query._id)
  console.log('req.body._id', req.query)
  console.log('req.body._id', req.body)
  const result = await productpage.findByIdAndDelete(req.body._id)
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
const GetByAgencyCreatedVariants = async (req) => {
  console.log('req.query:', req.query);
  const { company_id } = req.query;
  console.log('GetByAgencyCreatedVariants company_id:', company_id);
  if (!company_id) {
    return {
      success: false,
      message: 'Company ID is required',
    };
  }

  const result = await productpage.find({ 'variants.agencyCreated': true, 'variants.createdBy': company_id });

  if (!result || result.length === 0) {
    return {
      success: false,
      message: 'No products found for the specified agency',
    };
  }

  return {
    success: true,
    message: 'Products found successfully',
    data: result,
  };
};
module.exports = {
  Create: (req, res) => ServiceHandler(Create, req, res),
  Delete: (req, res) => ServiceHandler(Delete, req, res),
  Update: (req, res) => ServiceHandler(Update, req, res),
  Get: (req, res) => ServiceHandler(Get, req, res),
  GetProductByMerchantId: (req, res) => ServiceHandler(GetProductByMerchantId, req, res),
  GetByProductId: (req, res) => ServiceHandler(GetByProductId, req, res),
  GetProductByCompanyId: (req, res) => ServiceHandler(GetProductByCompanyId, req, res),
  RemoveProductFromStore: (req, res) => ServiceHandler(RemoveProductFromStore, req, res),
  GetByAgencyCreatedVariants: (req, res) => ServiceHandler(GetByAgencyCreatedVariants, req, res),
}
