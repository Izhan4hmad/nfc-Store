import React, { useState, useRef, useEffect } from 'react'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import Autocomplete from '@mui/material/Autocomplete'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import {
  Button,
  Typography,
  Box,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Fade,
  Paper,
  Divider,
  Stack,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  Input,
  TextField,
} from '@mui/material'
import { useLocation } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { useAppServices } from 'hook/services'
import LinkIcon from '@mui/icons-material/Link'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import QrCodeIcon from '@mui/icons-material/QrCode2'
import CloseIcon from '@mui/icons-material/Close'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import DownloadIcon from '@mui/icons-material/Download'
import html2canvas from 'html2canvas'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 500,
  bgcolor: 'background.paper',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  borderRadius: 3,
  p: 0,
  overflow: 'hidden',
}

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

const downloadQRCode = async () => {
  const qrCodeContainer = document.getElementById('qr-code-container')
  if (qrCodeContainer) {
    const canvas = await html2canvas(qrCodeContainer, {
      scale: 2,
      useCORS: true,
    })
    const pngUrl = canvas.toDataURL('image/png')
    const downloadLink = document.createElement('a')
    downloadLink.href = pngUrl
    downloadLink.download = 'nfc-card-qrcode.png'
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  } else {
    console.error('QR code container not found')
  }
}

const copyToClipboard = (text, setSnackbarOpen, showSnackbar) => {
  navigator.clipboard.writeText(text).then(
    () => {
      showSnackbar('URL copied to clipboard!', 'success')
    },
    (err) => {
      console.error('Could not copy text: ', err)
      showSnackbar('Failed to copy URL.', 'error')
    }
  )
}

