import React from 'react'
import { useMaterialUIController } from 'context'
import { useState } from 'react'
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import MDInput from 'components/MDInput'
import { IconButton, Switch, Grid } from '@mui/material'
import LinearGradiant from './LinearGradiant'
import Collapse from '@mui/material/Collapse'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
const Body = (props) => {
  const [controller, dispatch] = useMaterialUIController()
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller
  const [handletext, sethandletext] = useState('defeult')
  const [colorvalue, setcolorvalue] = useState(
    getComputedStyle(document.documentElement).getPropertyValue('--ThemeBackground')
  )
  const [open, setOpen] = useState({
    bodyBg: true,
  })
  const SidenavColors = ['primary', 'dark', 'info', 'success', 'warning', 'error']
  const handleChange = ({ key, value }) => {
    props.handleChange({ value: value, key: key })
  }
  const handleClick = (e) => {
    var name = e
    const statedata = {
      bodyBg: () => {
        setOpen({ bodyBg: !open.bodyBg })
      },
    }
    statedata[name]()
  }
  return (
    <>
      <MDBox>
        <MDBox
          mt={1}
          onClick={(e) => handleClick('bodyBg')}
          sx={{ cursor: 'pointer', width: '100%' }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          lineHeight={1}
        >
          <MDTypography variant="h6">Body Background Color</MDTypography>

          {open.bodyBg ? (
            <ExpandLess style={{ color: 'black', fontWeight: '200', fontSize: '15px' }} />
          ) : (
            <ExpandMore style={{ color: 'black', fontWeight: '200', fontSize: '15px' }} />
          )}
        </MDBox>
        <Collapse in={open.bodyBg} timeout="auto" unmountOnExit style={{ width: '100%' }}>
          <Grid container mt={3} sx={{ border: '1px solid #dfe1e6', background: 'white' }} p={2}>
            <Grid item xs={12}>
              <LinearGradiant
                handleChange={handleChange}
                type={'ThemeBackground'}
                color={colorvalue}
              />
            </Grid>
          </Grid>{' '}
        </Collapse>
      </MDBox>
    </>
  )
}

export default Body
