// import React, { useState, useEffect } from 'react'
// import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
// import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
// import {
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   TablePagination,
//   Modal,
//   Box,
//   Typography,
//   TextField,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   Grid,
//   Chip,
//   IconButton,
//   Checkbox,
//   ListItemText,
// } from '@mui/material'
// import CloseIcon from '@mui/icons-material/Close'
// import { useAppServices } from 'hook/services'

// function Package() {
//   const AppService = useAppServices()
//   const [packages, setPackages] = useState([])
//   const [openModal, setOpenModal] = useState(false)
//   const [isEditing, setIsEditing] = useState(false)
//   const [currentPackageId, setCurrentPackageId] = useState(null)
//   const [products, setProducts] = useState([])
//   const [newPackage, setNewPackage] = useState({
//     name: '',
//     description: '',
//     price: '',
//     products: [], // Array of { productId, productName }
//   })
//   const [errors, setErrors] = useState({})
//   const [page, setPage] = useState(0)
//   const [rowsPerPage, setRowsPerPage] = useState(10)

//   // Fetch packages
//   const GetPackages = async () => {
//     try {
//       const response = await AppService.packages.get()
//       if (response?.response?.success) {
//         setPackages(response.response.data)
//       }
//     } catch (error) {
//       console.error('Error getting packages', error)
//     }
//   }

//   // Fetch products
//   const GetProducts = async () => {
//     try {
//       const { response } = await AppService.productsPage.get()
//       if (response && response.data) {
//         setProducts(Array.isArray(response.data) ? response.data : [response.data])
//       }
//     } catch (error) {
//       console.error('Error getting products', error)
//     }
//   }

//   useEffect(() => {
//     GetPackages()
//     GetProducts()
//   }, [])

//   // Map _id to productName for display
//   const getProductNameById = (id) => {
//     const product = products.find((p) => p._id === id)
//     return product ? product.productName : id
//   }

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage)
//   }

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10))
//     setPage(0)
//   }

//   const handleOpenModal = () => setOpenModal(true)

//   const handleCloseModal = () => {
//     setOpenModal(false)
//     setIsEditing(false)
//     setCurrentPackageId(null)
//     setNewPackage({
//       name: '',
//       description: '',
//       price: '',
//       products: [],
//     })
//     setErrors({})
//   }

//   const validateForm = () => {
//     const newErrors = {}
//     if (!newPackage.name.trim()) newErrors.name = 'Package name is required'
//     if (!newPackage.description.trim()) newErrors.description = 'Description is required'
//     if (!newPackage.price) newErrors.price = 'Price is required'
//     else if (isNaN(newPackage.price) || newPackage.price <= 0)
//       newErrors.price = 'Price must be a positive number'
//     if (newPackage.products.length === 0) newErrors.products = 'At least one product is required'
//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleInputChange = (field, value) => {
//     setNewPackage((prev) => ({ ...prev, [field]: value }))
//     if (errors[field]) {
//       setErrors((prev) => ({ ...prev, [field]: '' }))
//     }
//   }

//   const handleProductChange = (event) => {
//     const selectedProductIds = event.target.value
//     const newProducts = selectedProductIds.map((id) => ({
//       productId: id,
//       productName: getProductNameById(id),
//     }))
//     setNewPackage((prev) => ({ ...prev, products: newProducts }))
//     if (errors.products) {
//       setErrors((prev) => ({ ...prev, products: '' }))
//     }
//   }

//   const handleDeleteChip = (productIdToDelete) => {
//     setNewPackage((prev) => ({
//       ...prev,
//       products: prev.products.filter((p) => p.productId !== productIdToDelete),
//     }))
//   }

//   const handleCreatePackage = async () => {
//     if (!validateForm()) return

//     try {
//       const payload = {
//         name: newPackage.name,
//         description: newPackage.description,
//         price: newPackage.price, // Backend expects string
//         products: newPackage.products,
//       }
//       const response = await AppService.packages.create({ payload })
//       if (response?.response?.success) {
//         setPackages([...packages, response.response.data])
//         handleCloseModal()
//       } else {
//         setErrors({ submit: response?.response?.message || 'Failed to create package' })
//       }
//     } catch (error) {
//       console.error('Error creating package:', error)
//       setErrors({ submit: error.response?.data?.message || 'An error occurred. Please try again.' })
//     }
//   }

//   const handleUpdatePackage = async () => {
//     if (!validateForm()) return

