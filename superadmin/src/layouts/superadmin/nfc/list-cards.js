import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import { useState, useEffect } from 'react'
import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  Grid,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
} from '@mui/material'
import { useAppServices } from 'hook/services'
import NfcCardTable from './cardtable'

function NfcBusiness() {
  const [open, setOpen] = useState(false)
  const [numberOfIds, setNumberOfIds] = useState('')
  const [passcode, setPasscode] = useState('')
  const [domain, setDomain] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [cards, setCards] = useState([])

  const AppService = useAppServices()

  const fetchCards = async () => {
    try {
      const { response } = await AppService.nfcbusinessCard.get()
      if (response?.success) {
        setCards(response.data || [])
      } else {
        setError('Failed to fetch NFC cards.')
      }
    } catch (err) {
      setError('An error occurred while fetching cards.')
      console.error(err)
    }
  }

  useEffect(() => {
    fetchCards()
  }, [])

  const handleOpen = () => {
    setOpen(true)
    setError('')
    setSuccess('')
  }

  const handleClose = () => {
    setOpen(false)
    setNumberOfIds('')
    setPasscode('')
    setDomain('')
    setError('')
    setSuccess('')
  }

  const handleSave = async () => {
    setProcessing(true)
    setError('')
    setSuccess('')

    const numIds = parseInt(numberOfIds, 10)
    if (isNaN(numIds) || numIds <= 0) {
      setError('Please enter a valid number of IDs.')
      setProcessing(false)
      return
    }

    if (!passcode.trim()) {
      setError('Please enter a valid passcode.')
      setProcessing(false)
      return
    }

    if (!domain.trim()) {
      setError('Please enter a valid domain.')
      setProcessing(false)
      return
    }

    try {
      const basePayload = {
        passcode: passcode.trim(),
        url: 'https://example.com',
        domain: domain.trim(),
        islock: false,
      }

      const promises = []
      for (let i = 0; i < numIds; i++) {
        promises.push(
          AppService.nfcbusinessCard.create({
            payload: basePayload,
          })
        )
      }

      const responses = await Promise.all(promises)

      const allSuccessful = responses.every((res) => res.response?.success)
      if (allSuccessful) {
        setSuccess(`Successfully created ${numIds} NFC card(s)!`)
        handleClose()
        await fetchCards()
      } else {
        setError('Some cards could not be created. Please try again.')
      }
    } catch (err) {
      setError('An error occurred while creating cards. Please try again.')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const downloadCSV = () => {
    if (cards.length === 0) {
      setError('No data available to download.')
      return
    }

    // Define the CSV headers
    const headers = ['Code', 'Passcode', 'URL', 'Domain', 'Locked', 'Created At']

    // Map the cards data to CSV rows
    const rows = cards.map((card) => [
      card.code,
      card.passcode,
      card.domain?.includes('http')
        ? card.domain + '/' + card.code
        : 'https://' + card.domain + '/' + card.code,
      card.domain,
      card.islock ? 'Yes' : 'No',
      new Date(card.createdAt).toLocaleDateString(),
    ])

    // Combine headers and rows
    const csvContent = [
      headers.join(','), // Header row
      ...rows.map((row) => row.join(',')),
    ].join('\n')

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)

    // Create a temporary link to trigger the download
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `nfc_cards_${new Date().toISOString()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Grid container justifyContent="flex-end" sx={{ px: 3, mt: 2, gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={downloadCSV}
          sx={{
            color: '#fff',
            bgcolor: '#0288d1',
            '&:hover': { bgcolor: '#0277bd' },
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
          disabled={processing}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            style={{ width: '20px', height: '20px' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
          Download CSV
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          sx={{ color: '#fff' }}
          disabled={processing}
        >
          Create
        </Button>
      </Grid>

      <Grid container sx={{ mt: 4 }}>
        <NfcCardTable cards={cards} />
      </Grid>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            Create NFC Cards
          </Typography>
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            type="number"
            fullWidth
            label="Number of IDs"
            value={numberOfIds}
            onChange={(e) => setNumberOfIds(e.target.value)}
            margin="normal"
            disabled={processing}
          />
          <TextField
            type="text"
            fullWidth
            label="Passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            margin="normal"
            disabled={processing}
          />
          <Select
            fullWidth
            label="Domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            margin="normal"
            disabled={processing}
          >
            <MenuItem value="tap-this.link">tap-this.link</MenuItem>
            <MenuItem value="click-my.link">click-my.link</MenuItem>
            <MenuItem value="tap-my.link">tap-my.link</MenuItem>
          </Select>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={processing || !numberOfIds || !passcode.trim() || !domain.trim()}
            sx={{ color: '#fff' }}
            fullWidth
          >
            {processing ? <CircularProgress size={24} color="inherit" /> : 'Save'}
          </Button>
        </Box>
      </Modal>
    </DashboardLayout>
  )
}

export default NfcBusiness
