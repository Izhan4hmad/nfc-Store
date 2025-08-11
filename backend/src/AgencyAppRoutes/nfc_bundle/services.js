const { AppTokenHandler } = require('../../_utils/AppHandler')
const { ServiceHandler } = require('../../_utils/handler')
const crypto = require('crypto')

const Stripe = require('stripe')
const {
  FreeAppTokenModel,
  TriggersModel,
  NFCPACKAGEMODEL,
  BUYPACKAGE,
  NFCCARD,
} = require('../../model')
const cron = require('node-cron')
const { ghlAuthHandler } = require('../../_utils/ghlauthhandler')
const axios = require('axios').default

const GHL_API_URL = 'https://services.leadconnectorhq.com'

// Schedule the cron job to run daily at midnight (00:00)


const GetProductDetails = async (req) => {
  const {name} = req.query;
  
  const result = await NFCPACKAGEMODEL.find({
    status: 'active',
    $or: [
      { couponId: { $exists: false } },
      { couponId: null },
      { couponId: "" },
    ]
  });

  console.log('result321', result);
  if (!result)
    return {
      success: false,
      message: 'Data not found successfully',
    }

  return {
    success: true,
    message: 'Data found successfully',
    data: result,
  }
}
const UpdateRedeemCoupon = async (req) => {
  const { coupon, company_id } = req.body;

  // Validate input
  if (!coupon || !company_id) {
    return {
      success: false,
      message: 'Coupon and company_id are required',
    };
  }

  try {
    // Search for the coupon in BUYPACKAGE
    const result = await BUYPACKAGE.findOne({ 
      couponId: coupon,
    });

    // Case 1: Coupon not found
    if (!result) {
      return {
        success: false, // Changed to false
        message: 'Invalid couponId',
      };
    }

    // Case 2: Coupon already redeemed (agencyId exists)
    if (result.agencyId) {
      return {
        success: false, // Changed to false
        message: 'Coupon already redeemed',
      };
    }

    // Case 3: Coupon valid and not redeemed, update BUYPACKAGE
    const updatedCoupon = await BUYPACKAGE.findOneAndUpdate(
      { couponId: coupon },
      { $set: { agencyId: company_id } },
      { new: true } // Return the updated document
    );

    // Only proceed to update NFCCARD if BUYPACKAGE update is successful
    if (updatedCoupon) {
      const updatedBundle = await NFCCARD.updateMany(
        { bundleId: updatedCoupon.bundleId },
        { $set: { agencyId: company_id } }
      );
      console.log('dataaaaa321', updatedCoupon.bundleId);
    }

    return {
      success: true,
      message: 'Coupon redeemed successfully',
      data: updatedCoupon,
    };

  } catch (error) {
    console.error('Error in UpdateRedeemCoupon:', error);
    return {
      success: false,
      message: 'An error occurred while processing the request',
    };
  }
};
const GetTagsDetails = async (req) => {
  const {company_id} = req.query;
  console.log('company_id', company_id);
 const result = await NFCCARD.find({agencyId: company_id});
  console.log('result123', result);
  if (!result)
    return {
      success: false,
      message: 'Data not found successfully',
    }

  return {
    success: true,
    message: 'Data found successfully',
    data: result,
  }
}
const GetCouponDetails = async (req) => {
  const {company_id} = req.query;
  
 const result = await BUYPACKAGE.find({agencyId: company_id});
  console.log('result321', result);
  if (!result)
    return {
      success: false,
      message: 'Data not found successfully',
    }

  return {
    success: true,
    message: 'Data found successfully',
    data: result,
  }
}


module.exports = {
  GetProductDetails: (req, res) => ServiceHandler(GetProductDetails, req, res),
  GetCouponDetails: (req, res) => ServiceHandler(GetCouponDetails, req, res),
  GetTagsDetails: (req, res) => ServiceHandler(GetTagsDetails, req, res),
  UpdateRedeemCoupon: (req, res) => ServiceHandler(UpdateRedeemCoupon, req, res),
}
