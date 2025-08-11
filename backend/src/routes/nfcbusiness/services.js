const {
  AgencyModel,
  GHlLocationsModel,
  GhlUserModel,
  WhiteBoardModel,
  NFCUSER,
  NFC_ADMIN_ACTION,
} = require('../../model')
const { ServiceHandler } = require('../../_utils/handler')
const util = require('util')
const jwt = require('jsonwebtoken')
const {
  AppTokenHandler,
  UpdateAppTokenHandler,
} = require('../../_utils/AppHandler')
const nfc_card = require('../../model/nfc_card')
const productpage = require('../../model/productpage')
// const NFC_User = require('../../model/NFC_User')
const nfcgroup = require('../../model/nfcgroup')
const nfc_action = require('../../model/nfc_action')
const lookup = util.promisify(require('dns').lookup)
const exec = util.promisify(require('child_process').exec)

const JWT_SECRET = '0987609876123456123456asdfglkjh5432167890'

const Create = async (req) => {
  const result = await nfc_card.create(req.body)
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

const CreateGroups = async (req) => {
  const result = await nfcgroup.create(req.body)
  if (!result)
    return {
      success: false,
      message: 'something went wrong while creating groups',
    }

  return {
    success: true,
    message: 'group successfully created',
    data: result,
  }
}

const GetNfcGroups = async (req) => {
  const { company_id } = req.query
  //console.log('company_id', req.query)

  const results = await nfcgroup.find({ company_id: company_id })
  //console.log('results', results)

  if (!results || results.length === 0) {
    return {
      success: false,
      message: 'No NFC Groups found for this company',
    }
  }

  return {
    success: true,
    message: 'NFC Groups found successfully',
    data: results,
  }
}

const Get = async (req) => {
  const result = await nfc_card.find()

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
const GetByUserId = async (req) => {
  console.log("userIduserIduserIdus erIduserId")
const { userId } = req.query;
  const result = await nfc_card.find( {userId} );
  if (!result)
    return {
      success: false,
      message: "NFC Data not found successfully",
    };

  return {
    success: true,
    message: "NFC Data found successfully",
    data: result,
  };
};
const GetCardInfo = async (req) => {
  const { cardId } = req.query
  //console.log('cardId', req.query)
  const result = await nfc_card.findOne({ code: cardId })
  //console.log('result', result)
  if (!result)
    return {
      success: false,
      message: 'NFC Data not found successfully',
    }

  const action = await nfc_action.findById(result.actionId)

  return {
    success: true,
    message: 'NFC Data found successfully',
    data: result,
    action: action,
  }
}
const getByAgency = async (req) => {
  const { company_id } = req.query
  //console.log('company_id', req.query)

  const results = await nfc_card.find({ companyId: company_id })
  //console.log('results', results)

  if (!results || results.length === 0) {
    return {
      success: false,
      message: 'No NFC Data found for this company',
    }
  }

  return {
    success: true,
    message: 'NFC Data found successfully',
    data: results,
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

    const result = await nfc_card.findOne({ code: cardId })
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
  try {
    const { code, associatedId, url, associatedVariantIndex } = req.body // Extract fields from request body

    // Validate input: code is required, and at least one of associatedId, url, or associatedVariantIndex must be present
    if (!code) {
      return {
        success: false,
        message: 'Code is required',
      }
    }

    if (!associatedId && !url && associatedVariantIndex === undefined) {
      return {
        success: false,
        message:
          'At least one of associatedId, url, or associatedVariantIndex is required',
      }
    }

    // Validate associatedVariantIndex if provided
    if (
      associatedVariantIndex !== undefined &&
      associatedVariantIndex !== null
    ) {
      if (
        !Number.isInteger(associatedVariantIndex) ||
        associatedVariantIndex < 0
      ) {
        return {
          success: false,
          message:
            'associatedVariantIndex must be a non-negative integer or null',
        }
      }
    }

    // Build the update object dynamically based on provided fields
    const updateFields = {}
    if (associatedId) updateFields.associatedId = associatedId
    if (url) updateFields.url = url
    if (associatedVariantIndex !== undefined)
      updateFields.associatedVariantIndex = associatedVariantIndex

    // Find and update the card by code
    const updatedCard = await nfc_card.findOneAndUpdate(
      { code }, // Find card by code
      { $set: updateFields }, // Update the fields that were provided
      { new: true } // Return the updated document
    )

    // Check if card was found and updated
    if (!updatedCard) {
      return {
        success: false,
        message: 'Card not found with the given code',
      }
    }

    return {
      success: true,
      message: 'Card successfully updated',
      data: updatedCard,
    }
  } catch (error) {
    console.error('Error updating card:', error)
    return {
      success: false,
      message: 'Something went wrong while updating the card',
      error: error.message,
    }
  }
}
const UpdateNFCURL = async (req) => {
  try {
    const { code, associatedId, url, associatedVariantIndex } = req.body // Extract fields from request body

    // Validate input: code is required, and at least one of associatedId, url, or associatedVariantIndex must be present
    if (!code) {
      return {
        success: false,
        message: 'Code is required',
      }
    }

    if (!associatedId && !url && associatedVariantIndex === undefined) {
      return {
        success: false,
        message:
          'At least one of associatedId, url, or associatedVariantIndex is required',
      }
    }

    // Validate associatedVariantIndex if provided
    if (
      associatedVariantIndex !== undefined &&
      associatedVariantIndex !== null
    ) {
      if (
        !Number.isInteger(associatedVariantIndex) ||
        associatedVariantIndex < 0
      ) {
        return {
          success: false,
          message:
            'associatedVariantIndex must be a non-negative integer or null',
        }
      }
    }

    // Build the update object dynamically based on provided fields
    const updateFields = {}
    if (associatedId) updateFields.associatedId = associatedId
    if (url) updateFields.url = url
    if (associatedVariantIndex !== undefined)
      updateFields.associatedVariantIndex = associatedVariantIndex

    // Find and update the card by code
    const updatedCard = await nfc_card.findOneAndUpdate(
      { code }, // Find card by code
      { $set: updateFields }, // Update the fields that were provided
      { new: true } // Return the updated document
    )

    // Check if card was found and updated
    if (!updatedCard) {
      return {
        success: false,
        message: 'Card not found with the given code',
      }
    }

    return {
      success: true,
      message: 'Card successfully updated',
      data: updatedCard,
    }
  } catch (error) {
    console.error('Error updating card:', error)
    return {
      success: false,
      message: 'Something went wrong while updating the card',
      error: error.message,
    }
  }
}

const AssociatedbyAgencyID = async (req) => {
  try {
    const { code: codes, passcode, company_id, type } = req.body
    // const { company_id } = req.params

    // //console.log('req.params:', req.params) // Debug: Log params

    // Validate input
    if (!codes || !Array.isArray(codes) || codes.length === 0) {
      return {
        success: false,
        message: 'Please provide at least one code',
      }
    }

    if (!passcode) {
      return {
        success: false,
        message: 'Passcode is required',
      }
    }

    if (!company_id) {
      return {
        success: false,
        message: 'Company ID is required',
      }
    }

    // Validate each code and create an array of valid codes
    const validCodes = []
    for (const code of codes) {
      const card = await nfc_card.findOne({ code })
      if (card) {
        validCodes.push(code)
      }
    }

    if (validCodes.length === 0) {
      return {
        success: false,
        message: 'No valid codes provided',
      }
    }

    // Validate passcode
    const isPasscodeValid = await nfc_card.findOne({ passcode })
    if (!isPasscodeValid) {
      return {
        success: false,
        message: 'Invalid passcode',
      }
    }

    // Update valid cards with company_id
    const updatePromises = validCodes.map((code) =>
      nfc_card.findOneAndUpdate(
        { code },
        { $set: { company_id, type: type || 'agency' } },
        { new: true }
      )
    )

    const updatedCards = await Promise.all(updatePromises)

    // Check if all updates were successful
    const failedUpdates = updatedCards.filter((card) => !card)
    if (failedUpdates.length > 0) {
      return {
        success: false,
        message: 'Some cards could not be updated',
      }
    }

    return {
      success: true,
      message: 'Cards successfully associated with company',
      data: updatedCards,
    }
  } catch (error) {
    console.error('Error associating cards:', error)
    return {
      success: false,
      message: 'Something went wrong while associating cards',
      error: error.message,
    }
  }
}

const GetByAssociateID = async (req) => {
  const { associatedId } = req.query // Extract associatedId from query params
  console.log('associatedId', req.query)
  try {
    // Find the product by associatedId
    // const result = await productpage.findById({ associatedId })
    const result = await productpage.findById(associatedId)

    if (!result) {
      return {
        success: false,
        message: 'Product not found',
      }
    }

    return {
      success: true,
      message: 'Product found successfully',
      data: result,
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error fetching product: ' + error.message,
    }
  }
}

const UpdateCardUser = async (req) => {
  try {
    const { cardId, name, email, passcode, password, confirmPassword } =
      req.body

    // Validate required fields
    // if (
    //   !cardId ||
    //   !name ||
    //   !email ||
    //   !passcode ||
    //   !password ||
    //   !confirmPassword
    // ) {
    //   return {
    //     success: false,
    //     message: 'All fields are required',
    //   }
    // }

    // Validate password match
    // if (password !== confirmPassword) {
    //   return {
    //     success: false,
    //     message: 'Passwords do not match',
    //   }
    // }

    // Check if card exists
    const card = await nfc_card.findOne({ code: cardId })
    if (!card) {
      return {
        success: false,
        message: 'Card not found',
      }
    }
    if (card.userId) {
      return {
        success: false,
        message: 'Card Already Associated',
      }
    }

    // Validate passcode
    if (card.passcode !== passcode) {
      return {
        success: false,
        message: 'Invalid passcode',
      }
    }

    // Check if user exists with this email
    let user = await NFCUSER.findOne({ email })
    if (!user) {
      // Create new user
      user = new NFCUSER({
        cardIds: [cardId],
        name,
        email,
        passcode,
        password,
        company_id: card.company_id || null,
      })
    } else {
      // Add cardId to existing user's cardIds array if not already present
      if (!user.cardIds.includes(cardId)) {
        user.cardIds.push(cardId)
      }
      // user.name = name
      // user.email = email
      // user.passcode = passcode
      // user.password = password // Will be hashed by pre-save hook
      // user.company_id = card.company_id || null
    }

    await user.save()

    // Update nfc_card with user association
    const updatedCard = await nfc_card.findOneAndUpdate(
      { code: cardId },
      { $set: { userId: user._id.toString() } },
      { new: true }
    )

    if (!updatedCard) {
      return {
        success: false,
        message: 'Failed to update card',
      }
    }

    return {
      success: true,
      message: 'Card and user details updated successfully',
      data: { user, card: updatedCard },
    }
  } catch (error) {
    console.error('Error updating card user:', error)
    return {
      success: false,
      message: 'Something went wrong while updating card user',
      error: error.message,
    }
  }
}

const VerifyUser = async (req) => {
  try {
    const { email, password } = req.body

    // Validate required fields
    if (!email || !password) {
      return {
        success: false,
        message: 'Email and password are required',
      }
    }

    // Check if user exists with this email
    const user = await NFCUSER.findOne({ email })
    if (!user) {
      return {
        success: false,
        message: 'User not found',
      }
    }

    // Compare password directly (as plain string)
    if (password !== user.password) {
      return {
        success: false,
        message: 'Invalid password',
      }
    }

    // Generate JWT token with 30-day expiration
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' } // 30 days
    )

    // Successful login
    return {
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          cardIds: user.cardIds,
          company_id: user.company_id,
        },
      },
    }
  } catch (error) {
    console.error('Error logging in user:', error)
    return {
      success: false,
      message: 'Something went wrong while logging in user',
      error: error.message,
    }
  }
}

