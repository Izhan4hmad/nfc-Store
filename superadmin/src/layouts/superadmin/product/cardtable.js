import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Tooltip,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function NfcCardTable({ cards }) {
  const navigate = useNavigate()

  // State for pagination
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // State for domain filter
  const [selectedDomain, setSelectedDomain] = useState('all') // 'all' for no filter

  // Get unique domains from cards
  const uniqueDomains = [...new Set(cards.map((card) => card.domain))].sort()

  // Filter cards based on selected domain
  const filteredCards =
    selectedDomain === 'all' ? cards : cards.filter((card) => card.domain === selectedDomain)

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0) // Reset to first page
  }

  // Handle domain filter change
  const handleDomainChange = (event) => {
    setSelectedDomain(event.target.value)
    setPage(0) // Reset to first page when domain changes
  }

  // Calculate paginated data
  const paginatedCards = filteredCards.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const handleView = (card) => {
    console.log('Navigating with card:', card)
    navigate(`./view/${card.code}`, { state: { card } })
  }

  const handleRedirect = (carddomain, cardId) => {
    window.open(
      `${carddomain?.includes('http') ? carddomain : 'https://' + carddomain}/${cardId}`,
      '_blank'
    )
    console.log('carddomain', `${carddomain}/${cardId}`)
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
      }}
    >
      {/* Domain Filter */}
      <FormControl sx={{ m: 2, minWidth: 200 }} size="small">
        <InputLabel id="domain-filter-label">Filter by Domain</InputLabel>
        <Select
          labelId="domain-filter-label"
          id="domain-filter"
          value={selectedDomain}
          label="Filter by Domain"
          onChange={handleDomainChange}
        >
          <MenuItem value="all">All Domains</MenuItem>
          {uniqueDomains.map((domain) => (
            <MenuItem key={domain} value={domain}>
              {domain}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Table sx={{ minWidth: 700 }}>
        <TableHead
          sx={{
            bgcolor: '#0288d1',
            '& th': { color: 'white', fontWeight: 'bold', py: 1.5 },
          }}
        >
          <TableRow>
            <TableCell>
              <Typography variant="subtitle1">Code</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1">Passcode</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1">URL</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1">Domain</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1">Locked</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1">Created At</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1">Action</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1">Redirect</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedCards.length > 0 ? (
            paginatedCards.map((card) => (
              <TableRow
                key={card._id}
                sx={{
                  '&:hover': { bgcolor: '#f5f5f5' },
                  '& td': {
                    py: 1.5,
                    borderBottom: '1px solid #e0e0e0',
                    verticalAlign: 'middle',
                  },
                }}
              >
                <TableCell>
                  <Typography variant="body1" sx={{ color: '#424242' }}>
                    {card.code}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" sx={{ color: '#424242' }}>
                    {card.passcode}
                  </Typography>
                </TableCell>
                <TableCell sx={{ maxWidth: 150 }}>
                  <Tooltip title={card.url} arrow>
                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: '#424242',
                      }}
                    >
                      {card.url}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ maxWidth: 150 }}>
                  <Tooltip title={card.domain} arrow>
                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: '#424242',
                      }}
                    >
                      {card.domain}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" sx={{ color: '#424242' }}>
                    {card.islock ? 'Yes' : 'No'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" sx={{ color: '#424242' }}>
                    {new Date(card.createdAt).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleView(card)}
                    sx={{
                      textTransform: 'none',
                      bgcolor: '#0288d1',
                      color: '#fff',
                      '&:hover': { bgcolor: '#0277bd' },
                      boxShadow: 'none',
                    }}
                  >
                    View
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleRedirect(card.domain, card.code)}
                    sx={{
                      textTransform: 'none',
                      bgcolor: '#0288d1',
                      color: '#fff',
                      '&:hover': { bgcolor: '#0277bd' },
                      boxShadow: 'none',
                    }}
                  >
                    Redirect
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <Typography variant="body1" color="text.secondary">
                  No NFC cards found for this domain.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredCards.length} // Use filtered data length
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            color: '#424242',
          },
          '.MuiTablePagination-actions button': {
            color: '#0288d1',
          },
        }}
      />
    </TableContainer>
  )
}

export default NfcCardTable
