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
  Tabs,
  Tab,
  Box,
  Modal,
  TextField,
  MenuItem,
  Typography,
  Chip,
  IconButton,
  Divider,
} from '@mui/material'
import {
  Edit as EditIcon,
  Add as AddIcon,
  QrCode as QrCodeIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAppServices } from 'hook/services'

function NfcCards() {
  const AppService = useAppServices()
  const navigate = useNavigate()
  const location = useLocation()
  const cardIds = location.state?.user.cardIds
  const [cards, setCards] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [tabValue, setTabValue] = useState(0)
  const [openModal, setOpenModal] = useState(false)
  const [formData, setFormData] = useState({
    actionName: '',
    actionType: 'VCF',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
  })
  const [actions, setActions] = useState([
    { id: 1, name: 'Faraz', type: 'REDIRECT' },
    { id: 2, name: 'admin', type: 'REDIRECT' },
    { id: 3, name: 'admin', type: 'REDIRECT' },
    { id: 4, name: 'admin', type: 'REDIRECT' },
    { id: 5, name: 'admin', type: 'REDIRECT' },
  ])

  const GetCards = async () => {
    try {
      const payLoad = {
        cardIds: cardIds,
      }
      const response = await AppService.nfcUsers.getcards({
        query: `cardIds=${cardIds.join(',')}`,
      })
      if (response?.response?.success) {
        setCards(response.response.data)
      }
    } catch (error) {
      console.error('Error Getting cards', error)
    }
  }

  const onLoad = () => {
    GetCards()
  }

  useEffect(onLoad, [])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setFormData({
      actionName: '',
      actionType: 'VCF',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    console.log('Form submitted:', formData)
    handleCloseModal()
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box sx={{ width: '100%', p: 3, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
        {/* Clean Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: '#2d3748',
              mb: 1,
            }}
          >
            NFC Action Management
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#718096',
            }}
          >
            Manage your NFC and configure actions
          </Typography>
        </Box>

        {/* Professional Tabs */}
        <Paper
          sx={{
            width: '100%',
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              borderBottom: '1px solid #e2e8f0',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.95rem',
                minHeight: 48,
                color: '#64748b',
                '&.Mui-selected': {
                  color: '#3182ce',
                  fontWeight: 600,
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#3182ce',
                height: 2,
              },
            }}
          >
            <Tab
              icon={<QrCodeIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="NFC Codes"
            />
            <Tab
              icon={<SettingsIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="Configuration"
            />
          </Tabs>

          {/* Tab Content */}
          <Box sx={{ p: 3 }}>
            {tabValue === 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2d3748' }}>
                  Your NFC Cards
                </Typography>

                <TableContainer>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f7fafc' }}>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            color: '#4a5568',
                            fontSize: '0.875rem',
                            py: 2,
                          }}
                        >
                          NFC Code
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            color: '#4a5568',
                            fontSize: '0.875rem',
                            py: 2,
                          }}
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cards
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((card, index) => (
                          <TableRow
                            key={card.id}
                            sx={{
                              '&:hover': {
                                bgcolor: '#f7fafc',
                              },
                              borderBottom: '1px solid #e2e8f0',
                            }}
                          >
                            <TableCell sx={{ py: 2.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 1,
                                    bgcolor: '#e2e8f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#4a5568',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                  }}
                                >
                                  {index + 1}
                                </Box>
                                <Typography
                                  sx={{
                                    fontFamily: 'monospace',
                                    fontSize: '0.9rem',
                                    color: '#2d3748',
                                    fontWeight: 500,
                                  }}
                                >
                                  {card.code}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                                onClick={() =>
                                  navigate(`../update/${card.actionId}`, { state: { card } })
                                }
                                sx={{
                                  color: '#ffffff',

                                  bgcolor: '#3182ce',
                                  textTransform: 'none',
                                  fontWeight: 500,
                                  fontSize: '0.875rem',
                                  px: 2,
                                  py: 0.75,
                                  borderRadius: 1.5,
                                  '&:hover': {
                                    bgcolor: '#2c5aa0',
                                  },
                                }}
                              >
                                Update
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
                  count={cards.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    borderTop: '1px solid #e2e8f0',
                    mt: 1,
                  }}
                />
              </Box>
            )}

            {tabValue === 1 && (
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', mb: 0.5 }}>
                      Action Configuration
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#718096' }}>
                      Manage your actions and configurations
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon sx={{ fontSize: 18 }} />}
                    onClick={handleOpenModal}
                    sx={{
                      color: '#ffffff',

                      bgcolor: '#00C48C',
                      textTransform: 'none',
                      fontWeight: 500,
                      px: 3,
                      py: 1,
                      borderRadius: 1.5,
                      '&:hover': {
                        bgcolor: '#00a075',
                      },
                    }}
                  >
                    Add Action
                  </Button>
                </Box>

                <TableContainer>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f7fafc' }}>
                        <TableCell
                          sx={{ fontWeight: 600, color: '#4a5568', fontSize: '0.875rem', py: 2 }}
                        >
                          Name
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, color: '#4a5568', fontSize: '0.875rem', py: 2 }}
                        >
                          Type
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 600, color: '#4a5568', fontSize: '0.875rem', py: 2 }}
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {actions
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((action) => (
                          <TableRow
                            key={action.id}
                            sx={{
                              '&:hover': { bgcolor: '#f7fafc' },
                              borderBottom: '1px solid #e2e8f0',
                            }}
                          >
                            <TableCell sx={{ py: 2.5 }}>
                              <Typography sx={{ fontWeight: 500, color: '#2d3748' }}>
                                {action.name}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={action.type}
                                size="small"
                                sx={{
                                  bgcolor: '#e6fffa',
                                  color: '#00C48C',
                                  fontWeight: 500,
                                  fontSize: '0.75rem',
                                  height: 24,
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                sx={{
                                  color: '#718096',
                                  '&:hover': {
                                    bgcolor: '#f7fafc',
                                    color: '#3182ce',
                                  },
                                }}
                              >
                                <EditIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={actions.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    borderTop: '1px solid #e2e8f0',
                    mt: 1,
                  }}
                />
              </Box>
            )}
          </Box>
        </Paper>

        {/* Clean Professional Modal */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 480 },
              maxWidth: 480,
              bgcolor: '#ffffff',
              borderRadius: 2,
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748' }}>
                  Create New Action
                </Typography>
                <IconButton onClick={handleCloseModal} size="small">
                  <CloseIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>
              <Typography variant="body2" sx={{ color: '#718096', mt: 1 }}>
                Configure your new NFC action
              </Typography>
            </Box>

            {/* Modal Content */}
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  fullWidth
                  label="Action Name"
                  name="actionName"
                  value={formData.actionName}
                  onChange={handleInputChange}
                  required
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  select
                  label="Action Type"
                  name="actionType"
                  value={formData.actionType}
                  onChange={handleInputChange}
                  required
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                    },
                  }}
                >
                  <MenuItem value="VCF">VCF Contact</MenuItem>
                </TextField>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                  />
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                  />
                </Box>

                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  size="small"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  size="small"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                />

                <TextField
                  fullWidth
                  label="Date of Birth (Optional)"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                />
              </Box>

              {/* Modal Actions */}
              <Box sx={{ display: 'flex', gap: 2, mt: 4, pt: 3, borderTop: '1px solid #e2e8f0' }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleCloseModal}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 1.5,
                    borderColor: '#d1d5db',
                    color: '#6b7280',
                    '&:hover': {
                      borderColor: '#9ca3af',
                      bgcolor: '#f9fafb',
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{
                    color: '#ffffff',
                    bgcolor: '#3182ce',
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 1.5,
                    '&:hover': {
                      bgcolor: '#2c5aa0',
                    },
                  }}
                >
                  Create Action
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>
      </Box>
    </DashboardLayout>
  )
}

export default NfcCards
