import React, { useEffect, useState } from 'react'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import {
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Typography,
  Box,
} from '@mui/material'
import { useLocation, useParams } from 'react-router-dom'
import { useAppServices } from 'hook/services'

const UpdateAction = () => {
  const AppService = useAppServices()
  const location = useLocation()
  const param = useParams()
  const card = location.state?.card

  const [formData, setFormData] = useState({
    actionName: '',
    actionType: 'VCF',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    redirectUrl: '',
  })

  const theme = {
    primary: '#3366FF',
    secondary: '#F5F7FF',
    accent: '#FF6B2C',
    success: '#00C48C',
    grey: {
      100: '#F7F9FC',
      200: '#EDF1F7',
      300: '#E4E9F2',
      800: '#2E3A59',
    },
    text: {
      primary: '#222B45',
      secondary: '#8F9BB3',
    },
  }

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [action, setAction] = useState(null)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.actionName.trim()) {
      newErrors.actionName = 'Action name is required'
    }

    if (formData.actionType === 'VCF') {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required'
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required'
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid'
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone is required'
      }
    } else if (formData.actionType === 'Redirect') {
      if (!formData.redirectUrl.trim()) {
        newErrors.redirectUrl = 'Redirect URL is required'
      } else if (!/^https?:\/\/.+/.test(formData.redirectUrl)) {
        newErrors.redirectUrl = 'Please enter a valid URL'
      }
    }

    setErrors(newErrors)
    console.log('Validation errors:', newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }))
    }
  }

  const GetAction = async () => {
    try {
      console.log('Fetching action with cardId:', card?.code)
      const response = await AppService.nfcUsers.getAction({
        query: `cardId=${card?.code}`,
      })
      console.log('GetAction response:', response)
      if (response?.response?.success) {
        const actionData = response.response.data
        setAction(actionData)
        setFormData({
          actionName: actionData.name || '',
          actionType: actionData.type || 'VCF',
          firstName: actionData.vcf_data?.firstName || '',
          lastName: actionData.vcf_data?.lastName || '',
          email: actionData.vcf_data?.email || '',
          phone: actionData.vcf_data?.phone || '',
          dob: actionData.vcf_data?.dob || '',
          redirectUrl: actionData.redirect_url || '',
        })
        console.log('Action data set:', actionData)
      } else {
        console.log('No action found or API error:', response?.response?.message)
      }
    } catch (error) {
      console.error('Error fetching action:', error)
    }
  }

  const handleRemove = async () => {
    console.log('handleRemove called')
    if (action) {
      const payload = {
        action_id: action._id,
        card_id: card.code,
      }
      const response = await AppService.nfcUsers.deleteAction({
        payload: payload,
      })
      console.log('DeleteAction response:', response)
      if (response?.response?.success) {
        setAction(null)
        setFormData({
          actionName: '',
          actionType: 'VCF',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dob: '',
          redirectUrl: '',
        })
      } else {
        setErrors({ submit: response?.response?.message || 'Failed to remove action' })
      }
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      console.log('Form validation failed')
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      if (action) {
        const payload = {
          action_id: action?._id,
          user_id: action?.user_id || card?.user_id,
          name: formData.actionName,
          type: formData.actionType,
          ...(formData.actionType === 'VCF'
            ? {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                dob: formData.dob || null,
              }
            : {
                redirectUrl: formData.redirectUrl,
              }),
        }
        console.log('Updating action with payload:', payload)
        const response = await AppService.nfcUsers.updateAction({
          payload: payload,
        })
        console.log('UpdateAction response:', response)
        if (response?.response?.success) {
          setAction(response.response.data)
          console.log('Action updated successfully:', response.response.data)
        } else {
          setErrors({ submit: response?.response?.message || 'Failed to update action' })
          console.error('Update failed:', response?.response?.message)
        }
      } else {
        const payload = {
          cardId: card?.code,
          user_id: card?.userId,
          name: formData.actionName,
          type: formData.actionType,
          ...(formData.actionType === 'VCF'
            ? {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                dob: formData.dob || null,
              }
            : {
                redirectUrl: formData.redirectUrl,
              }),
        }
        console.log('Creating new action with payload:', payload)
        const response = await AppService.nfcUsers.attachAction({
          payload: payload,
        })
        console.log('AttachAction response:', response)
        if (response?.response?.success) {
          setAction(response.response.data)
          console.log('Action created successfully:', response.response.data)
        } else {
          setErrors({ submit: response?.response?.message || 'Failed to create action' })
          console.error('Create failed:', response?.response?.message)
        }
      }
    } catch (error) {
      console.error('Submission error:', error)
      setErrors({
        submit: error.response?.data?.message || 'An error occurred. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const onLoad = () => {
    if (card?.code) {
      GetAction()
    } else {
      console.error('No card code provided')
    }
  }

  useEffect(onLoad, [])

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          {action ? 'Edit Action' : 'Add New Action'}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Configure your action details
        </Typography>

        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Action Name *"
                value={formData.actionName}
                onChange={(e) => handleInputChange('actionName', e.target.value)}
                error={!!errors.actionName}
                helperText={errors.actionName}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Action Type *</InputLabel>
                <Select
                  value={formData.actionType}
                  onChange={(e) => handleInputChange('actionType', e.target.value)}
                  label="Action Type *"
                >
                  <MenuItem value="VCF">VCF</MenuItem>
                  <MenuItem value="Redirect">Redirect</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formData.actionType === 'VCF' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name *"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name *"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email *"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone *"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Date of Birth (Optional)"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </>
            )}

            {formData.actionType === 'Redirect' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Redirect URL *"
                  type="url"
                  value={formData.redirectUrl}
                  onChange={(e) => handleInputChange('redirectUrl', e.target.value)}
                  error={!!errors.redirectUrl}
                  helperText={errors.redirectUrl}
                  variant="outlined"
                />
              </Grid>
            )}

            {errors.submit && (
              <Grid item xs={12}>
                <Typography color="error" variant="body2">
                  {errors.submit}
                </Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => window.history.back()}
                  disabled={isSubmitting}
                  sx={{ color: 'text.primary', borderColor: 'text.primary' }}
                >
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleRemove}
                  disabled={isSubmitting || !action} // Disable if no action exists
                  sx={{ color: 'text.primary', borderColor: 'text.primary' }}
                >
                  Remove Action
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting && (
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          border: '2px solid transparent',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                        }}
                      />
                    )
                  }
                  sx={{
                    color: '#fff',
                    backgroundColor: theme.primary,
                    borderRadius: 2,
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#2954CC',
                      boxShadow: '0 4px 12px rgba(51, 102, 255, 0.2)',
                    },
                  }}
                >
                  {isSubmitting
                    ? action
                      ? 'Updating...'
                      : 'Creating...'
                    : action
                    ? 'Update'
                    : 'Save'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </DashboardLayout>
  )
}

export default UpdateAction