const VerifyToken = async (req) => {
  console.log('Verifying token...', req.headers.authorization)
  const token = req.headers.authorization?.split(' ')[1] // Extract token from "Bearer <token>"
  console.log('Token:', token)

  if (!token) {
    return { success: false, message: 'No token provided' }
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    console.log('Decoded token:', decoded)

    // Await the database query
    const user = await NFCUSER.findById(decoded.userId)
    if (!user) {
      return { success: false, message: 'User not found' }
    }

    return {
      success: true,
      message: 'Token is valid',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          cardIds: user.cardIds,
          company_id: user.company_id,
        },
      },
    }
  } catch (error) {
    console.error('Token verification error:', error.message)
    return {
      success: false,
      message: 'Invalid or expired token',
      error: error.message,
    }
  }
}

const getUserCards = async (req) => {
  try {
    const { cardIds } = req.query

    // Validate cardIds
    if (!cardIds) {
      return {
        success: false,
        message: 'Missing required query parameter: cardIds',
        data: [],
      }
    }

    // Ensure cardIds is an array
    const cardIdsArray = Array.isArray(cardIds)
      ? cardIds
      : typeof cardIds === 'string'
      ? cardIds.split(',')
      : []

    if (cardIdsArray.length === 0) {
      return {
        success: false,
        message: 'No card IDs provided',
        data: [],
      }
    }

    // Sanitize cardIds
    const sanitizedCardIds = cardIdsArray
      .map((id) => id.trim())
      .filter((id) => id)

    // Query MongoDB for cards
    const result = await nfc_card
      .find({ code: { $in: sanitizedCardIds } })
      .lean()

    // Check if any cards were found
    if (!result || result.length === 0) {
      return {
        success: false,
        message: 'No NFC cards found for the provided IDs',
        data: [],
      }
    }

    // Map results to frontend-compatible format and fetch associated products
    const formattedCards = await Promise.all(
      result.map(async (card) => {
        let product = null
        try {
          // Check if associatedId exists and fetch the product
          if (card.associatedId) {
            product = await productpage.findById(card.associatedId).lean()
            if (!product) {
              console.warn(
                `Product not found for associatedId: ${card.associatedId}`
              )
            }
          }
        } catch (error) {
          console.error(
            `Error fetching product for associatedId ${card.associatedId}:`,
            error
          )
          product = null // Set to null if there's an error
        }

        return {
          id: card.code, // Use `code` as the unique ID
          type: card.type || 'nfc', // Default to 'nfc' if type is missing
          title: card.domain
            ? `${card.domain
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (c) => c.toUpperCase())} Card`
            : 'NFC Card', // E.g., "Tap My Link Card"
          ...card,
          product, // Attach the product (or null if not found/error)
        }
      })
    )

    return {
      success: true,
      message: 'NFC cards retrieved successfully',
      data: formattedCards,
    }
  } catch (error) {
    console.error('Error in getUserCards:', error)
    return {
      success: false,
      message: error.message || 'An error occurred while fetching NFC cards',
      data: [],
    }
  }
}

