// import React, { useEffect, useState } from 'react'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   TablePagination,
//   Box,
//   Chip,
//   Modal,
//   Typography,
//   Button,
//   Grid,
// } from '@mui/material'
// import { useAppServices } from 'hook/services'

// function OrderTable() {
//   const AppService = useAppServices()
//   const [orders, setOrders] = useState([])
//   const [page, setPage] = useState(0)
//   const [rowsPerPage, setRowsPerPage] = useState(5)
//   const [modalOpen, setModalOpen] = useState(false)
//   const [selectedOrder, setSelectedOrder] = useState(null)
//   const [packageDetails, setPackageDetails] = useState(null)

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage)
//   }

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10))
//     setPage(0)
//   }

//   const getOrders = async () => {
//     try {
//       const { response } = await AppService.packages.getOrder()
//       if (response && response.data) {
//         setOrders(response.data)
//       }
//     } catch (error) {
//       console.error('Error getting orders', error)
//     }
//   }

//   const getPackageDetails = async (bundleId) => {
//     try {
//       const { response } = await AppService.packages.getByBundleId({
//         query: `bundleId=${bundleId}`,
//       })
//       if (response && response.data) {
//         setPackageDetails(response.data)
//       }
//     } catch (error) {
//       console.error('Error getting package details', error)
//       setPackageDetails(null)
//     }
//   }

//   useEffect(() => {
//     getOrders()
//   }, [])

//   const handleViewOrder = (order) => {
//     setSelectedOrder(order)
//     getPackageDetails(order.bundleId)
//     setModalOpen(true)
//   }

//   const handleCloseModal = () => {
//     setModalOpen(false)
//     setSelectedOrder(null)
//     setPackageDetails(null)
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       <Paper sx={{ width: '100%', overflow: 'hidden', p: 3, mt: 2 }}>
//         <TableContainer>
//           <Table sx={{ minWidth: 650 }} aria-label="order table">
//             <TableHead>
//               <TableRow>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Coupon ID</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Bundle ID</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Agency ID</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Customer Email</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
//                 <TableRow key={order._id}>
//                   <TableCell>{order.couponId}</TableCell>
//                   <TableCell>{order.bundleId}</TableCell>
//                   <TableCell>{order.agencyId || '-'}</TableCell>
//                   <TableCell>{order.customerName || '-'}</TableCell>
//                   <TableCell>{order.customerEmail || '-'}</TableCell>
//                   <TableCell>{new Date(order.createdAt).toDateString()}</TableCell>
//                   <TableCell>
//                     <Button
//                       variant="outlined"
//                       size="small"
//                       onClick={() => handleViewOrder(order)}
//                       sx={{ color: '#3182ce', borderColor: '#3182ce' }}
//                     >
//                       View
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={orders.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Paper>

//       <Modal open={modalOpen} onClose={handleCloseModal}>
//         <Box
//           sx={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             width: '80%',
//             maxWidth: 600,
//             bgcolor: 'background.paper',
//             boxShadow: 24,
//             p: 4,
//             borderRadius: 2,
//             maxHeight: '90vh',
//             overflowY: 'auto',
//           }}
//         >
//           <Typography variant="h6" gutterBottom>
//             Order Details
//           </Typography>
//           {selectedOrder && (
//             <Box>
//               <Grid container spacing={2}>
//                 <Grid item xs={12}>
//                   <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                     Coupon ID: <Typography component="span">{selectedOrder.couponId}</Typography>
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                     Bundle ID: <Typography component="span">{selectedOrder.bundleId}</Typography>
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                     Agency ID:{' '}
//                     <Typography component="span">{selectedOrder.agencyId || '-'}</Typography>
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                     Customer Name:{' '}
//                     <Typography component="span">{selectedOrder.customerName || '-'}</Typography>
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                     Customer Email:{' '}
//                     <Typography component="span">{selectedOrder.customerEmail || '-'}</Typography>
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                     Order Date:{' '}
//                     <Typography component="span">
//                       {new Date(selectedOrder.createdAt).toDateString()}
//                     </Typography>
//                   </Typography>
//                 </Grid>
//                 {packageDetails && (
//                   <>
//                     <Grid item xs={12}>
//                       <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
//                         Package Details
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={12}>
//                       <Typography variant="body2">
//                         <strong>Name:</strong> {packageDetails.name}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={12}>
//                       <Typography variant="body2">
//                         <strong>Description:</strong> {packageDetails.description || '-'}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={12}>
//                       <Typography variant="body2">
//                         <strong>Price:</strong> ${packageDetails.price}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={12}>
//                       <Typography variant="body2">
//                         <strong>Reselling Price:</strong>{' '}
//                         {packageDetails.resellingPrice ? `$${packageDetails.resellingPrice}` : '-'}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={12}>
//                       <Typography variant="body2">
//                         <strong>Agency Only:</strong> {packageDetails.agencyOnly ? 'Yes' : 'No'}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={12}>
//                       <Typography variant="body2">
//                         <strong>Status:</strong> {packageDetails.status}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={12}>
//                       <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>
//                         Products:
//                       </Typography>
//                       {packageDetails.products.map((product) => (
//                         <Box key={product.productId} sx={{ ml: 2, mt: 1 }}>
//                           <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
//                             {product.productName}
//                           </Typography>
//                           {product.variants.map((variant) => (
//                             <Typography
//                               key={variant.variantId}
//                               variant="caption"
//                               sx={{ ml: 2, display: 'block' }}
//                             >
//                               {variant.title} (Qty: {variant.quantity}, Price: ${variant.unitPrice}
//                               {variant.resellingPrice ? `, Resell: $${variant.resellingPrice}` : ''}
//                               )
//                             </Typography>
//                           ))}
//                         </Box>
//                       ))}
//                     </Grid>
//                   </>
//                 )}
//                 <Grid item xs={12}>
//                   <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
//                     <Button
//                       variant="outlined"
//                       onClick={handleCloseModal}
//                       sx={{ color: '#3182ce', borderColor: '#3182ce' }}
//                     >
//                       Close
//                     </Button>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Box>
//           )}
//         </Box>
//       </Modal>
//     </Box>
//   )
// }

// export default OrderTable

import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  Modal,
  Typography,
  Button,
  Grid,
} from '@mui/material'
import { useAppServices } from 'hook/services'

