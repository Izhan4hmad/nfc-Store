import { Grid } from '@mui/material'
import MDBox from 'components/MDBox'
import MDInput from 'components/MDInput'
import MDTypography from 'components/MDTypography'
import React, { useState, useEffect } from 'react'

const BoxShadows = (props) => {
  const [shadowcolor, setshadowcolor] = useState('#000')
  const [postion_x, setpostion_x] = useState('7px')
  const [postion_y, setpostion_y] = useState('8px')
  const [blurRadius, setblurRadius] = useState('10px')
  const [spreedRadius, setspreedRadius] = useState('-1px')
  const [inset, setinset] = useState('')
  const [opacity, setopacity] = useState('1')
  const [boxshadow, setboxshadow] = useState(' 10px 10px 5px 0px #000')

  const handleChange = async ({ key, value }) => {
    var color_manage = {
      shadowcolor: () => {
        setshadowcolor(value)
        var color = value
          .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
          .substring(1)
          .match(/.{2}/g)
          .map((x) => parseInt(x, 16))
        setboxshadow(
          `${postion_x} ${postion_y} ${blurRadius} ${spreedRadius} rgba(${color},${opacity})`
        )
      },
      inset: () => {
        setinset(value + 'px')
        setboxshadow(`${postion_x} ${postion_y} ${blurRadius} ${spreedRadius} ${shadowcolor}`)
      },
      spreedRadius: () => {
        setspreedRadius(value + 'px')
        setboxshadow(`${postion_x} ${postion_y} ${blurRadius} ${value + 'px'} ${shadowcolor}`)
      },
      blurRadius: () => {
        setblurRadius(value + 'px')
        setboxshadow(`${postion_x} ${postion_y} ${value + 'px'} ${spreedRadius} ${shadowcolor}`)
      },
      postion_x: () => {
        setpostion_x(value + 'px')
        setboxshadow(`${value + 'px'} ${postion_y} ${blurRadius} ${spreedRadius} ${shadowcolor}`)
      },
      postion_y: () => {
        setpostion_y(value + 'px')
        setboxshadow(`${postion_x} ${value + 'px'} ${blurRadius} ${spreedRadius} ${shadowcolor}`)
      },
      opacity: () => {
        setopacity(value)
        var color = shadowcolor
          .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
          .substring(1)
          .match(/.{2}/g)
          .map((x) => parseInt(x, 16))
        var temp = parseFloat(value)
        if (temp == 0) {
          temp = 0
        } else {
          temp = temp / 10
        }
        setboxshadow(
          `${postion_x} ${postion_y} ${blurRadius} ${spreedRadius} rgba(${color},${temp})`
        )
      },
    }
    await color_manage[key]()

    // console.log(boxshadow)
    props.handleChange({ value: boxshadow, key: 'cardsboxshadow' })
  }
  return (
    <MDBox mt={1} display="flex" justifyContent="center" alignItems="center" lineHeight={1}>
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ border: '1px solid #d2d4d7', borderRadius: '0.25rem', width: '95%' }}
        p={2}
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <MDBox
              display="flex"
              justifyContent="flex-start"
              sx={{ fontSize: '14px', marginTop: 2 }}
            >
              <b>Horizontal Shadow Length</b>
            </MDBox>
            <MDBox display="flex" justifyContent="flex-start" mt={1}>
              <input
                defaultValue="7"
                type="range"
                min="-20"
                max="120"
                style={{ width: '90%' }}
                onChange={(e) => handleChange({ value: e.target.value, key: 'postion_x' })}
              />
            </MDBox>
          </Grid>
          <Grid item xs={6}>
            <MDBox display="flex" justifyContent="flex-end" sx={{ fontSize: '14px', marginTop: 2 }}>
              <b>Vertical Shadow Length</b>
            </MDBox>
            <MDBox display="flex" justifyContent="flex-end" mt={1}>
              <input
                defaultValue="8"
                type="range"
                min="-200"
                max="200"
                style={{ width: '90%' }}
                onChange={(e) => handleChange({ value: e.target.value, key: 'postion_y' })}
              />
            </MDBox>
          </Grid>
          <Grid item xs={6}>
            <MDBox
              display="flex"
              justifyContent="flex-start"
              sx={{ fontSize: '14px', marginTop: 2 }}
            >
              <b>Blur Radius</b>
            </MDBox>
            <MDBox display="flex" justifyContent="flex-start" mt={1}>
              <input
                defaultValue="10"
                type="range"
                min="0"
                max="400"
                style={{ width: '90%' }}
                onChange={(e) => handleChange({ value: e.target.value, key: 'blurRadius' })}
              />
            </MDBox>
          </Grid>
          <Grid item xs={6}>
            <MDBox display="flex" justifyContent="flex-end" sx={{ fontSize: '14px', marginTop: 2 }}>
              <b>Spread Radius</b>
            </MDBox>
            <MDBox display="flex" justifyContent="flex-end" mt={1}>
              <input
                defaultValue="-1"
                type="range"
                min="-200"
                max="200"
                style={{ width: '90%' }}
                onChange={(e) => handleChange({ value: e.target.value, key: 'spreedRadius' })}
              />
            </MDBox>
          </Grid>

          <Grid item xs={6}>
            <MDBox
              display="flex"
              justifyContent="flex-start"
              sx={{ fontSize: '14px', marginTop: 2 }}
            >
              <b>Shadow Color </b>
            </MDBox>

            <MDBox display="flex" justifyContent="flex-start" sx={{ marginTop: '2px' }}>
              <input
                type="color"
                name="sidenav_custom_color"
                // sx={{paddingLeft:"90%"}}
                value={shadowcolor}
                onChange={(e) => handleChange({ value: e.target.value, key: 'shadowcolor' })}
              />
              <MDBox
                sx={{
                  border: '1px solid #d2d4d7',
                  borderRadius: '0.25rem',
                  fontSize: '12px',
                  fontWeight: '300',
                }}
                p={1}
                ml={1}
              >
                {shadowcolor}
              </MDBox>
            </MDBox>
          </Grid>
          <Grid item xs={6}>
            <MDBox display="flex" justifyContent="flex-end" sx={{ fontSize: '14px', marginTop: 2 }}>
              <b>Shadow Color Opacity</b>
            </MDBox>
            <MDBox display="flex" justifyContent="flex-end" mt={1}>
              <input
                defaultValue="3"
                type="range"
                min="0"
                max="10"
                onChange={(e) => handleChange({ value: e.target.value, key: 'opacity' })}
                style={{ width: '90%' }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12}>
            <MDBox
              sx={{
                width: '90%',
                margin: 'auto',
                marginTop: 2,
                height: '100px',
                background: 'rgb(12,89,152)',
                boxShadow: boxshadow,
              }}
            ></MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  )
}

export default BoxShadows
