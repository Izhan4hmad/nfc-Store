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
import BoxShadows from './BoxShadows'
import Collapse from '@mui/material/Collapse'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
const Card = (props) => {
  const [controller, dispatch] = useMaterialUIController()
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller
  const [customcards, setcustomcards] = useState('defeult')
  const [bodyText, setbodyText] = useState('defeult')
  const [PurchaseBtn, setPurchaseBtn] = useState('defeult')
  const [SnapshotBtn, setSnapshotBtn] = useState('defeult')
  const [bodyHeadings, setbodyHeadings] = useState('defeult')
  const [handletext, sethandletext] = useState('defeult')
  const [cardsshadow, setcardsshadow] = useState('defeult')
  const [customcardsBg, setcustomcardsBg] = useState('defeult')
  const [open, setOpen] = useState({
    titlecolor: false,
    bodyheading: false,
    snapshotbtn: false,
    purchasebtn: false,
    bodytext: false,
    fontstyle: false,
  })
  const [cardValue, setcardValue] = useState(
    getComputedStyle(document.documentElement).getPropertyValue('--sideNavCard')
  )
  const handleChange = ({ key, value }) => {
    document.documentElement.style.setProperty(`--${key}`, value)
    props.handleChange({ value: value, key: key })
  }
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
  const handleClick = (e) => {
    var name = e
    const statedata = {
      titlecolor: () => {
        setOpen({ titlecolor: !open.titlecolor })
      },
      purchasebtn: () => {
        setOpen({ purchasebtn: !open.purchasebtn })
      },
      bodytext: () => {
        setOpen({ bodytext: !open.bodytext })
      },
      snapshotbtn: () => {
        setOpen({ snapshotbtn: !open.snapshotbtn })
      },
      bodyheading: () => {
        setOpen({ bodyheading: !open.bodyheading })
      },
      fontstyle: () => {
        setOpen({ fontstyle: !open.fontstyle })
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

  return (
    <>
      <MDBox>
        <MDBox
          mt={1}
          onClick={(e) => handleClick('titlecolor')}
          sx={{ cursor: 'pointer', width: '100%' }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          lineHeight={1}
        >
          <MDTypography variant="h6">Image Card title Colors</MDTypography>

          {open.titlecolor ? (
            <ExpandLess style={{ color: 'black', fontWeight: '200', fontSize: '15px' }} />
          ) : (
            <ExpandMore style={{ color: 'black', fontWeight: '200', fontSize: '15px' }} />
          )}
        </MDBox>
        <Collapse in={open.titlecolor} timeout="auto" unmountOnExit style={{ width: '100%' }}>
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
                onChange={(e) => handleChange({ value: e.target.value, key: 'cardsTitle' })}
              />
            </MDBox>
          </MDBox>{' '}
        </Collapse>
      </MDBox>
      <MDBox mt={2}>
        <MDBox
          mt={1}
          onClick={(e) => handleClick('bodyheading')}
          sx={{ cursor: 'pointer', width: '100%' }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          lineHeight={1}
        >
          <MDTypography variant="h6">Image Card body Headings Color</MDTypography>

          {open.bodyheading ? (
            <ExpandLess style={{ color: 'black', fontWeight: '200', fontSize: '15px' }} />
          ) : (
            <ExpandMore style={{ color: 'black', fontWeight: '200', fontSize: '15px' }} />
          )}
        </MDBox>
        <Collapse in={open.bodyheading} timeout="auto" unmountOnExit style={{ width: '100%' }}>
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
                onChange={(e) => handleChange({ value: e.target.value, key: 'cardsBodyHeading' })}
              />
            </MDBox>
          </MDBox>
        </Collapse>
      </MDBox>
      <MDBox mt={2}>
        <MDBox
          mt={1}
          onClick={(e) => handleClick('bodytext')}
          sx={{ cursor: 'pointer', width: '100%' }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          lineHeight={1}
        >
          <MDTypography variant="h6">Image Card body Text Color</MDTypography>

          {open.bodytext ? (
            <ExpandLess style={{ color: 'black', fontWeight: '200', fontSize: '15px' }} />
          ) : (
            <ExpandMore style={{ color: 'black', fontWeight: '200', fontSize: '15px' }} />
          )}
        </MDBox>
        <Collapse in={open.bodytext} timeout="auto" unmountOnExit style={{ width: '100%' }}>
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
                onChange={(e) => handleChange({ value: e.target.value, key: 'cardsBodyText' })}
              />
            </MDBox>
          </MDBox>{' '}
        </Collapse>
      </MDBox>
      <MDBox mt={2}>
        <MDBox
          mt={1}
          onClick={(e) => handleClick('snapshotbtn')}
          sx={{ cursor: 'pointer', width: '100%' }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          lineHeight={1}
        >
          <MDTypography variant="h6">View Snapshot button Color</MDTypography>

          {open.snapshotbtn ? (
            <ExpandLess style={{ color: 'black', fontWeight: '200', fontSize: '15px' }} />
          ) : (
            <ExpandMore style={{ color: 'black', fontWeight: '200', fontSize: '15px' }} />
          )}
        </MDBox>
        <Collapse in={open.snapshotbtn} timeout="auto" unmountOnExit style={{ width: '100%' }}>
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
                onChange={(e) => handleChange({ value: e.target.value, key: 'SnapshotButton' })}
              />
            </MDBox>
          </MDBox>{' '}
        </Collapse>
      </MDBox>
      <MDBox mt={2}>
        <MDBox
          mt={1}
          onClick={(e) => handleClick('purchasebtn')}
          sx={{ cursor: 'pointer', width: '100%' }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          lineHeight={1}
        >
          <MDTypography variant="h6">Purchase button Color</MDTypography>

          {open.purchasebtn ? (
            <ExpandLess style={{ color: 'black', fontWeight: '200', fontSize: '15px' }} />
          ) : (
            <ExpandMore style={{ color: 'black', fontWeight: '200', fontSize: '15px' }} />
          )}
        </MDBox>
        <Collapse in={open.purchasebtn} timeout="auto" unmountOnExit style={{ width: '100%' }}>
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
                onChange={(e) => handleChange({ value: e.target.value, key: 'PurchaseButton' })}
              />
            </MDBox>
          </MDBox>
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
          <MDTypography variant="h6">Card Font Style </MDTypography>

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
            onChange={(e) => handleChange({ value: e.target.value, key: 'cardsFontFamily' })}
          >
            {FontStyle.map((FontStyle, key) => (
              <option value={FontStyle.year}>{FontStyle.title}</option>
            ))}
          </select>
        </Collapse>
      </MDBox>
      <MDBox mt={2}>
        {customcards == 'defeult' ? (
          <MDBox
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            lineHeight={1}
            mb={1}
          >
            <MDTypography variant="h6"> Cards Header Background </MDTypography>
            <Switch onClick={(e) => setcustomcards('custom')} />
          </MDBox>
        ) : (
          <>
            <MDBox
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              lineHeight={1}
              mb={1}
            >
              <MDTypography variant="h6"> Custom Cards Header Color </MDTypography>
              <Switch onClick={(e) => setcustomcards('defeult')} />
            </MDBox>
            <Grid container mt={3} sx={{ border: '1px solid #dfe1e6', background: 'white' }} p={2}>
              {cardValue ? (
                <Grid item xs={12} mt={1}>
                  <LinearGradiant
                    handleChange={handleChange}
                    type={'sideNavCard'}
                    color={cardValue}
                  />
                </Grid>
              ) : (
                <></>
              )}
            </Grid>
          </>
        )}
      </MDBox>

      <MDBox>
        {cardsshadow == 'defeult' ? (
          <MDBox mb={0.5}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" lineHeight={1}>
              <MDTypography variant="h6">Cards Header Box Shadow</MDTypography>
              <Switch onClick={(e) => setcardsshadow('custom')} />
            </MDBox>
          </MDBox>
        ) : (
          <MDBox mb={2} sx={{ border: '1px solid #dfe1e6', background: 'white' }} p={2}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" lineHeight={1}>
              <MDTypography variant="h6">Cards Box Shadow </MDTypography>
              <Switch onClick={(e) => setcardsshadow('defeult')} />
            </MDBox>

            <BoxShadows handleChange={handleChange} />
          </MDBox>
        )}
      </MDBox>
      <MDBox mt={1}>
        {customcardsBg == 'defeult' ? (
          <MDBox
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            lineHeight={1}
            mb={1}
          >
            <MDTypography variant="h6"> Cards Body Background </MDTypography>
            <Switch onClick={(e) => setcustomcardsBg('custom')} />
          </MDBox>
        ) : (
          <>
            <MDBox
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              lineHeight={1}
              mb={1}
            >
              <MDTypography variant="h6"> Custom Cards Header Color </MDTypography>
              <Switch onClick={(e) => setcustomcardsBg('defeult')} />
            </MDBox>
            <Grid container mt={3} sx={{ border: '1px solid #dfe1e6', background: 'white' }} p={2}>
              <Grid item xs={12} mt={1}>
                <LinearGradiant
                  handleChange={handleChange}
                  type={'cardsBodyColor'}
                  color={cardValue}
                />
              </Grid>
            </Grid>
          </>
        )}
      </MDBox>
    </>
  )
}

export default Card