function OrderTable() {
  const AppService = useAppServices()
  const [orders, setOrders] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [modalOpen, setModalOpen] = useState(false)
  const [orderDetails, setOrderDetails] = useState(null)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const getOrders = async () => {
    try {
      const { response } = await AppService.packages.getOrder()
      if (response && response.data) {
        setOrders(response.data)
      }
    } catch (error) {
      console.error('Error getting orders', error)
    }
  }

  const getOrderDetails = async (orderId) => {
    try {
      const { response } = await AppService.packages.getOrderDetails({ query: `_id=${orderId}` })
      if (response && response.data) {
        setOrderDetails(response.data)
      } else {
        setOrderDetails(null)
      }
    } catch (error) {
      console.error('Error getting order details', error)
      setOrderDetails(null)
    }
  }

  useEffect(() => {
    getOrders()
  }, [])

  const handleViewOrder = (order) => {
    getOrderDetails(order._id)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setOrderDetails(null)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ width: '100%', overflow: 'hidden', p: 3, mt: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="order table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Coupon ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Bundle ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Agency ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Customer Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.couponId}</TableCell>
                  <TableCell>{order.bundleId}</TableCell>
                  <TableCell>{order.agencyId || '-'}</TableCell>
                  <TableCell>{order.customerName || '-'}</TableCell>
                  <TableCell>{order.customerEmail || '-'}</TableCell>
                  <TableCell>{new Date(order.createdAt).toDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewOrder(order)}
                      sx={{ color: '#3182ce', borderColor: '#3182ce' }}
                    >
                      View
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
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Modal open={modalOpen} onClose={handleCloseModal}>
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
          <Typography variant="h6" gutterBottom>
            Order Details
          </Typography>
          {orderDetails ? (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Coupon ID:{' '}
                    <Typography component="span">{orderDetails.order.couponId}</Typography>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Bundle ID:{' '}
                    <Typography component="span">{orderDetails.order.bundleId}</Typography>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Agency ID:{' '}
                    <Typography component="span">{orderDetails.order.agencyId || '-'}</Typography>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Customer Name:{' '}
                    <Typography component="span">
                      {orderDetails.order.customerName || '-'}
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Customer Email:{' '}
                    <Typography component="span">
                      {orderDetails.order.customerEmail || '-'}
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Order Date:{' '}
                    <Typography component="span">
                      {new Date(orderDetails.order.createdAt).toDateString()}
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
                    Package Details
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Name:</strong> {orderDetails.package.name}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Description:</strong> {orderDetails.package.description || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Price:</strong> ${orderDetails.package.price}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Reselling Price:</strong>{' '}
                    {orderDetails.package.resellingPrice
                      ? `$${orderDetails.package.resellingPrice}`
                      : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Agency Only:</strong> {orderDetails.package.agencyOnly ? 'Yes' : 'No'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Status:</strong> {orderDetails.package.status}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2 }}>
                    Products:
                  </Typography>
                  {orderDetails.package.products.map((product) => (
                    <Box key={product.productId} sx={{ ml: 2, mt: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {product.productName}
                      </Typography>
                      {product.variants.map((variant) => (
                        <Typography
                          key={variant.variantId}
                          variant="caption"
                          sx={{ ml: 2, display: 'block' }}
                        >
                          {variant.title} (Qty: {variant.quantity}, Price: ${variant.unitPrice}
                          {variant.resellingPrice ? `, Resell: $${variant.resellingPrice}` : ''})
                        </Typography>
                      ))}
                    </Box>
                  ))}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
                    NFC Cards ({orderDetails.nfcCards.length})
                  </Typography>
                  {orderDetails.nfcCards.map((card) => (
                    <Box
                      key={card.code}
                      sx={{ ml: 2, mt: 1, border: '1px solid #e0e0e0', p: 1, borderRadius: 1 }}
                    >
                      <Typography variant="body2">
                        <strong>Code:</strong> {card.code}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Product:</strong> {card.productName}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Variant:</strong> {card.variantTitle} (Qty: {card.variantQuantity},
                        Price: ${card.variantUnitPrice}
                        {card.variantResellingPrice
                          ? `, Resell: $${card.variantResellingPrice}`
                          : ''}
                        )
                      </Typography>
                      <Typography variant="body2">
                        <strong>URL:</strong> {card.url}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Domain:</strong> {card.domain}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Locked:</strong> {card.islock ? 'Yes' : 'No'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Created:</strong> {new Date(card.createdAt).toDateString()}
                      </Typography>
                    </Box>
                  ))}
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button
                      variant="outlined"
                      onClick={handleCloseModal}
                      sx={{ color: '#3182ce', borderColor: '#3182ce' }}
                    >
                      Close
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Typography variant="body1">Loading order details...</Typography>
          )}
        </Box>
      </Modal>
    </Box>
  )
  // )
}

export default OrderTable
