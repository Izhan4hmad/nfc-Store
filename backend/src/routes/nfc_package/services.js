const { ServiceHandler } = require('../../_utils/handler')
const util = require('util')
const nfc_action = require('../../model/nfc_action')
const { NFCPACKAGEMODEL, BUYPACKAGE, NFCCARD } = require('../../model')

const generateBundleId = async () => {
  const prefix = 'BU'
  const length = Math.floor(Math.random() * 3) + 5 // Random length between 5 and 7 for digits
  let bundleId
  let isUnique = false

  while (!isUnique) {
    const randomDigits = Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, '0')
    bundleId = `${prefix}${randomDigits}`
    const existingPackage = await NFCPACKAGEMODEL.findOne({ bundleId })
    if (!existingPackage) {
      isUnique = true
    }
  }

  return bundleId
}

const generateCouponId = async () => {
  const prefix = 'CP'
  const length = Math.floor(Math.random() * 3) + 5 // Random length between 5 and 7 for digits
  let couponId
  let isUnique = false

  while (!isUnique) {
    const randomDigits = Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, '0')
    couponId = `${prefix}${randomDigits}`
    const existingPurchase = await BUYPACKAGE.findOne({ couponId })
    if (!existingPurchase) {
      isUnique = true
    }
  }

  return couponId
}

const Create = async (req) => {
  console.log('req.body', req.body)

  try {
    // Generate unique bundleId
    const bundleId = await generateBundleId()

    // Add bundleId to the payload
    const payload = {
      ...req.body,
      bundleId,
    }
console.log('Final payload to create:', payload)

    const result = await NFCPACKAGEMODEL.create(payload)
    if (!result) {
      return {
        success: false,
        message: 'Something went wrong while creating package',
      }
    }

    return {
      success: true,
      message: 'Package successfully created',
      data: result,
    }
  } catch (error) {
    console.error('Error creating package:', error)
    return {
      success: false,
      message: 'An error occurred while creating the package',
      error: error.message,
    }
  }
}

const Delete = async (req) => {
  console.log('req.query', req.query)
  const { package_id } = req.query
  try {
    const result = await NFCPACKAGEMODEL.findByIdAndDelete(package_id)
    console.log('result', result)

    if (!result) {
      return {
        success: false,
        message: 'Package not found or could not be deleted',
      }
    }

    return {
      success: true,
      message: 'Package deleted successfully',
      data: result,
    }
  } catch (error) {
    console.error('Error deleting Package:', error)
    return {
      success: false,
      message: 'An error occurred while deleting the Package',
      error: error.message,
    }
  }
}

const Get = async (req) => {
  const result = await NFCPACKAGEMODEL.find()
  console.log(result, 'result')
  if (!result)
    return {
      success: false,
      message: 'Package not found successfully',
    }

  return {
    success: true,
    message: 'Package found successfully',
    data: result,
  }
}
const GetBundleByMerchantId = async (req) => {
  const { merchantId } = req.query
  const result = await NFCPACKAGEMODEL.find({merchantId})
  console.log(result, 'result')
  if (!result)
    return {
      success: false,
      message: 'Package not found successfully',
    }

  return {
    success: true,
    message: 'Package found successfully',
    data: result,
  }
}
const GetBundleByCompanyId = async (req) => {
  const { companyId } = req.query
  const result = await NFCPACKAGEMODEL.find({companyId})
  console.log(result, 'result')
  if (!result)
    return {
      success: false,
      message: 'Package not found successfully',
    }

  return {
    success: true,
    message: 'Package found successfully',
    data: result,
  }
}
const GetByBundleId = async (req) => {
  const {bundleId } = req.query
  const result = await NFCPACKAGEMODEL.findOne({bundleId})
  console.log(result, 'result')
  if (!result)
    return {
      success: false,
      message: 'Package not found successfully',
    }

  return {
    success: true,
    message: 'Package found successfully',
    data: result,
  }
}