const NfcCardView = React.memo(function NfcCardView() {
  const location = useLocation()
    console.log("location", location)

  const card = location.state?.card
  console.log("cardcard", card)
  const AppService = useAppServices()
  const [modalOpen, setModalOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [associatedProduct, setAssociatedProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [urlLoading, setUrlLoading] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')
  const [url, setUrl] = useState(card?.url || '')
  const [isUrlEditable, setIsUrlEditable] = useState(false)
  const [variantImageIndex, setVariantImageIndex] = useState(0)
  const hasFetchedProducts = useRef(false)

  const qrCodeUrl =
    card?.domain && card?.code
      ? card.domain.includes('http')
        ? `${card.domain}/${card.code}`
        : `https://${card.domain}/${card.code}`
      : ''

  useEffect(() => {
    const fetchData = async () => {
      if (hasFetchedProducts.current) return

      setLoading(true)
      try {
        const { response } = await AppService.productsPage.get()
        if (response && response.data) {
          const productList = Array.isArray(response.data) ? response.data : [response.data]
          setProducts(productList)

          if (card?.associatedId) {
            const associatedProd = productList.find((product) => product._id === card.associatedId)
            if (associatedProd) {
              console.log('Associated Product:', associatedProd) // Debugging log
              setAssociatedProduct(associatedProd)
              setVariantImageIndex(0)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        showSnackbar('Failed to load products', 'error')
      } finally {
        setLoading(false)
        hasFetchedProducts.current = true
      }
    }

    fetchData()
  }, [card])

  const handlePreviousImage = () => {
    setVariantImageIndex((prev) =>
      prev > 0 ? prev - 1 : (associatedProduct?.imageUrls?.length || 1) - 1
    )
  }

  const handleNextImage = () => {
    setVariantImageIndex((prev) =>
      prev < (associatedProduct?.imageUrls?.length || 1) - 1 ? prev + 1 : 0
    )
  }

  const handleOpenModal = () => setModalOpen(true)

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedProduct('')
  }

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value)
  }

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
  }

  const handleSave = async () => {
    if (selectedProduct && card?.code) {
      setLoading(true)
      try {
        const payload = {
          code: card.code,
          associatedId: selectedProduct,
        }

        const { response } = await AppService.nfcbusinessCard.update({
          payload,
        })

        if (response?.success) {
          const selectedProductData = products.find((product) => product._id === selectedProduct)
          if (selectedProductData) {
            setAssociatedProduct(selectedProductData)
            setVariantImageIndex(0)
          }
          showSnackbar('Product associated successfully!')
        } else {
          showSnackbar(
            'Failed to associate product: ' + (response?.message || 'Unknown error'),
            'error'
          )
        }
      } catch (error) {
        console.error('Error associating product:', error)
        showSnackbar('Error associating product: ' + error.message, 'error')
      } finally {
        setLoading(false)
      }
      handleCloseModal()
    } else {
      showSnackbar('Please select a product to associate.', 'warning')
    }
  }

  const handleSaveUrl = async () => {
    if (url && card?.code && url !== card.url) {
      setUrlLoading(true)
      try {
        const { response } = await AppService.nfcbusinessCard.update({
          payload: {
            code: card.code,
            url: url,
          },
        })

        if (response?.success) {
          showSnackbar('URL updated successfully!')
          setIsUrlEditable(false)
        } else {
          showSnackbar('Failed to update URL: ' + (response?.message || 'Unknown error'), 'error')
        }
      } catch (error) {
        console.error('Error updating URL:', error)
        showSnackbar('Error updating URL: ' + error.message, 'error')
      } finally {
        setUrlLoading(false)
      }
    } else {
      showSnackbar('No changes to save or URL is invalid.', 'warning')
      setIsUrlEditable(false)
    }
  }

  const formatUrl = (url) => {
    if (!url) return ''
    return url.length > 30 ? `${url.substring(0, 30)}...` : url
  }

  if (!card) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'calc(100vh - 100px)',
            p: 3,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              p: 4,
              textAlign: 'center',
              backgroundColor: theme.grey[100],
              border: `1px solid ${theme.grey[300]}`,
              maxWidth: 500,
            }}
          >
            <QrCodeIcon sx={{ fontSize: 60, color: theme.grey[300], mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, color: theme.text.primary, mb: 1 }}>
              No Card Data Available
            </Typography>
            <Typography variant="body1" sx={{ color: theme.text.secondary, mb: 3 }}>
              There is no NFC card data to display. Please select a valid card.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: theme.primary,
                borderRadius: 2,
                boxShadow: 'none',
                px: 3,
                py: 1,
                '&:hover': {
                  backgroundColor: '#2954CC',
                  boxShadow: '0 4px 12px rgba(51, 102, 255, 0.2)',
                },
              }}
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </Paper>
        </Box>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box
        sx={{
          bgcolor: theme.secondary,
          minHeight: 'calc(100vh - 64px)',
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 3,
          m: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            alignItems: { xs: 'center', md: 'flex-start' },
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              flex: 1,
              width: { xs: '100%', md: 'auto' },
              maxWidth: { xs: '100%', md: 400 },
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                mb: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <QrCodeIcon sx={{ color: theme.accent }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: theme.text.primary }}>
                  NFC Card Details
                </Typography>
              </Stack>

              <Divider sx={{ mb: 3 }} />

              <Box
                id="qr-code-container"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    bgcolor: 'white',
                    borderRadius: 2,
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
                    position: 'relative',
                  }}
                >
                  <QRCodeSVG
                    id="qr-code-canvas"
                    value={qrCodeUrl}
                    size={200}
                    level="H"
                    includeMargin={true}
                    bgColor="#FFFFFF"
                    fgColor={theme.text.primary}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 2,
                      border: `2px solid ${theme.accent}`,
                      pointerEvents: 'none',
                    }}
                  />
                </Box>

                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Tooltip title="Download QR Code">
                    <IconButton
                      color="primary"
                      onClick={downloadQRCode}
                      sx={{
                        bgcolor: theme.grey[100],
                        '&:hover': { bgcolor: theme.grey[200] },
                      }}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: theme.text.secondary }}>
                  Card URL
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: theme.grey[100],
                    border: `1px solid ${theme.grey[300]}`,
                  }}
                >
                  {isUrlEditable ? (
                    <>
                      <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        fullWidth
                        sx={{ color: theme.text.primary, fontFamily: 'monospace' }}
                      />
                      <IconButton
                        size="small"
                        onClick={handleSaveUrl}
                        disabled={urlLoading || url === card.url}
                        sx={{ color: theme.primary }}
                      >
                        {urlLoading ? (
                          <CircularProgress size={16} sx={{ color: theme.primary }} />
                        ) : (
                          <SaveIcon />
                        )}
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setUrl(card.url || '')
                          setIsUrlEditable(false)
                        }}
                        sx={{ color: theme.text.secondary }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <Typography
                        variant="body2"
                        sx={{
                          flex: 1,
                          color: theme.text.primary,
                          fontFamily: 'monospace',
                        }}
                      >
                        {formatUrl(url || '')}
                      </Typography>
                      <Tooltip title="Edit URL">
                        <IconButton
                          size="small"
                          onClick={() => setIsUrlEditable(true)}
                          sx={{ color: theme.primary }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Copy URL">
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard(url || '', setSnackbarOpen, showSnackbar)}
                          sx={{ color: theme.primary }}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </Box>
              </Box>

              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 0.5, color: theme.text.secondary }}>
                    Card Code
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: theme.text.primary }}>
                    {card.code || 'N/A'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 0.5, color: theme.text.secondary }}>
                    Status
                  </Typography>
                  <Chip
                    label={associatedProduct ? 'Associated' : 'Not Associated'}
                    size="small"
                    color={associatedProduct ? 'success' : 'default'}
                    sx={{
                      borderRadius: 1,
                      backgroundColor: associatedProduct
                        ? 'rgba(0, 196, 140, 0.1)'
                        : theme.grey[200],
                      color: associatedProduct ? theme.success : theme.text.secondary,
                      fontWeight: 500,
                    }}
                  />
                </Box>
              </Stack>
            </Paper>

            <Box sx={{ display: { xs: 'block', md: 'none' }, width: '100%', mb: 3 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<ShoppingBagIcon />}
                onClick={handleOpenModal}
                sx={{
                  backgroundColor: theme.primary,
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(51, 102, 255, 0.25)',
                  '&:hover': {
                    backgroundColor: '#2954CC',
                    boxShadow: '0 6px 20px rgba(51, 102, 255, 0.35)',
                  },
                }}
              >
                {associatedProduct ? 'Change Associated Product' : 'Associate Product'}
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1.5,
              width: { xs: '100%', md: 'auto' },
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                height: '100%',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 3 }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ShoppingBagIcon sx={{ color: theme.accent }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: theme.text.primary }}>
                    Associated Product
                  </Typography>
                </Stack>

                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Button
                    variant="contained"
                    size="medium"
                    startIcon={<ShoppingBagIcon />}
                    onClick={handleOpenModal}
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
                    {associatedProduct ? 'Change' : 'Associate'}
                  </Button>
                </Box>
              </Stack>

              <Divider sx={{ mb: 3 }} />

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress size={40} sx={{ color: theme.primary }} />
                </Box>
              ) : associatedProduct ? (
                <Box sx={{ flex: 1 }}>
                  <Card
                    elevation={0}
                    sx={{
                      mb: 3,
                      borderRadius: 3,
                      overflow: 'hidden',
                      border: `1px solid ${theme.grey[200]}`,
                      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 28px rgba(0, 0, 0, 0.08)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: 700, color: theme.text.primary }}
                        >
                          {associatedProduct.productName}
                        </Typography>
                      </Box>

                      {associatedProduct.productDescription && (
                        <Typography
                          variant="body2"
                          sx={{ color: theme.text.secondary, mb: 2, lineHeight: 1.6 }}
                        >
                          {associatedProduct.productDescription}
                        </Typography>
                      )}

                      <Box sx={{ position: 'relative', mb: 2 }}>
                        {associatedProduct?.imageUrls?.length > 0 ? (
                          associatedProduct.imageUrls.length === 1 ? (
                            <CardMedia
                              component="img"
                              image={associatedProduct.imageUrls[0]}
                              alt={`${associatedProduct.productName}`}
                              sx={{
                                width: '100%',
                                height: 300,
                                objectFit: 'cover',
                                borderRadius: 1,
                              }}
                              onError={(e) => {
                                console.error(
                                  'Image failed to load:',
                                  associatedProduct.imageUrls[0]
                                )
                                e.target.style.display = 'none' // Hide broken image
                                e.target.nextSibling.style.display = 'flex' // Show fallback
                              }}
                            />
                          ) : (
                            <>
                              <CardMedia
                                component="img"
                                image={associatedProduct.imageUrls[variantImageIndex]}
                                alt={`${associatedProduct.productName}`}
                                sx={{
                                  width: '100%',
                                  height: 300,
                                  objectFit: 'cover',
                                  borderRadius: 1,
                                }}
                                onError={(e) => {
                                  console.error(
                                    'Image failed to load:',
                                    associatedProduct.imageUrls[variantImageIndex]
                                  )
                                  e.target.style.display = 'none' // Hide broken image
                                  e.target.nextSibling.style.display = 'flex' // Show fallback
                                }}
                              />
                              <IconButton
                                size="small"
                                onClick={handlePreviousImage}
                                sx={{
                                  position: 'absolute',
                                  left: 8,
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                                  color: 'white',
                                  '&:hover': {
                                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                                  },
                                }}
                              >
                                <ChevronLeftIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={handleNextImage}
                                sx={{
                                  position: 'absolute',
                                  right: 8,
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                                  color: 'white',
                                  '&:hover': {
                                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                                  },
                                }}
                              >
                                <ChevronRightIcon />
                              </IconButton>
                            </>
                          )
                        ) : (
                          <Box
                            sx={{
                              width: '100%',
                              height: 300,
                              bgcolor: theme.grey[200],
                              borderRadius: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mb: 2,
                            }}
                          >
                            <Typography variant="body2" color={theme.text.secondary}>
                              No Image
                            </Typography>
                          </Box>
                        )}
                        {/* Fallback Box for broken images */}
                        <Box
                          sx={{
                            width: '100%',
                            height: 300,
                            bgcolor: theme.grey[200],
                            borderRadius: 1,
                            display: 'none', // Hidden by default
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                          }}
                        >
                          <Typography variant="body2" color={theme.text.secondary}>
                            Image Failed to Load
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ) : (
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 8,
                    px: 3,
                    textAlign: 'center',
                    bgcolor: theme.grey[100],
                    borderRadius: 2,
                  }}
                >
                  <ShoppingBagIcon sx={{ fontSize: 60, color: theme.grey[300], mb: 2 }} />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: theme.text.primary, mb: 1 }}
                  >
                    No Product Associated
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.text.secondary, mb: 3, maxWidth: 400 }}
                  >
                    This NFC card is not associated with any product yet. Click the button above to
                    link a product.
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={handleOpenModal}
                    startIcon={<LinkIcon />}
                    sx={{
                      borderColor: theme.primary,
                      color: theme.primary,
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(51, 102, 255, 0.05)',
                        borderColor: theme.primary,
                      },
                    }}
                  >
                    Associate a Product
                  </Button>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          closeAfterTransition
          aria-labelledby="associate-product-modal"
        >
          <Fade in={modalOpen}>
            <Box sx={modalStyle}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: `1px solid ${theme.grey[200]}`,
                  p: 3,
                }}
              >
                <Typography
                  id="associate-product-modal"
                  variant="h6"
                  sx={{ fontWeight: 600, color: theme.text.primary }}
                >
                  Associate Product
                </Typography>
                <IconButton size="small" onClick={handleCloseModal}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>

              <Box sx={{ p: 3 }}>
                <Typography variant="body2" sx={{ mb: 3, color: theme.text.secondary }}>
                  Select a product to associate with this NFC card. Users scanning this card will be
                  directed to the product page.
                </Typography>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <Autocomplete
                    id="product-select"
                    options={products}
                    getOptionLabel={(option) => option.productName || ''} // Display product name
                    value={products.find((product) => product._id === selectedProduct) || null}
                    onChange={(event, newValue) => {
                      setSelectedProduct(newValue ? newValue._id : '')
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Product"
                        variant="outlined"
                        placeholder="Search products..."
                      />
                    )}
                    noOptionsText="No products found"
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>
                        {option.productName}
                      </li>
                    )}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: theme.grey[300],
                        },
                        '&:hover fieldset': {
                          borderColor: theme.primary,
                        },
                      },
                    }}
                  />
                </FormControl>

                {associatedProduct && (
                  <Alert
                    severity="info"
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      '& .MuiAlert-icon': { color: theme.primary },
                    }}
                  >
                    Currently associated with: <strong>{associatedProduct.productName}</strong>
                  </Alert>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleCloseModal}
                    sx={{
                      borderColor: theme.grey[300],
                      color: theme.text.secondary,
                      borderRadius: 2,
                      px: 3,
                      '&:hover': {
                        borderColor: theme.grey[800],
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={!selectedProduct || loading}
                    sx={{
                      color: '#fff',
                      backgroundColor: theme.primary,
                      borderRadius: 2,
                      px: 3,
                      '&:hover': {
                        backgroundColor: '#2954CC',
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Save'}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Fade>
        </Modal>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: '100%', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  )
})

export default NfcCardView
