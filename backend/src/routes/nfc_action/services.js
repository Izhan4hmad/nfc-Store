const { ServiceHandler } = require('../../_utils/handler')
const util = require('util')
const nfc_action = require('../../model/nfc_action')

const Create = async (req) => {
  console.log('req.body', req.body)

  // Transform the incoming data to match the schema
  const {
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

  try {
    const result = await nfc_action.create(actionData)
    if (!result) {
      return {
        success: false,
        message: 'Something went wrong while creating action',
      }
    }

    return {
      success: true,
      message: 'Action successfully created',
      data: result,
    }
  } catch (error) {
    console.error('Error creating action:', error)
    return {
      success: false,
      message: 'An error occurred while creating the action',
      error: error.message,
    }
  }
}

const Delete = async (req) => {
  console.log('req.query', req.query)
  try {
    const { action_id } = req.query // Use id from params (e.g., /nfc_action/:id)
    const result = await nfc_action.findByIdAndDelete(action_id)

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

const Get = async (req) => {
  // const result = await nfc_action.find(req.query)
  console.log(req.query, 'req.query')
  const result = await nfc_action.find({ user_id: req.query.user_id })
  console.log(result, 'result')
  if (!result)
    return {
      success: false,
      message: 'Action not found successfully',
    }

  return {
    success: true,
    message: 'Action(s) found successfully',
    data: result,
  }
}

const Update = async (req) => {
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

    console.log('req.body', req.body)
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

module.exports = {
  Create: (req, res) => ServiceHandler(Create, req, res),
  Get: (req, res) => ServiceHandler(Get, req, res),
  Update: (req, res) => ServiceHandler(Update, req, res),
  Delete: (req, res) => ServiceHandler(Delete, req, res),
}