const Update = async (req) => {
  try {
    console.log('req.body', req.body)

    const result = await NFCPACKAGEMODEL.findByIdAndUpdate(
      req.body._id,
      req.body,
      {
        new: true,
      }
    )

    if (!result) {
      return {
        success: false,
        message: 'Action not found or could not be updated',
      }
    }

    return {
      success: true,
      message: 'Action updated successfully',
      data: result,
    }
  } catch (error) {
    console.error('Error updating action:', error)
    return {
      success: false,
      message: 'An error occurred while updating the action',
      error: error.message,
    }
  }
}


const RemoveBundleFromStore = async (req) => {
  try {
    const { _id, companyId } = req.body;

    if (!_id || !companyId) {
      return {
        success: false,
        message: 'Missing _id or companyId in request body',
      };
    }

    // Remove the provided companyId from the array
    const result = await NFCPACKAGEMODEL.findByIdAndUpdate(
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




const BuyPackage = async (req) => {
  console.log('BuyPackage req.body', req.body)

  try {
    // Check if the package is already sold
    const { bundleId } = req.body
    const packageCheck = await NFCPACKAGEMODEL.findOne({ bundleId })
    if (!packageCheck) {
      return {
        success: false,
        message: 'Package not found',
      }
    }
    if (packageCheck.couponId) {
      return {
        success: false,
        message: 'This package has already been sold',
      }
    }

    // Generate unique couponId
    const couponId = await generateCouponId()

    // Create the purchase payload
    const purchasePayload = {
      ...req.body,
      couponId,
    }

    // Create the purchase record
    const purchaseResult = await BUYPACKAGE.create(purchasePayload)
    if (!purchaseResult) {
      return {
        success: false,
        message: 'Something went wrong while Buying',
      }
    }

    // Update the NFC_PACKAGE with the couponId
    const packageUpdateResult = await NFCPACKAGEMODEL.findOneAndUpdate(
      { bundleId, couponId: null },
      { couponId },
      { new: true }
    )

    if (!packageUpdateResult) {
      // Roll back purchase if package update fails
      await BUYPACKAGE.deleteOne({ _id: purchaseResult._id })
      return {
        success: false,
        message: 'Purchase failed: Package not found or already sold',
      }
    }

    // Create NFC cards based on variant quantities
    const tagsToCreate = []
    for (const product of packageCheck.products) {
      for (const variant of product.variants) {
        const { quantity, variantId } = variant
        console.log(
          `Creating ${quantity} cards for product ${product.productId}, variant ${variantId}`
        )
        for (let i = 0; i < quantity; i++) {
          tagsToCreate.push({
            passcode: 'Password',
            url: 'https://example.com',
            domain: req.body.domain.trim(),
            islock: false,
            bundleId,
            couponId,
            associatedId: product.productId,
            associatedVariantIndex: product.variants.findIndex(
              (v) => v.variantId === variantId
            ),
          })
        }
      }
    }
    console.log('tagsToCreate', tagsToCreate)

    // Create all NFC cards
    const createdTags = await NFCCARD.insertMany(tagsToCreate)
    if (!createdTags || createdTags.length !== tagsToCreate.length) {
      // Roll back purchase and created tags if card creation fails
      await BUYPACKAGE.deleteOne({ _id: purchaseResult._id })
      await NFCCARD.deleteMany({ bundleId })
      return {
        success: false,
        message: 'Failed to create NFC cards',
      }
    }

    console.log('quantity createdTags', createdTags.length)

    return {
      success: true,
      message: 'Package Bought successfully and NFC cards created',
      data: {
        purchase: purchaseResult,
        tagsCreated: createdTags.length,
      },
    }
  } catch (error) {
    console.error('Error buying package:', error)
    // Attempt to clean up if error occurs
    if (purchaseResult) {
      await BUYPACKAGE.deleteOne({ _id: purchaseResult._id })
      await NFCCARD.deleteMany({ bundleId })
    }
    return {
      success: false,
      message: 'An error occurred while buying the package',
      error: error.message,
    }
  }
}

const GetPackage = async (req) => {
  try {
    const result = await BUYPACKAGE.find()
    if (!result) {
      return {
        success: false,
        message: 'Something went wrong while fetching',
      }
    }

    return {
      success: true,
      message: 'Package Fetch successfully',
      data: result,
    }
  } catch (error) {
    console.error('Error Fetching package:', error)
    return {
      success: false,
      message: 'An error occurred while Fetching the package',
      error: error.message,
    }
  }
}

const GetOrderDetails = async (req) => {
  try {
    const { _id } = req.query
    if (!_id) {
      return {
        success: false,
        message: 'Order ID is required',
      }
    }

    // Fetch the order by _id
    const order = await BUYPACKAGE.findById(_id)
    if (!order) {
      return {
        success: false,
        message: 'Order not found',
      }
    }

    // Fetch the package by bundleId
    const packageDetails = await NFCPACKAGEMODEL.findOne({
      bundleId: order.bundleId,
    })
    if (!packageDetails) {
      return {
        success: false,
        message: 'Associated package not found',
      }
    }

    // Fetch NFC cards by bundleId
    const nfcCards = await NFCCARD.find({ bundleId: order.bundleId })

    // Enhance NFC cards with product and variant details
    const enrichedNfcCards = nfcCards.map((card) => {
      const product = packageDetails.products.find(
        (p) => p.productId === card.associatedId
      )
      const variant = product?.variants[card.associatedVariantIndex] || null
      return {
        code: card.code,
        associatedId: card.associatedId,
        associatedVariantIndex: card.associatedVariantIndex,
        productName: product?.productName || 'Unknown',
        variantTitle: variant?.title || 'Unknown',
        variantQuantity: variant?.quantity || 0,
        variantUnitPrice: variant?.unitPrice || 0,
        variantResellingPrice: variant?.resellingPrice || null,
        passcode: card.passcode,
        url: card.url,
        domain: card.domain,
        islock: card.islock,
        createdAt: card.createdAt,
      }
    })

    return {
      success: true,
      message: 'Order fetched successfully',
      data: {
        order: {
          _id: order._id,
          couponId: order.couponId,
          bundleId: order.bundleId,
          agencyId: order.agencyId || null,
          customerName: order.customerName || null,
          customerEmail: order.customerEmail || null,
          createdAt: order.createdAt,
        },
        package: {
          name: packageDetails.name,
          description: packageDetails.description || null,
          price: packageDetails.price,
          resellingPrice: packageDetails.resellingPrice || null,
          agencyOnly: packageDetails.agencyOnly,
          status: packageDetails.status,
          products: packageDetails.products.map((p) => ({
            productId: p.productId,
            productName: p.productName,
            variants: p.variants.map((v) => ({
              variantId: v.variantId,
              title: v.title,
              quantity: v.quantity,
              unitPrice: v.unitPrice,
              resellingPrice: v.resellingPrice || null,
            })),
          })),
        },
        nfcCards: enrichedNfcCards,
      },
    }
  } catch (error) {
    console.error('Error fetching order details:', error)
    return {
      success: false,
      message: 'An error occurred while fetching the order details',
      error: error.message,
    }
  }
}

module.exports = {
  Create: (req, res) => ServiceHandler(Create, req, res),
  Get: (req, res) => ServiceHandler(Get, req, res),
  GetBundleByMerchantId: (req, res) => ServiceHandler(GetBundleByMerchantId, req, res),
  GetByBundleId: (req, res) => ServiceHandler(GetByBundleId, req, res),
  GetBundleByCompanyId: (req, res) => ServiceHandler(GetBundleByCompanyId, req, res),
  Update: (req, res) => ServiceHandler(Update, req, res),
  RemoveBundleFromStore: (req, res) => ServiceHandler(RemoveBundleFromStore, req, res),
  Delete: (req, res) => ServiceHandler(Delete, req, res),
  BuyPackage: (req, res) => ServiceHandler(BuyPackage, req, res),
  GetPackage: (req, res) => ServiceHandler(GetPackage, req, res),
  GetOrderDetails: (req, res) => ServiceHandler(GetOrderDetails, req, res),
}