const attachAction = async (req) => {
  const { card_id, action_id, user_id } = req.body
  console.log('attachAction', req.body)
  // Validate request body
  if (!card_id || !action_id || !user_id) {
    return {
      success: false,
      message:
        'Missing required fields: card_id, action_id, and user_id are required.',
    }
  }

  try {
    // Find the card by code and ensure it belongs to the user
    const card = await nfc_card.findOne({ code: card_id, user_id })
    if (!card) {
      return {
        success: false,
        message: 'Card not found or does not belong to the user.',
      }
    }

    // Update the card with the new action_id
    const updatedCard = await nfc_card.findOneAndUpdate(
      { code: card_id, userId: user_id },
      { actionId: action_id },
      { new: true }
    )

    if (!updatedCard) {
      return {
        success: false,
        message: 'Failed to update card.',
      }
    }

    return {
      success: true,
      message: 'Card and user details updated successfully.',
      data: {
        // user: userData,
        card: updatedCard,
      },
    }
  } catch (error) {
    console.error('Error attaching action:', error)
    return {
      success: false,
      message: 'Server error while attaching action.',
    }
  }
}

const associateActionFromAdmin = async (req) => {
  const {
    cardId,
    name,
    type,
    user_id,
    redirectUrl,
    firstName,
    lastName,
    email,
    phone,
    dob,
  } = req.body
  console.log('attachAction', req.body)

  try {
    const actionData = {
      name,
      type,
      user_id,
      // Map redirectUrl to redirect_url for Redirect actions
      ...(type === 'Redirect' && redirectUrl
        ? { redirect_url: redirectUrl }
        : {}),
      // Group VCF fields into vcf_data for VCF actions
      ...(type === 'VCF'
        ? {
            vcf_data: {
              firstName: firstName || '',
              lastName: lastName || '',
              email: email || '',
              phone: phone || '',
              dob: dob || null,
            },
          }
        : {}),
    }

    const action = await nfc_action.create(actionData)
    if (!action) {
      return {
        success: false,
        message: 'Something went wrong while creating action',
      }
    }

    // Find the card by code and ensure it belongs to the user
    const card = await nfc_card.findOne({ code: cardId, userId: user_id })
    console.log({ code: cardId, userId: user_id }, 'card', card)
    if (!card) {
      return {
        success: false,
        message: 'Card not found or does not belong to the user.',
      }
    }

    // Update the card with the new action_id
    const updatedCard = await nfc_card.findOneAndUpdate(
      { code: cardId, userId: user_id },
      { actionId: action._id },
      { new: true }
    )

    if (!updatedCard) {
      return {
        success: false,
        message: 'Failed to update card.',
      }
    }

    return {
      success: true,
      message: 'Card and user details updated successfully.',
      data: {
        card: updatedCard,
      },
    }
  } catch (error) {
    console.error('Error attaching action:', error)
    return {
      success: false,
      message: 'Server error while attaching action.',
    }
  }
}

