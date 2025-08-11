import React, { useState, useRef } from 'react'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  Grid,
  IconButton,
  Card,
  CardMedia,
  CardActions,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Select,
  MenuItem,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useAppServices, useUploadImage } from 'hook/services'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 900,
  bgcolor: '#fff',
  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
  p: 6,
  borderRadius: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
}

// ProductTable Component
const ProductTable = React.memo(function ProductTable({
  products,
  onStatusUpdate,
  onEditProduct,
  onDeleteProduct,
}) {
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [modalType, setModalType] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [searchQuery, setSearchQuery] = useState('')

  const handleViewDetails = (product, type) => {
    setSelectedProduct(product)
    setModalType(type)
    setViewModalOpen(true)
  }

  const handleViewModalClose = () => {
    setViewModalOpen(false)
    setSelectedProduct(null)
    setModalType(null)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleStatusChange = (productId, newStatus) => {
    onStatusUpdate(productId, newStatus)
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
    setPage(0) // Reset to first page when search changes
  }

  const handleEditProduct = (product) => {
    onEditProduct(product)
  }

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await onDeleteProduct(productId)
    }
  }

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    ['productName', 'productId', 'productDescription'].some((field) =>
      product[field]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const paginatedRows = filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, mt: 6 }}>
        <TextField
          label="Search Products"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by name, ID, or description"
          sx={{
            width: { xs: '100%', sm: 300 },
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': { borderColor: '#3b82f6' },
              '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
            },
          }}
        />
      </Box>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
      >
        <Table>
          <TableHead sx={{ bgcolor: 'linear-gradient(to right, #1e3a8a, #3b82f6)' }}>
            <TableRow>
              {[
                'Product Name',
                'Product ID',
                'Description',
                'Variants',
                'Media',
                'Status',
                'Update Status',
                'Edit',
              ].map((header) => (
                <TableCell key={header} sx={{ color: 'white', fontWeight: 600, py: 3 }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((product, index) => (
              <TableRow key={product._id || index} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                <TableCell>{product.productName}</TableCell>
                <TableCell>{product.productId}</TableCell>
                <TableCell>{product.productDescription}</TableCell>
                <TableCell>
                  {product.variants.length}{' '}
                  {product.variants.length > 0 && (
                    <IconButton
                      onClick={() => handleViewDetails(product, 'variants')}
                      sx={{ color: '#3b82f6', '&:hover': { color: '#1e40af' } }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell>
                  {product.imageUrls && product.imageUrls.length > 0 ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>{product.imageUrls.length} Image(s)</Typography>
                      <IconButton
                        onClick={() => handleViewDetails(product, 'media')}
                        sx={{ color: '#3b82f6', '&:hover': { color: '#1e40af' } }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <Typography sx={{ color: '#64748b' }}>No Images</Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography sx={{ color: product.status === 'active' ? '#16a34a' : '#64748b' }}>
                    {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Select
                    value={product.status}
                    onChange={(e) => handleStatusChange(product._id, e.target.value)}
                    sx={{ minWidth: 120, borderRadius: 2 }}
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditProduct(product)}
                    sx={{ color: '#3b82f6', '&:hover': { color: '#1e40af' }, mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteProduct(product._id)}
                    sx={{ color: '#ef4444', '&:hover': { color: '#b91c1c' } }}
                  >
                    <DeleteIcon />
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
        count={filteredProducts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ mt: 2 }}
      />
      <Modal open={viewModalOpen} onClose={handleViewModalClose}>
        <Box sx={modalStyle}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
              {modalType === 'variants' ? 'Product Variants' : 'Product Images'}
            </Typography>
            <IconButton onClick={handleViewModalClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          {selectedProduct && (
            <>
              {modalType === 'variants' ? (
                selectedProduct.variants.length > 0 ? (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
                      {/* Product Variants */}
                    </Typography>
                    <Grid container spacing={3}>
                      {selectedProduct.variants.map((variant, vIndex) => (
                        <Grid item xs={12} sm={6} md={4} key={vIndex}>
                          <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                            <Typography
                              variant="h6"
                              sx={{ mb: 1, fontWeight: 600, color: '#1e293b' }}
                            >
                              {vIndex + 1}. {variant.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                              Quantity: {variant.quantity}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                              Unit Price: ${variant.unitPrice}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                              Reselling Price: ${variant.resellingPrice}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ) : (
                  <Typography sx={{ color: '#64748b', mb: 4 }}>No variants available.</Typography>
                )
              ) : modalType === 'media' &&
                selectedProduct.imageUrls &&
                selectedProduct.imageUrls.length > 0 ? (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
                    {/* Product Images */}
                  </Typography>
                  <Grid container spacing={2}>
                    {selectedProduct.imageUrls.map((imgUrl, imgIndex) => (
                      <Grid item xs={12} sm={6} md={4} key={imgIndex}>
                        <Card sx={{ borderRadius: 2, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                          <CardMedia
                            component="img"
                            height="140"
                            image={imgUrl}
                            alt={`Product image ${imgIndex + 1}`}
                          />
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ) : (
                <Typography sx={{ color: '#64748b' }}>No images available.</Typography>
              )}
            </>
          )}
        </Box>
      </Modal>
    </>
  )
})

function ProductPage() {
  const [open, setOpen] = useState(false)
  const AppService = useAppServices()
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    productId: '',
    images: [],
  })
  const [variants, setVariants] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState()
  const hasFetched = useRef(false)

  // Fetch products only once on load
  if (!hasFetched.current) {
    ;(async () => {
      try {
        const { response } = await AppService.productsPage.get()
        if (response && response.data) {
          setProducts(Array.isArray(response.data) ? response.data : [response.data])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        hasFetched.current = true
      }
    })()
  }

  const uploadImage = useUploadImage()

  const handleStatusUpdate = async (productId, newStatus) => {
    try {
      const response = await AppService.productsPage.update({
        payload: { status: newStatus, _id: productId },
      })
      if (response?.response?.success) {
        setProducts((prev) =>
          prev.map((product) =>
            product._id === productId ? { ...product, status: newStatus } : product
          )
        )
      }
    } catch (error) {
      console.error('Error updating product status:', error)
    }
  }

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
    setFormData({
      productName: '',
      productDescription: '',
      productId: '',
      images: [],
    })
    setVariants([])
    setIsLoading(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddVariant = () => {
    setVariants((prev) => [...prev, { title: '', quantity: '', unitPrice: '', resellingPrice: '' }])
  }

  const handleDeleteVariant = (variantIndex) => {
    const updatedVariants = [...variants]
    updatedVariants.splice(variantIndex, 1)
    setVariants(updatedVariants)
  }

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants]
    updated[index][field] = value
    setVariants(updated)
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    const uploaded = await Promise.all(
      files.map(async (file) => {
        try {
          const res = await uploadImage({
            file,
            desiredPath: `design/logo/image`,
          })
          return {
            file,
            preview: URL.createObjectURL(file),
            url: res?.response?.data,
          }
        } catch {
          return null
        }
      })
    )

    const valid = uploaded.filter((img) => img !== null)
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...valid],
    }))
  }

  const handleImageDelete = (imageIndex) => {
    const updatedImages = [...formData.images]
    URL.revokeObjectURL(updatedImages[imageIndex]?.preview)
    updatedImages.splice(imageIndex, 1)
    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    const basePayload = {
      ...formData,
      imageUrls: formData.images.map((img) => img.url || img),
      status: 'draft',
      variants: variants.map((variant) => ({
        title: variant.title,
        quantity: parseInt(variant.quantity) || 0,
        unitPrice: parseFloat(variant.unitPrice) || 0,
        resellingPrice: parseFloat(variant.resellingPrice) || 0,
      })),
    }

    if (selectedProduct) basePayload._id = selectedProduct._id

    try {
      const response = await AppService.productsPage[selectedProduct ? 'update' : 'create']({
        payload: basePayload,
      })

      console.log('Full API Response:', response)

      if (response?.response?.success && response.response.data) {
        console.log('Product created successfully:', response.response.data)
        handleClose()
        const { response: newResponse } = await AppService.productsPage.get()
        if (newResponse && newResponse.data) {
          setProducts(Array.isArray(newResponse.data) ? newResponse.data : [newResponse.data])
        }
      } else {
        console.log('API response (not considered success):', response)
      }
    } catch (error) {
      console.error('Error creating product:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditProduct = (product) => {
    setSelectedProduct(product)
    console.log(product)
    setFormData({
      productName: product.productName,
      productDescription: product.productDescription,
      productId: product.productId,
      images: product.imageUrls || [],
    })
    setVariants(product.variants || [])
    setOpen(true)
  }

  const handleDeleteProduct = async (productId) => {
    try {
      const { response } = await AppService.productsPage.delete({
        payload: { _id: productId },
      })
      if (response?.success) {
        setProducts((prev) => prev.filter((product) => product._id !== productId))
        console.log('Product deleted successfully:', response.message)
      } else {
        console.error('Failed to delete product:', response?.message || 'Unknown error')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box sx={{ p: 4, bgcolor: '#f8fafc' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#3b82f6',
              color: '#fff',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              '&:hover': { bgcolor: '#1e40af' },
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
            onClick={handleOpen}
          >
            Create Product
          </Button>
        </Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="create-product-modal"
          disableEscapeKeyDown={isLoading}
          disableBackdropClick={isLoading}
        >
          <Box sx={modalStyle}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {selectedProduct
                  ? 'Update Product ' + selectedProduct.productName
                  : 'Create New Product'}
              </Typography>
              <IconButton onClick={handleClose} disabled={isLoading}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Name"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': { borderColor: '#3b82f6' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product ID"
                  name="productId"
                  value={formData.productId}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': { borderColor: '#3b82f6' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Description"
                  name="productDescription"
                  value={formData.productDescription}
                  onChange={handleInputChange}
                  variant="outlined"
                  multiline
                  rows={4}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': { borderColor: '#3b82f6' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    bgcolor: '#3b82f6',
                    color: '#fff',
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    '&:hover': { bgcolor: '#1e40af' },
                  }}
                >
                  Upload Product Images
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Button>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {formData.images.map((img, imgIndex) => (
                    <Grid item xs={12} sm={6} md={4} key={imgIndex}>
                      <Card sx={{ borderRadius: 2, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={img?.preview || img}
                          alt={`Product image ${imgIndex + 1}`}
                        />
                        <CardActions>
                          <Button
                            size="small"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleImageDelete(imgIndex)}
                          >
                            Delete
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  onClick={handleAddVariant}
                  disabled={
                    isLoading ||
                    !formData.productName ||
                    !formData.productId ||
                    !formData.productDescription
                  }
                  sx={{
                    borderColor: '#3b82f6',
                    color: '#3b82f6',
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    '&:hover': { borderColor: '#1e40af', color: '#1e40af' },
                  }}
                >
                  Add Variant
                </Button>
              </Grid>
              {variants.map((variant, vIndex) => (
                <Grid item xs={12} key={vIndex}>
                  <Box
                    sx={{
                      border: '1px solid #e2e8f0',
                      borderRadius: 2,
                      p: 3,
                      mt: 2,
                      bgcolor: '#f8fafc',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>
                        Variant {vIndex + 1}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteVariant(vIndex)}
                        disabled={isLoading}
                        sx={{
                          borderColor: '#ef4444',
                          color: '#ef4444',
                          '&:hover': { borderColor: '#b91c1c', color: '#b91c1c' },
                        }}
                      >
                        Delete Variant
                      </Button>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Variant Title"
                          value={variant.title}
                          onChange={(e) => handleVariantChange(vIndex, 'title', e.target.value)}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover fieldset': { borderColor: '#3b82f6' },
                              '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Quantity"
                          type="number"
                          value={variant.quantity}
                          onChange={(e) => handleVariantChange(vIndex, 'quantity', e.target.value)}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover fieldset': { borderColor: '#3b82f6' },
                              '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Unit Price ($)"
                          type="number"
                          value={variant.unitPrice}
                          onChange={(e) => handleVariantChange(vIndex, 'unitPrice', e.target.value)}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover fieldset': { borderColor: '#3b82f6' },
                              '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Reselling Price ($)"
                          type="number"
                          value={variant.resellingPrice}
                          onChange={(e) =>
                            handleVariantChange(vIndex, 'resellingPrice', e.target.value)
                          }
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover fieldset': { borderColor: '#3b82f6' },
                              '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleClose}
                    disabled={isLoading}
                    sx={{
                      borderColor: '#64748b',
                      color: '#64748b',
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      '&:hover': { borderColor: '#475569', color: '#475569' },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: '#3b82f6',
                      color: '#fff',
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      position: 'relative',
                      '&:hover': { bgcolor: '#1e40af' },
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    }}
                    onClick={handleSave}
                    disabled={
                      isLoading ||
                      !formData.productName ||
                      !formData.productId ||
                      !formData.productDescription ||
                      variants.length === 0 ||
                      variants.some(
                        (v) => !v.title || !v.quantity || !v.unitPrice || !v.resellingPrice
                      )
                    }
                  >
                    {isLoading && (
                      <CircularProgress
                        size={24}
                        sx={{
                          position: 'absolute',
                          left: '50%',
                          marginLeft: '-12px',
                        }}
                      />
                    )}
                    {isLoading ? 'Saving...' : selectedProduct ? 'Update' : 'Save'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Modal>
        <ProductTable
          products={products}
          onStatusUpdate={handleStatusUpdate}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      </Box>
    </DashboardLayout>
  )
}

export default ProductPage
