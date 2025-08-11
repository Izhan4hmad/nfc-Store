import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import { Button, Typography, Box } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'

function NfcCardView() {
  const location = useLocation()
  const card = location.state?.card

  console.log('Card Details:', card)

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {card ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            minHeight: 'calc(100vh - 64px)', // Adjust for navbar height
            padding: '20px',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {/* QR Code Container - Left Corner */}
          <div style={{ position: 'relative' }}>
            {/* QR Code */}
            <QRCodeSVG
              value={card.url || 'https://example.com'}
              size={200}
              level="H"
              includeMargin={true}
              style={{ display: 'block' }}
            />
            {/* Corner Markers */}
            <div
              style={{
                position: 'absolute',
                top: -10,
                left: -10,
                width: 30,
                height: 30,
                borderTop: '4px solid #ff6f61', // Coral color for top-left corner
                borderLeft: '4px solid #ff6f61',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: -10,
                right: -10,
                width: 30,
                height: 30,
                borderTop: '4px solid #ff6f61',
                borderRight: '4px solid #ff6f61',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: -10,
                left: -10,
                width: 30,
                height: 30,
                borderBottom: '4px solid #ff6f61',
                borderLeft: '4px solid #ff6f61',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: -10,
                right: -10,
                width: 30,
                height: 30,
                borderBottom: '4px solid #ff6f61',
                borderRight: '4px solid #ff6f61',
              }}
            />
            {/* Label Below QR Code */}
            <Typography
              variant="body2"
              style={{
                marginTop: '10px',
                textAlign: 'center',
                color: '#000000',
                fontWeight: 500,
              }}
            >
              Scan to view
            </Typography>
          </div>

          {/* Associate Product Button - Right Corner */}
          <Button
            variant="contained"
            size="large"
            style={{
              backgroundColor: '#1976d2',
              color: '#ffffff',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1.1rem',
              padding: '10px 20px',
              borderRadius: '8px',
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#1565c0'
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#1976d2'
            }}
          >
            Associate Product
          </Button>
        </div>
      ) : (
        <Typography
          variant="h6"
          style={{
            color: '#d32f2f',
            textAlign: 'center',
            padding: '20px',
          }}
        >
          No card data available
        </Typography>
      )}
    </DashboardLayout>
  )
}

export default NfcCardView