const detachAction = async (req) => {
  const { card_id, action_id, user_id } = req.body
  console.log('attachAction', req.body)
  // Validate request body
  if (!card_id || !action_id || !user_id) {
    return {
      success: false,
      message:
        'Missing required fields: card_id, action_id, and user_id are required.',
    }
  }

  try {
    // Find the card by code and ensure it belongs to the user
    const card = await nfc_card.findOne({ code: card_id, user_id })
    if (!card) {
      return {
        success: false,
        message: 'Card not found or does not belong to the user.',
      }
    }

    // Update the card with the new action_id
    const updatedCard = await nfc_card.findOneAndUpdate(
      { code: card_id, userId: user_id },
      { actionId: null },
      { new: true }
    )

    if (!updatedCard) {
      return {
        success: false,
        message: 'Failed to update card.',
      }
    }

    return {
      success: true,
      message: 'Card and user details updated successfully.',
      data: {
        // user: userData,
        card: updatedCard,
      },
    }
  } catch (error) {
    console.error('Error attaching action:', error)
    return {
      success: false,
      message: 'Server error while attaching action.',
    }
  }
}

const deleteActionFromAdmin = async (req) => {
  const { card_id, action_id } = req.body
  console.log('attachAction', req.body)
  // Validate request body
  if (!card_id || !action_id) {
    return {
      success: false,
      message: 'Missing required fields: card_id, action_id are required.',
    }
  }

  try {
    // Find the card by code and ensure it belongs to the user
    const card = await nfc_card.findOne({ code: card_id })
    if (!card) {
      return {
        success: false,
        message: 'Card not found or does not belong to the user.',
      }
    }

    // Update the card with the new action_id
    const updatedCard = await nfc_card.findOneAndUpdate(
      { code: card_id },
      { actionId: null },
      { new: true }
    )

    if (!updatedCard) {
      return {
        success: false,
        message: 'Failed to update card.',
      }
    }

    return {
      success: true,
      message: 'Card and user details updated successfully.',
      data: {
        // user: userData,
        card: updatedCard,
      },
    }
  } catch (error) {
    console.error('Error attaching action:', error)
    return {
      success: false,
      message: 'Server error while attaching action.',
    }
  }
}