//     try {
//       const payload = {
//         action_id: currentPackageId, // Changed to match backend
//         name: newPackage.name,
//         description: newPackage.description,
//         price: newPackage.price, // Backend expects string
//         products: newPackage.products,
//       }
//       const response = await AppService.packages.update({ payload })
//       if (response?.response?.success) {
//         setPackages(
//           packages.map((pkg) => (pkg._id === currentPackageId ? response.response.data : pkg))
//         )
//         handleCloseModal()
//       } else {
//         setErrors({ submit: response?.response?.message || 'Failed to update package' })
//       }
//     } catch (error) {
//       console.error('Error updating package:', error)
//       setErrors({ submit: error.response?.data?.message || 'An error occurred. Please try again.' })
//     }
//   }

//   const handleDeletePackage = async (packageId) => {
//     if (!window.confirm('Are you sure you want to delete this package?')) return

//     try {
//       const payload = { package_id: packageId }
//       //   const response = await AppService.packages.delete({ payload })
//       const response = await AppService.packages.delete({ query: `package_id=${packageId}` })
//       if (response?.response?.success) {
//         setPackages(packages.filter((pkg) => pkg._id !== packageId))
//       } else {
//         setErrors({ submit: response?.response?.message || 'Failed to delete package' })
//       }
//     } catch (error) {
//       console.error('Error deleting package:', error)
//       setErrors({ submit: error.response?.data?.message || 'An error occurred. Please try again.' })
//     }
//   }

//   const handleEditPackage = (pkg) => {
//     setIsEditing(true)
//     setCurrentPackageId(pkg._id)
//     setNewPackage({
//       name: pkg.name || '',
//       description: pkg.description || '',
//       price: pkg.price || '',
//       products: pkg.products || [], // Expecting [{ productId, productName }]
//     })
//     setOpenModal(true)
//   }

//   return (
//     <DashboardLayout>
//       <DashboardNavbar />
//       <Box sx={{ p: 3 }}>
//         <Button
//           variant="contained"
//           sx={{
//             color: '#fff',
//             backgroundColor: '#3182ce',
//             borderRadius: 2,
//             fontWeight: 600,
//             boxShadow: 'none',
//             '&:hover': {
//               backgroundColor: '#2954CC',
//               boxShadow: '0 4px 12px rgba(51, 102, 255, 0.2)',
//             },
//           }}
//           onClick={handleOpenModal}
//         >
//           Add Package
//         </Button>

//         <Paper sx={{ width: '100%', overflow: 'hidden', p: 3, mt: 2 }}>
//           <TableContainer>
//             <Table sx={{ minWidth: 650 }} aria-label="package table">
//               <TableHead>
//                 <TableRow>
//                   <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold' }}>Products</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {packages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pkg) => (
//                   <TableRow key={pkg._id}>
//                     <TableCell>{pkg.name}</TableCell>
//                     <TableCell>{pkg.description}</TableCell>
//                     <TableCell>${pkg.price}</TableCell>
//                     <TableCell>{pkg.products?.map((p) => p.productName).join(', ')}</TableCell>
//                     <TableCell>
//                       <Button
//                         variant="outlined"
//                         sx={{ mr: 1, color: '#3182ce', borderColor: '#3182ce' }}
//                         onClick={() => handleEditPackage(pkg)}
//                       >
//                         Update
//                       </Button>
//                       <Button
//                         variant="outlined"
//                         sx={{ color: '#e53e3e', borderColor: '#e53e3e' }}
//                         onClick={() => handleDeletePackage(pkg._id)}
//                       >
//                         Delete
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <TablePagination
//             rowsPerPageOptions={[5, 10, 25]}
//             component="div"
//             count={packages.length}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={handleChangePage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//           />
//         </Paper>

