import React from 'react'
import { useState } from 'react'
import MDBox from 'components/MDBox'
import MDInput from 'components/MDInput'
import MDButton from 'components/MDButton'
import MDTypography from 'components/MDTypography'
import { useMaterialUIController } from 'context'
import { Grid } from '@mui/material'
import { IconButton, Switch } from '@mui/material'
import LinearGradiant from './LinearGradiant'
import Collapse from '@mui/material/Collapse'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
const Sidnav = (props) => {
  const [controller, dispatch] = useMaterialUIController()
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller
  const [handleswitch, sethandleswitch] = useState('defeult')
  const [handletext, sethandletext] = useState('defeult')
  const [handlesidnavtype, sethandlesidnavtype] = useState('defeult')
  const [sidnavColorValue, setsidnavColorValue] = useState(
    getComputedStyle(document.documentElement).getPropertyValue('')
  )
  const [open, setOpen] = useState({
    listGridView: false,
    sidnavcolors: false,
    fontstyle: false,
    sidnavtype: true,
    defeult_settings: false,
  })
  const [categriesdropdown, setCategrdesDropdown] = useState(false)
  const FontStyle = [
    { title: 'Arial', year: 'Arial' },
    { title: 'Helvetica', year: 'Helvetica' },
    { title: 'Verdana', year: 'Verdana' },
    { title: 'Calibri', year: 'Calibri' },
    { title: 'Noto', year: 'Noto' },
    { title: 'Lucida Sans', year: 'Lucida Sans' },
    { title: 'Gill Sans', year: 'Gill Sans' },
    { title: 'Century Gothic', year: 'Century Gothic' },
    { title: 'Franklin Gothic Medium', year: 'Franklin Gothic Medium' },
    { title: 'Trebuchet MS', year: 'Trebuchet MS' },
    { title: 'Consolas', year: 'Consolas' },
    { title: 'Lucida Console', year: 'Lucida Console' },
    { title: 'Comic Sans MS', year: 'Comic Sans MS' },
    { title: 'Impact', year: 'Impact' },
    { title: 'Jazz LET', year: 'Jazz LET' },
    { title: 'Abadi MT Condensed Light', year: 'Abadi MT Condensed Light' },
    { title: 'Arial Black', year: 'Arial Black' },
    { title: 'Bahnschrift SemiBold', year: 'Bahnschrift SemiBold' },
    { title: 'Bahnschrift', year: 'Bahnschrift' },
    { title: 'BIZ UDGothic', year: 'BIZ UDGothic' },
    { title: 'Comic Sans MS', year: 'Comic Sans MS' },
    { title: 'Courier', year: 'Courier' },
    { title: 'Courier New', year: 'Courier New' },
    { title: 'DFKai-SB', year: 'DFKai-SB' },
    { title: 'Franklin Gothic Medium', year: 'Franklin Gothic Medium' },
    { title: 'Gabriola', year: 'Gabriola' },
    { title: 'Gadugi', year: 'Gadugi' },
    { title: 'Ink Free', year: 'Ink Free' },
    { title: 'Lucida Console', year: 'Lucida Console' },
    { title: 'Marlett', year: 'Marlett' },
    { title: 'Microsoft Himalaya', year: 'Microsoft Himalaya' },
    { title: 'Microsoft Sans Serif', year: 'Microsoft Sans Serif' },
    { title: 'Microsoft YaHei', year: 'Microsoft YaHei' },
    { title: 'MingLiU_HKSCS-ExtB', year: 'MingLiU_HKSCS-ExtB' },
    { title: 'MS Gothic', year: 'MS Gothic' },
    { title: 'MV Boli', year: 'MV Boli' },
    { title: 'NSimSun', year: 'NSimSun' },
    { title: 'Segoe Print', year: 'Segoe Print' },
    { title: 'Segoe Script', year: 'Segoe Script' },
    { title: 'SimSun', year: 'SimSun' },
    { title: 'Symbol', year: 'Symbol' },
    { title: 'Arial', year: 'Arial' },
  ]
  const handleChange = ({ key, value }) => {
    document.documentElement.style.setProperty(`--${key}`, value)
    props.handleChange({ value: value, key: key })
  }
  React.useEffect(async () => {
    //    sidnavColorValue= getComputedStyle(document.documentElement).getPropertyValue('--sideNavType')
    //    cardValue= getComputedStyle(document.documentElement).getPropertyValue('--sideNavCard')
    // alert(sidnavColorValue)
  }, [])
  const handleClick = (e) => {
    var name = e
    const statedata = {
      listGridView: () => {
        setOpen({ listGridView: !open.listGridView })
      },
      sidnavcolors: () => {
        setOpen({ sidnavcolors: !open.sidnavcolors })
      },
      sidnavtype: () => {
        setOpen({ sidnavtype: !open.sidnavtype })
      },
      fontstyle: () => {
        setOpen({ fontstyle: !open.fontstyle })
      },
      defeult_settings: () => {
        setOpen({ defeult_settings: !open.defeult_settings })
      },
    }
    statedata[name]()
  }
  const SidenavColors = ['primary', 'dark', 'info', 'success', 'warning', 'error']
  const sidenavTypeButtonsStyles = ({
    functions: { pxToRem },
    palette: { white, dark, background },
    borders: { borderWidth },
  }) => ({
    height: pxToRem(39),
    background: darkMode ? background.sidenav : white.main,
    color: darkMode ? white.main : dark.main,
    border: `${borderWidth[1]} solid ${darkMode ? white.main : dark.main}`,

    '&:hover, &:focus, &:focus:not(:hover)': {
      background: darkMode ? background.sidenav : white.main,
      color: darkMode ? white.main : dark.main,
      border: `${borderWidth[1]} solid ${darkMode ? white.main : dark.main}`,
    },
  })

  // sidenav type active button styles
  const sidenavTypeActiveButtonStyles = ({
    functions: { pxToRem, linearGradient },
    palette: { white, gradients, background },
  }) => ({
    height: pxToRem(39),
    background: darkMode ? white.main : linearGradient(gradients.dark.main, gradients.dark.state),
    color: darkMode ? background.sidenav : white.main,

    '&:hover, &:focus, &:focus:not(:hover)': {
      background: darkMode ? white.main : linearGradient(gradients.dark.main, gradients.dark.state),
      color: darkMode ? background.sidenav : white.main,
    },
  })
  return (
    <>
      <MDBox>
        <MDBox
          mt={1}
          onClick={(e) => handleClick('listGridView')}
          sx={{ cursor: 'pointer', width: '100%' }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          lineHeight={1}
        >
          <MDTypography variant="h6">Sidnav Text Color</MDTypography>

          {open.listGridView ? (
            <ExpandLess style={{ color: 'black', fontWeight: '200', fontSize: '15px' }} />
          ) : (
            <ExpandMore style={{ color: 'black', fontWeight: '200', fontSize: '15px' }} />
          )}
        </MDBox>
        <Collapse in={open.listGridView} timeout="auto" unmountOnExit style={{ width: '100%' }}>
          <MDBox>
            <MDBox
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              lineHeight={1}
              mt={1}
            >
              <MDInput
                type="color"
                label="Custom Text Color"
                name="sidenav_custom_text_color"
                fullWidth
                className="color-input"
                // sx={{paddingLeft:"90%"}}
                onChange={(e) => handleChange({ value: e.target.value, key: 'sideNavText' })}
              />
            </MDBox>
          </MDBox>
        </Collapse>
      </MDBox>
      <MDBox mt={2}>
        <MDBox
          mt={1}
          onClick={(e) => handleClick('sidnavcolors')}
          sx={{ cursor: 'pointer', width: '100%' }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          lineHeight={1}
        >
          <MDTypography variant="h6">Sidenav Colors</MDTypography>

          {open.sidnavcolors ? (
            <ExpandLess style={{ color: 'black', fontWeight: '200', fontSize: '15px' }} />
          ) : (
            <ExpandMore style={{ color: 'black', fontWeight: '200', fontSize: '15px' }} />
          )}
        </MDBox>
        <Collapse in={open.sidnavcolors} timeout="auto" unmountOnExit style={{ width: '100%' }}>
          <MDBox>
            <MDBox
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              lineHeight={1}
              mt={1}
            >
              <MDInput
                type="color"
                label="Custom Text Color"
                name="sidenav_custom_text_color"
                fullWidth
                className="color-input"
                // sx={{paddingLeft:"90%"}}
                onChange={(e) => handleChange({ value: e.target.value, key: 'sideNavColor' })}
              />
            </MDBox>
          </MDBox>
        </Collapse>
      </MDBox>
      <MDBox mt={2}>
        <MDBox
          mt={1}
          onClick={(e) => handleClick('sidnavtype')}
          sx={{ cursor: 'pointer', width: '100%' }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          lineHeight={1}
        >
          <MDTypography variant="h6">Sidenav Type</MDTypography>

          {open.sidnavtype ? (
            <ExpandLess style={{ color: 'black', fontWeight: '200', fontSize: '15px' }} />
          ) : (
            <ExpandMore style={{ color: 'black', fontWeight: '200', fontSize: '15px' }} />
          )}
        </MDBox>
        <Collapse in={open.sidnavtype} timeout="auto" unmountOnExit style={{ width: '100%' }}>
          {handlesidnavtype == 'defeult' ? (
            <>
              <MDBox
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                lineHeight={1}
              >
                <div>
                  <MDTypography variant="button" color="text">
                    Choose between different sidenav types.
                  </MDTypography>
                </div>
                <Switch onClick={(e) => sethandlesidnavtype('custom')} />
              </MDBox>

              <MDBox
                sx={{
                  display: 'flex',
                  mt: 2,
                  mr: 1,
                }}
              >
                <MDButton
                  color="dark"
                  variant="gradient"
                  onClick={() => handleChange({ value: 'dark', key: 'ThemesidnavBg' })}
                  // disabled={disabled}
                  fullWidth
                  sx={sidenavTypeButtonsStyles}
                >
                  Dark
                </MDButton>
                <MDBox sx={{ mx: 1, width: '8rem', minWidth: '8rem' }}>
                  <MDButton
                    color="dark"
                    variant="gradient"
                    onClick={() => handleChange({ value: 'transparent', key: 'ThemesidnavBg' })}
                    // disabled={disabled}
                    fullWidth
                    sx={sidenavTypeButtonsStyles}
                  >
                    Transparent
                  </MDButton>
                </MDBox>
                <MDButton
                  color="dark"
                  variant="gradient"
                  onClick={() => handleChange({ value: 'white', key: 'ThemesidnavBg' })}
                  // disabled={disabled}
                  fullWidth
                  sx={sidenavTypeButtonsStyles}
                >
                  White
                </MDButton>
              </MDBox>
            </>
          ) : (
            <>
              <MDBox
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                lineHeight={1}
              >
                <MDTypography variant="button" color="text">
                  Choose between different sidenav types.
                </MDTypography>
                <Switch onClick={(e) => sethandlesidnavtype('defeult')} />
              </MDBox>
              <MDBox>
                <Grid
                  container
                  mt={3}
                  sx={{ border: '1px solid #dfe1e6', background: 'white' }}
                  p={2}
                >
                  {
                    <Grid item xs={12}>
                      <LinearGradiant
                        handleChange={handleChange}
                        type={'ThemesidnavBg'}
                        color={sidnavColorValue}
                      />
                    </Grid>
                  }
                </Grid>
              </MDBox>
            </>
          )}
        </Collapse>
      </MDBox>
      <MDBox mt={2}>
        <MDBox
          mt={1}
          onClick={(e) => handleClick('fontstyle')}
          sx={{ cursor: 'pointer', width: '100%' }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          lineHeight={1}
        >
          <MDTypography variant="h6">Sidnav Font Style </MDTypography>

          {open.fontstyle ? (
            <ExpandLess style={{ color: 'black', fontWeight: '200', fontSize: '15px' }} />
          ) : (
            <ExpandMore style={{ color: 'black', fontWeight: '200', fontSize: '15px' }} />
          )}
        </MDBox>
        <Collapse in={open.fontstyle} timeout="auto" unmountOnExit style={{ width: '100%' }}>
          <select
            name=""
            id=""
            className="form-control"
            onChange={(e) => handleChange({ value: e.target.value, key: 'sidnavFontFamily' })}
          >
            {FontStyle.map((FontStyle, key) => (
              <option value={FontStyle.year}>{FontStyle.title}</option>
            ))}
          </select>
        </Collapse>
      </MDBox>
      <MDBox
        sx={{ marginTop: 3 }}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        lineHeight={1}
      >
        <MDTypography variant="h6">Show Categries in Dropdown</MDTypography>

        <input
          type="checkbox"
          style={{ width: '19px', height: '19px', marginRight: '11px' }}
          onChange={(e) => handleChange({ value: e.target.checked, key: 'CategriesDropdown' })}
        />
      </MDBox>
    </>
  )
}

export default Sidnav