const getcard = async (req) => {
  const { code } = req.query
  console.log('code', req.query)
  const result = await nfc_card.findOne({ code: code })
  console.log('result', result)
  if (!result)
    return {
      success: false,
      message: 'NFC Data not found successfully',
    }

  const action = await nfc_action.findById(result.actionId)

  return {
    success: true,
    message: 'NFC Data found successfully',
    data: result,
    action: action,
  }
}

const GetAllUsers = async (req) => {
  try {
    const users = await NFCUSER.find().lean()
    if (!users || users.length === 0) {
      return {
        success: false,
        message: 'No users found',
      }
    }
    return {
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    return {
      success: false,
      message: 'Error fetching users',
      error: error.message,
    }
  }
}

const GetCardsByIds = async (req) => {
  console.log('cardIds', req.query)
  const { cardIds } = req.query

  // Validate cardIds
  if (!cardIds || !Array.isArray(cardIds) || cardIds.length === 0) {
    return {
      success: false,
      message: 'cardIds is required and must be a non-empty array',
    }
  }

  try {
    // Find cards by codes
    const cards = await nfc_card.find({ code: { $in: cardIds } })
    if (!cards || cards.length === 0) {
      return {
        success: false,
        message: 'No cards found for the provided cardIds',
      }
    }

    return {
      success: true,
      message: 'Cards found successfully',
      data: cards,
    }
  } catch (error) {
    console.error('Error fetching cards:', error)
    return {
      success: false,
      message: 'Error fetching cards',
      error: error.message,
    }
  }
}

const GetAssociatedActionById = async (req) => {
  const { cardId } = req.query
  console.log('cardId', req.query)

  // Validate cardId
  if (!cardId) {
    return {
      success: false,
      message: 'cardId is required in query parameters',
    }
  }

  try {
    // Find the card by code
    const card = await nfc_card.findOne({ code: cardId })
    if (!card) {
      return {
        success: false,
        message: 'Card not found',
      }
    }

    // Find the associated action by actionId
    const action = await nfc_action.findById(card.actionId)
    if (!action) {
      return {
        success: false,
        message: 'Associated action not found',
      }
    }

    return {
      success: true,
      message: 'Associated action found successfully',
      data: action,
    }
  } catch (error) {
    console.error('Error fetching associated action:', error)
    return {
      success: false,
      message: 'Error fetching associated action',
      error: error.message,
    }
  }
}

const UpdateAssociatedAction = async (req) => {
  try {
    const {
      action_id,
      name,
      type,
      user_id,
      redirectUrl,
      firstName,
      lastName,
      email,
      phone,
      dob,
    } = req.body

    const actionData = {
      name,
      type,
      user_id,
      ...(type === 'Redirect' && redirectUrl
        ? { redirect_url: redirectUrl }
        : { redirect_url: null }),
      ...(type === 'VCF'
        ? {
            vcf_data: {
              firstName: firstName || '',
              lastName: lastName || '',
              email: email || '',
              phone: phone || '',
              dob: dob || null,
            },
          }
        : { vcf_data: null }),
    }

    const result = await nfc_action.findByIdAndUpdate(action_id, actionData, {
      new: true,
    })

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

const CreateSuperAdminAction = async (req) => {
  const {
    name,
    type,
    expiry,
    redirect_url,
    firstName,
    lastName,
    email,
    phone,
    dob,
  } = req.body
  console.log('CreateSuperAdminAction', req.body)
  try {
    const actionData = {
      name,
      type,
      expiry,
      ...(type === 'Redirect' && redirect_url
        ? { redirect_url: redirect_url }
        : { redirect_url: null }),
      ...(type === 'VCF'
        ? {
            vcf_data: {
              firstName: firstName || '',
              lastName: lastName || '',
              email: email || '',
              phone: phone || '',
              dob: dob || null,
            },
          }
        : { vcf_data: null }),
    }

    const result = await NFC_ADMIN_ACTION.create(actionData)

    if (!result) {
      return {
        success: false,
        message: 'Action not created successfully',
      }
    }

    return {
      success: true,
      message: 'Action created successfully',
      data: result,
    }
  } catch (error) {
    console.error('Error created action:', error)
    return {
      success: false,
      message: 'An error occurred while created the action',
      error: error.message,
    }
  }
}

const GetSuperAdminActions = async (req) => {
  try {
    const actions = await NFC_ADMIN_ACTION.find().lean()
    console.log('actions', actions)
    if (!actions || actions.length === 0) {
      return {
        success: false,
        message: 'No actions found',
      }
    }
    return {
      success: true,
      message: 'Actions retrieved successfully',
      data: actions,
    }
  } catch (error) {
    console.error('Error fetching actions:', error)
    return {
      success: false,
      message: 'Error fetching actions',
      error: error.message,
    }
  }
}

const UpdateSuerAdminAction = async (req) => {
  const {
    action_id,
    name,
    type,
    expiry,
    redirect_url,
    firstName,
    lastName,
    email,
    phone,
    dob,
  } = req.body
  console.log(redirect_url, 'redirectUrl')
  try {
    const actionData = {
      name,
      type,
      expiry,
      ...(type === 'Redirect' && redirect_url
        ? { redirect_url: redirect_url }
        : { redirect_url: null }),
      ...(type === 'VCF'
        ? {
            vcf_data: {
              firstName: firstName || '',
              lastName: lastName || '',
              email: email || '',
              phone: phone || '',
              dob: dob || null,
            },
          }
        : { vcf_data: null }),
    }

    const result = await NFC_ADMIN_ACTION.findByIdAndUpdate(
      action_id,
      actionData,
      { new: true }
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

const DeleteSuperAdminAction = async (req) => {
  const { action_id } = req.body

  try {
    const result = await NFC_ADMIN_ACTION.findByIdAndDelete(action_id)

    if (!result) {
      return {
        success: false,
        message: 'Action not found or could not be deleted',
      }
    }

    return {
      success: true,
      message: 'Action deleted successfully',
      data: result,
    }
  } catch (error) {
    console.error('Error deleting action:', error)
    return {
      success: false,
      message: 'An error occurred while deleting the action',
      error: error.message,
    }
  }
}

module.exports = {
  Create: (req, res) => ServiceHandler(Create, req, res),
  CreateGroups: (req, res) => ServiceHandler(CreateGroups, req, res),
  Get: (req, res) => ServiceHandler(Get, req, res),
  GetNfcGroups: (req, res) => ServiceHandler(GetNfcGroups, req, res),
  GetCardInfo: (req, res) => ServiceHandler(GetCardInfo, req, res),
  getByAgency: (req, res) => ServiceHandler(getByAgency, req, res),
  GetById: (req, res) => ServiceHandler(GetById, req, res),
  GetByAssociateID: (req, res) => ServiceHandler(GetByAssociateID, req, res),
  Update: (req, res) => ServiceHandler(Update, req, res),
  UpdateNFCURL: (req, res) => ServiceHandler(UpdateNFCURL, req, res),
  UpdateCardUser: (req, res) => ServiceHandler(UpdateCardUser, req, res),
  VerifyUser: (req, res) => ServiceHandler(VerifyUser, req, res),
  VerifyToken: (req, res) => ServiceHandler(VerifyToken, req, res),
  getUserCards: (req, res) => ServiceHandler(getUserCards, req, res),
  attachAction: (req, res) => ServiceHandler(attachAction, req, res),
  associateActionFromAdmin: (req, res) =>
    ServiceHandler(associateActionFromAdmin, req, res),
  detachAction: (req, res) => ServiceHandler(detachAction, req, res),
  deleteActionFromAdmin: (req, res) =>
    ServiceHandler(deleteActionFromAdmin, req, res),
  GetAllUsers: (req, res) => ServiceHandler(GetAllUsers, req, res),
  GetCardsByIds: (req, res) => ServiceHandler(GetCardsByIds, req, res),
  GetAssociatedActionById: (req, res) =>
    ServiceHandler(GetAssociatedActionById, req, res),
  UpdateAssociatedAction: (req, res) =>
    ServiceHandler(UpdateAssociatedAction, req, res),
  getcard: (req, res) => ServiceHandler(getcard, req, res),
  AssociatedbyAgencyID: (req, res) =>
    ServiceHandler(AssociatedbyAgencyID, req, res),
  CreateSuperAdminAction: (req, res) =>
    ServiceHandler(CreateSuperAdminAction, req, res),
  GetSuperAdminActions: (req, res) =>
    ServiceHandler(GetSuperAdminActions, req, res),
  UpdateSuerAdminAction: (req, res) =>
    ServiceHandler(UpdateSuerAdminAction, req, res),
  DeleteSuperAdminAction: (req, res) =>
    ServiceHandler(DeleteSuperAdminAction, req, res),
  GetByUserId: (req, res) =>
    ServiceHandler(GetByUserId, req, res),
}