//         <Modal open={openModal} onClose={handleCloseModal}>
//           <Box
//             sx={{
//               position: 'absolute',
//               top: '50%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)',
//               width: '80%',
//               maxWidth: 600,
//               bgcolor: 'background.paper',
//               boxShadow: 24,
//               p: 4,
//               borderRadius: 2,
//               maxHeight: '90vh',
//               overflowY: 'auto',
//             }}
//           >
//             <Typography variant="h6" gutterBottom>
//               {isEditing ? 'Update Package' : 'Create New Package'}
//             </Typography>
//             <Box component="form" noValidate autoComplete="off">
//               <Grid container spacing={2}>
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Package Name *"
//                     value={newPackage.name}
//                     onChange={(e) => handleInputChange('name', e.target.value)}
//                     error={!!errors.name}
//                     helperText={errors.name}
//                     variant="outlined"
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Description *"
//                     value={newPackage.description}
//                     onChange={(e) => handleInputChange('description', e.target.value)}
//                     error={!!errors.description}
//                     helperText={errors.description}
//                     variant="outlined"
//                     multiline
//                     rows={3}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Price *"
//                     type="number"
//                     value={newPackage.price}
//                     onChange={(e) => handleInputChange('price', e.target.value)}
//                     error={!!errors.price}
//                     helperText={errors.price}
//                     variant="outlined"
//                     InputProps={{ inputProps: { min: 0, step: '0.01' } }}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <FormControl fullWidth variant="outlined" error={!!errors.products}>
//                     <InputLabel>Products *</InputLabel>
//                     <Select
//                       multiple
//                       value={newPackage.products.map((p) => p.productId)}
//                       onChange={handleProductChange}
//                       label="Products *"
//                       renderValue={(selected) => `${selected.length} product(s) selected`}
//                       MenuProps={{
//                         PaperProps: {
//                           style: {
//                             maxHeight: 300,
//                           },
//                         },
//                       }}
//                     >
//                       {products.map((product) => (
//                         <MenuItem key={product._id} value={product._id}>
//                           <Checkbox
//                             checked={newPackage.products.some((p) => p.productId === product._id)}
//                             size="small"
//                           />
//                           <ListItemText primary={product.productName} />
//                         </MenuItem>
//                       ))}
//                     </Select>
//                     {errors.products && (
//                       <Typography color="error" variant="caption">
//                         {errors.products}
//                       </Typography>
//                     )}
//                   </FormControl>
//                 </Grid>

//                 {/* Selected Products Display */}
//                 {newPackage.products.length > 0 && (
//                   <Grid item xs={12}>
//                     <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
//                       Selected Products:
//                     </Typography>
//                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                       {newPackage.products.map((product) => (
//                         <Chip
//                           key={product.productId}
//                           label={product.productName}
//                           onDelete={() => handleDeleteChip(product.productId)}
//                           deleteIcon={<CloseIcon fontSize="small" />}
//                           variant="outlined"
//                           size="small"
//                           sx={{
//                             backgroundColor: '#f0f8ff',
//                             borderColor: '#3182ce',
//                             color: '#3182ce',
//                             '& .MuiChip-deleteIcon': {
//                               color: '#3182ce',
//                               '&:hover': {
//                                 color: '#e53e3e',
//                               },
//                             },
//                           }}
//                         />
//                       ))}
//                     </Box>
//                   </Grid>
//                 )}

//                 {errors.submit && (
//                   <Grid item xs={12}>
//                     <Typography color="error" variant="body2">
//                       {errors.submit}
//                     </Typography>
//                   </Grid>
//                 )}
//                 <Grid item xs={12}>
//                   <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
//                     <Button
//                       variant="outlined"
//                       onClick={handleCloseModal}
//                       sx={{ color: 'text.primary', borderColor: 'text.primary' }}
//                     >
//                       Cancel
//                     </Button>
//                     <Button
//                       variant="contained"
//                       onClick={isEditing ? handleUpdatePackage : handleCreatePackage}
//                       sx={{
//                         color: '#fff',
//                         backgroundColor: '#3182ce',
//                         borderRadius: 2,
//                         fontWeight: 600,
//                         boxShadow: 'none',
//                         '&:hover': {
//                           backgroundColor: '#2954CC',
//                           boxShadow: '0 4px 12px rgba(51, 102, 255, 0.2)',
//                         },
//                       }}
//                     >
//                       {isEditing ? 'Update Package' : 'Create Package'}
//                     </Button>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Box>
//           </Box>
//         </Modal>
//       </Box>
//     </DashboardLayout>
//   )
// }

// export default Package

import React, { useState } from 'react'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import { Box, Tabs, Tab, Typography } from '@mui/material'
import PackageList from './package-list'
import PackageOrder from './package-order'

function Package() {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Package Management
        </Typography>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            mb: 3,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#3182ce',
            },
          }}
        >
          <Tab label="Packages" />
          <Tab label="Package Orders" />
        </Tabs>
        {activeTab === 0 && <PackageList />}
        {activeTab === 1 && <PackageOrder />}
      </Box>
    </DashboardLayout>
  )
}

export default Package
