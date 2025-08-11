import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Modal,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAppServices } from 'hook/services'

function NfcUsers() {
  const AppService = useAppServices()
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [actions, setActions] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false) // Track if we're editing an action
  const [currentActionId, setCurrentActionId] = useState(null) // Track the action being edited
  const [newAction, setNewAction] = useState({
    name: '',
    type: 'VCF',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    redirectUrl: '',
    expiry: '',
  })
  const [errors, setErrors] = useState({})

  console.log(actions, 'actionssss')

  // Fetch users
  const GetUsers = async () => {
    try {
      const response = await AppService.nfcUsers.get()
      if (response?.response?.success) {
        setUsers(response.response.data)
      }
    } catch (error) {
      console.error('Error Getting users', error)
    }
  }

  // Fetch actions for the table in the modal
  const GetActions = async () => {
    try {
      const response = await AppService.nfcUsers.GetAdminAction() // Updated API call
      console.log('Fetched actions:', response.response.data) // Debug the fetched data
      if (response?.response?.success) {
        setActions(response.response.data)
      }
    } catch (error) {
      console.error('Error Getting actions', error)
    }
  }

  const onLoad = () => {
    GetUsers()
    GetActions()
  }

  useEffect(onLoad, [])

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Modal handling
  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => {
    setOpenModal(false)
    setIsEditing(false)
    setCurrentActionId(null)
    setNewAction({
      name: '',
      type: 'VCF',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dob: '',
      redirectUrl: '',
      expiry: '',
    })
    setErrors({})
  }

  // Form validation
  const validateForm = () => {
    const newErrors = {}

    if (!newAction.name.trim()) {
      newErrors.name = 'Action name is required'
    }
    if (newAction.type === 'VCF') {
      if (!newAction.firstName.trim()) {
        newErrors.firstName = 'First name is required'
      }
      if (!newAction.lastName.trim()) {
        newErrors.lastName = 'Last name is required'
      }
      if (!newAction.email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(newAction.email)) {
        newErrors.email = 'Email is invalid'
      }
      if (!newAction.phone.trim()) {
        newErrors.phone = 'Phone is required'
      }
    } else if (newAction.type === 'Redirect') {
      if (!newAction.redirectUrl.trim()) {
        newErrors.redirectUrl = 'Redirect URL is required'
      } else if (!/^https?:\/\/.+/.test(newAction.redirectUrl)) {
        newErrors.redirectUrl = 'Please enter a valid URL'
      }
    }
    if (!newAction.expiry) {
      newErrors.expiry = 'Expiry date and time are required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setNewAction((prev) => ({
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

  // Set default expiry to 1 hour from now
  const getDefaultExpiry = () => {
    const now = new Date()
    now.setHours(now.getHours() + 1) // Add 1 hour from 06:20 PM PKT (07:20 PM PKT)
    return now.toISOString().slice(0, 16) // Format as "2025-05-26T19:20"
  }

  // Handle form submission to create a new action
  const handleCreateAction = async () => {
    if (!validateForm()) {
      return
    }

    try {
      const payload = {
        name: newAction.name,
        type: newAction.type,
        expiry: newAction.expiry,
        ...(newAction.type === 'Redirect' && { redirect_url: newAction.redirectUrl }),
        ...(newAction.type === 'VCF' && {
          vcf_data: {
            firstName: newAction.firstName,
            lastName: newAction.lastName,
            email: newAction.email,
            phone: newAction.phone,
            dob: newAction.dob || null,
          },
        }),
      }

      console.log('Creating action with payload:', payload)
      const response = await AppService.nfcUsers.CreateAdminAction({ payload })
      if (response?.response?.success) {
        setActions([...actions, response.response.data])
        handleCloseModal()
      } else {
        setErrors({ submit: response?.response?.message || 'Failed to create action' })
      }
    } catch (error) {
      console.error('Error creating action:', error)
      setErrors({
        submit: error.response?.data?.message || 'An error occurred. Please try again.',
      })
    }
  }

  // Handle update action
  const handleUpdateAction = async () => {
    if (!validateForm()) {
      return
    }

    try {
      const payload = {
        action_id: currentActionId,
        name: newAction.name,
        type: newAction.type,
        expiry: newAction.expiry,
        ...(newAction.type === 'Redirect' && { redirect_url: newAction.redirectUrl }),
        ...(newAction.type === 'VCF' && {
          vcf_data: {
            firstName: newAction.firstName,
            lastName: newAction.lastName,
            email: newAction.email,
            phone: newAction.phone,
            dob: newAction.dob || null,
          },
        }),
      }

      console.log('Updating action with payload:', payload)
      const response = await AppService.nfcUsers.UpdateAdminAction({ payload })
      if (response?.response?.success) {
        setActions(
          actions.map((action) =>
            action._id === currentActionId ? response.response.data : action
          )
        )
        handleCloseModal()
      } else {
        setErrors({ submit: response?.response?.message || 'Failed to update action' })
      }
    } catch (error) {
      console.error('Error updating action:', error)
      setErrors({
        submit: error.response?.data?.message || 'An error occurred. Please try again.',
      })
    }
  }

  // Handle delete action
  const handleDeleteAction = async (actionId) => {
    if (!window.confirm('Are you sure you want to delete this action?')) {
      return
    }

    try {
      const payload = { action_id: actionId }
      console.log('Deleting action with payload:', payload)
      const response = await AppService.nfcUsers.DeleteAdminAction({ payload })
      if (response?.response?.success) {
        setActions(actions.filter((action) => action._id !== actionId))
      } else {
        setErrors({ submit: response?.response?.message || 'Failed to delete action' })
      }
    } catch (error) {
      console.error('Error deleting action:', error)
      setErrors({
        submit: error.response?.data?.message || 'An error occurred. Please try again.',
      })
    }
  }

  // Handle edit action (populate form with existing action data)
  const handleEditAction = (action) => {
    setIsEditing(true)
    setCurrentActionId(action._id)
    console.log('Editing action:', action) // Debug the action object
    setNewAction({
      name: action.name || '',
      type: action.type || 'VCF',
      firstName: action.vcf_data?.firstName || '',
      lastName: action.vcf_data?.lastName || '',
      email: action.vcf_data?.email || '',
      phone: action.vcf_data?.phone || '',
      dob: action.vcf_data?.dob || '',
      redirectUrl: action.redirect_url || '', // Match backend's redirect_url
      expiry: action.expiry ? new Date(action.expiry).toISOString().slice(0, 16) : '',
    })
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box sx={{ p: 3 }}>
        <Button
          variant="contained"
          sx={{
            color: '#fff',
            backgroundColor: '#3182ce',
            borderRadius: 2,
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#2954CC',
              boxShadow: '0 4px 12px rgba(51, 102, 255, 0.2)',
            },
          }}
          onClick={handleOpenModal}
        >
          Manage Actions
        </Button>

        <Paper sx={{ width: '100%', overflow: 'hidden', p: 3 }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="user table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        sx={{
                          color: '#fff',
                          backgroundColor: '#3182ce',
                          borderRadius: 2,
                          fontWeight: 600,
                          boxShadow: 'none',
                          '&:hover': {
                            backgroundColor: '#2954CC',
                            boxShadow: '0 4px 12px rgba(51, 102, 255, 0.2)',
                          },
                        }}
                        onClick={() => navigate(`./edit/${user._id}`, { state: { user } })}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Modal for Actions Table */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              maxWidth: 800,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <Typography variant="h5" gutterBottom>
              Actions
            </Typography>

            {/* Actions Table */}
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table sx={{ minWidth: 650 }} aria-label="actions table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Expiry</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {actions.map((action) => (
                    <TableRow key={action._id}>
                      {console.log(action, 'action')}
                      <TableCell>{action.name}</TableCell>
                      <TableCell>{action.type}</TableCell>
                      <TableCell>{action.expiry || 'N/A'}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          sx={{ mr: 1, color: '#3182ce', borderColor: '#3182ce' }}
                          onClick={() => handleEditAction(action)}
                        >
                          Update
                        </Button>
                        <Button
                          variant="outlined"
                          sx={{ color: '#e53e3e', borderColor: '#e53e3e' }}
                          onClick={() => handleDeleteAction(action._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Form to Create or Update Action */}
            <Typography variant="h6" gutterBottom>
              {isEditing ? 'Update Action' : 'Create New Action'}
            </Typography>
            <Box component="form" noValidate autoComplete="off">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Action Name *"
                    value={newAction.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Action Type *</InputLabel>
                    <Select
                      value={newAction.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      label="Action Type *"
                    >
                      <MenuItem value="VCF">VCF</MenuItem>
                      <MenuItem value="Redirect">Redirect</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {newAction.type === 'VCF' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name *"
                        value={newAction.firstName}
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
                        value={newAction.lastName}
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
                        value={newAction.email}
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
                        value={newAction.phone}
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
                        value={newAction.dob}
                        onChange={(e) => handleInputChange('dob', e.target.value)}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </>
                )}
                {newAction.type === 'Redirect' && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Redirect URL *"
                      type="url"
                      value={newAction.redirectUrl}
                      onChange={(e) => handleInputChange('redirectUrl', e.target.value)}
                      error={!!errors.redirectUrl}
                      helperText={errors.redirectUrl}
                      variant="outlined"
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Expiry *"
                    type="datetime-local"
                    value={newAction.expiry || getDefaultExpiry()}
                    onChange={(e) => handleInputChange('expiry', e.target.value)}
                    error={!!errors.expiry}
                    helperText={errors.expiry}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ inputProps: { min: new Date().toISOString().slice(0, 16) } }}
                  />
                </Grid>
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
                      onClick={handleCloseModal}
                      sx={{ color: 'text.primary', borderColor: 'text.primary' }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={isEditing ? handleUpdateAction : handleCreateAction}
                      sx={{
                        color: '#fff',
                        backgroundColor: '#3182ce',
                        borderRadius: 2,
                        fontWeight: 600,
                        boxShadow: 'none',
                        '&:hover': {
                          backgroundColor: '#2954CC',
                          boxShadow: '0 4px 12px rgba(51, 102, 255, 0.2)',
                        },
                      }}
                    >
                      {isEditing ? 'Update Action' : 'Create Action'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Modal>
      </Box>
    </DashboardLayout>
  )
}

export default NfcUsers
