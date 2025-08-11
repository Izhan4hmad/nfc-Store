import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import PageLayout from 'examples/LayoutContainers/PageLayout'
import { useLogout } from 'hook/auth'
import { useAppServices } from 'hook/services'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function Redirect() {
  const logout = useLogout()
  const { nfcbusinessCard } = useAppServices()
  const { cardId } = useParams()

  const [cards, setCards] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCard = async () => {
      try {
        if (!cardId) {
          setError('Card ID is missing.')
          return
        }

        const { response } = await nfcbusinessCard.getbycardId({ query: `cardId=${cardId}` })
        console.log('response321', response)

        if (response?.success) {
          if (response.data?.url) {
            console.log('response4321', response.data.url)
            window.open(response.data.url, '_blank')
            return
          } else {
            setError('No URL found in response.')
          }
        } else {
          setError('Failed to fetch NFC cards.')
        }
      } catch (err) {
        console.error('Error fetching card:', err)
        setError('An error occurred while fetching the card.')
      }
    }

    fetchCard()
  }, []) // Empty dependency array ensures it runs only once on mount

  return (
    <PageLayout>
      <MDBox pt={6} pb={3}>
        <MDBox
          mx={2}
          py={3}
          px={2}
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <MDTypography variant="h6" color="white">
            Redirect
          </MDTypography>
        </MDBox>
        {error && (
          <MDBox mx={2} mt={2}>
            <MDTypography variant="body2" color="error">
              {error}
            </MDTypography>
          </MDBox>
        )}
      </MDBox>
    </PageLayout>
  )
}

export default Redirect
